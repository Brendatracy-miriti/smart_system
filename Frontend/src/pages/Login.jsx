// src/pages/Login.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      setLoading(false);
      navigate("/dashboard"); // adjust route
    } catch {
      setLoading(false);
      // error message set in AuthContext
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
    <div className="min-h-screen flex">
      {/* Left: Branding */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={leftVariants}
        transition={{ duration: 0.7 }}
        className="w-1/2 flex flex-col items-center justify-center bg-accent/10"
        style={{ backgroundColor: "rgba(56,189,248,0.08)" }}
      >
        <div className="max-w-md p-10">
          <h1 className="text-4xl font-bold text-primary mb-4">SmartEdu360</h1>
          <p className="text-textBody mb-6">
            Safe. Transparent. Smart. Connect your school community in one platform.
          </p>

          <div className="bg-surface p-4 rounded-xl shadow">
            <h3 className="font-semibold text-primary">Why SmartEdu360?</h3>
            <ul className="mt-3 text-sm text-gray-600">
              <li>• Real-time bus tracking & alerts</li>
              <li>• Transparent school funds</li>
              <li>• Personalized revision tools</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Right: Login Form */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={rightVariants}
        transition={{ duration: 0.7 }}
        className="w-1/2 flex items-center justify-center bg-surface"
      >
        <div className="w-4/5 max-w-md p-8">
          <h2 className="text-2xl font-bold text-primary mb-6">Sign in</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-textBody mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border rounded-lg bg-white"
                placeholder="you@school.com"
              />
            </div>

            <div>
              <label className="block text-sm text-textBody mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border rounded-lg bg-white"
                placeholder="Your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg text-white font-semibold"
              style={{ backgroundColor: "#1E3A8A" }}
            >
              {loading ? "Please wait..." : "Login"}
            </button>
          </form>

          <div className="mt-4 text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-accent underline">
              Create one
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
