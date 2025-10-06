from django.contrib.auth.models import AbstractUser
from django.db import models
from cloudinary.models import CloudinaryField

class User(AbstractUser):
    """
    Custom User model extending Django's AbstractUser.
    This is the central user model for the entire system.
    """
    
    # User type choices - defines what dashboard they can access
    USER_TYPE_CHOICES = (
        ('student', 'Student'),
        ('teacher', 'Teacher'),
        ('parent', 'Parent'),
        ('admin', 'Admin'),
        ('mentor', 'Mentor'),  # For peer support system
    )
    
    # Core fields
    user_type = models.CharField(
        max_length=10, 
        choices=USER_TYPE_CHOICES,
        help_text="Determines which dashboard and permissions the user has"
    )
    phone_number = models.CharField(max_length=15, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    address = models.TextField(blank=True)
    avatar = CloudinaryField('image', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Dropout prevention fields
    at_risk_score = models.IntegerField(
        default=0,
        help_text="0-100 score indicating dropout risk (0 = low risk, 100 = high risk)"
    )
    last_risk_assessment = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.username} ({self.get_user_type_display()})"
    
    def get_full_name(self):
        """Return full name for better display"""
        return f"{self.first_name} {self.last_name}".strip()
    
    class Meta:
        # Order users by creation date by default
        ordering = ['-created_at']

class Student(models.Model):
    """
    Student-specific profile extending the base User model.
    Contains data relevant only to students.
    """
    # One-to-one link to User - each User has one Student profile
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE, 
        primary_key=True,
        related_name='student'
    )
    
    # Academic information
    grade = models.CharField(
        max_length=10,
        help_text="Current grade level (e.g., 'Grade 10', 'Form 4')"
    )
    
    # Parent linkage for family connections
    parent = models.ForeignKey(
        'Parent', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='children',
        help_text="Linked parent account"
    )
    
    enrollment_date = models.DateField(auto_now_add=True)
    
    # Dropout prevention metrics
    attendance_rate = models.FloatField(
        default=100.0,
        help_text="Percentage attendance (0-100)"
    )
    average_grade = models.FloatField(
        default=0.0,
        help_text="Overall academic average"
    )
    behavioral_incidents = models.IntegerField(
        default=0,
        help_text="Number of behavioral issues reported"
    )
    last_wellness_check = models.DateTimeField(null=True, blank=True)
    
    # Transport safety information
    bus_route = models.CharField(max_length=50, blank=True)
    bus_stop = models.CharField(max_length=100, blank=True)
    
    # Exam preparation personalization
    preferred_learning_style = models.CharField(
        max_length=20,
        choices=(
            ('visual', 'Visual Learner'),
            ('auditory', 'Auditory Learner'), 
            ('kinesthetic', 'Kinesthetic Learner'),
            ('reading', 'Reading/Writing Learner'),
        ),
        default='visual',
        help_text="Used to personalize study materials"
    )
    
    def __str__(self):
        return f"Student: {self.user.get_full_name()} - {self.grade}"

class Teacher(models.Model):
    """
    Teacher-specific profile with teaching-related data.
    """
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE, 
        primary_key=True,
        related_name='teacher'
    )
    
    subjects = models.CharField(
        max_length=200,
        help_text="Subjects taught (comma-separated)"
    )
    qualification = models.TextField(help_text="Teaching qualifications")
    hire_date = models.DateField(auto_now_add=True)
    
    # Mentorship capabilities
    is_mentor = models.BooleanField(
        default=False,
        help_text="Can this teacher serve as a mentor?"
    )
    mentor_subjects = models.CharField(
        max_length=200, 
        blank=True,
        help_text="Subjects available for mentorship"
    )
    
    def __str__(self):
        return f"Teacher: {self.user.get_full_name()}"

class Parent(models.Model):
    """
    Parent profile with family management capabilities.
    """
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE, 
        primary_key=True,
        related_name='parent'
    )
    
    occupation = models.CharField(max_length=100, blank=True)
    relationship_to_student = models.CharField(
        max_length=50, 
        default='Parent'
    )
    
    # Financial transparency access control
    can_view_financial_reports = models.BooleanField(
        default=False,
        help_text="Can this parent view school financial reports?"
    )
    
    def __str__(self):
        return f"Parent: {self.user.get_full_name()}"

class Admin(models.Model):
    """
    Administrative staff with system management permissions.
    """
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE, 
        primary_key=True,
        related_name='admin'
    )
    
    department = models.CharField(max_length=100)
    role = models.CharField(max_length=100)
    
    # Granular admin permissions
    can_manage_finances = models.BooleanField(default=False)
    can_manage_transport = models.BooleanField(default=False)
    can_view_risk_reports = models.BooleanField(default=True)
    can_manage_users = models.BooleanField(default=True)
    
    def __str__(self):
        return f"Admin: {self.user.get_full_name()} - {self.role}"
    

class Mentor(models.Model):
    """
    Dedicated mentor model for peer support system.
    Addresses: Students struggling to connect with peers/mentors
    """
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE, 
        primary_key=True,
        related_name='mentor'
    )
    
    expertise_areas = models.CharField(
        max_length=200,
        help_text="Areas of expertise (comma-separated)"
    )
    grade_levels = models.CharField(
        max_length=100,
        help_text="Grade levels they can mentor"
    )
    availability = models.JSONField(
        default=dict,
        help_text="Weekly availability schedule"
    )
    rating = models.FloatField(default=5.0)
    students_mentored = models.IntegerField(default=0)
    
    def __str__(self):
        return f"Mentor: {self.user.get_full_name()}"

class SchoolFinancialRecord(models.Model):
    """
    Financial transparency system.
    Addresses: Parents demanding transparency in school fund usage
    """
    RECORD_TYPE_CHOICES = (
        ('income', 'Income'),
        ('expense', 'Expense'),
        ('budget', 'Budget'),
    )
    
    title = models.CharField(max_length=200)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    record_type = models.CharField(max_length=10, choices=RECORD_TYPE_CHOICES)
    description = models.TextField()
    date = models.DateField()
    category = models.CharField(
        max_length=100,
        help_text="e.g., Infrastructure, Salaries, Transport, Supplies"
    )
    
    # Access control
    is_public = models.BooleanField(
        default=False,
        help_text="Can parents view this record?"
    )
    
    created_by = models.ForeignKey(
        User, 
        on_delete=models.CASCADE,
        related_name='created_financial_records'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-date', '-created_at']
    
    def __str__(self):
        return f"{self.title} - ${self.amount} ({self.record_type})"

class StudentRiskAssessment(models.Model):
    """
    Early warning system for dropout prevention.
    Addresses: Student dropouts happening unexpectedly
    """
    student = models.ForeignKey(
        Student, 
        on_delete=models.CASCADE,
        related_name='risk_assessments'
    )
    assessment_date = models.DateTimeField(auto_now_add=True)
    risk_score = models.IntegerField(help_text="0-100 risk score")
    
    # Store multiple risk factors as JSON
    factors = models.JSONField(
        help_text="List of risk factors identified"
    )
    recommendations = models.TextField(
        help_text="Recommended interventions"
    )
    
    assessed_by = models.ForeignKey(
        User, 
        on_delete=models.CASCADE,
        related_name='conducted_assessments'
    )
    
    class Meta:
        ordering = ['-assessment_date']
    
    def __str__(self):
        return f"Risk Assessment: {self.student.user.get_full_name()} - Score: {self.risk_score}"

class TransportRoute(models.Model):
    """
    Transport safety and accountability system.
    Addresses: School transport needs better safety measures
    """
    route_name = models.CharField(max_length=100)
    driver_name = models.CharField(max_length=100)
    driver_contact = models.CharField(max_length=15)
    vehicle_number = models.CharField(max_length=20)
    current_location = models.CharField(max_length=200, blank=True)
    is_active = models.BooleanField(default=True)
    
    # Track which students are on which route
    students_on_board = models.ManyToManyField(
        Student, 
        blank=True,
        related_name='transport_routes'
    )
    
    def __str__(self):
        return f"Route: {self.route_name} - Driver: {self.driver_name}"
    
    def get_students_count(self):
        return self.students_on_board.count()
