import React, { useEffect, useState } from "react";
import { useData } from "../../../context/DataContext";
import { useMessage } from "../../../context/MessageContext";

/**
 * Parent settings: upload photo, edit name, link/unlink child (student) by studentID/admission
 */

export default function ParentSettings() {
  const { data, updateUser, refresh } = useData();
  const { setMessage } = useMessage();
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("eg_current_user") || "null")
  );

  const [form, setForm] = useState({ name: "", avatar: "", childId: "" });

  useEffect(() => {
    if (!currentUser) return;
    const u = data.users.find((x) => x.id === currentUser.id) || currentUser;
    setForm({
      name: u.name || "",
      avatar: u.avatar || u.avatarBase64 || "",
      childId: u.childStudentId || "",
    });
  }, [currentUser, data.users]);

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setForm((p) => ({ ...p, avatar: r.result }));
    r.readAsDataURL(f);
  };

  const save = () => {
    if (!currentUser) return setMessage({ type: "error", text: "Not logged in" });

    // check if provided child exists
    if (form.childId) {
      const student = data.users.find((u) => (u.role === "student") && (u.studentID === form.childId || u.admission_number === form.childId));
      if (!student) {
        setMessage({ type: "error", text: "Child student ID not found. Double-check." });
        return;
      }
    }

    updateUser(currentUser.id, { name: form.name, avatar: form.avatar, childStudentId: form.childId });
    const updated = { ...currentUser, name: form.name, avatar: form.avatar, childStudentId: form.childId };
    localStorage.setItem("eg_current_user", JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
    refresh();
    setMessage({ type: "success", text: "Parent profile saved" });
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-primary mb-4">Parent Settings</h2>

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
          <input value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} className="w-full p-2 border rounded-md dark:bg-[#0D1117]" />
        </div>

        <div>
          <label className="block text-sm mb-1">Link child (studentID or Admission #)</label>
          <input value={form.childId} onChange={(e)=>setForm({...form, childId: e.target.value})} className="w-full p-2 border rounded-md dark:bg-[#0D1117]" />
          <p className="text-xs text-gray-500 mt-1">If left empty you can link a child later.</p>
        </div>

        <div className="flex gap-2">
          <button onClick={save} className="px-4 py-2 bg-primary text-white rounded">Save</button>
          <button onClick={()=>{ setForm({name:"",avatar:"",childId:""}); setMessage({type:"info", text:"Cleared changes"}); }} className="px-4 py-2 border rounded">Reset</button>
        </div>
      </div>
    </div>
  );
}
