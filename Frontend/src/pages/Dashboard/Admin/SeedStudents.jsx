import React, { useState } from 'react';
import { useData } from '../../../context/DataContext';
import { addStudent } from '../../../utils/localData';
import { v4 as uuidv4 } from 'uuid';

export default function SeedStudents() {
  const { refresh } = useData();
  const [name, setName] = useState('');
  const [admission, setAdmission] = useState('');
  const [course, setCourse] = useState('');
  const [message, setMessage] = useState(null);

  const handleAdd = () => {
    if (!name || !admission) {
      setMessage('Provide both name and admission number');
      return;
    }
    const student = {
      id: uuidv4(),
      userId: uuidv4(),
      name,
      admission_number: admission,
      course,
      attendance_rate: 0,
      average_score: 0,
      courses_count: course ? 1 : 0,
    };
    addStudent(student);
    setMessage('Student seeded');
    setName('');
    setAdmission('');
    setCourse('');
    try { refresh(); } catch (e) {}
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Seed Students (Quick)</h2>
      <p className="text-sm text-gray-400 mb-4">Quickly add a test student to local storage for development/testing.</p>
      <div className="space-y-3 max-w-md">
        <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Student full name" className="w-full px-3 py-2 rounded bg-white/5 text-white" />
        <input value={admission} onChange={(e)=>setAdmission(e.target.value)} placeholder="Admission number" className="w-full px-3 py-2 rounded bg-white/5 text-white" />
        <input value={course} onChange={(e)=>setCourse(e.target.value)} placeholder="Course / Class" className="w-full px-3 py-2 rounded bg-white/5 text-white" />
        <div className="flex gap-2">
          <button onClick={handleAdd} className="px-4 py-2 bg-blue-600 rounded">Add student</button>
          <button onClick={()=>{ setName(''); setAdmission(''); setCourse(''); setMessage(null); }} className="px-4 py-2 bg-gray-600 rounded">Clear</button>
        </div>
        {message && <div className="text-sm text-green-400">{message}</div>}
      </div>
    </div>
  );
}
