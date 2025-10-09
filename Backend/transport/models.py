from django.db import models
from django.conf import settings
from django.utils import timezone

class Bus(models.Model):
    BUS_STATUS = (
        ('active', 'Active'),
        ('maintenance', 'Maintenance'),
        ('inactive', 'Inactive'),
    )
    
    plate_number = models.CharField(max_length=20, unique=True)
    driver_name = models.CharField(max_length=100)
    driver_contact = models.CharField(max_length=15)
    capacity = models.IntegerField(default=30)
    status = models.CharField(max_length=15, choices=BUS_STATUS, default='active')
    current_route = models.ForeignKey('Route', on_delete=models.SET_NULL, null=True, blank=True)
    
    # Geolocation fields
    current_latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    current_longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    last_location_update = models.DateTimeField(null=True, blank=True)
    current_speed = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)  # km/h
    
    # SOS Emergency
    sos_activated = models.BooleanField(default=False)
    sos_activated_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.plate_number} - {self.driver_name}"

class Route(models.Model):
    name = models.CharField(max_length=100)
    start_point = models.CharField(max_length=200)
    end_point = models.CharField(max_length=200)
    waypoints = models.JSONField(default=list, blank=True)  # Store coordinates as [{"lat": x, "lng": y}]
    estimated_duration = models.IntegerField(help_text="Duration in minutes")
    distance = models.DecimalField(max_digits=6, decimal_places=2, help_text="Distance in km")
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.start_point} to {self.end_point})"

class TransportLog(models.Model):
    LOG_TYPES = (
        ('location_update', 'Location Update'),
        ('sos_activated', 'SOS Activated'),
        ('sos_resolved', 'SOS Resolved'),
        ('maintenance', 'Maintenance'),
        ('route_change', 'Route Change'),
    )
    
    bus = models.ForeignKey(Bus, on_delete=models.CASCADE, related_name='logs')
    log_type = models.CharField(max_length=20, choices=LOG_TYPES)
    description = models.TextField()
    
    # Location data
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    address = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.bus.plate_number} - {self.get_log_type_display()} - {self.created_at}"