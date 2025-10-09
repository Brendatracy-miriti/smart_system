import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useMessage } from "../hooks/useMessage";
import loginIllustration from "../assets/react.svg";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function Login() {
  const { login } = useAuth();
  const { setMessage } = useMessage();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login({ email: email.trim(), password: password.trim() });
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

      {/* RIGHT SIDE - Login Form */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={rightVariants}
        transition={{ duration: 0.7 }}
        className="w-full md:w-2/5 flex items-center justify-center bg-[#0f172a] text-white"
      >
        <div className="max-w-md w-full mx-auto px-10">
          <h1 className="text-3xl font-bold mb-2">Login</h1>
          <p className="text-gray-400 mb-8">Enter your account details</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block mb-2 text-sm">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-[#1E293B] text-white outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block mb-2 text-sm">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
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

            <div className="text-right mb-6">
              <a href="#" className="text-sm text-blue-400 hover:underline">
                Forgot Password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-md font-semibold transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-gray-400 text-sm mt-6 text-center">
            Don’t have an account?{" "}
            <a href="/Signup" className="text-sky-400 hover:underline font-medium">
              Sign up
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
