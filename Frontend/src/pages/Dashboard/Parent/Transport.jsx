import React, { useEffect, useRef, useState } from "react";
import { AlertTriangle, Loader } from "lucide-react";
import api from "../../../utils/api";
import { useData } from "../../../context/DataContext";
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

  const [markerPos, setMarkerPos] = useState(null);

  // if Google Maps key is present, the component can use @react-google-maps
  let hasMapsKey = Boolean(import.meta.env.VITE_GOOGLE_MAPS_KEY);
  let isLoaded = false;
  let loadError = null;

  const { data } = useData();
  const buses = data.buses || [];

  // Get current location (used when interacting with live device)
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
    // If maps key available, initial load would happen; otherwise just get current location and rely on DataContext buses
    setIsLoading(false);
    getCurrentLocation();
  }, []);

  const initMap = () => {
    // left intentionally light: when Google Maps is present this will be implemented
  };

  // Send location update when location changes
  useEffect(() => {
    if (location) {
      setMarkerPos(location);
      if (map) {
        try {
          map.panTo(location);
        } catch {}
      }
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

      <div className="w-full h-[500px] rounded-xl shadow border border-gray-300 overflow-hidden">
        {hasMapsKey ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Loader className="animate-spin" size={24} />
              Loading map (Google Maps key present)...
            </div>
          </div>
        ) : (
          // Fallback: show a simple list + tiny SVG position preview based on DataContext buses
          <div className="p-4 h-full overflow-auto">
            {buses.length === 0 ? (
              <div className="text-center text-gray-500">No transport data available.</div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {buses.map((b) => (
                  <div key={b.busId || b.id} className="p-3 bg-white dark:bg-[#0b1220] rounded shadow flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{b.busId || b.id}</div>
                      <div className="text-sm text-gray-500">Driver: {b.driver || b.driver?.name || 'N/A'}</div>
                      <div className="text-xs text-gray-400">Status: {b.status || b.active ? 'Active' : 'Unknown'}</div>
                      <div className="text-xs text-gray-400">Pos: {b.lat?.toFixed ? `${b.lat.toFixed(5)}, ${b.lng.toFixed(5)}` : 'N/A'}</div>
                    </div>
                    <div className="w-36 h-20 flex items-center justify-center">
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        <rect x="0" y="0" width="100" height="100" fill="#e6eef9" />
                        {/* marker relative by lat/lng normalized to a tiny box (demo only) */}
                        {b.lat && b.lng && (
                          <circle cx={50 + ((b.lng % 1) * 40)} cy={50 - ((b.lat % 1) * 40)} r="4" fill="#2563EB" />
                        )}
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {location && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Current Location: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
          {lastUpdate && ` • Last updated: ${lastUpdate.toLocaleTimeString()}`}
        </div>
      )}
    </div>
  );
}
