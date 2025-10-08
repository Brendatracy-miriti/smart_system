import React, { createContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export const DataContext = createContext();

const STORAGE_KEY = "eduguardian_data_v1";

const defaultSeed = {
  users: [],        // {id,name,email,password,role,avatarBase64}
  students: [],     // {id,userId,admission_number,course,attendance_rate,average_score,courses_count,completed_assignments,gpa}
  parents: [],      // {id,userId,childStudentId}
  teachers: [],     // {id,userId,courses:[]}
  classes: [],      // {id,name,teacherId,students:[]}
  assignments: [],  // {id,title,course,createdBy,due,createdAt}
  submissions: [],  // {id,assignmentId,studentId,content,submittedAt,grade,gradedBy}
  attendance: [],   // {id,classId,studentId,date,status}
  timetables: [],   // {id,classId,subject,time,createdBy,approved,createdAt}
  transport: [],    // {id,busId,driver,lat,lng,status,timestamp}
  notifications: [],// {id,title,message,createdAt,fromRole,toRole,toId,read}
};

export function DataProvider({ children }) {
  const [data, setData] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : defaultSeed;
    } catch {
      return defaultSeed;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  // ---------- CRUD helpers ----------
  const createUser = ({ name, email, password, role, avatarBase64 = null }) => {
    const id = uuidv4();
    const user = { id, name, email, password, role, avatarBase64 };
    setData(prev => ({ ...prev, users: [user, ...prev.users] }));
    return user;
  };

  const findUserByEmail = (email) => data.users.find(u => u.email === email);

  const updateUserAvatar = (userId, avatarBase64) => {
    setData(prev => ({ ...prev, users: prev.users.map(u => u.id === userId ? { ...u, avatarBase64 } : u) }));
  };

  const createStudentProfile = ({ userId, admission_number, course }) => {
    const id = uuidv4();
    const student = { id, userId, admission_number, course, attendance_rate: 0, average_score: 0, courses_count: course ? 1 : 0, completed_assignments: 0, gpa: null };
    setData(prev => ({ ...prev, students: [student, ...prev.students] }));
    return student;
  };

  const createParentProfile = ({ userId, childStudentId }) => {
    const id = uuidv4();
    const parent = { id, userId, childStudentId };
    setData(prev => ({ ...prev, parents: [parent, ...prev.parents] }));
    return parent;
  };

  const createTeacherProfile = ({ userId, courses = [] }) => {
    const id = uuidv4();
    const teacher = { id, userId, courses };
    setData(prev => ({ ...prev, teachers: [teacher, ...prev.teachers] }));
    return teacher;
  };

  const createAssignment = ({ title, course, createdBy, due = null }) => {
    const id = uuidv4();
    const a = { id, title, course, createdBy, due, createdAt: new Date().toISOString() };
    setData(prev => ({ ...prev, assignments: [a, ...prev.assignments] }));
    return a;
  };

  const submitAssignment = ({ assignmentId, studentId, content }) => {
    const id = uuidv4();
    const sub = { id, assignmentId, studentId, content, submittedAt: new Date().toISOString(), grade: null, gradedBy: null };
    setData(prev => ({ ...prev, submissions: [sub, ...prev.submissions] }));
    return sub;
  };

  const gradeSubmission = ({ submissionId, grade, graderId }) => {
    setData(prev => ({ ...prev, submissions: prev.submissions.map(s => s.id === submissionId ? { ...s, grade, gradedBy: graderId } : s) }));
  };

  const markAttendance = ({ classId, studentId, date, status }) => {
    const id = uuidv4();
    const r = { id, classId, studentId, date, status };
    setData(prev => ({ ...prev, attendance: [r, ...prev.attendance] }));
    return r;
  };

  const createTimetable = ({ classId, subject, time, createdBy }) => {
    const id = uuidv4();
    const t = { id, classId, subject, time, createdBy, approved: false, createdAt: new Date().toISOString() };
    setData(prev => ({ ...prev, timetables: [t, ...prev.timetables] }));
    return t;
  };

  const approveTimetable = (timetableId) => {
    setData(prev => ({ ...prev, timetables: prev.timetables.map(t => t.id === timetableId ? { ...t, approved: true } : t) }));
  };

  const upsertTransport = ({ busId, driver, lat, lng, status }) => {
    setData(prev => {
      const found = prev.transport.find(t => t.busId === busId);
      const entry = { id: found ? found.id : uuidv4(), busId, driver, lat, lng, status, timestamp: new Date().toISOString() };
      const transport = found ? prev.transport.map(t => t.busId === busId ? entry : t) : [entry, ...prev.transport];
      return { ...prev, transport };
    });
  };

  const pushNotification = ({ title, message, fromRole = "teacher", toRole = "all", toId = null }) => {
    const id = uuidv4();
    const n = { id, title, message, createdAt: new Date().toISOString(), fromRole, toRole, toId, read: false };
    setData(prev => ({ ...prev, notifications: [n, ...prev.notifications] }));
    return n;
  };

  // getters
  const getStudentByUserId = (userId) => data.students.find(s => s.userId === userId);
  const getParentByUserId = (userId) => data.parents.find(p => p.userId === userId);
  const getTeacherByUserId = (userId) => data.teachers.find(t => t.userId === userId);

  return (
    <DataContext.Provider value={{
      data,
      setData,
      // user methods
      createUser,
      findUserByEmail,
      updateUserAvatar,
      // profiles
      createStudentProfile,
      createParentProfile,
      createTeacherProfile,
      // assignments & submissions
      createAssignment,
      submitAssignment,
      gradeSubmission,
      // attendance
      markAttendance,
      // timetable
      createTimetable,
      approveTimetable,
      // transport
      upsertTransport,
      // notifications
      pushNotification,
      // getters
      getStudentByUserId,
      getParentByUserId,
      getTeacherByUserId,
    }}>
      {children}
    </DataContext.Provider>
  );
}
