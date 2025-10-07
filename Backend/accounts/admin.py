from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import UserChangeForm, UserCreationForm
from django.utils.translation import gettext_lazy as _
from .models import *

# Custom Form for User Creation
class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = User
        fields = ('username', 'email', 'user_type')

# Custom Form for User Change
class CustomUserChangeForm(UserChangeForm):
    class Meta:
        model = User
        fields = '__all__'

class CustomUserAdmin(UserAdmin):
    """Custom Admin configuration for our User model"""
    
    form = CustomUserChangeForm
    add_form = CustomUserCreationForm
    
    # Fields to display in the user list
    list_display = ('username', 'email', 'first_name', 'last_name', 'user_type', 'at_risk_score', 'is_active', 'is_staff')
    list_filter = ('user_type', 'is_active', 'is_staff', 'is_superuser', 'created_at')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    ordering = ('-created_at',)
    
    # Fieldsets for the EDIT form
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        (_('Personal info'), {
            'fields': (
                'first_name', 'last_name', 'email', 
                'phone_number', 'date_of_birth', 'address', 
                'profile_picture'
            )
        }),
        (_('User Type & Risk Assessment'), {
            'fields': (
                'user_type',
                'at_risk_score',
                'last_risk_assessment',
            )
        }),
        (_('Permissions'), {
            'fields': (
                'is_active', 
                'is_staff', 
                'is_superuser',
                'groups', 
                'user_permissions'
            )
        }),
        (_('Important dates'), {
            'fields': ('last_login', 'date_joined', 'created_at')
        }),
    )
    
    # Fieldsets for the ADD form
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'username', 'email', 'password1', 'password2', 
                'user_type', 'first_name', 'last_name', 'phone_number',
                'is_active', 'is_staff'
            ),
        }),
    )
    
    # Make these fields read-only
    readonly_fields = ('last_login', 'date_joined', 'created_at')

# Register the User model with custom admin
admin.site.register(User, CustomUserAdmin)

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('user', 'grade', 'attendance_rate', 'average_grade', 'parent', 'preferred_learning_style')
    list_filter = ('grade', 'preferred_learning_style', 'enrollment_date')
    search_fields = ('user__username', 'user__first_name', 'user__last_name', 'grade')
    raw_id_fields = ('user', 'parent')
    
    fieldsets = (
        (None, {
            'fields': ('user', 'parent')
        }),
        ('Academic Information', {
            'fields': ('grade', 'enrollment_date', 'preferred_learning_style')
        }),
        ('Performance Metrics', {
            'fields': ('attendance_rate', 'average_grade', 'behavioral_incidents', 'last_wellness_check')
        }),
        ('Transport Information', {
            'fields': ('bus_route', 'bus_stop')
        }),
    )

@admin.register(Teacher)
class TeacherAdmin(admin.ModelAdmin):
    list_display = ('user', 'subjects', 'is_mentor', 'hire_date')
    list_filter = ('is_mentor', 'hire_date')
    search_fields = ('user__username', 'user__first_name', 'user__last_name', 'subjects')
    raw_id_fields = ('user',)
    
    fieldsets = (
        (None, {
            'fields': ('user',)
        }),
        ('Professional Information', {
            'fields': ('subjects', 'qualification', 'hire_date')
        }),
        ('Mentorship', {
            'fields': ('is_mentor', 'mentor_subjects')
        }),
    )

@admin.register(Parent)
class ParentAdmin(admin.ModelAdmin):
    list_display = ('user', 'occupation', 'relationship_to_student', 'can_view_financial_reports')
    list_filter = ('relationship_to_student', 'can_view_financial_reports')
    search_fields = ('user__username', 'user__first_name', 'user__last_name', 'occupation')
    raw_id_fields = ('user',)
    filter_horizontal = ()  # Clear any default
    
    fieldsets = (
        (None, {
            'fields': ('user',)
        }),
        ('Parent Information', {
            'fields': ('occupation', 'relationship_to_student', 'can_view_financial_reports')
        }),
    )

@admin.register(Admin)
class AdminProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'department', 'role', 'can_manage_finances', 'can_manage_transport')
    list_filter = ('department', 'can_manage_finances', 'can_manage_transport')
    search_fields = ('user__username', 'user__first_name', 'user__last_name', 'department')
    raw_id_fields = ('user',)
    
    fieldsets = (
        (None, {
            'fields': ('user',)
        }),
        ('Admin Information', {
            'fields': ('department', 'role')
        }),
        ('Permissions', {
            'fields': ('can_manage_finances', 'can_manage_transport', 'can_view_risk_reports', 'can_manage_users')
        }),
    )

@admin.register(Mentor)
class MentorAdmin(admin.ModelAdmin):
    list_display = ('user', 'expertise_areas', 'rating', 'students_mentored')
    search_fields = ('user__username', 'user__first_name', 'user__last_name', 'expertise_areas')
    raw_id_fields = ('user',)
    
    fieldsets = (
        (None, {
            'fields': ('user',)
        }),
        ('Mentor Information', {
            'fields': ('expertise_areas', 'grade_levels', 'availability', 'rating', 'students_mentored')
        }),
    )

@admin.register(SchoolFinancialRecord)
class FinancialRecordAdmin(admin.ModelAdmin):
    list_display = ('title', 'amount', 'record_type', 'category', 'is_public', 'date', 'created_by')
    list_filter = ('record_type', 'category', 'is_public', 'date')
    search_fields = ('title', 'description', 'category')
    raw_id_fields = ('created_by',)
    date_hierarchy = 'date'
    
    fieldsets = (
        (None, {
            'fields': ('title', 'description')
        }),
        ('Financial Details', {
            'fields': ('amount', 'record_type', 'category', 'date')
        }),
        ('Access Control', {
            'fields': ('is_public', 'created_by')
        }),
    )

@admin.register(StudentRiskAssessment)
class RiskAssessmentAdmin(admin.ModelAdmin):
    list_display = ('student', 'risk_score', 'assessment_date', 'assessed_by')
    list_filter = ('assessment_date', 'risk_score')
    search_fields = ('student__user__username', 'student__user__first_name', 'student__user__last_name')
    raw_id_fields = ('student', 'assessed_by')
    date_hierarchy = 'assessment_date'
    
    fieldsets = (
        (None, {
            'fields': ('student', 'assessed_by')
        }),
        ('Assessment Details', {
            'fields': ('risk_score', 'factors', 'recommendations')
        }),
    )

@admin.register(TransportRoute)
class TransportRouteAdmin(admin.ModelAdmin):
    list_display = ('route_name', 'driver_name', 'vehicle_number', 'is_active', 'get_students_count')
    list_filter = ('is_active',)
    search_fields = ('route_name', 'driver_name', 'vehicle_number')
    filter_horizontal = ('students_on_board',)
    
    fieldsets = (
        (None, {
            'fields': ('route_name', 'is_active')
        }),
        ('Driver Information', {
            'fields': ('driver_name', 'driver_contact', 'vehicle_number')
        }),
        ('Tracking', {
            'fields': ('current_location', 'students_on_board')
        }),
    )
    
    def get_students_count(self, obj):
        return obj.students_on_board.count()
    get_students_count.short_description = 'Students Count'