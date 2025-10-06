import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useMessage } from "../context/MessageContext";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { setMessage } = useMessage();
  const [loading, setLoading] = useState(false);

  // signup fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [admission, setAdmission] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // payload shape depends on your backend
      await signup({ name, email, password, admission_number: admission });
      setLoading(false);
      navigate("/dashboard");
    } catch (err) {
      setLoading(false);
      const errText =
        err?.response?.data?.detail ||
        JSON.stringify(err?.response?.data) ||
        "Signup failed";
      setMessage({ type: "error", text: errText });
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
        className="w-1/2 flex flex-col items-center justify-center bg-primary/10"
        style={{ backgroundColor: "rgba(30,58,138,0.06)" }}
      >
        <div className="max-w-md p-10">
          <h1 className="text-4xl font-bold text-primary mb-4">Welcome to SmartEdu360</h1>
          <p className="text-textBody mb-6">
            Create your account and join your school’s digital community.
          </p>

          <div className="bg-surface p-4 rounded-xl shadow">
            <h3 className="font-semibold text-primary">Get started</h3>
            <ul className="mt-3 text-sm text-gray-600">
              <li>• Manage student data</li>
              <li>• Track buses live</li>
              <li>• See fund transparency</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Right: Signup Form */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={rightVariants}
        transition={{ duration: 0.7 }}
        className="w-1/2 flex items-center justify-center bg-surface"
      >
        <div className="w-4/5 max-w-md p-8">
          <h2 className="text-2xl font-bold text-primary mb-6">Create account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-textBody mb-1">Full name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border rounded-lg bg-white"
                placeholder="Jane Doe"
              />
            </div>

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
              <label className="block text-sm text-textBody mb-1">Admission number</label>
              <input
                type="text"
                value={admission}
                onChange={(e) => setAdmission(e.target.value)}
                className="w-full p-3 border rounded-lg bg-white"
                placeholder="ADM12345"
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
                placeholder="Create a password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg text-white font-semibold"
              style={{ backgroundColor: "#1E3A8A" }}
            >
              {loading ? "Please wait..." : "Create account"}
            </button>
          </form>

          <div className="mt-4 text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-accent underline">
              Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
