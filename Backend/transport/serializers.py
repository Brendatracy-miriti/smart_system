from rest_framework import serializers
from .models import Bus, Route, TransportLog

class BusSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    last_update_formatted = serializers.SerializerMethodField()
    current_address = serializers.SerializerMethodField()
    
    class Meta:
        model = Bus
        fields = [
            'id', 'plate_number', 'driver_name', 'driver_contact', 'capacity',
            'status', 'status_display', 'current_route', 'current_latitude',
            'current_longitude', 'last_location_update', 'last_update_formatted',
            'current_speed', 'sos_activated', 'sos_activated_at', 'current_address'
        ]
        read_only_fields = ['last_location_update', 'sos_activated_at']
    
    def get_last_update_formatted(self, obj):
        if obj.last_location_update:
            return obj.last_location_update.strftime('%H:%M:%S')
        return "Never"
    
    def get_current_address(self, obj):
        if obj.current_latitude and obj.current_longitude:
            from .services import maps_service
            return maps_service.reverse_geocode(
                float(obj.current_latitude), 
                float(obj.current_longitude)
            )
        return "Location not available"

class RouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Route
        fields = '__all__'

class TransportLogSerializer(serializers.ModelSerializer):
    bus_plate = serializers.CharField(source='bus.plate_number', read_only=True)
    log_type_display = serializers.CharField(source='get_log_type_display', read_only=True)
    time_ago = serializers.SerializerMethodField()
    
    class Meta:
        model = TransportLog
        fields = '__all__'
    
    def get_time_ago(self, obj):
        from django.utils.timesince import timesince
        return timesince(obj.created_at) + ' ago'