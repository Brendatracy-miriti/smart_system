from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Q

from .models import Bus, Route, TransportLog
from .serializers import BusSerializer, RouteSerializer, TransportLogSerializer
from .services import maps_service
from accounts.permissions import IsAdmin, CanManageTransport

@api_view(['GET'])
@permission_classes([CanManageTransport])
def get_buses(request):
    """Get all buses with current locations"""
    buses = Bus.objects.filter(status='active').select_related('current_route')
    serializer = BusSerializer(buses, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([CanManageTransport])
def update_bus_location(request, bus_id):
    """Update bus location with geocoding"""
    try:
        bus = Bus.objects.get(id=bus_id)
        latitude = request.data.get('latitude')
        longitude = request.data.get('longitude')
        speed = request.data.get('speed')
        
        if latitude and longitude:
            bus.current_latitude = latitude
            bus.current_longitude = longitude
            bus.last_location_update = timezone.now()
            
            # Get address from coordinates
            address = maps_service.reverse_geocode(float(latitude), float(longitude))
            
            if speed:
                bus.current_speed = speed
            
            bus.save()
            
            # Create transport log
            TransportLog.objects.create(
                bus=bus,
                log_type='location_update',
                description=f'Location updated - Speed: {speed or "N/A"} km/h',
                latitude=latitude,
                longitude=longitude,
                address=address
            )
            
            return Response({
                'message': 'Location updated successfully',
                'address': address,
                'bus': BusSerializer(bus).data
            })
        
        return Response({'error': 'Latitude and longitude required'}, status=400)
        
    except Bus.DoesNotExist:
        return Response({'error': 'Bus not found'}, status=404)

@api_view(['POST'])
@permission_classes([CanManageTransport])
def activate_sos(request, bus_id):
    """Activate SOS emergency for a bus"""
    try:
        bus = Bus.objects.get(id=bus_id)
        bus.sos_activated = True
        bus.sos_activated_at = timezone.now()
        bus.save()
        
        # Create SOS log
        TransportLog.objects.create(
            bus=bus,
            log_type='sos_activated',
            description='SOS emergency activated by driver',
            latitude=bus.current_latitude,
            longitude=bus.current_longitude,
            address=maps_service.reverse_geocode(
                float(bus.current_latitude), 
                float(bus.current_longitude)
            ) if bus.current_latitude and bus.current_longitude else "Unknown location"
        )
        
        # Create emergency alert for admins and parents
        from alerts.views import create_emergency_alert
        create_emergency_alert(request, {
            'template': 'bus_sos_emergency',
            'bus_id': bus_id,
            'custom_data': {
                'bus_plate': bus.plate_number,
                'driver_name': bus.driver_name,
                'location': bus.current_address
            }
        })
        
        return Response({
            'message': 'SOS activated successfully',
            'bus': BusSerializer(bus).data
        })
        
    except Bus.DoesNotExist:
        return Response({'error': 'Bus not found'}, status=404)

@api_view(['POST'])
@permission_classes([CanManageTransport])
def resolve_sos(request, bus_id):
    """Resolve SOS emergency"""
    try:
        bus = Bus.objects.get(id=bus_id)
        bus.sos_activated = False
        bus.save()
        
        TransportLog.objects.create(
            bus=bus,
            log_type='sos_resolved',
            description='SOS emergency resolved'
        )
        
        return Response({'message': 'SOS resolved successfully'})
        
    except Bus.DoesNotExist:
        return Response({'error': 'Bus not found'}, status=404)

@api_view(['GET'])
@permission_classes([CanManageTransport])
def get_transport_logs(request):
    """Get transport logs with filters"""
    logs = TransportLog.objects.select_related('bus').all()
    
    # Apply filters
    bus_id = request.GET.get('bus_id')
    log_type = request.GET.get('log_type')
    date_from = request.GET.get('date_from')
    date_to = request.GET.get('date_to')
    
    if bus_id:
        logs = logs.filter(bus_id=bus_id)
    if log_type:
        logs = logs.filter(log_type=log_type)
    if date_from:
        logs = logs.filter(created_at__date__gte=date_from)
    if date_to:
        logs = logs.filter(created_at__date__lte=date_to)
    
    serializer = TransportLogSerializer(logs, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([CanManageTransport])
def geocode_address(request):
    """Convert address to coordinates"""
    address = request.data.get('address')
    if not address:
        return Response({'error': 'Address required'}, status=400)
    
    lat, lng = maps_service.geocode_address(address)
    if lat and lng:
        return Response({
            'address': address,
            'latitude': lat,
            'longitude': lng
        })
    
    return Response({'error': 'Could not geocode address'}, status=400)

@api_view(['POST'])
@permission_classes([CanManageTransport])
def get_route_directions(request):
    """Get directions for a route"""
    origin = request.data.get('origin')
    destination = request.data.get('destination')
    waypoints = request.data.get('waypoints', [])
    
    if not origin or not destination:
        return Response({'error': 'Origin and destination required'}, status=400)
    
    directions = maps_service.get_route_directions(origin, destination, waypoints)
    if directions:
        return Response(directions)
    
    return Response({'error': 'Could not calculate route'}, status=400)