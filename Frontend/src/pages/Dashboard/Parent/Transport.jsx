import React, { useEffect, useRef } from "react";

export default function Transport() {
  const mapRef = useRef(null);
  const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY_HERE"; // 🔑 placeholder

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
    script.async = true;
    script.onload = () => initMap();
    document.body.appendChild(script);
  }, []);

  const initMap = () => {
    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: -1.286389, lng: 36.817223 }, // Nairobi CBD default
      zoom: 13,
      mapId: "DEMO_MAP_ID",
    });
    const marker = new window.google.maps.Marker({
      position: { lat: -1.286389, lng: 36.817223 },
      map,
      title: "School Bus #1",
      icon: "https://maps.google.com/mapfiles/ms/icons/bus.png",
    });
    // Simulated movement
    let i = 0;
    setInterval(() => {
      marker.setPosition({
        lat: -1.286389 + Math.sin(i / 20) * 0.01,
        lng: 36.817223 + Math.cos(i / 20) * 0.01,
      });
      i++;
    }, 2000);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-primary mb-3">Live Bus Tracking</h2>
      <div
        ref={mapRef}
        className="w-full h-[500px] rounded-xl shadow border border-gray-300"
      />
    </div>
  );
}
