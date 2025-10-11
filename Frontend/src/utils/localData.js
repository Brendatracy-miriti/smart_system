// LocalStorage based single-file data engine for Edu-Guardian

const read = (k) => {
  try {
    const raw = localStorage.getItem(k);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};
const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));

export const keys = {
  USERS: "eg_users",
  STUDENTS: "eg_students",
  TEACHERS: "eg_teachers",
  PARENTS: "eg_parents",
  ASSIGNMENTS: "eg_assignments",
  SUBMISSIONS: "eg_submissions",
  ATTENDANCE: "eg_attendance",
  TIMETABLES: "eg_timetables",
  TRANSPORT: "eg_transport",
  NOTIFICATIONS: "eg_notifications",
  GRADES: "eg_grades",
};

// users
export const getUsers = () => read(keys.USERS);
export const addUser = (u) => {
  const user = { is_active: true, ...u };
  const all = getUsers();
  all.unshift(user);
  write(keys.USERS, all);
  return user;
};
export const updateUser = (id, patch) => {
  const all = getUsers().map((x) => (x.id === id ? { ...x, ...patch } : x));
  write(keys.USERS, all);
  return all.find((x) => x.id === id);
};
export const findUserByEmail = (email) => getUsers().find((u) => u.email === email);

// students
export const getStudents = () => read(keys.STUDENTS);
export const addStudent = (s) => {
  const arr = getStudents();
  arr.unshift(s);
  write(keys.STUDENTS, arr);
  return s;
};
export const updateStudent = (id, patch) => {
  const arr = getStudents().map((x) => (x.id === id ? { ...x, ...patch } : x));
  write(keys.STUDENTS, arr);
  return arr.find((x) => x.id === id);
};

// teachers
export const getTeachers = () => read(keys.TEACHERS);
export const addTeacher = (t) => {
  const arr = getTeachers();
  arr.unshift(t);
  write(keys.TEACHERS, arr);
  return t;
};
export const updateTeacher = (id, patch) => {
  const arr = getTeachers().map((x) => (x.id === id ? { ...x, ...patch } : x));
  write(keys.TEACHERS, arr);
  return arr.find((x) => x.id === id);
};

// parents
export const getParents = () => read(keys.PARENTS);
export const addParent = (p) => {
  const arr = getParents();
  arr.unshift(p);
  write(keys.PARENTS, arr);
  return p;
};

// assignments & submissions
export const getAssignments = () => read(keys.ASSIGNMENTS);
export const addAssignment = (a) => {
  const arr = getAssignments();
  arr.unshift(a);
  write(keys.ASSIGNMENTS, arr);
  return a;
};
export const getSubmissions = () => read(keys.SUBMISSIONS);
export const addSubmission = (s) => {
  const arr = getSubmissions();
  arr.unshift(s);
  write(keys.SUBMISSIONS, arr);
  return s;
};
export const updateSubmission = (id, patch) => {
  const arr = getSubmissions().map((x) => (x.id === id ? { ...x, ...patch } : x));
  write(keys.SUBMISSIONS, arr);
  return arr.find((x) => x.id === id);
};

// attendance
export const getAttendance = () => read(keys.ATTENDANCE);
export const addAttendance = (r) => {
  const arr = getAttendance();
  arr.unshift(r);
  write(keys.ATTENDANCE, arr);
  return r;
};

// timetables
export const getTimetables = () => read(keys.TIMETABLES);
export const addTimetable = (t) => {
  const arr = getTimetables();
  arr.unshift(t);
  write(keys.TIMETABLES, arr);
  return t;
};
export const approveTimetable = (id) => {
  const arr = getTimetables().map((x) => (x.id === id ? { ...x, approved: true } : x));
  write(keys.TIMETABLES, arr);
  return arr.find((x) => x.id === id);
};

// transport
export const getTransport = () => read(keys.TRANSPORT);
export const upsertTransport = (entry) => {
  const arr = getTransport();
  const idx = arr.findIndex((t) => t.busId === entry.busId);
  if (idx >= 0) {
    arr[idx] = { ...arr[idx], ...entry, timestamp: new Date().toISOString() };
  } else {
    arr.unshift({ ...entry, id: `${Date.now()}`, timestamp: new Date().toISOString() });
  }
  write(keys.TRANSPORT, arr);
  return arr;
};

// notifications
export const getNotifications = () => read(keys.NOTIFICATIONS);
export const pushNotification = (n) => {
  const arr = getNotifications();
  arr.unshift({ ...n, id: `${Date.now()}`, createdAt: new Date().toISOString(), read: false });
  write(keys.NOTIFICATIONS, arr);
  return arr[0];
};

// grades
export const getGrades = () => read(keys.GRADES);
export const addGrade = (g) => {
  const arr = getGrades();
  arr.unshift(g);
  write(keys.GRADES, arr);
  return g;
};

// helper to seed a default admin (optional)
export const ensureAdmin = (admin) => {
  const users = getUsers();
  if (!users.find((u) => u.role === "admin")) {
    addUser(admin);
  }
};
