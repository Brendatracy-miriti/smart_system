import React from "react";
import { useLive } from "../../../context/LiveContext";

export default function Transport() {
  const { transport } = useLive();
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-primary mb-4">Transport</h2>
      {transport.length ? transport.map(t => (
        <div key={t.id} className="bg-white dark:bg-[#071027] p-3 rounded mb-2">
          <div className="font-semibold">Bus: {t.busId}</div>
          <div className="text-xs text-gray-500">Driver: {t.driver} • {t.status}</div>
          <div className="text-xs text-gray-400">Last: {t.timestamp}</div>
        </div>
      )) : <div className="text-gray-500">No transport logs yet.</div>}
    </div>
  );
}
