"""
Views for accounts app - Authentication and User Management
Handles all user-related operations for the LMS system.
"""

from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.db.models import Q
from django.utils import timezone
from datetime import datetime

# Import models
from .models import User, Student, Teacher, Parent, Admin, Mentor, SchoolFinancialRecord, StudentRiskAssessment, TransportRoute

# Import serializers
from .serializers import (
    UserRegistrationSerializer, UserLoginSerializer, UserProfileSerializer,
    StudentProfileSerializer, TeacherProfileSerializer, ParentProfileSerializer,
    AdminProfileSerializer, MentorProfileSerializer, FinancialRecordSerializer,
    StudentRiskAssessmentSerializer, TransportRouteSerializer
)

# Import permissions
from .permissions import (
    IsStudent, IsTeacher, IsParent, IsAdmin, 
    CanViewFinancials, CanManageTransport, CanViewRiskReports
)


# ==================== AUTHENTICATION VIEWS ====================

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_user(request):
    """
    Register a new user with role-specific profile creation.
    
    Expected POST data:
    - username, email, password, password2, user_type
    - first_name, last_name, phone_number
    - grade (for students), subjects (for teachers/mentors), parent_email (optional)
    
    Returns:
    - User data with JWT tokens upon successful registration
    """
    serializer = UserRegistrationSerializer(data=request.data)
    
    if serializer.is_valid():
        try:
            user = serializer.save()
            
            # Initialize risk assessment for students
            if user.user_type == 'student':
                calculate_initial_risk_score(user.student)
            
            # Generate JWT tokens for immediate login
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'message': 'User registered successfully',
                'user': UserProfileSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({
                'error': f'Registration failed: {str(e)}'
            }, status=status.HTTP_400_BAD_REQUEST)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_user(request):
    """
    Authenticate user and return JWT tokens.
    
    Expected POST data:
    - username, password
    
    Returns:
    - User data with JWT tokens upon successful authentication
    """
    serializer = UserLoginSerializer(data=request.data)
    
    if serializer.is_valid():
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        
        # Authenticate user credentials
        user = authenticate(username=username, password=password)
        
        if user:
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'message': 'Login successful',
                'user': UserProfileSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        
        return Response({
            'error': 'Invalid username or password'
        }, status=status.HTTP_401_UNAUTHORIZED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout_user(request):
    """
    Logout user by blacklisting refresh token.
    
    Expected POST data:
    - refresh: JWT refresh token
    
    Returns:
    - Success message
    """
    try:
        refresh_token = request.data.get('refresh')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
        
        return Response({
            'message': 'Successfully logged out'
        })
        
    except Exception as e:
        return Response({
            'error': f'Logout failed: {str(e)}'
        }, status=status.HTTP_400_BAD_REQUEST)


# ==================== PROFILE MANAGEMENT VIEWS ====================

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_user_profile(request):
    """
    Get current user's complete profile with role-specific data.
    
    Returns:
    - Complete user profile based on user type
    """
    user = request.user
    
    # Return different profile data based on user type
    if user.user_type == 'student' and hasattr(user, 'student'):
        serializer = StudentProfileSerializer(user.student)
    elif user.user_type == 'teacher' and hasattr(user, 'teacher'):
        serializer = TeacherProfileSerializer(user.teacher)
    elif user.user_type == 'parent' and hasattr(user, 'parent'):
        serializer = ParentProfileSerializer(user.parent)
    elif user.user_type == 'admin' and hasattr(user, 'admin'):
        serializer = AdminProfileSerializer(user.admin)
    elif user.user_type == 'mentor' and hasattr(user, 'mentor'):
        serializer = MentorProfileSerializer(user.mentor)
    else:
        # Fallback to basic user profile
        serializer = UserProfileSerializer(user)
    
    return Response(serializer.data)


@api_view(['PUT', 'PATCH'])
@permission_classes([permissions.IsAuthenticated])
def update_profile(request):
    """
    Update user profile information.
    
    Expected data:
    - Any user profile fields to update
    
    Returns:
    - Updated user profile data
    """
    user = request.user
    
    # Update base user fields
    user_serializer = UserProfileSerializer(
        user, 
        data=request.data, 
        partial=True,  # Allow partial updates for PATCH
        context={'request': request}
    )
    
    if user_serializer.is_valid():
        user_serializer.save()
        
        # Update role-specific profile if additional data is provided
        profile_data = {k: v for k, v in request.data.items() 
                       if k not in user_serializer.fields}
        
        if profile_data and user.user_type == 'student' and hasattr(user, 'student'):
            student_serializer = StudentProfileSerializer(
                user.student, 
                data=profile_data, 
                partial=True
            )
            if student_serializer.is_valid():
                student_serializer.save()
        
        # Add similar blocks for other user types as needed
        
        return Response({
            'message': 'Profile updated successfully',
            'user': UserProfileSerializer(user).data
        })
    
    return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ==================== DASHBOARD DATA VIEWS ====================

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_dashboard_data(request):
    """
    Get role-specific dashboard data for the current user.
    
    Returns:
    - Dashboard data tailored to user's role with stats, alerts, and quick actions
    """
    user = request.user
    
    dashboard_data = {
        'user': UserProfileSerializer(user).data,
        'stats': {},
        'recent_activity': [],
        'alerts': [],
        'quick_actions': []
    }
    
    # Student Dashboard Data
    if user.user_type == 'student' and hasattr(user, 'student'):
        student = user.student
        dashboard_data['stats'] = {
            'attendance_rate': student.attendance_rate,
            'average_grade': student.average_grade,
            'risk_score': user.at_risk_score,
            'behavioral_incidents': student.behavioral_incidents,
            'learning_style': student.preferred_learning_style
        }
        
        # Add risk alert if score is high
        if user.at_risk_score > 70:
            dashboard_data['alerts'].append({
                'type': 'warning',
                'message': 'High dropout risk detected. Please meet with counselor.',
                'priority': 'high'
            })
        
        # Quick actions for students
        dashboard_data['quick_actions'] = [
            {'action': 'update_learning_style', 'label': 'Update Learning Style'},
            {'action': 'view_assignments', 'label': 'View Assignments'},
            {'action': 'find_mentor', 'label': 'Find a Mentor'}
        ]
    
    # Teacher Dashboard Data
    elif user.user_type == 'teacher' and hasattr(user, 'teacher'):
        teacher = user.teacher
        
        # Calculate teacher stats (simplified - would be from Course model in production)
        total_students = Student.objects.count()  # Placeholder
        
        dashboard_data['stats'] = {
            'total_students': total_students,
            'subjects': [s.strip() for s in teacher.subjects.split(',')],
            'is_mentor': teacher.is_mentor,
            'mentor_subjects': [s.strip() for s in teacher.mentor_subjects.split(',')] if teacher.mentor_subjects else []
        }
        
        # Quick actions for teachers
        dashboard_data['quick_actions'] = [
            {'action': 'create_assignment', 'label': 'Create Assignment'},
            {'action': 'view_students', 'label': 'View Students'},
            {'action': 'risk_reports', 'label': 'Risk Reports'}
        ]
    
    # Parent Dashboard Data
    elif user.user_type == 'parent' and hasattr(user, 'parent'):
        parent = user.parent
        children = parent.children.all()
        
        high_risk_children = children.filter(user__at_risk_score__gte=70).count()
        
        dashboard_data['stats'] = {
            'children_count': children.count(),
            'can_view_finances': parent.can_view_financial_reports,
            'high_risk_children': high_risk_children
        }
        
        # Add children data
        dashboard_data['children'] = StudentProfileSerializer(children, many=True).data
        
        # Quick actions for parents
        dashboard_data['quick_actions'] = [
            {'action': 'view_progress', 'label': 'View Child Progress'},
            {'action': 'contact_teacher', 'label': 'Contact Teacher'},
        ]
        
        if parent.can_view_financial_reports:
            dashboard_data['quick_actions'].append({
                'action': 'view_finances', 
                'label': 'View Financial Reports'
            })
    
    # Admin Dashboard Data
    elif user.user_type == 'admin' and hasattr(user, 'admin'):
        admin_user = user.admin
        
        # Calculate admin stats
        total_students = Student.objects.count()
        total_teachers = Teacher.objects.count()
        total_parents = Parent.objects.count()
        high_risk_students = User.objects.filter(user_type='student', at_risk_score__gte=70).count()
        financial_records_count = SchoolFinancialRecord.objects.count()
        
        dashboard_data['stats'] = {
            'total_users': User.objects.count(),
            'total_students': total_students,
            'total_teachers': total_teachers,
            'total_parents': total_parents,
            'high_risk_students': high_risk_students,
            'financial_records': financial_records_count
        }
        
        # Admin permissions
        dashboard_data['permissions'] = {
            'can_manage_finances': admin_user.can_manage_finances,
            'can_manage_transport': admin_user.can_manage_transport,
            'can_view_risk_reports': admin_user.can_view_risk_reports,
            'can_manage_users': admin_user.can_manage_users
        }
        
        # Quick actions for admin
        dashboard_data['quick_actions'] = [
            {'action': 'manage_users', 'label': 'Manage Users'},
            {'action': 'view_reports', 'label': 'View Reports'},
        ]
        
        if admin_user.can_manage_finances:
            dashboard_data['quick_actions'].append({
                'action': 'manage_finances', 
                'label': 'Manage Finances'
            })
        
        if admin_user.can_manage_transport:
            dashboard_data['quick_actions'].append({
                'action': 'manage_transport', 
                'label': 'Manage Transport'
            })
    
    return Response(dashboard_data)


# ==================== PROBLEM-SOLVING FEATURE VIEWS ====================

# ---------- DROPOUT PREVENTION (Risk Assessments) ----------

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated, CanViewRiskReports])
def get_student_risk_assessments(request):
    """
    Get risk assessments for dropout prevention system.
    
    Returns:
    - Risk assessments filtered by user permissions
    """
    try:
        user = request.user
        
        if user.user_type == 'parent':
            # Parents see only their children's assessments
            students = Student.objects.filter(parent__user=user)
            assessments = StudentRiskAssessment.objects.filter(
                student__in=students
            ).order_by('-assessment_date')
        elif user.user_type == 'teacher':
            # Teachers see all assessments (would filter by their students in production)
            assessments = StudentRiskAssessment.objects.all().order_by('-assessment_date')
        else:  # Admin
            assessments = StudentRiskAssessment.objects.all().order_by('-assessment_date')
        
        serializer = StudentRiskAssessmentSerializer(assessments, many=True)
        return Response({
            'assessments': serializer.data,
            'count': assessments.count()
        })
        
    except Exception as e:
        return Response({
            'error': f'Failed to fetch risk assessments: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated, IsTeacher | IsAdmin])
def create_risk_assessment(request):
    """
    Create a new risk assessment for a student.
    
    Expected POST data:
    - student: Student ID
    - risk_score: 0-100
    - factors: List of risk factors
    - recommendations: Suggested interventions
    
    Returns:
    - Created risk assessment data
    """
    serializer = StudentRiskAssessmentSerializer(data=request.data)
    
    if serializer.is_valid():
        # Set the assessed_by field to current user
        assessment = serializer.save(assessed_by=request.user)
        
        # Update student's risk score
        student = assessment.student
        student.user.at_risk_score = assessment.risk_score
        student.user.last_risk_assessment = timezone.now()
        student.user.save()
        
        return Response({
            'message': 'Risk assessment created successfully',
            'assessment': StudentRiskAssessmentSerializer(assessment).data
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ---------- FINANCIAL TRANSPARENCY ----------

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated, CanViewFinancials])
def get_financial_records(request):
    """
    Get financial records for transparency system.
    
    Query Parameters (optional):
    - type: Filter by record_type (income/expense/budget)
    - category: Filter by category
    - is_public: Filter public records only
    
    Returns:
    - Financial records filtered by user permissions
    """
    try:
        records = SchoolFinancialRecord.objects.all()
        
        # Filter based on user type and permissions
        if request.user.user_type == 'parent':
            records = records.filter(is_public=True)
        
        # Apply optional filters
        record_type = request.GET.get('type')
        if record_type:
            records = records.filter(record_type=record_type)
        
        category = request.GET.get('category')
        if category:
            records = records.filter(category=category)
        
        is_public = request.GET.get('is_public')
        if is_public is not None:
            records = records.filter(is_public=(is_public.lower() == 'true'))
        
        # Order by date (most recent first)
        records = records.order_by('-date', '-created_at')
        
        serializer = FinancialRecordSerializer(records, many=True)
        return Response({
            'records': serializer.data,
            'count': records.count()
        })
        
    except Exception as e:
        return Response({
            'error': f'Failed to fetch financial records: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated, IsAdmin])
def create_financial_record(request):
    """
    Create a new financial record (Admin only).
    
    Expected POST data:
    - title, amount, record_type, description, date, category, is_public
    
    Returns:
    - Created financial record data
    """
    serializer = FinancialRecordSerializer(
        data=request.data, 
        context={'request': request}
    )
    
    if serializer.is_valid():
        financial_record = serializer.save()
        return Response({
            'message': 'Financial record created successfully',
            'record': FinancialRecordSerializer(financial_record).data
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ---------- TRANSPORT SAFETY ----------

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated, CanManageTransport])
def get_transport_routes(request):
    """
    Get all active transport routes (Transport managers only).
    
    Returns:
    - List of active transport routes with student counts
    """
    try:
        routes = TransportRoute.objects.filter(is_active=True)
        serializer = TransportRouteSerializer(routes, many=True)
        return Response({
            'routes': serializer.data,
            'count': routes.count()
        })
        
    except Exception as e:
        return Response({
            'error': f'Failed to fetch transport routes: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated, CanManageTransport])
def update_bus_location(request, route_id):
    """
    Update bus current location for tracking.
    
    Expected POST data:
    - current_location: New location string
    
    Returns:
    - Updated route data
    """
    try:
        route = TransportRoute.objects.get(id=route_id, is_active=True)
        new_location = request.data.get('current_location')
        
        if new_location:
            route.current_location = new_location
            route.save()
            
            return Response({
                'message': f'Bus location updated to: {new_location}',
                'route': TransportRouteSerializer(route).data
            })
        
        return Response({
            'error': 'current_location is required'
        }, status=status.HTTP_400_BAD_REQUEST)
        
    except TransportRoute.DoesNotExist:
        return Response({
            'error': 'Transport route not found'
        }, status=status.HTTP_404_NOT_FOUND)


# ==================== ROLE-SPECIFIC DATA VIEWS ====================

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated, IsParent])
def get_my_children(request):
    """
    Get parent's children with their risk assessments and progress.
    
    Returns:
    - List of children with detailed information and risk assessments
    """
    try:
        parent = request.user.parent
        children = parent.children.all()
        
        children_data = []
        for child in children:
            child_data = StudentProfileSerializer(child).data
            
            # Add recent risk assessments (last 3)
            recent_assessments = StudentRiskAssessment.objects.filter(
                student=child
            ).order_by('-assessment_date')[:3]
            
            child_data['recent_assessments'] = StudentRiskAssessmentSerializer(
                recent_assessments, many=True
            ).data
            
            children_data.append(child_data)
        
        return Response({
            'children': children_data,
            'count': len(children_data)
        })
        
    except Exception as e:
        return Response({
            'error': f'Failed to fetch children data: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated, IsTeacher])
def get_my_students(request):
    """
    Get students assigned to teacher (simplified version).
    
    Note: In production, this would link via Course model.
    
    Returns:
    - List of students with basic information and risk levels
    """
    try:
        # Simplified - in real system, filter by teacher's courses
        students = Student.objects.all()[:20]  # Limit for demo
        
        students_data = []
        for student in students:
            student_data = StudentProfileSerializer(student).data
            
            # Add risk level categorization
            risk_score = student.user.at_risk_score
            if risk_score >= 70:
                risk_level = "High"
            elif risk_score >= 30:
                risk_level = "Medium"
            else:
                risk_level = "Low"
                
            student_data['current_risk_level'] = risk_level
            students_data.append(student_data)
    
        return Response({
            'students': students_data,
            'count': len(students_data)
        })
        
    except Exception as e:
        return Response({
            'error': f'Failed to fetch students data: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated, IsStudent])
def update_learning_style(request):
    """
    Update student's preferred learning style for personalized exam prep.
    
    Expected POST data:
    - learning_style: One of 'visual', 'auditory', 'kinesthetic', 'reading'
    
    Returns:
    - Success message with updated learning style
    """
    try:
        student = request.user.student
        learning_style = request.data.get('learning_style')
        
        # Get valid learning style choices from model
        valid_styles = dict(Student._meta.get_field('preferred_learning_style').choices)
        
        if learning_style in valid_styles:
            student.preferred_learning_style = learning_style
            student.save()
            
            return Response({
                'message': f'Learning style updated to {valid_styles[learning_style]}',
                'learning_style': learning_style,
                'learning_style_display': valid_styles[learning_style]
            })
        
        return Response({
            'error': f'Invalid learning style. Must be one of: {", ".join(valid_styles.keys())}'
        }, status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        return Response({
            'error': f'Failed to update learning style: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ==================== HELPER FUNCTIONS ====================

def calculate_initial_risk_score(student):
    """
    Calculate initial risk score for a new student.
    
    Args:
        student: Student object to assess
    
    This is a simplified version - production would use more sophisticated algorithms.
    """
    risk_score = 0
    
    # Initial baseline assessment based on available data
    if student.attendance_rate < 85:
        risk_score += 20
    
    if student.average_grade < 50:
        risk_score += 30
    
    if student.behavioral_incidents > 2:
        risk_score += 25
    
    # Ensure score doesn't exceed 100
    risk_score = min(risk_score, 100)
    
    # Update the student's risk score
    student.user.at_risk_score = risk_score
    student.user.last_risk_assessment = timezone.now()
    student.user.save()
    
    # Create initial risk assessment record if score is significant
    if risk_score >= 30:
        StudentRiskAssessment.objects.create(
            student=student,
            risk_score=risk_score,
            factors=["Initial assessment based on baseline data"],
            recommendations="Monitor academic performance and attendance closely. Consider academic support programs.",
            assessed_by=User.objects.filter(user_type='admin').first() or student.user
        )


def calculate_comprehensive_risk_score(student):
    """
    Comprehensive risk assessment (for future enhancement).
    
    This would incorporate more factors in a production system:
    - Social-emotional indicators
    - Family background
    - Economic factors
    - Peer relationships
    - Teacher observations
    """
    # Placeholder for more sophisticated risk calculation
    pass