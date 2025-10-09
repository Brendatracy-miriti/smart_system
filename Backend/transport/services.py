import googlemaps
from django.conf import settings
from django.utils import timezone
from datetime import datetime

class GoogleMapsService:
    def __init__(self):
        self.gmaps = googlemaps.Client(key=settings.GOOGLE_MAPS_API_KEY)
    
    def geocode_address(self, address):
        """Convert address to coordinates"""
        try:
            geocode_result = self.gmaps.geocode(address)
            if geocode_result:
                location = geocode_result[0]['geometry']['location']
                return location['lat'], location['lng']
            return None, None
        except Exception as e:
            print(f"Geocoding error: {e}")
            return None, None
    
    def reverse_geocode(self, lat, lng):
        """Convert coordinates to address"""
        try:
            reverse_geocode_result = self.gmaps.reverse_geocode((lat, lng))
            if reverse_geocode_result:
                return reverse_geocode_result[0]['formatted_address']
            return "Address not found"
        except Exception as e:
            print(f"Reverse geocoding error: {e}")
            return "Address lookup failed"
    
    def get_route_directions(self, origin, destination, waypoints=None):
        """Get route directions and estimated time"""
        try:
            directions_result = self.gmaps.directions(
                origin,
                destination,
                waypoints=waypoints,
                mode="driving",
                departure_time=datetime.now()
            )
            
            if directions_result:
                route = directions_result[0]
                leg = route['legs'][0]
                
                return {
                    'distance': leg['distance']['text'],
                    'duration': leg['duration']['text'],
                    'duration_seconds': leg['duration']['value'],
                    'polyline': route['overview_polyline']['points'],
                    'steps': leg['steps']
                }
            return None
        except Exception as e:
            print(f"Directions error: {e}")
            return None
    
    def calculate_distance_matrix(self, origins, destinations):
        """Calculate distance between multiple points"""
        try:
            matrix = self.gmaps.distance_matrix(origins, destinations)
            return matrix
        except Exception as e:
            print(f"Distance matrix error: {e}")
            return None

# Singleton instance
maps_service = GoogleMapsService()