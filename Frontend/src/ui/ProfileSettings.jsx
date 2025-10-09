import React, { useState } from "react";
import { motion } from "framer-motion";
import { Camera, Save } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function ProfileSettings() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [photo, setPhoto] = useState(user?.photo || null);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setPhoto(event.target.result);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    updateUser({ ...user, name, email, photo });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 space-y-6"
    >
      <h2 className="text-2xl font-bold text-primary">Profile Settings</h2>

      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <img
            src={photo || "https://i.pravatar.cc/100?img=5"}
            alt="Profile"
            className="w-28 h-28 rounded-full border-4 border-blue-100 object-cover"
          />
          <label className="absolute bottom-0 right-0 bg-primary p-2 rounded-full cursor-pointer">
            <Camera size={16} color="#fff" />
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </label>
        </div>

        <div className="w-full max-w-md space-y-3">
          <div>
            <label className="block text-sm mb-1">Full Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border rounded-lg dark:border-gray-700 bg-transparent"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg dark:border-gray-700 bg-transparent"
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-primary text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-accent transition"
          >
            <Save size={18} /> Save Changes
          </button>
        </div>
      </div>
    </motion.div>
  );
}
