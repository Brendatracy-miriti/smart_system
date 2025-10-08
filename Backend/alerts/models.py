from django.db import models
from django.conf import settings
from django.utils import timezone

class Alert(models.Model):
    """
    Central alert system for notifications across the LMS
    """
    ALERT_TYPE_CHOICES = (
        ('transport_safety', 'Transport Safety'),
        ('academic_performance', 'Academic Performance'),
        ('attendance', 'Attendance Issue'),
        ('behavior', 'Behavioral Incident'),
        ('health_wellness', 'Health & Wellness'),
        ('school_safety', 'School Safety'),
        ('financial', 'Financial Update'),
        ('system', 'System Notification'),
        ('achievement', 'Student Achievement'),
        ('parent_meeting', 'Parent Meeting Request'),
    )
    
    PRIORITY_CHOICES = (
        ('low', 'Low Priority'),
        ('medium', 'Medium Priority'),
        ('high', 'High Priority'),
        ('emergency', 'Emergency'),
    )
    
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('acknowledged', 'Acknowledged'),
        ('resolved', 'Resolved'),
        ('expired', 'Expired'),
    )
    
    # Core alert information
    title = models.CharField(max_length=200)
    message = models.TextField()
    alert_type = models.CharField(max_length=20, choices=ALERT_TYPE_CHOICES)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    status = models.CharField(max_length=12, choices=STATUS_CHOICES, default='active')
    
    # Target audience
    target_users = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='alerts_received',
        blank=True,
        help_text="Specific users who should receive this alert"
    )
    target_user_types = models.JSONField(
        default=list,
        blank=True,
        help_text="User types who should receive this alert (e.g., ['parent', 'teacher'])"
    )
    
    # Student-specific alerts
    student = models.ForeignKey(
        'accounts.Student',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='alerts',
        help_text="If this alert is about a specific student"
    )
    
    # Metadata
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='alerts_created'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    
    # Action fields
    action_required = models.BooleanField(default=False)
    action_url = models.CharField(max_length=500, blank=True)
    action_text = models.CharField(max_length=100, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['alert_type', 'status']),
            models.Index(fields=['priority', 'status']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"{self.title} ({self.get_priority_display()})"
    
    def is_expired(self):
        """Check if alert has expired"""
        if self.expires_at:
            return timezone.now() > self.expires_at
        return False
    
    def mark_acknowledged(self, user):
        """Mark alert as acknowledged by a user"""
        AlertAcknowledgement.objects.create(alert=self, user=user)
    
    def get_acknowledged_users(self):
        """Get users who have acknowledged this alert"""
        return self.acknowledgements.all()

class AlertAcknowledgement(models.Model):
    """
    Track which users have acknowledged which alerts
    """
    alert = models.ForeignKey(
        Alert,
        on_delete=models.CASCADE,
        related_name='acknowledgements'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='alert_acknowledgements'
    )
    acknowledged_at = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True)
    
    class Meta:
        unique_together = ['alert', 'user']
        ordering = ['-acknowledged_at']
    
    def __str__(self):
        return f"{self.user.username} acknowledged {self.alert.title}"

class AlertTemplate(models.Model):
    """
    Reusable templates for common alert types
    """
    name = models.CharField(max_length=100)
    alert_type = models.CharField(max_length=20, choices=Alert.ALERT_TYPE_CHOICES)
    title_template = models.CharField(max_length=200)
    message_template = models.TextField()
    default_priority = models.CharField(max_length=10, choices=Alert.PRIORITY_CHOICES, default='medium')
    default_expiry_hours = models.IntegerField(default=24, help_text="Default expiry in hours")
    
    # Template variables help text
    variables_help = models.TextField(
        blank=True,
        help_text="Available variables for this template"
    )
    
    def __str__(self):
        return f"{self.name} ({self.get_alert_type_display()})"
    
    def create_alert(self, context_data, created_by, **kwargs):
        """Create an alert from this template with context data"""
        from django.template import Template, Context
        title = Template(self.title_template).render(Context(context_data))
        message = Template(self.message_template).render(Context(context_data))
        
        return Alert.objects.create(
            title=title,
            message=message,
            alert_type=self.alert_type,
            priority=kwargs.get('priority', self.default_priority),
            created_by=created_by,
            expires_at=timezone.now() + timezone.timedelta(
                hours=kwargs.get('expiry_hours', self.default_expiry_hours)
            ),
            **{k: v for k, v in kwargs.items() if k not in ['priority', 'expiry_hours']}
        )