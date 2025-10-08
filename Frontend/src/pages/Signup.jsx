import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import { useMessage } from "../context/MessageContext"; // you have this already

export default function Signup() {
  const { data } = useContext(DataContext);
  const { signup } = useAuth();
  const { setMessage } = useMessage();
  const navigate = useNavigate();

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
      if (role === "student") { extra.admission_number = admission; extra.course = course; }
      if (role === "parent") { extra.childStudentId = childStudentId || null; }
      if (role === "teacher") { extra.courses = teacherCourses.split(",").map(s => s.trim()).filter(Boolean); }
      await signup({ name, email, password, role, extra });
      setMessage({ type: "success", text: "Signup success!" });
      if (role === "teacher") navigate("/teacher");
      if (role === "parent") navigate("/parent");
      if (role === "student") navigate("/student");
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Signup failed" });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      transition={{ duration: 0.7 }}
      className="min-h-screen flex items-center justify-center p-6 bg-surface"
    >
      <div className="max-w-md w-full bg-white dark:bg-[#0B1221] p-6 rounded-2xl shadow">
        <h2 className="text-2xl font-bold text-primary mb-4">Create an account</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <select value={role} onChange={e => setRole(e.target.value)} className="w-full p-2 border rounded">
            <option value="student">Student</option>
            <option value="parent">Parent</option>
            <option value="teacher">Teacher</option>
          </select>

          <input required value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" className="w-full p-2 border rounded" />
          <input required value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="Email" className="w-full p-2 border rounded" />
          <input required value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Password" className="w-full p-2 border rounded" />

          {/* role specific */}
          {role === "student" && (
            <>
              <input value={admission} onChange={e=>setAdmission(e.target.value)} placeholder="Admission number" className="w-full p-2 border rounded" />
              <input value={course} onChange={e=>setCourse(e.target.value)} placeholder="Course / Class (e.g. Form 2A)" className="w-full p-2 border rounded" />
            </>
          )}

          {role === "parent" && (
            <>
              <label className="text-sm text-gray-600">Link to child (select admission)</label>
              <select value={childStudentId} onChange={e=>setChildStudentId(e.target.value)} className="w-full p-2 border rounded">
                <option value="">-- choose child (if already registered) --</option>
                {data.students.map(s => {
                  const owner = data.users.find(u => u.id === s.userId);
                  return <option key={s.id} value={s.id}>{s.admission_number} — {owner?.name || "student"}</option>;
                })}
              </select>
              <p className="text-xs text-gray-400">If child not created yet, link later in settings.</p>
            </>
          )}

          {role === "teacher" && (
            <>
              <input value={teacherCourses} onChange={e=>setTeacherCourses(e.target.value)} placeholder="Courses taught (comma separated)" className="w-full p-2 border rounded" />
              <p className="text-xs text-gray-400">e.g. Math,Physics,Form 2A</p>
            </>
          )}

          <button type="submit" className="w-full py-2 bg-primary text-white rounded">Create account</button>
        </form>
      </div>
    </motion.div>
  );
}
