import React, { useEffect, useState } from "react";
import { useData } from "../../../context/DataContext";
import { useMessage } from "../../../context/MessageContext";

/**
 * Student settings: change name, course, admission number, profile photo.
 * Saves to DataContext.users and to eg_current_user in localStorage.
 */

export default function StudentSettings() {
  const { data, updateUser, refresh } = useData();
  const { setMessage } = useMessage();
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("eg_current_user") || "null")
  );
  const [form, setForm] = useState({
    name: "",
    course: "",
    admission_number: "",
    avatar: "",
  });

  useEffect(() => {
    if (!currentUser) return;
    // prefer newest data from data.users if present
    const userRecord = data.users.find((u) => u.id === currentUser.id) || currentUser;
    setForm({
      name: userRecord.name || "",
      course: userRecord.course || userRecord.course || "",
      admission_number: userRecord.admission_number || userRecord.studentID || "",
      avatar: userRecord.avatar || userRecord.avatarBase64 || "",
    });
  }, [currentUser, data.users]);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm((p) => ({ ...p, avatar: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const save = () => {
    if (!currentUser) return setMessage({ type: "error", text: "Not logged in" });
    // update DataContext users and localStorage current user
    updateUser(currentUser.id, {
      name: form.name,
      course: form.course,
      admission_number: form.admission_number,
      avatar: form.avatar,
      studentID: form.admission_number || currentUser.studentID || undefined,
    });

    // also keep eg_current_user in sync
    const updated = { ...currentUser, ...form };
    localStorage.setItem("eg_current_user", JSON.stringify(updated));
    setCurrentUser(updated);
    window.dispatchEvent(new Event("storage"));
    refresh();
    setMessage({ type: "success", text: "Profile updated" });
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-primary mb-4">Profile Settings</h2>

      <div className="bg-white dark:bg-[#071027] p-4 rounded-xl shadow space-y-3">
        <div className="flex items-center gap-4">
          <img
            src={form.avatar || "/default-avatar.png"}
            alt="avatar"
            className="w-20 h-20 rounded-full object-cover border"
          />
          <div className="flex-1">
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="text-sm"
            />
            <div className="text-xs text-gray-500 mt-2">Upload a profile photo</div>
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Full name</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full p-2 border rounded-md dark:bg-[#0D1117]"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Course / Class</label>
          <input
            value={form.course}
            onChange={(e) => setForm({ ...form, course: e.target.value })}
            className="w-full p-2 border rounded-md dark:bg-[#0D1117]"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Admission Number / Student ID</label>
          <input
            value={form.admission_number}
            onChange={(e) => setForm({ ...form, admission_number: e.target.value })}
            className="w-full p-2 border rounded-md dark:bg-[#0D1117]"
          />
        </div>

        <div className="flex gap-2">
          <button onClick={save} className="px-4 py-2 bg-primary text-white rounded">Save changes</button>
          <button onClick={() => { setForm({ name: "", course: "", admission_number: "", avatar: "" }); setMessage({ type: "info", text: "Cleared edits" }); }} className="px-4 py-2 border rounded">Reset</button>
        </div>
      </div>
    </div>
  );
}
