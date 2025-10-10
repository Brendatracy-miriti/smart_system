import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, BusFront, AlertTriangle, Loader } from "lucide-react";
import api from "../../utils/api";
import { useLoadScript } from "@react-google-maps/api";
import { GoogleMap, Marker } from "@react-google-maps/api";
const BUS_ID = 1; // TODO: Make this configurable or get from props/context
const UPDATE_INTERVAL = 10000; // 10 seconds

export default function Transport() {
  const mapRef = useRef(null);
  const watchIdRef = useRef(null);
  const intervalRef = useRef(null);

  const [location, setLocation] = useState(null);
  const [map, setMap] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSosActive, setIsSosActive] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [markerPos, setMarkerPos] = useState(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
    libraries: ["places"],
  });

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
    // When loader indicates maps are available, attempt to get initial location
    if (isLoaded) {
      // set loading off and request location; the map onLoad handler will set map instance
      setIsLoading(false);
      getCurrentLocation();
    }

    // Set up periodic location updates
    intervalRef.current = setInterval(() => {
      getCurrentLocation();
    }, UPDATE_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [isLoaded]);

  // Send location update when location changes
  useEffect(() => {
    if (location) {
      // update marker position & center
      setMarkerPos(location);
      if (map) {
        try {
          map.panTo(location);
        } catch (e) {
          // ignore if map not interactive yet
        }
      }
      sendLocationUpdate(location.lat, location.lng);
    }
  }, [location]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-4"
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
            <BusFront /> Live Transport Tracking
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Real-time school bus monitoring using Google Maps API.
          </p>
        </div>
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
        <div className="flex items-center justify-center h-[500px] bg-gray-100 dark:bg-gray-800 rounded-2xl">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Loader className="animate-spin" size={24} />
            Getting your location...
          </div>
        </div>
      )}

      <div className="w-full h-[500px] rounded-2xl shadow-lg border dark:border-gray-700 overflow-hidden">
        {!isLoaded ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Loader className="animate-spin" size={24} />
              Loading map...
            </div>
          </div>
        ) : (
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={markerPos || { lat: -1.286389, lng: 36.817223 }}
            zoom={13}
            onLoad={(mapInstance) => {
              mapRef.current = mapInstance;
              setMap(mapInstance);
            }}
          >
            {markerPos && (
              <Marker
                position={markerPos}
                title="School Bus"
                // simple custom icon; scaledSize will use browser default sizing
                icon={{ url: "https://img.icons8.com/color/48/school-bus.png" }}
              />
            )}
          </GoogleMap>
        )}
      </div>

      {location && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Current Location: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
          {lastUpdate && ` • Last updated: ${lastUpdate.toLocaleTimeString()}`}
        </div>
      )}
    </motion.div>
  );
}
