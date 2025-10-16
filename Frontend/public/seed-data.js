// seed-data.js — populates localStorage with dummy app data for development
(function() {
  const users = [
    { id: 1, role: 'student', name: 'Alice Mwangi', email: 'alice@example.com', course: 'Mathematics', level: 'Form 3', gpa: 3.6, attendance_rate: 92, average_score: 76, courses_count: 5, avatarBase64: '' },
    { id: 2, role: 'student', name: 'Brian Otieno', email: 'brian@example.com', course: 'Physics', level: 'Form 4', gpa: 3.1, attendance_rate: 85, average_score: 68, courses_count: 5 },
    { id: 3, role: 'teacher', name: 'Mr. Kimani', email: 'kimani@example.com', subject: 'Mathematics' },
    { id: 4, role: 'teacher', name: 'Ms. Wanjiru', email: 'wanjiru@example.com', subject: 'Physics' },
    { id: 5, role: 'parent', name: 'Mary Mwangi', email: 'mary@example.com', childId: 1 },
    { id: 6, role: 'admin', name: 'Admin', email: 'admin@school.com', password: 'AdminSystem' }
  ];

  const students = users.filter(u => u.role === 'student').map(s => ({
    id: s.id,
    name: s.name,
    email: s.email,
    course: s.course,
    attendanceRate: s.attendance_rate || 80,
    avgScore: s.average_score || 70,
  }));

  const teachers = users.filter(u => u.role === 'teacher');
  const parents = users.filter(u => u.role === 'parent');

  const buses = [
    { id: 'bus-1', busId: 'B001', driver: 'John Driver', capacity: 40 },
    { id: 'bus-2', busId: 'B002', driver: 'Grace Driver', capacity: 35 },
  ];

  const funds = [
    { id: 1, title: 'Operational Budget', category: 'General', amount: 500000, date: '2024-08-01' },
    { id: 2, title: 'Donor Fund', category: 'Donations', amount: 250000, date: '2024-09-15' },
  ];

  const assignments = [
    { id: 1, course: 'Mathematics', title: 'Algebra HW', due: '2024-10-20' },
  ];

  const grades = [
    { id: 1, studentEmail: 'alice@example.com', course: 'Mathematics', score: 78 },
    { id: 2, studentEmail: 'alice@example.com', course: 'Physics', score: 74 },
    { id: 3, studentEmail: 'brian@example.com', course: 'Physics', score: 68 },
  ];

  const timetable = [
    { id: 1, course: 'Mathematics', subject: 'Calculus', day: 'Monday', time: '09:00', approved: true },
    { id: 2, course: 'Physics', subject: 'Mechanics', day: 'Tuesday', time: '11:00', approved: true },
  ];

  const submissions = [
    { id: 1, assignmentId: 1, userEmail: 'alice@example.com', submittedAt: new Date().toISOString() }
  ];

  const attendance = [
    { id: 1, studentId: 1, date: '2024-10-01', present: true },
    { id: 2, studentId: 2, date: '2024-10-01', present: false }
  ];

  const mentorships = [
    { id: 1, studentId: 1, teacherId: 3, status: 'active' }
  ];

  const messages = [
    { id: 1, from: 'admin@school.com', to: 'alice@example.com', subject: 'Welcome', body: 'Welcome to the demo dashboard', createdAt: new Date().toISOString() }
  ];

  // current user — set to Alice for testing student dashboard
  const eg_current_user = users.find(u => u.email === 'alice@example.com');

  localStorage.setItem('eg_users', JSON.stringify(users));
  localStorage.setItem('eg_students', JSON.stringify(students));
  localStorage.setItem('eg_parents', JSON.stringify(parents));
  localStorage.setItem('eg_transport', JSON.stringify(buses));
  localStorage.setItem('funds', JSON.stringify(funds));
  localStorage.setItem('eg_assignments', JSON.stringify(assignments));
  localStorage.setItem('eg_grades', JSON.stringify(grades));
  localStorage.setItem('eg_timetables', JSON.stringify(timetable));
  localStorage.setItem('eg_submissions', JSON.stringify(submissions));
  localStorage.setItem('eg_attendance', JSON.stringify(attendance));
  localStorage.setItem('mentorships', JSON.stringify(mentorships));
  localStorage.setItem('eg_notifications', JSON.stringify(messages));
  localStorage.setItem('eg_current_user', JSON.stringify(eg_current_user));

  console.info('Seeded localStorage with dummy data for dev.');
})();
