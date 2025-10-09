import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { DataContext } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import { useMessage } from "../context/MessageContext";

export default function Signup() {
  const { data } = useContext(DataContext);
  const { signup } = useAuth();
  const { setMessage } = useMessage();
  const navigate = useNavigate();

  const [role, setRole] = useState("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // role fields
  const [admission, setAdmission] = useState("");
  const [course, setCourse] = useState("");
  const [childStudentId, setChildStudentId] = useState("");
  const [teacherCourses, setTeacherCourses] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }
    try {
      const extra = {};
      if (role === "student") { extra.admission_number = admission; extra.course = course; }
      if (role === "parent") { extra.childStudentId = childStudentId || null; }
      if (role === "teacher") { extra.courses = teacherCourses.split(",").map(s => s.trim()).filter(Boolean); }
      await signup({ name, email, password, role, extra });
      setMessage({ type: "success", text: "Signup success!" });
      if (role === "admin") navigate("/admin");
      if (role === "teacher") navigate("/teacher");
      if (role === "parent") navigate("/parent");
      if (role === "student") navigate("/student");
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Signup failed" });
    }
  };

  const leftVariants = {
    hidden: { x: -50, opacity: 0 },
    show: { x: 0, opacity: 1 },
  };
  const rightVariants = {
    hidden: { x: 50, opacity: 0 },
    show: { x: 0, opacity: 1 },
  };

  return (
    <div className="min-h-screen flex text-textBody dark:text-gray-100">
      {/* Left side */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={leftVariants}
        transition={{ duration: 0.7 }}
        className="hidden md:flex w-1/2 flex-col items-center justify-center bg-accent/10"
      >
        <div className="max-w-md p-10">
          <h1 className="text-4xl font-bold text-primary mb-4">Edu-Guardian</h1>
          <p className="text-textBody mb-6 dark:text-gray-300">
            Safe. Transparent. Smart. Connect your school community in one
            platform.
          </p>

          <div className="bg-surface dark:bg-[#1F2937] p-4 rounded-xl shadow">
            <h3 className="font-semibold text-primary">Why Edu-Guardian?</h3>
            <ul className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              <li>• Real-time bus tracking & alerts</li>
              <li>• Transparent school funds</li>
              <li>• Personalized revision tools</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Right side */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={rightVariants}
        transition={{ duration: 0.7 }}
        className="w-full md:w-1/2 flex items-center justify-center bg-surface dark:bg-[#111827]"
      >
        <div className="w-4/5 max-w-md p-8 bg-white dark:bg-[#1F2937] rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-primary mb-6 text-center">
            Create an account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Role</label>
              <select value={role} onChange={e => setRole(e.target.value)} className="w-full p-3 border rounded-lg bg-transparent dark:border-gray-600 focus:ring-2 focus:ring-accent">
                <option value="student">Student</option>
                <option value="parent">Parent</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input required value={name} onChange={e=>setName(e.target.value)} placeholder="Your full name" className="w-full p-3 border rounded-lg bg-transparent dark:border-gray-600 focus:ring-2 focus:ring-accent" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input required value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="your@email.com" className="w-full p-3 border rounded-lg bg-transparent dark:border-gray-600 focus:ring-2 focus:ring-accent" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border rounded-lg bg-transparent dark:border-gray-600 focus:ring-2 focus:ring-accent pr-10"
                  placeholder="Your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 border rounded-lg bg-transparent dark:border-gray-600 focus:ring-2 focus:ring-accent pr-10"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showConfirmPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* role specific */}
            {role === "student" && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Admission Number</label>
                  <input value={admission} onChange={e=>setAdmission(e.target.value)} placeholder="e.g. 2023001" className="w-full p-3 border rounded-lg bg-transparent dark:border-gray-600 focus:ring-2 focus:ring-accent" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Course / Class</label>
                  <input value={course} onChange={e=>setCourse(e.target.value)} placeholder="e.g. Form 2A" className="w-full p-3 border rounded-lg bg-transparent dark:border-gray-600 focus:ring-2 focus:ring-accent" />
                </div>
              </>
            )}

            {role === "parent" && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Link to Child</label>
                  <select value={childStudentId} onChange={e=>setChildStudentId(e.target.value)} className="w-full p-3 border rounded-lg bg-transparent dark:border-gray-600 focus:ring-2 focus:ring-accent">
                    <option value="">-- Select child (if already registered) --</option>
                    {data.students.map(s => {
                      const owner = data.users.find(u => u.id === s.userId);
                      return <option key={s.id} value={s.id}>{s.admission_number} — {owner?.name || "student"}</option>;
                    })}
                  </select>
                  <p className="text-xs text-gray-400 mt-1">If child not created yet, link later in settings.</p>
                </div>
              </>
            )}

            {role === "teacher" && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Courses Taught</label>
                  <input value={teacherCourses} onChange={e=>setTeacherCourses(e.target.value)} placeholder="e.g. Math, Physics, Form 2A" className="w-full p-3 border rounded-lg bg-transparent dark:border-gray-600 focus:ring-2 focus:ring-accent" />
                  <p className="text-xs text-gray-400 mt-1">Comma separated</p>
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-lg text-white font-semibold transition"
              style={{ backgroundColor: "#1E3A8A" }}
            >
              Create Account
            </button>
          </form>

          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-accent font-semibold underline">
              Sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
