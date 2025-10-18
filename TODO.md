# TODO: Centralized DataContext Enhancements

## 1. Update DataContext.jsx
- [x] Add missing state arrays: students, teachers, parents, courses
- [x] Add missing methods: updateAttendance, updateStudentGrades, sendMessage, updateUserProfile
- [x] Adjust message structure to { id, senderRole, receiverRole, subject, content, timestamp }
- [x] Update persistence for new arrays
- [x] Ensure all methods trigger state updates and localStorage sync

## 2. Update Dashboard Components
- [x] StudentDashboard.jsx: Use DataContext for all data (timetables, assignments, messages, etc.)
- [x] TeacherDashboard.jsx: Use DataContext for students, at-risk, etc.
- [x] ParentDashboard.jsx: Use DataContext for child data, messages
- [ ] AdminDashboard.jsx: Already uses DataContext, ensure consistency
- [x] Other components: Assignments, Attendance, Messages, etc. - use DataContext methods

## 3. Unify Data Sources
- [ ] Remove reliance on LiveContext where possible, make DataContext the single source
- [ ] Update LiveContext if needed, but prioritize DataContext

## 4. Test Reactivity
- [ ] Verify that changes in one dashboard reflect in others (e.g., teacher adds assignment, student sees it)
- [ ] Test messages, mentorship, funds, etc.

## 5. Followup
- [x] Run the app and check for errors
- [ ] Ensure localStorage sync works
- [ ] Optional: Add real-time simulation if needed
