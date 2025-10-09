from django.urls import path
from . import views


urlpatterns = [
    # Bus management
    path('', views.get_buses, name='get-buses'),
    path('<int:bus_id>/update-location/', views.update_bus_location, name='update-bus-location'),
    path('<int:bus_id>/activate-sos/', views.activate_sos, name='activate-sos'),
    path('<int:bus_id>/resolve-sos/', views.resolve_sos, name='resolve-sos'),
    
    # Logs
    path('logs/', views.get_transport_logs, name='get-transport-logs'),
    
    # Google Maps services
    path('geocode/', views.geocode_address, name='geocode-address'),
    path('directions/', views.get_route_directions, name='get-directions'),
]