import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useMessage } from "../context/MessageContext";

export default function Login() {
  const { login } = useAuth();
  const { setMessage } = useMessage();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(username.trim(), password.trim());
    } catch {
      setMessage({ type: "error", text: "Login failed, please try again." });
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
        className="hidden md:flex w-1/2 flex-col items-center justify-center bg-accent/10"
      >
        <div className="max-w-md p-10">
          <h1 className="text-4xl font-bold text-primary mb-4">SmartEdu360</h1>
          <p className="text-textBody mb-6 dark:text-gray-300">
            Safe. Transparent. Smart. Connect your school community in one
            platform.
          </p>

          <div className="bg-surface dark:bg-[#1F2937] p-4 rounded-xl shadow">
            <h3 className="font-semibold text-primary">Why SmartEdu360?</h3>
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
            Sign in
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 border rounded-lg bg-transparent dark:border-gray-600 focus:ring-2 focus:ring-accent"
                placeholder="e.g. Admin"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border rounded-lg bg-transparent dark:border-gray-600 focus:ring-2 focus:ring-accent"
                placeholder="Your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg text-white font-semibold transition"
              style={{ backgroundColor: "#1E3A8A" }}
            >
              {loading ? "Please wait..." : "Login"}
            </button>
          </form>

          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-accent font-semibold underline">
              Create one
            </Link>
          </div>

          <p className="text-xs text-center mt-6 text-gray-500">
            Tip: Use <span className="font-semibold">Admin / AdminSystem</span>{" "}
            for Admin login.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
