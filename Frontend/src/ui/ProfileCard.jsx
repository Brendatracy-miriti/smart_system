import React from "react";

export default function ProfileCard({ name, role, email, image }) {
  return (
    <div className="flex items-center gap-4 bg-white dark:bg-[#1F2937] p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
      <img
        src={image || "/default-avatar.png"}
        alt={name}
        className="w-16 h-16 rounded-full object-cover border-2 border-accent"
      />
      <div>
        <h3 className="font-semibold text-lg text-[#111827] dark:text-gray-100">{name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{role}</p>
        <p className="text-sm text-gray-600 dark:text-gray-300">{email}</p>
      </div>
    </div>
  );
}
