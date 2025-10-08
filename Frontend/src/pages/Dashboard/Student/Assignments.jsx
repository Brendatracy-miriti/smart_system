import React, { useEffect, useState } from "react";
import { useLive } from "../../../context/LiveContext";
import { addSubmission, getAssignments, getSubmissions, addSubmission as addSub } from "../../../utils/localData";
import { v4 as uuidv4 } from "uuid";
import { useMessage } from "../../../context/MessageContext";

export default function StudentAssignments() {
  const { assignments, submissions, refresh } = useLive();
  const { setMessage } = useMessage();
  const user = JSON.parse(localStorage.getItem("eg_current_user"));
  const [myAssignments, setMyAssignments] = useState([]);

  useEffect(() => {
    if (!user) return;
    setMyAssignments(assignments.filter(a => a.course === user.course));
  }, [assignments]);

  const handleSubmit = (assignmentId) => {
    if (!user) return setMessage({ type: "error", text: "Login first" });
    const sub = { id: uuidv4(), assignmentId, studentId: user.id, userEmail: user.email, content: "Submitted via frontend", submittedAt: new Date().toISOString(), grade: null };
    addSub(sub);
    setMessage({ type: "success", text: "Submitted" });
    // force refresh by updating localStorage key
    window.dispatchEvent(new Event("storage"));
    setTimeout(() => refresh && refresh(), 300);
  };

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-2xl font-bold text-primary">Assignments</h2>
      {myAssignments.length ? myAssignments.map(a => {
        const sub = submissions.find(s => s.assignmentId === a.id && s.userEmail === user.email);
        return (
          <div key={a.id} className="bg-white dark:bg-[#071027] p-4 rounded-xl">
            <div className="flex justify-between">
              <div>
                <div className="font-semibold">{a.title}</div>
                <div className="text-xs text-gray-500">{a.createdAt}</div>
              </div>
              <div>
                {sub ? <div className="text-sm text-green-500">Submitted</div> : <button onClick={()=>handleSubmit(a.id)} className="px-3 py-1 bg-primary text-white rounded">Submit</button>}
              </div>
            </div>
          </div>
        );
      }) : <div className="text-gray-500">No assignments yet.</div>}
    </div>
  );
}
