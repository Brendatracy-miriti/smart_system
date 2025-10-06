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

