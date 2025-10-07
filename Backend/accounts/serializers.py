from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import *

class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Handles user registration with validation and profile creation.
    """
    password = serializers.CharField(
        write_only=True, 
        required=True, 
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    password2 = serializers.CharField(
        write_only=True, 
        required=True,
        style={'input_type': 'password'},
        help_text="Enter the same password as above for verification"
    )
    
    # User-type specific fields (only required during registration)
    grade = serializers.CharField(
        write_only=True, 
        required=False, 
        allow_blank=True,
        help_text="Required for student registration"
    )
    parent_email = serializers.EmailField(
        write_only=True, 
        required=False, 
        allow_blank=True,
        help_text="Optional: Link to parent's email"
    )
    subjects = serializers.CharField(
        write_only=True, 
        required=False, 
        allow_blank=True,
        help_text="Required for teacher/mentor registration"
    )

    class Meta:
        model = User
        fields = (
            'username', 'email', 'password', 'password2', 'user_type',
            'first_name', 'last_name', 'phone_number', 
            'grade', 'parent_email', 'subjects'
        )
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
            'email': {'required': True},
        }

    def validate(self, attrs):
        """
        Custom validation for registration data.
        """
        # Password confirmation check
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({
                "password": "Password fields didn't match."
            })
        
        user_type = attrs.get('user_type')
        
        # Student-specific validation
        if user_type == 'student':
            if not attrs.get('grade'):
                raise serializers.ValidationError({
                    "grade": "Grade is required for student registration."
                })
        
        # Teacher/Mentor validation
        if user_type in ['teacher', 'mentor'] and not attrs.get('subjects'):
            raise serializers.ValidationError({
                "subjects": "Subjects are required for teacher/mentor registration."
            })
        
        return attrs

    def create(self, validated_data):
        """
        Create user and associated profile based on user_type.
        """
        # Extract registration-specific fields
        grade = validated_data.pop('grade', None)
        parent_email = validated_data.pop('parent_email', None)
        subjects = validated_data.pop('subjects', None)
        validated_data.pop('password2')  # Remove confirmation field
        
        # Create the user
        user = User.objects.create_user(**validated_data)
        
        # Create user-type specific profile
        self.create_user_profile(user, grade, parent_email, subjects)
        
        return user

    def create_user_profile(self, user, grade, parent_email, subjects):
        """
        Create the appropriate profile based on user type.
        """
        if user.user_type == 'student':
            Student.objects.create(user=user, grade=grade)
            
        elif user.user_type == 'teacher':
            Teacher.objects.create(user=user, subjects=subjects)
            
        elif user.user_type == 'parent':
            Parent.objects.create(user=user)
            
        elif user.user_type == 'admin':
            Admin.objects.create(user=user)
            
        elif user.user_type == 'mentor':
            Mentor.objects.create(user=user, expertise_areas=subjects)

class UserLoginSerializer(serializers.Serializer):
    """
    Handles user login data validation.
    """
    username = serializers.CharField(required=True)
    password = serializers.CharField(
        required=True,
        style={'input_type': 'password'}
    )
    
    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')
        
        if not username or not password:
            raise serializers.ValidationError(
                "Both username and password are required."
            )
        
        return attrs

class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializes user profile data for API responses.
    """
    full_name = serializers.CharField(source='get_full_name', read_only=True)
    user_type_display = serializers.CharField(
        source='get_user_type_display', 
        read_only=True
    )

    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'first_name', 'last_name', 'full_name',
            'user_type', 'user_type_display', 'phone_number', 
            'date_of_birth', 'address', 'profile_picture',
            'at_risk_score', 'created_at'
        )
        read_only_fields = ('id', 'username', 'created_at')

class StudentProfileSerializer(serializers.ModelSerializer):
    """
    Serializes student profile with user data.
    """
    user = UserProfileSerializer(read_only=True)
    risk_level = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = '__all__'
    
    def get_risk_level(self, obj):
        """
        Calculate risk level based on risk score.
        """
        score = obj.user.at_risk_score
        if score < 30:
            return "Low"
        elif score < 70:
            return "Medium"
        else:
            return "High"

# Similar serializers for Teacher, Parent, Admin...
class TeacherProfileSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = Teacher
        fields = '__all__'

class FinancialRecordSerializer(serializers.ModelSerializer):
    """
    Serializes financial records for transparency.
    """
    created_by_name = serializers.CharField(
        source='created_by.get_full_name', 
        read_only=True
    )
    formatted_amount = serializers.SerializerMethodField()

    class Meta:
        model = SchoolFinancialRecord
        fields = (
            'id', 'title', 'amount', 'formatted_amount', 'record_type',
            'description', 'date', 'category', 'is_public',
            'created_by', 'created_by_name', 'created_at'
        )
        read_only_fields = ('created_by', 'created_at')
    
    def get_formatted_amount(self, obj):
        return f"${obj.amount:,.2f}"
    
    def create(self, validated_data):
        """
        Auto-set created_by to the current user.
        """
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)

class StudentRiskAssessmentSerializer(serializers.ModelSerializer):
    """
    Serializes risk assessment data.
    """
    student_name = serializers.CharField(
        source='student.user.get_full_name', 
        read_only=True
    )
    assessor_name = serializers.CharField(
        source='assessed_by.get_full_name',
        read_only=True
    )
    risk_level = serializers.SerializerMethodField()

    class Meta:
        model = StudentRiskAssessment
        fields = '__all__'
        read_only_fields = ('assessment_date',)
    
    def get_risk_level(self, obj):
        score = obj.risk_score
        if score < 30:
            return "Low"
        elif score < 70:
            return "Medium"
        else:
            return "High"
        


# Add these missing serializers
class ParentProfileSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)
    children_count = serializers.SerializerMethodField()

    class Meta:
        model = Parent
        fields = '__all__'
    
    def get_children_count(self, obj):
        return obj.children.count()

class AdminProfileSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)
    permissions = serializers.SerializerMethodField()

    class Meta:
        model = Admin
        fields = '__all__'
    
    def get_permissions(self, obj):
        return {
            'can_manage_finances': obj.can_manage_finances,
            'can_manage_transport': obj.can_manage_transport,
            'can_view_risk_reports': obj.can_view_risk_reports,
            'can_manage_users': obj.can_manage_users,
        }

class MentorProfileSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = Mentor
        fields = '__all__'

class TransportRouteSerializer(serializers.ModelSerializer):
    students_count = serializers.SerializerMethodField()
    driver_info = serializers.SerializerMethodField()

    class Meta:
        model = TransportRoute
        fields = '__all__'
    
    def get_students_count(self, obj):
        return obj.students_on_board.count()
    
    def get_driver_info(self, obj):
        return {
            'name': obj.driver_name,
            'contact': obj.driver_contact
        }