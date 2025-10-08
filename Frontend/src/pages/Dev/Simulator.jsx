// src/pages/Dev/Simulator.jsx
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  addUser,
  addStudent,
  addTeacher,
  addParent,
  addAssignment,
  addGrade,
  addTimetable,
  upsertTransport,
  pushNotification,
  ensureAdmin,
} from "../../utils/localData";
import { useLive } from "../../context/LiveContext";

export default function Simulator() {
  const { refresh } = useLive();
  const [msg, setMsg] = useState("");

  const seedAll = () => {
    ensureAdmin({
      id: "admin1",
      name: "Admin",
      email: "admin@eg.test",
      password: "AdminSystem",
      role: "admin",
    });

    const teacher = addUser({
      id: uuidv4(),
      name: "Mr. Smith",
      email: "teacher@eg.test",
      password: "1234",
      role: "teacher",
      avatarBase64: null,
    });
    addTeacher({
      id: uuidv4(),
      userId: teacher.id,
      email: teacher.email,
      courses: ["Computer Science"],
    });

    const student = addUser({
      id: uuidv4(),
      name: "John Doe",
      email: "student@eg.test",
      password: "1234",
      role: "student",
      course: "Computer Science",
    });
    addStudent({
      id: uuidv4(),
      userId: student.id,
      admission_number: "STU001",
      email: student.email,
      course: "Computer Science",
      attendance_rate: 90,
      average_score: 82,
      courses_count: 1,
      completed_assignments: 2,
      gpa: 3.6,
    });

    const parent = addUser({
      id: uuidv4(),
      name: "Mrs. Doe",
      email: "parent@eg.test",
      password: "1234",
      role: "parent",
    });
    addParent({
      id: uuidv4(),
      userId: parent.id,
      email: parent.email,
      childStudentId: student.id,
    });

    addAssignment({
      id: uuidv4(),
      title: "Intro to React",
      course: "Computer Science",
      createdBy: teacher.id,
      createdAt: new Date().toISOString(),
    });

    addTimetable({
      id: uuidv4(),
      subject: "React Basics",
      day: "Monday",
      time: "09:00 - 10:30",
      course: "Computer Science",
      createdBy: teacher.id,
      approved: true,
    });

    addGrade({
      id: uuidv4(),
      studentEmail: student.email,
      course: "Computer Science",
      type: "Assignment",
      score: 88,
    });

    upsertTransport({
      busId: "Bus-1",
      driver: "James",
      lat: -1.2921,
      lng: 36.8219,
      status: "On route to school",
    });

    pushNotification({
      title: "Welcome to Edu-Guardian Demo",
      message: "Seed data created successfully!",
      sender: "Admin",
    });

    window.dispatchEvent(new Event("storage"));
    refresh();
    setMsg("✅ Demo data created successfully!");
  };

  const simulateBus = () => {
    const randomLat = -1.29 + Math.random() * 0.02;
    const randomLng = 36.82 + Math.random() * 0.02;
    upsertTransport({
      busId: "Bus-1",
      driver: "James",
      lat: randomLat,
      lng: randomLng,
      status: "Moving...",
    });
    pushNotification({
      title: "Transport Update",
      message: `Bus-1 updated: ${randomLat.toFixed(4)}, ${randomLng.toFixed(4)}`,
      sender: "System",
    });
    window.dispatchEvent(new Event("storage"));
    refresh();
    setMsg(`🚍 Bus updated @ ${new Date().toLocaleTimeString()}`);
  };

  const clearAll = () => {
    Object.keys(localStorage).forEach((k) => {
      if (k.startsWith("eg_")) localStorage.removeItem(k);
    });
    window.dispatchEvent(new Event("storage"));
    refresh();
    setMsg("🧹 Cleared all Edu-Guardian data.");
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-primary mb-4">Edu-Guardian Simulator</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Use this tool to seed demo users, simulate transport, and broadcast sample data.
      </p>

      <div className="flex flex-wrap gap-4">
        <button
          onClick={seedAll}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          🪄 Seed Demo Data
        </button>
        <button
          onClick={simulateBus}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          🚍 Simulate Bus Update
        </button>
        <button
          onClick={clearAll}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          🧹 Clear All Data
        </button>
      </div>

      {msg && <p className="mt-6 text-sm text-gray-500">{msg}</p>}

      <div className="mt-8 bg-white dark:bg-gray-900 p-4 rounded-lg shadow">
        <h3 className="font-semibold mb-2">Quick Credentials:</h3>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <li>Admin → <b>admin@eg.test / AdminSystem</b></li>
          <li>Teacher → <b>teacher@eg.test / 1234</b></li>
          <li>Student → <b>student@eg.test / 1234</b></li>
          <li> Parent → <b>parent@eg.test / 1234</b></li>
        </ul>
      </div>
    </div>
  );
}
