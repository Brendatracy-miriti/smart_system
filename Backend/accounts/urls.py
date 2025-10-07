from django.urls import path
from . import views

app_name = 'accounts'  # Namespace for accounts app

urlpatterns = [
    # ==================== AUTHENTICATION ENDPOINTS ====================
    path('register/', views.register_user, name='register'),
    path('login/', views.login_user, name='login'),
    path('logout/', views.logout_user, name='logout'),
    
    # ==================== USER PROFILE ENDPOINTS ====================
    path('profile/', views.get_user_profile, name='profile'),
    path('profile/update/', views.update_profile, name='update-profile'),
    
    # ==================== DASHBOARD DATA ENDPOINTS ====================
    path('dashboard/', views.get_dashboard_data, name='dashboard'),
    
    # ==================== PROBLEM-SOLVING ENDPOINTS ====================
    
    # Dropout Prevention - Risk Assessments
    path('risk-assessments/', views.get_student_risk_assessments, name='risk-assessments'),
    path('risk-assessments/create/', views.create_risk_assessment, name='create-risk-assessment'),
    
    # Financial Transparency
    path('financial-records/', views.get_financial_records, name='financial-records'),
    path('financial-records/create/', views.create_financial_record, name='create-financial-record'),
    
    # Transport Safety
    path('transport/routes/', views.get_transport_routes, name='transport-routes'),
    path('transport/routes/<int:route_id>/update-location/', views.update_bus_location, name='update-bus-location'),
    
    # ==================== ROLE-SPECIFIC DATA ENDPOINTS ====================
    
    # Parent endpoints
    path('parent/children/', views.get_my_children, name='my-children'),
    
    # Teacher endpoints  
    path('teacher/students/', views.get_my_students, name='my-students'),
    
    # Student endpoints
    path('student/update-learning-style/', views.update_learning_style, name='update-learning-style'),
]

"""
URL PATTERN EXPLANATION:

Authentication:
- /api/auth/register/          - User registration
- /api/auth/login/             - User login  
- /api/auth/logout/            - User logout

Profile Management:
- /api/auth/profile/           - Get user profile
- /api/auth/profile/update/    - Update profile

Dashboard:
- /api/auth/dashboard/         - Get role-specific dashboard data

Problem-Solving Features:
- /api/auth/risk-assessments/  - Dropout prevention system
- /api/auth/financial-records/ - Financial transparency
- /api/auth/transport/routes/  - Transport safety

Role-Specific Data:
- /api/auth/parent/children/   - Parent gets their children
- /api/auth/teacher/students/  - Teacher gets their students
- /api/auth/student/update-learning-style/ - Personalized learning
"""