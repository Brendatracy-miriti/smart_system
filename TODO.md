# TODO: Frontend-Only Application (No Backend Dependency)

## 1. Authentication (AuthContext)
- [x] Reverted AuthContext.jsx to use localStorage for signup/login (no backend API)
- [x] Store user data in localStorage instead of JWT tokens
- [x] Handle logout by clearing localStorage

## 2. Data Contexts
- [x] LiveContext.jsx uses localStorage (no backend data fetching)
- [x] DataContext.jsx uses localStorage (no backend data fetching)
- [x] All data flows freely on frontend

## 3. Dashboard Pages
- [x] StudentDashboard uses local auth user directly for profile and data
- [x] Other dashboards use local data (no changes needed)

## 4. Fixes Applied
- [x] Fixed infinite loop in LiveContext.jsx
- [x] Added missing routes for student sidebar navigation
- [x] Updated sidebar logout to use AuthContext logout

## 5. Testing
- [ ] Manual testing: signup/login locally, dashboard displays with user data and local assignments/grades
