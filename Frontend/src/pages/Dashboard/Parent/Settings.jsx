import React from "react";
import { useAuth } from "../../../context/AuthContext";

export default function ParentSettings() {
  const { current, updateAvatar } = useAuth();
  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = () => {
      updateAvatar(r.result);
      window.dispatchEvent(new Event("storage"));
      alert("Profile updated");
    };
    r.readAsDataURL(file);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-primary mb-4">Settings</h2>
      <div className="bg-white dark:bg-[#071027] p-4 rounded">
        <img src={current?.avatarBase64 || "https://i.pravatar.cc/100"} className="w-20 h-20 rounded-full" alt="avatar" />
        <div className="mt-2">{current?.name}</div>
        <div className="mt-2">
          <input type="file" onChange={handlePhoto} />
        </div>
      </div>
    </div>
  );
}
