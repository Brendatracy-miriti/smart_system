import React, { useEffect, useRef, useState } from "react";
import { AlertTriangle, Loader } from "lucide-react";
import api from "../../../utils/api";

const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY_HERE";
const BUS_ID = 1; // TODO: Make this configurable or get from props/context
const UPDATE_INTERVAL = 10000; // 10 seconds

export default function Transport() {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const intervalRef = useRef(null);

  const [location, setLocation] = useState(null);
  const [map, setMap] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSosActive, setIsSosActive] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newLocation = { lat: latitude, lng: longitude };
        setLocation(newLocation);
        setError(null);
        setIsLoading(false);

        // Update marker position
        if (markerRef.current) {
          markerRef.current.setPosition(newLocation);
        }

        // Center map on current location
        if (map) {
          map.setCenter(newLocation);
        }
      },
      (error) => {
        let errorMessage = "Unable to retrieve your location.";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. Please enable location permissions.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
        }
        setError(errorMessage);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  // Send location update to backend
  const sendLocationUpdate = async (latitude, longitude) => {
    try {
      const response = await api.post(`transport/${BUS_ID}/update-location/`, {
        latitude,
        longitude,
        speed: 0, // TODO: Calculate speed from previous locations
      });
      setLastUpdate(new Date());
      console.log("Location updated:", response.data);
    } catch (error) {
      console.error("Failed to update location:", error);
      setError("Failed to update location on server.");
    }
  };

  // Handle SOS activation
  const handleSosActivate = async () => {
    try {
      setIsSosActive(true);
      const response = await api.post(`transport/${BUS_ID}/activate-sos/`);
      console.log("SOS activated:", response.data);
      // TODO: Show success message or notification
    } catch (error) {
      console.error("Failed to activate SOS:", error);
      setError("Failed to activate SOS.");
      setIsSosActive(false);
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
    script.async = true;
    script.onload = () => initMap();
    document.body.appendChild(script);
  }, []);

  const initMap = () => {
    const center = { lat: -1.286389, lng: 36.817223 }; // Nairobi CBD fallback
    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center,
      zoom: 13,
      mapId: "DEMO_MAP_ID",
    });
    const marker = new window.google.maps.Marker({
      position: center,
      map: mapInstance,
      title: "School Bus #1",
      icon: "https://maps.google.com/mapfiles/ms/icons/bus.png",
    });

    setMap(mapInstance);
    markerRef.current = marker;

    // Get initial location
    getCurrentLocation();

    // Set up periodic location updates
    intervalRef.current = setInterval(() => {
      getCurrentLocation();
    }, UPDATE_INTERVAL);
  };

  // Send location update when location changes
  useEffect(() => {
    if (location) {
      sendLocationUpdate(location.lat, location.lng);
    }
  }, [location]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary">Live Bus Tracking</h2>
        <button
          onClick={handleSosActivate}
          disabled={isSosActive}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            isSosActive
              ? "bg-red-600 text-white cursor-not-allowed"
              : "bg-red-500 hover:bg-red-600 text-white"
          }`}
        >
          <AlertTriangle size={18} />
          {isSosActive ? "SOS Active" : "Activate SOS"}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center h-[500px] bg-gray-100 dark:bg-gray-800 rounded-xl">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Loader className="animate-spin" size={24} />
            Getting your location...
          </div>
        </div>
      )}

      <div
        ref={mapRef}
        className="w-full h-[500px] rounded-xl shadow border border-gray-300"
      />

      {location && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Current Location: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
          {lastUpdate && ` • Last updated: ${lastUpdate.toLocaleTimeString()}`}
        </div>
      )}
    </div>
  );
}
