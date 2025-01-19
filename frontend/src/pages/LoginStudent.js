import React from 'react';
import LoginForm from '../components/LoginForm';
import axios from 'axios';
import { Grid, Typography, Box } from '@mui/material';

const LoginStudent = () => {
  const handleLogin = async (credentials) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login/student', credentials);
      const { token, role } = response.data;

      // Stockage des informations dans localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('email', credentials.email);

      // Vérifiez si l'étudiant existe dans la table `Student`
      const studentCheck = await axios.post('http://localhost:5000/api/students/check-or-create', {
        email: credentials.email,
      });

      if (!studentCheck.data.exists) {
        alert('Veuillez compléter votre profil étudiant.');
        window.location.href = '/complete-student-profile';
      } else {
        window.location.href = '/student-dashboard';
      }
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      alert(error.response?.data?.message || 'Erreur de connexion. Veuillez réessayer.');
    }
  };

  return (
    <Grid container sx={{ height: '100vh' }}>
      {/* Image Section */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          backgroundColor: '#e3f2fd',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ textAlign: 'center', mb: 2 }}>
            Bienvenue Étudiant 👨‍🎓
          </Typography>
          <img
            src="/images/student-cartoon.webp"
            alt="Student login"
            style={{ width: '100%', maxWidth: '400px', borderRadius: '12px' }}
          />
        </Box>
      </Grid>

      {/* Form Section */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 4 }}
      >
        <LoginForm role="Étudiant" onSubmit={handleLogin} />
      </Grid>
    </Grid>
  );
};

export default LoginStudent;
