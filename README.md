# 🎓 Edu-Guardian — Smart School Management & Tracking System

**Edu-Guardian** is a next-generation, all-in-one platform designed to connect schools, parents, teachers, and students under one secure, transparent, and intelligent digital ecosystem.

It provides real-time school transport tracking, transparent fund management, digital mentorship, attendance analytics, and performance monitoring — all built to empower the modern education experience.

---

##  Overview

Edu-Guardian bridges the communication gap between **parents**, **teachers**, **students**, and **administrators** through a unified web application.

The system leverages a **React + TailwindCSS** frontend powered by a **Django REST API backend** and **Firebase authentication layer**, ensuring secure data handling, seamless role-based access, and real-time updates.

---

##  Key Features


###  Admin Portal
- Manage users (students, teachers, parents)
- Oversee funds with transparent charts (Recharts)
- Approve timetables and announcements
- View risk analytics for potential dropouts
- Send platform-wide messages or alerts

### Teacher Portal
- Manage attendance and assignments  
- Post exams, CATs, and RATs with grading system  
- Mentor students (approval system for mentorship requests)  
- Create and manage timetables (pending admin approval)  
- Communicate with parents and students through integrated messaging

### Parent Portal
- View child performance, attendance, and progress  
- Live **bus tracking** with Google Maps integration  
- Receive real-time notifications for transport and academics  
- Update profile photo and manage account settings

### Student Portal
- View performance, grades, and upcoming lessons  
- Access assignments, submit work, and receive grades  
- Request mentorship from teachers by subject/course  
- View school timetable and notifications  
- Personalized dashboard with course & GPA overview  

---


### 🚌 Real-time School Bus Tracking
- Live location updates via Google Maps integration
- Route optimization and geo-fencing
- Parent notifications for pickup/drop-off
- Driver communication module

### 💰 Transparent Fund Management
- Budget allocation and expense tracking
- Visualized financial data with Recharts
- Role-based access to financial reports
- Audit logs for all transactions

### 🧑‍🏫 Digital Mentorship
- Student-teacher matching based on subject/course
- Mentorship request and approval workflow
- Secure communication channel for mentors and mentees
- Progress tracking and reporting

### 📊 Attendance Analytics
- Automated attendance tracking
- Real-time attendance reports for teachers and admins
====== 
### 
### 🏫 Timetable Management
- Dynamic timetable generation
- Conflict detection and resolution
- Role-based timetable viewing (students, teachers, parents)
====== 
### 🏫 Attendance Analytics
- Real-time attendance reports for teachers and admins





## 💡 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React.js (Vite) + Tailwind CSS + Framer Motion |
| **UI Components** | shadcn/ui + Lucide Icons + Recharts |
| **Backend API** | Django REST Framework (DRF) |
| **Authentication** | Firebase Auth (Email/Password + Role-based claims) |
| **Data Storage** | Firebase Firestore + Django ORM |
| **Maps Integration** | Google Maps JavaScript API |
| **State Management** | React Context API (AuthContext, ThemeContext, DataContext, LiveContext) |

---

## 🔑 API Highlights

Edu-Guardian’s backend is powered by Django REST Framework (DRF) and exposes secure endpoints consumed by the frontend.

| Endpoint | Description |
|-----------|--------------|
| `/api/auth/` | Authentication (Login / Signup / Logout) |
| `/api/users/` | Manage students, teachers, parents, and admin profiles |
| `/api/funds/` | School funds and budget transparency |
| `/api/transport/` | Real-time student bus tracking |
| `/api/mentorship/` | Mentorship requests and approvals |
| `/api/messages/` | Cross-role messaging system |

---

## 🌗 Theming & Responsiveness

Edu-Guardian supports:
- **Dark / Light Mode Toggle**
- **Responsive Layouts** across mobile, tablet, and desktop
- Dynamic role-based sidebar and navigation

All color palettes follow the official Edu-Guardian design tokens:
- Primary: `#1E3A8A`
- Accent: `#10B981`
- Highlight: `#38BDF8`
- Background: `#F3F4F6`
- Text: `#111827`

---

## 🧠 Core Architecture


