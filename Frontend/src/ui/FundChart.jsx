import React from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

export default function FundChart({ data }) {
  return (
    <div className="bg-white dark:bg-[#1F2937] p-5 rounded-2xl shadow">
      <h3 className="text-lg font-semibold text-[#111827] dark:text-gray-100 mb-4">
        Funds Overview
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="month" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip />
          <Line type="monotone" dataKey="income" stroke="#10B981" strokeWidth={2} />
          <Line type="monotone" dataKey="expense" stroke="#38BDF8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
