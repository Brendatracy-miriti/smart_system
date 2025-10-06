import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
// import Dashboard from "./pages/Dashboard/AdminDashboard";
import { MessageProvider } from "./context/MessageContext";
import { AuthProvider } from "./context/AuthContext";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <MessageProvider>
        <AuthProvider>
          <AnimatedRoutes />
        </AuthProvider>
      </MessageProvider>
    </BrowserRouter>
  );
}
