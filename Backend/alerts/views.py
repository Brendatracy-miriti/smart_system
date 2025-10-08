from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Q
from django.utils import timezone
from datetime import timedelta

from .models import Alert, AlertAcknowledgement, AlertTemplate
from .serializers import *
from accounts.permissions import IsStudent, IsTeacher, IsParent, IsAdmin

# Pre-defined alert messages for common scenarios
ALERT_TEMPLATES = {
    # Emergency & Safety Alerts
    'student_safety_emergency': {
        'title': " EMERGENCY: Student Safety Concern - {{student_name}}",
        'message': "URGENT: {{student_name}} has been involved in a safety incident at school. Emergency services have been notified. Please contact the school immediately at {{contact_number}}.",
        'type': 'school_safety',
        'priority': 'emergency'
    },
    'medical_emergency': {
        'title': " Medical Emergency Alert - {{student_name}}",
        'message': "{{student_name}} has experienced a medical emergency and has been taken to {{hospital_name}}. School nurse is accompanying. Please proceed to the hospital emergency room.",
        'type': 'health_wellness', 
        'priority': 'emergency'
    },
    'bus_accident': {
        'title': "BUS ACCIDENT NOTIFICATION - Route {{route_number}}",
        'message': "URGENT: Bus route {{route_number}} has been involved in a minor accident. All students are safe and accounted for. Parents should pick up students from {{location}}.",
        'type': 'transport_safety',
        'priority': 'emergency'
    },
    
    # Financial Transparency Alerts
    'financial_irregularity': {
        'title': "🔍 Financial Irregularity Detected - {{department}}",
        'message': "Unusual expenditure pattern detected in {{department}} funds. Amount: {{amount}}. Audit review initiated. Details available in financial portal.",
        'type': 'financial',
        'priority': 'high'
    },
    'budget_overrun': {
        'title': "Budget Overrun Alert - {{department}}",
        'message': "{{department}} has exceeded quarterly budget by {{percentage}}%. Requisition approval temporarily suspended pending review.",
        'type': 'financial',
        'priority': 'medium'
    },
    
    # Academic Performance Alerts
    'failing_grade': {
        'title': "Academic Performance Concern - {{student_name}}",
        'message': "{{student_name}} is struggling in {{subject}}. Current grade: {{grade}}%. Additional tutoring sessions recommended. Please schedule parent-teacher meeting.",
        'type': 'academic_performance',
        'priority': 'high'
    },
    'attendance_concern': {
        'title': "Chronic Attendance Concern - {{student_name}}",
        'message': "{{student_name}} has missed {{days_missed}} days this semester. Attendance rate: {{attendance_rate}}%. This affects academic progress. Meeting requested with parents.",
        'type': 'attendance',
        'priority': 'high'
    },
    
    # Parent-Teacher Communication
    'urgent_meeting': {
        'title': "URGENT: Parent-Teacher Meeting Request - {{student_name}}",
        'message': "{{teacher_name}} requests urgent meeting regarding {{issue}} with your child. Please contact to schedule: {{contact_info}}.",
        'type': 'parent_meeting',
        'priority': 'high'
    },
    'positive_achievement': {
        'title': "Student Achievement - {{student_name}}",
        'message': "Congratulations! {{student_name}} has shown exceptional performance in {{achievement_area}}. Keep up the great work!",
        'type': 'achievement',
        'priority': 'low'
    }
}

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_my_alerts(request):
    """
    Get alerts relevant to the current user
    """
    user = request.user
    
    # Base queryset - active alerts that haven't expired
    alerts = Alert.objects.filter(status='active').exclude(
        expires_at__lt=timezone.now()
    )
    
    # Filter alerts for this user
    alerts = alerts.filter(
        Q(target_users=user) |
        Q(target_user_types__contains=[user.user_type]) |
        Q(student__parent__user=user) |  # Parent gets child's alerts
        Q(student__user=user)  # Student gets their own alerts
    ).distinct()
    
    # Priority ordering: emergency -> high -> medium -> low
    priority_order = {'emergency': 0, 'high': 1, 'medium': 2, 'low': 3}
    alerts = sorted(alerts, key=lambda x: priority_order[x.priority])
    
    serializer = AlertSerializer(alerts, many=True, context={'request': request})
    
    # Count unacknowledged alerts
    unacknowledged_count = sum(1 for alert in alerts if not alert.acknowledgements.filter(user=user).exists())
    
    return Response({
        'alerts': serializer.data,
        'unacknowledged_count': unacknowledged_count,
        'total_count': len(alerts)
    })

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated, IsTeacher | IsAdmin])
def create_alert(request):
    """
    Create a new alert (Teachers and Admins only)
    """
    serializer = AlertCreateSerializer(data=request.data, context={'request': request})
    
    if serializer.is_valid():
        alert = serializer.save()
        
        return Response({
            'message': 'Alert created successfully',
            'alert': AlertSerializer(alert, context={'request': request}).data
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def acknowledge_alert(request, alert_id):
    """
    Acknowledge an alert
    """
    try:
        alert = Alert.objects.get(id=alert_id, status='active')
        
        # Check if user has permission to acknowledge this alert
        user = request.user
        has_access = (
            alert.target_users.filter(id=user.id).exists() or
            user.user_type in alert.target_user_types or
            (user.user_type == 'parent' and alert.student and alert.student.parent.user == user) or
            (user.user_type == 'student' and alert.student and alert.student.user == user)
        )
        
        if not has_access:
            return Response({
                'error': 'You do not have permission to acknowledge this alert'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Check if already acknowledged
        if alert.acknowledgements.filter(user=user).exists():
            return Response({
                'error': 'Alert already acknowledged'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = AcknowledgeAlertSerializer(data=request.data)
        if serializer.is_valid():
            AlertAcknowledgement.objects.create(
                alert=alert,
                user=user,
                notes=serializer.validated_data.get('notes', '')
            )
            
            return Response({
                'message': 'Alert acknowledged successfully'
            })
    
    except Alert.DoesNotExist:
        return Response({
            'error': 'Alert not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated, IsTeacher | IsAdmin])
def create_emergency_alert(request):
    """
    Create emergency safety alert
    """
    alert_template = request.data.get('template')
    student_id = request.data.get('student_id')
    custom_data = request.data.get('custom_data', {})
    
    try:
        from accounts.models import Student
        student = Student.objects.get(id=student_id) if student_id else None
        
        if alert_template not in ALERT_TEMPLATES:
            return Response({
                'error': 'Invalid alert template'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        template = ALERT_TEMPLATES[alert_template]
        
        # Prepare context data
        context = {
            'student_name': student.user.get_full_name() if student else 'Student',
            'contact_number': '555-0123',
            'hospital_name': custom_data.get('hospital', 'City Hospital'),
            'route_number': custom_data.get('route', 'Unknown'),
            'location': custom_data.get('location', 'School'),
            **custom_data
        }
        
        # Create alert from template
        alert = Alert.objects.create(
            title=template['title'].format(**context),
            message=template['message'].format(**context),
            alert_type=template['type'],
            priority=template['priority'],
            student=student,
            created_by=request.user,
            target_user_types=['parent', 'admin'],
            action_required=True,
            action_text="Contact School",
            action_url="/contact"
        )
        
        return Response({
            'message': 'Emergency alert created successfully',
            'alert': AlertSerializer(alert, context={'request': request}).data
        })
        
    except Student.DoesNotExist:
        return Response({
            'error': 'Student not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated, IsTeacher | IsAdmin])
def create_financial_alert(request):
    """
    Create financial transparency alert
    """
    alert_type = request.data.get('alert_type')
    department = request.data.get('department')
    amount = request.data.get('amount')
    details = request.data.get('details', '')
    
    if alert_type == 'irregularity':
        alert = Alert.objects.create(
            title=f"Financial Irregularity Detected - {department}",
            message=f"Unusual expenditure pattern detected in {department} funds. Amount: ${amount}. Details: {details} Audit review initiated.",
            alert_type='financial',
            priority='high',
            created_by=request.user,
            target_user_types=['admin', 'teacher'],
            action_required=True,
            action_text="Review Financial Report",
            action_url="/financial/reports"
        )
    elif alert_type == 'budget_overrun':
        percentage = request.data.get('percentage', '0')
        alert = Alert.objects.create(
            title=f"Budget Overrun Alert - {department}",
            message=f"{department} has exceeded quarterly budget by {percentage}%. Amount over budget: ${amount}. Requisition approval temporarily suspended.",
            alert_type='financial',
            priority='medium',
            created_by=request.user,
            target_user_types=['admin'],
            action_required=True
        )
    
    return Response({
        'message': 'Financial alert created successfully',
        'alert': AlertSerializer(alert, context={'request': request}).data
    })

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated, IsTeacher])
def create_parent_meeting_alert(request):
    """
    Create parent-teacher meeting request alert
    """
    student_id = request.data.get('student_id')
    issue = request.data.get('issue')
    urgency = request.data.get('urgency', 'medium')
    
    try:
        from accounts.models import Student
        student = Student.objects.get(id=student_id)
        
        priority_map = {'low': 'low', 'medium': 'medium', 'high': 'high', 'urgent': 'high'}
        
        alert = Alert.objects.create(
            title=f"Parent-Teacher Meeting Request - {student.user.get_full_name()}",
            message=f"Teacher {request.user.get_full_name()} requests meeting regarding {issue} with your child. Please contact to schedule.",
            alert_type='parent_meeting',
            priority=priority_map[urgency],
            student=student,
            created_by=request.user,
            target_user_types=['parent'],
            action_required=True,
            action_text="Schedule Meeting",
            action_url="/schedule-meeting"
        )
        
        return Response({
            'message': 'Parent meeting alert created successfully',
            'alert': AlertSerializer(alert, context={'request': request}).data
        })
        
    except Student.DoesNotExist:
        return Response({
            'error': 'Student not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated, IsTeacher | IsAdmin])
def create_transport_alert(request):
    """
    Create transport safety alert
    """
    student_id = request.data.get('student_id')
    alert_type = request.data.get('alert_type')
    
    try:
        from accounts.models import Student
        student = Student.objects.get(id=student_id)
        
        if alert_type == 'bus_boarded':
            alert = Alert.objects.create(
                title=f"Bus Safety - {student.user.get_full_name()}",
                message=f"{student.user.get_full_name()} has safely boarded the bus at {student.bus_stop} at {timezone.now().strftime('%H:%M')}",
                alert_type='transport_safety',
                priority='medium',
                student=student,
                created_by=request.user,
                target_user_types=['parent'],
                expires_at=timezone.now() + timedelta(hours=12)
            )
        elif alert_type == 'bus_departed':
            alert = Alert.objects.create(
                title=f"Bus Departed - {student.user.get_full_name()}",
                message=f"The bus carrying {student.user.get_full_name()} has departed from school. Expected arrival: {timezone.now() + timedelta(minutes=45)}",
                alert_type='transport_safety',
                priority='medium',
                student=student,
                created_by=request.user,
                target_user_types=['parent'],
                expires_at=timezone.now() + timedelta(hours=6)
            )
        elif alert_type == 'bus_delayed':
            alert = Alert.objects.create(
                title=f"Bus Delayed - {student.user.get_full_name()}",
                message=f"Bus for {student.user.get_full_name()} is delayed. Expected delay: 30 minutes. Student is safe at school.",
                alert_type='transport_safety',
                priority='medium',
                student=student,
                created_by=request.user,
                target_user_types=['parent']
            )
        
        return Response({
            'message': 'Transport alert created successfully',
            'alert': AlertSerializer(alert, context={'request': request}).data
        })
        
    except Student.DoesNotExist:
        return Response({
            'error': 'Student not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated, IsTeacher | IsAdmin])
def create_academic_alert(request):
    """
    Create academic performance alert
    """
    student_id = request.data.get('student_id')
    issue_type = request.data.get('issue_type')
    
    try:
        from accounts.models import Student
        student = Student.objects.get(id=student_id)
        
        if issue_type == 'attendance' and student.attendance_rate < 80:
            alert = Alert.objects.create(
                title=f"Attendance Concern - {student.user.get_full_name()}",
                message=f"{student.user.get_full_name()} has low attendance rate: {student.attendance_rate}%. This affects academic progress.",
                alert_type='attendance',
                priority='high',
                student=student,
                created_by=request.user,
                target_user_types=['parent'],
                action_required=True,
                action_text="View Attendance Details",
                action_url=f"/student/{student.id}/attendance"
            )
        elif issue_type == 'grades' and student.average_grade < 50:
            alert = Alert.objects.create(
                title=f"Academic Performance - {student.user.get_full_name()}",
                message=f"{student.user.get_full_name()} is struggling academically. Current average: {student.average_grade}%. Additional support recommended.",
                alert_type='academic_performance',
                priority='high',
                student=student,
                created_by=request.user,
                target_user_types=['parent'],
                action_required=True,
                action_text="View Academic Report",
                action_url=f"/student/{student.id}/grades"
            )
        elif issue_type == 'behavior':
            alert = Alert.objects.create(
                title=f"Behavioral Concern - {student.user.get_full_name()}",
                message=f"{student.user.get_full_name()} has behavioral incidents requiring attention. Please contact school counselor.",
                alert_type='behavior',
                priority='high',
                student=student,
                created_by=request.user,
                target_user_types=['parent'],
                action_required=True
            )
        
        return Response({
            'message': 'Academic alert created successfully',
            'alert': AlertSerializer(alert, context={'request': request}).data
        })
        
    except Student.DoesNotExist:
        return Response({
            'error': 'Student not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated, IsAdmin])
def get_alert_templates(request):
    """
    Get all available alert templates
    """
    return Response({
        'templates': ALERT_TEMPLATES,
        'custom_templates': AlertTemplateSerializer(AlertTemplate.objects.all(), many=True).data
    })