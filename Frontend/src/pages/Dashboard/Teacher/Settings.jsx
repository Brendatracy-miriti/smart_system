import React, { useEffect, useState } from "react";
import { useData } from "../../../context/DataContext";
import { useMessage } from "../../../context/MessageContext";

/**
 * Teacher settings: edit name, courses taught, profile photo
 * courses stored as array on user.courses
 */

export default function TeacherSettings() {
  const { data, updateUser, refresh } = useData();
  const { setMessage } = useMessage();
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("eg_current_user") || "null")
  );
  const [form, setForm] = useState({ name: "", coursesText: "", avatar: "" });

  useEffect(() => {
    if (!currentUser) return;
    const userRecord = data.users.find((u) => u.id === currentUser.id) || currentUser;
    setForm({
      name: userRecord.name || "",
      coursesText: (userRecord.courses || []).join(", "),
      avatar: userRecord.avatar || userRecord.avatarBase64 || "",
    });
  }, [currentUser, data.users]);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = () => setForm((p) => ({ ...p, avatar: r.result }));
    r.readAsDataURL(file);
  };

  const save = () => {
    if (!currentUser) return setMessage({ type: "error", text: "Login first" });
    const courses = form.coursesText.split(",").map(s => s.trim()).filter(Boolean);
    updateUser(currentUser.id, { name: form.name, courses, avatar: form.avatar });
    const updated = { ...currentUser, name: form.name, courses, avatar: form.avatar };
    localStorage.setItem("eg_current_user", JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
    refresh();
    setMessage({ type: "success", text: "Saved teacher profile" });
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-primary mb-4">Teacher Settings</h2>

      <div className="bg-white dark:bg-[#071027] p-4 rounded-xl shadow space-y-3">
        <div className="flex items-center gap-4">
          <img src={form.avatar || "/default-avatar.png"} alt="avatar" className="w-20 h-20 rounded-full object-cover border" />
          <div>
            <input type="file" accept="image/*" onChange={handleFile} />
            <div className="text-xs text-gray-500 mt-1">Upload photo</div>
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Full name</label>
          <input value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} className="w-full p-2 border rounded-md dark:bg-[#0D1117]" />
        </div>

        <div>
          <label className="block text-sm mb-1">Courses taught (comma separated)</label>
          <input value={form.coursesText} onChange={(e)=>setForm({...form, coursesText:e.target.value})} className="w-full p-2 border rounded-md dark:bg-[#0D1117]" />
        </div>

        <div className="flex gap-2">
          <button onClick={save} className="px-4 py-2 bg-primary text-white rounded">Save</button>
          <button onClick={()=>{ setForm({...form, coursesText:""}); setMessage({type:"info", text:"Cleared courses field"}); }} className="px-4 py-2 border rounded">Clear</button>
        </div>
      </div>
    </div>
  );
}
