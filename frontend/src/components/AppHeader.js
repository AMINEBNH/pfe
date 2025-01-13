// Header.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const Header = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('role'); // Récupérer le rôle de l'utilisateur

  const handleHomeClick = () => {
    if (role === 'student') navigate('/student-dashboard');
    else if (role === 'teacher') navigate('/teacher-dashboard');
    else if (role === 'admin') navigate('/admin-dashboard');
    else navigate('/'); // Si non connecté
  };

  return (
    <AppBar position="static" sx={{ mb: 2 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Gestion scholarité
        </Typography>
        <Button color="inherit" onClick={handleHomeClick}>
          Accueil
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
