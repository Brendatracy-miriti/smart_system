import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useMessage } from "../../../context/MessageContext";

export default function StudentSettings() {
  const { current, updateAvatar } = useAuth();
  const { setMessage } = useMessage();
  const [preview, setPreview] = useState(current?.avatarBase64 || null);

  const fileToBase64 = (file) => new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });

  const handlePhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const b = await fileToBase64(file);
    updateAvatar(b);
    setPreview(b);
    setMessage({ type: "success", text: "Profile photo updated" });
    setTimeout(()=>window.dispatchEvent(new Event("storage")), 200);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-primary mb-4">Settings</h2>
      <div className="bg-white dark:bg-[#071027] p-4 rounded-xl">
        <div className="flex items-center gap-4">
          <img src={preview || current?.avatarBase64 || "https://i.pravatar.cc/100"} className="w-20 h-20 rounded-full" alt="avatar" />
          <div>
            <div className="font-semibold">{current?.name}</div>
            <div className="text-xs text-gray-500">{current?.email}</div>
          </div>
        </div>
        <div className="mt-3">
          <label className="block text-sm mb-1">Change profile photo</label>
          <input type="file" accept="image/*" onChange={handlePhoto} />
        </div>
      </div>
    </div>
  );
}
