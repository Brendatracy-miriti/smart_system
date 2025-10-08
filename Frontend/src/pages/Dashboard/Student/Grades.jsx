import React from "react";
import { useLive } from "../../../context/LiveContext";

export default function StudentGrades() {
  const { grades } = useLive();
  const user = JSON.parse(localStorage.getItem("eg_current_user"));
  const myGrades = grades.filter(g => g.studentEmail === user?.email);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-primary mb-4">My Grades</h2>
      {myGrades.length ? (
        <table className="w-full bg-white dark:bg-[#071027] rounded-xl">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">Course</th>
              <th className="p-2 text-left">Type</th>
              <th className="p-2 text-left">Score</th>
            </tr>
          </thead>
          <tbody>
            {myGrades.map((g,i)=>
              (<tr key={i} className="border-b">
                <td className="p-2">{g.course}</td>
                <td className="p-2">{g.type}</td>
                <td className="p-2 font-semibold">{g.score}</td>
              </tr>)
            )}
          </tbody>
        </table>
      ) : <div className="text-gray-500">No grades recorded yet.</div>}
    </div>
  );
}
