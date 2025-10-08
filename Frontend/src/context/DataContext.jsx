import React, { createContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export const DataContext = createContext();

const STORAGE_KEY = "eduguardian_data_v1";

const defaultSeed = {
  users: [], // all users (admin/teacher/parent/student)
  students: [], // student profile objects {id,userId,admission,course,...}
  parents: [],  // {id, userId, childStudentId}
  teachers: [], // {id, userId, courses:[]}
  classes: [],  // {id, name, teacherId, students: []}
  assignments: [], // {id,title,course,createdBy, due, createdAt}
  submissions: [], // {id, assignmentId, studentId, content, submittedAt, grade}
  attendance: [], // {id,classId,studentId,date,status}
  timetables: [], // {id, classId, subject,time,approved:false}
  transport: [], // {id, busId, driver, lat, lng, status, timestamp}
  notifications: [],
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

  // persist
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  // helper to upsert simple entity
  const upsert = (collection, item) => {
    setData(prev => {
      const arr = prev[collection] || [];
      const exists = arr.find(x => x.id === item.id);
      const newArr = exists ? arr.map(x => x.id === item.id ? item : x) : [item, ...arr];
      return { ...prev, [collection]: newArr };
    });
  };

  // create user (auth) => user object stored in users
  const createUser = ({ name, email, password, role, avatarBase64 }) => {
    const id = uuidv4();
    const user = { id, name, email, password, role, avatarBase64 };
    setData(prev => ({ ...prev, users: [user, ...prev.users] }));
    return user;
  };

  // find user
  const findUserByEmail = (email) => data.users.find(u => u.email === email);

  // add student profile
  const createStudentProfile = ({ userId, admission_number, course }) => {
    const id = uuidv4();
    const student = { id, userId, admission_number, course, attendance_rate: 0, average_score: 0, courses_count: course ? 1 : 0, completed_assignments:0, gpa: null };
    setData(prev => ({ ...prev, students: [student, ...prev.students] }));
    return student;
  };

  // add parent profile linking to student id
  const createParentProfile = ({ userId, childStudentId }) => {
    const id = uuidv4();
    const parent = { id, userId, childStudentId };
    setData(prev => ({ ...prev, parents: [parent, ...prev.parents] }));
    return parent;
  };

  // add teacher profile
  const createTeacherProfile = ({ userId, courses = [] }) => {
    const id = uuidv4();
    const teacher = { id, userId, courses };
    setData(prev => ({ ...prev, teachers: [teacher, ...prev.teachers] }));
    return teacher;
  };

  // create assignment
  const createAssignment = ({ title, course, createdBy, due }) => {
    const id = uuidv4();
    const a = { id, title, course, createdBy, due, createdAt: new Date().toISOString() };
    setData(prev => ({ ...prev, assignments: [a, ...prev.assignments] }));
    return a;
  };

  // student submission
  const submitAssignment = ({ assignmentId, studentId, content }) => {
    const id = uuidv4();
    const sub = { id, assignmentId, studentId, content, submittedAt: new Date().toISOString(), grade: null, gradedBy: null };
    setData(prev => ({ ...prev, submissions: [sub, ...prev.submissions] }));
    return sub;
  };

  // teacher grade submission
  const gradeSubmission = ({ submissionId, grade, graderId }) => {
    setData(prev => {
      const subs = prev.submissions.map(s => s.id === submissionId ? { ...s, grade, gradedBy: graderId } : s);
      return { ...prev, submissions: subs };
    });
  };

  // attendance marking
  const markAttendance = ({ classId, studentId, date, status }) => {
    const id = uuidv4();
    const record = { id, classId, studentId, date, status };
    setData(prev => ({ ...prev, attendance: [record, ...prev.attendance] }));
    return record;
  };

  // timetable create (pending approval)
  const createTimetable = ({ classId, subject, time, createdBy }) => {
    const id = uuidv4();
    const t = { id, classId, subject, time, createdBy, approved: false, createdAt: new Date().toISOString() };
    setData(prev => ({ ...prev, timetables: [t, ...prev.timetables] }));
    return t;
  };

  // admin approves timetable
  const approveTimetable = (timetableId) => {
    setData(prev => {
      const tims = prev.timetables.map(t => t.id === timetableId ? { ...t, approved: true } : t);
      return { ...prev, timetables: tims };
    });
  };

  // transport update (e.g., driver push location)
  const upsertTransport = ({ busId, driver, lat, lng, status }) => {
    setData(prev => {
      const idx = prev.transport.findIndex(t => t.busId === busId);
      const entry = { id: idx>=0 ? prev.transport[idx].id : uuidv4(), busId, driver, lat, lng, status, timestamp: new Date().toISOString() };
      const transport = idx >= 0 ? prev.transport.map(t => t.busId === busId ? entry : t) : [entry, ...prev.transport];
      return { ...prev, transport };
    });
  };

  // notifications
  const pushNotification = (note) => {
    const n = { id: uuidv4(), ...note, createdAt: new Date().toISOString(), read:false };
    setData(prev => ({ ...prev, notifications: [n, ...prev.notifications] }));
    return n;
  };

  // update user avatar
  const updateUserAvatar = (userId, avatarBase64) => {
    setData(prev => {
      const users = prev.users.map(u => u.id === userId ? { ...u, avatarBase64 } : u);
      return { ...prev, users };
    });
  };

  // utility getters
  const getStudentByUserId = (userId) => data.students.find(s => s.userId === userId);
  const getParentByUserId = (userId) => data.parents.find(p => p.userId === userId);
  const getTeacherByUserId = (userId) => data.teachers.find(t => t.userId === userId);

  return (
    <DataContext.Provider value={{
      data,
      setData,
      createUser,
      findUserByEmail,
      createStudentProfile,
      createParentProfile,
      createTeacherProfile,
      createAssignment,
      submitAssignment,
      gradeSubmission,
      markAttendance,
      createTimetable,
      approveTimetable,
      upsertTransport,
      pushNotification,
      updateUserAvatar,
      getStudentByUserId,
      getParentByUserId,
      getTeacherByUserId,
    }}>
      {children}
    </DataContext.Provider>
  );
}
