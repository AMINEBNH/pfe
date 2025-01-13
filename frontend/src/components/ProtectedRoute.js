// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Utilisation de l'export nommé

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/" />;
  }

  try {
    const decoded = jwtDecode(token);
    if (requiredRole && decoded.role !== requiredRole) {
      // Rediriger vers le dashboard approprié selon le rôle
      if (decoded.role === 'admin') return <Navigate to="/admin-dashboard" />;
      if (decoded.role === 'teacher') return <Navigate to="/teacher-dashboard" />;
      if (decoded.role === 'student') return <Navigate to="/student-dashboard" />;
      return <Navigate to="/" />;
    }
    return children;
  } catch (error) {
    console.error('Erreur de décodage du token:', error);
    return <Navigate to="/" />;
  }
};

export default ProtectedRoute;
