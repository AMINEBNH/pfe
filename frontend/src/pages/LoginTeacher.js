import React from 'react';
import LoginForm from '../components/LoginForm';
import axios from 'axios';
import { Grid, Typography, Box } from '@mui/material';

const LoginTeacher = () => {
  const handleLogin = async (credentials) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login/teacher', credentials);
      const { token } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', 'teacher');
      // Sauvegarde de l'email pour distinguer l'enseignant
      localStorage.setItem('email', credentials.email);
      window.location.href = '/teacher-dashboard';
    } catch (error) {
      alert(error.response?.data?.message || "Erreur de connexion. Veuillez réessayer.");
    }
  };
  return (
    <Grid container sx={{ height: '100vh' }}>
      {/* Image Section */}
      <Grid item xs={12} md={6} sx={{ backgroundColor: '#ffebee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ textAlign: 'center', mb: 2 }}>
            Bienvenue Enseignant 👩‍🏫
          </Typography>
          <img src="/images/teacher-cartoon.webp" alt="Teacher login" style={{ width: '100%', maxWidth: '400px', borderRadius: '12px' }} />
        </Box>
      </Grid>

      {/* Form Section */}
      <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 4 }}>
        <LoginForm role="Enseignant" onSubmit={handleLogin} />
      </Grid>
    </Grid>
  );
};

export default LoginTeacher;
