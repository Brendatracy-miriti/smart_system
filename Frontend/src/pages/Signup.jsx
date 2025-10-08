// src/pages/Signup.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { DataContext } from "../context/DataContext";
import { useMessage } from "../context/MessageContext";

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { data } = useContext(DataContext);
  const { setMessage } = useMessage();

  const [role, setRole] = useState("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // role fields
  const [admission, setAdmission] = useState("");
  const [course, setCourse] = useState("");
  const [childStudentId, setChildStudentId] = useState("");
  const [teacherCourses, setTeacherCourses] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const extra = {};
      if (role === "student") extra.admission = admission, extra.course = course;
      if (role === "parent") extra.childStudentId = childStudentId;
      if (role === "teacher") extra.courses = teacherCourses.split(",").map(s => s.trim());
      await signup({ name, email, password, role, extra });
      setMessage({ type: "success", text: "Account created. Redirecting..." });
      // redirect to role-based dashboard
      if (role === "admin") navigate("/admin/dashboard");
      if (role === "teacher") navigate("/teacher");
      if (role === "parent") navigate("/parent");
      if (role === "student") navigate("/student");
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Signup failed" });
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select value={role} onChange={(e)=>setRole(e.target.value)} className="w-full p-2 border rounded">
          <option value="student">Student</option>
          <option value="parent">Parent</option>
          <option value="teacher">Teacher</option>
        </select>

        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" required className="w-full p-2 border rounded" />
        <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="Email" required className="w-full p-2 border rounded" />
        <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Password" required className="w-full p-2 border rounded" />

        {/* Role-specific */}
        {role === "student" && (
          <>
            <input value={admission} onChange={e=>setAdmission(e.target.value)} placeholder="Admission number" className="w-full p-2 border rounded" />
            <input value={course} onChange={e=>setCourse(e.target.value)} placeholder="Course (e.g. Form 3 - KCSE Math)" className="w-full p-2 border rounded" />
          </>
        )}

        {role === "parent" && (
          <>
            <label className="text-sm text-gray-600">Link to child (choose student admission number)</label>
            <select value={childStudentId} onChange={e=>setChildStudentId(e.target.value)} className="w-full p-2 border rounded">
              <option value="">-- Select child --</option>
              {data.students.map(s => (
                <option key={s.id} value={s.id}>{s.admission_number} — {s.userId && data.users.find(u=>u.id===s.userId)?.name}</option>
              ))}
            </select>
            <p className="text-xs text-gray-400">If child not yet created, parent can create later and link.</p>
          </>
        )}

        {role === "teacher" && (
          <>
            <input value={teacherCourses} onChange={e=>setTeacherCourses(e.target.value)} placeholder="Courses taught (comma separated)" className="w-full p-2 border rounded" />
            <p className="text-xs text-gray-400">e.g. Math, Physics, Form 2A</p>
          </>
        )}

        <button className="w-full py-2 bg-primary text-white rounded">Create account</button>
      </form>
    </div>
  );
}
