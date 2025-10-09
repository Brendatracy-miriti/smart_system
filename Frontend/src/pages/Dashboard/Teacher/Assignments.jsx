import React, { useState } from "react";
import { useData } from "../../../context/DataContext";
import { useMessage } from "../../../context/MessageContext";

export default function TeacherAssignments() {
  const { data, addAssignment, refresh } = useData();
  const { setMessage } = useMessage();
  const teacher = JSON.parse(localStorage.getItem("eg_current_user") || "null");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");

  const create = () => {
    if (!title) return setMessage({ type: "error", text: "Add title" });
    const assignment = {
      id: Date.now(),
      teacherId: teacher?.id,
      title,
      description,
      deadline,
      createdAt: new Date().toISOString(),
    };
    addAssignment(assignment);
    refresh();
    setTitle("");
    setDescription("");
    setDeadline("");
    setMessage({ type: "success", text: "Assignment created" });
  };

  const teacherAssignments = data.assignments.filter(
    (a) => a.teacherId === teacher?.id
  );

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold text-primary">Assignments</h2>

      <div className="bg-white dark:bg-[#071027] p-4 rounded-xl space-y-3 shadow">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Assignment Title"
          className="w-full p-2 border rounded"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full p-2 border rounded"
        />
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          onClick={create}
          className="bg-primary text-white px-4 py-2 rounded"
        >
          Create Assignment
        </button>
      </div>

      <div className="grid gap-3">
        {teacherAssignments.map((a) => (
          <div
            key={a.id}
            className="bg-white dark:bg-[#071027] p-3 rounded shadow"
          >
            <h3 className="font-semibold">{a.title}</h3>
            <p className="text-sm">{a.description}</p>
            <p className="text-xs text-gray-400">
              Deadline: {a.deadline || "N/A"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
