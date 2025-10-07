import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useMessage } from "../context/MessageContext";

export default function Signup() {
  const navigate = useNavigate();
  const { setMessage } = useMessage();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const existing =
        JSON.parse(localStorage.getItem("smartedu_users")) || [];

      if (existing.find((u) => u.username === username)) {
        setMessage({ type: "error", text: "Username already exists!" });
        setLoading(false);
        return;
      }

      const newUser = { username, password, name, role };
      localStorage.setItem(
        "smartedu_users",
        JSON.stringify([...existing, newUser])
      );

      setMessage({ type: "success", text: "Signup successful! Please login." });
      navigate("/login");
    } catch {
      setMessage({ type: "error", text: "Signup failed!" });
    } finally {
      setLoading(false);
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
        className="hidden md:flex w-1/2 flex-col items-center justify-center bg-primary/10"
      >
        <div className="max-w-md p-10">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Welcome to SmartEdu360
          </h1>
          <p className="text-textBody mb-6 dark:text-gray-300">
            Create your account and join your school’s digital community.
          </p>

          <div className="bg-surface dark:bg-[#1F2937] p-4 rounded-xl shadow">
            <h3 className="font-semibold text-primary">Get started</h3>
            <ul className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              <li>• Manage student data</li>
              <li>• Track buses live</li>
              <li>• See fund transparency</li>
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
            Create account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Full name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border rounded-lg bg-transparent dark:border-gray-600 focus:ring-2 focus:ring-accent"
                placeholder="Jane Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 border rounded-lg bg-transparent dark:border-gray-600 focus:ring-2 focus:ring-accent"
                placeholder="janedoe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border rounded-lg bg-transparent dark:border-gray-600 focus:ring-2 focus:ring-accent"
                placeholder="Create a password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Select Role
              </label>
              <select
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-3 border rounded-lg bg-transparent dark:border-gray-600 focus:ring-2 focus:ring-accent"
              >
                <option value="">-- choose role --</option>
                <option value="teacher">Teacher</option>
                <option value="parent">Parent</option>
                <option value="student">Student</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg text-white font-semibold transition"
              style={{ backgroundColor: "#1E3A8A" }}
            >
              {loading ? "Please wait..." : "Create account"}
            </button>
          </form>

          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-accent font-semibold underline">
              Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
