from django.urls import path
from . import views

app_name = 'alerts'

urlpatterns = [
    # Alert management
    path('my-alerts/', views.get_my_alerts, name='my-alerts'),
    path('create/', views.create_alert, name='create-alert'),
    path('<int:alert_id>/acknowledge/', views.acknowledge_alert, name='acknowledge-alert'),
    
    # Specialized alert endpoints
    path('emergency/', views.create_emergency_alert, name='create-emergency-alert'),
    path('financial/', views.create_financial_alert, name='create-financial-alert'),
    path('parent-meeting/', views.create_parent_meeting_alert, name='create-parent-meeting-alert'),
    path('transport/', views.create_transport_alert, name='create-transport-alert'),
    path('academic/', views.create_academic_alert, name='create-academic-alert'),
    
    # Templates
    path('templates/', views.get_alert_templates, name='alert-templates'),
]