import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, Box, Toolbar } from '@mui/material';

// Pages publiques
import Home from './pages/Home';
import RoleSelection from './pages/RoleSelection';
import LoginStudent from './pages/LoginStudent';
import LoginTeacher from './pages/LoginTeacher';
import LoginAdmin from './pages/LoginAdmin';
import SignupStudent from './pages/Signup';
import CompleteStudentProfile from './pages/CompleteStudentProfile'; // Import de la page

// Pages protégées
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Messages from './pages/Messages';
import MessageDetails from './pages/MessageDetails';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import AdminStudents from './pages/AdminStudents'; // Importer le composant AdminStudents
import AdminTeachers from './pages/AdminTeachers'; // Importer le composant AdminTeachers
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailed from './pages/PaymentFailed';

// Composants
import ProtectedRoute from './components/ProtectedRoute';
import AppHeader from './components/AppHeader';
import AppSidebar from './components/AppSidebar';
import Footer from './components/Footer';

// Styles globaux
import './styles/App.css';

const App = () => {
  // Largeur de la sidebar
  const drawerWidth = 240;

  return (
    <Router>
      <CssBaseline />

      {/* En-tête (AppBar) */}
      <AppHeader drawerWidth={drawerWidth} />

      {/* Sidebar */}
      <AppSidebar drawerWidth={drawerWidth} />

      {/* Contenu principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: { sm: `${drawerWidth}px` }, // margin-left = drawerWidth en desktop
          p: 3,
        }}
      >
        {/* Pour éviter que le contenu passe sous l'AppBar */}
        <Toolbar />

        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<Home />} />
          <Route path="/role-selection" element={<RoleSelection />} />
          <Route path="/login-student" element={<LoginStudent />} />
          <Route path="/login-teacher" element={<LoginTeacher />} />
          <Route path="/login-admin" element={<LoginAdmin />} />
          <Route path="/signup-student" element={<SignupStudent />} />
          <Route path="/complete-student-profile" element={<CompleteStudentProfile />} /> {/* Nouvelle route */}

          {/* Routes protégées */}
          <Route
            path="/student-dashboard"
            element={
              <ProtectedRoute requiredRole="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher-dashboard"
            element={
              <ProtectedRoute requiredRole="teacher">
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Messages */}
          <Route
            path="/messages"
            element={
              <ProtectedRoute requiredRole="admin">
                <Messages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages/:id"
            element={
              <ProtectedRoute requiredRole="admin">
                <MessageDetails />
              </ProtectedRoute>
            }
          />

          {/* Cours */}
          <Route
            path="/courses"
            element={
              <ProtectedRoute requiredRole="admin">
                <Courses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:id"
            element={
              <ProtectedRoute requiredRole="admin">
                <CourseDetails />
              </ProtectedRoute>
            }
          />

          {/* Routes Admin supplémentaires */}
          <Route
            path="/admin-students"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminStudents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-teachers"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminTeachers />
              </ProtectedRoute>
            }
          />

          {/* Routes de paiement */}
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-failed" element={<PaymentFailed />} />

          {/* Route 404 éventuelle */}
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </Box>

      {/* Footer */}
      <Footer />
    </Router>
  );
};

export default App;
