import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { DataContext } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import { useMessage } from "../context/MessageContext";
import loginIllustration from "../assets/login-signup illustration.svg";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function Signup() {
  const { data, setData } = useContext(DataContext);
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
  const [avatar, setAvatar] = useState("");
  // role fields
  const [admission, setAdmission] = useState("");
  const [course, setCourse] = useState("");
  const [childStudentId, setChildStudentId] = useState("");
  const [teacherCourses, setTeacherCourses] = useState("");

  // preview + save avatar
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatar(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    try {
      const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        role,
        avatar,
      };

      const extra = {};
      if (role === "student") {
        extra.admission_number = admission;
        extra.course = course;
        extra.studentID = admission || `STU${Date.now()}`;
      }
      if (role === "parent") {
        extra.childStudentId = childStudentId || null;
      }
      if (role === "teacher") {
        extra.courses = teacherCourses
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }

      const newUserWithExtra = { ...newUser, ...extra };

      // Save to localStorage via DataContext
      const updatedUsers = [...data.users, newUserWithExtra];
      setData((prev) => ({ ...prev, users: updatedUsers }));
      localStorage.setItem("users", JSON.stringify(updatedUsers));

      // Auto-link parent <-> student
      if (role === "parent" && childStudentId) {
        const student = updatedUsers.find(
          (u) =>
            u.role === "student" &&
            (u.admission_number === childStudentId ||
              u.studentID === childStudentId)
        );
        if (!student) {
          setMessage({
            type: "error",
            text: "No student found with that ID. Link manually later in settings.",
          });
        }
      }

      setMessage({ type: "success", text: "Signup successful!" });

      // Redirect
      if (role === "admin") navigate("/admin/dashboard");
      if (role === "teacher") navigate("/teacher");
      if (role === "parent") navigate("/parent");
      if (role === "student") navigate("/student");
    } catch (err) {
      setMessage({
        type: "error",
        text: err.message || "Signup failed. Try again.",
      });
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
    <div className="flex h-screen w-full">
      {/* LEFT SIDE - Illustration + Welcome text */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={leftVariants}
        transition={{ duration: 0.7 }}
        className="hidden md:flex w-3/5 flex-col items-center justify-center text-white bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600"
      >
        <div className="w-4/5 flex flex-col items-center text-center px-8">
          <h2 className="text-4xl font-bold mb-4">Welcome to Edu-Guardian</h2>
          <p className="text-lg mb-6 text-white/90">
            Safe. Transparent. Smart. Connect your school community in one platform.
          </p>

          {/* Why EduGuardian Box */}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg mb-8 w-2/4">
            <h3 className="font-semibold text-white text-lg mb-2">Why EduGuardian?</h3>
            <ul className="mt-3 text-sm text-white/90 space-y-1">
              <li>• Real-time bus tracking & alerts</li>
              <li>• Transparent school funds</li>
              <li>• Personalized revision tools</li>
            </ul>
          </div>

          <img
            src={loginIllustration}
            alt="Login illustration"
            className="w-3/4 mx-auto drop-shadow-lg"
          />
        </div>
      </motion.div>

      {/* RIGHT SIDE - Signup Form */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={rightVariants}
        transition={{ duration: 0.7 }}
        className="w-full md:w-2/5 flex items-center justify-center bg-[#0f172a] text-white"
      >
        <div className="max-w-md w-full mx-auto px-10 h-screen overflow-y-auto">
          <h1 className="text-3xl font-bold mb-2 text-center">Create Account</h1>
          <p className="text-gray-400 mb-8 text-center">
            Fill in your details to get started
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Select */}
            <div>
              <label className="block mb-2 text-sm">Select Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-[#1E293B] text-white outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">-- choose role --</option>
                <option value="student">Student</option>
                <option value="parent">Parent</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>

            {/* Full Name */}
            <div>
              <label className="block mb-2 text-sm">Full Name</label>
              <input
                type="text"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-[#1E293B] text-white outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block mb-2 text-sm">Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-[#1E293B] text-white outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Profile photo */}
            <div>
              <label className="block mb-2 text-sm">Profile Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="w-full px-4 py-2 rounded-md bg-[#1E293B] text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
              {avatar && (
                <img
                  src={avatar}
                  alt="Preview"
                  className="mt-2 w-16 h-16 rounded-full object-cover border"
                />
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block mb-2 text-sm">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 pr-10 rounded-md bg-[#1E293B] text-white outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white"
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible size={20} />
                  ) : (
                    <AiOutlineEye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block mb-2 text-sm">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 pr-10 rounded-md bg-[#1E293B] text-white outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? (
                    <AiOutlineEyeInvisible size={20} />
                  ) : (
                    <AiOutlineEye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Role-specific fields */}
            {role === "student" && (
              <>
                <div>
                  <label className="block mb-2 text-sm">Admission Number</label>
                  <input
                    value={admission}
                    onChange={(e) => setAdmission(e.target.value)}
                    placeholder="e.g. 2023001"
                    className="w-full px-4 py-2 rounded-md bg-[#1E293B] text-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm">Course / Class</label>
                  <input
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    placeholder="e.g. Form 2A"
                    className="w-full px-4 py-2 rounded-md bg-[#1E293B] text-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}

            {role === "parent" && (
              <div>
                <label className="block mb-2 text-sm">Link to Child (Student ID)</label>
                <select
                  value={childStudentId}
                  onChange={(e) => setChildStudentId(e.target.value)}
                  className="w-full px-4 py-2 rounded-md bg-[#1E293B] text-white outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">
                    -- Select child (if already registered) --
                  </option>
                  {data.users
                    .filter((u) => u.role === "student")
                    .map((s) => (
                      <option key={s.id} value={s.studentID || s.admission_number}>
                        {s.name} ({s.course || s.admission_number})
                      </option>
                    ))}
                </select>
                <p className="text-xs text-gray-400 mt-1">
                  If child not registered yet, link later in settings.
                </p>
              </div>
            )}

            {role === "teacher" && (
              <div>
                <label className="block mb-2 text-sm">Courses Taught</label>
                <input
                  value={teacherCourses}
                  onChange={(e) => setTeacherCourses(e.target.value)}
                  placeholder="e.g. Math, Physics, Form 2A"
                  className="w-full px-4 py-2 rounded-md bg-[#1E293B] text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-400 mt-1">Comma separated</p>
              </div>
            )}

            {/* Signup Button */}
            <button
              type="submit"
              className="w-full py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-md font-semibold transition"
            >
              Create Account
            </button>
          </form>

          <p className="text-gray-400 text-sm mt-6 text-center">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-sky-400 hover:underline font-medium"
            >
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
