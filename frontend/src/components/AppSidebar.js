// frontend/src/components/AppSidebar.js
import React, { useState } from 'react';
import {
  Box,
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  IconButton,
} from '@mui/material';

// Icônes MUI
import HomeIcon from '@mui/icons-material/Home';
import MessageIcon from '@mui/icons-material/Message';
import ClassIcon from '@mui/icons-material/Class';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import PeopleIcon from '@mui/icons-material/People'; // pour étudiants
import PersonIcon from '@mui/icons-material/Person'; // pour enseignants

import { useNavigate } from 'react-router-dom';

const AppSidebar = ({ drawerWidth = 240 }) => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const role = localStorage.getItem('role'); // 'student', 'teacher', 'admin', etc.

  // Calculer l'URL "Accueil" selon le rôle
  const getHomePath = () => {
    if (role === 'admin') return '/admin-dashboard';
    if (role === 'teacher') return '/teacher-dashboard';
    if (role === 'student') return '/student-dashboard';
    return '/'; // si pas de rôle
  };

  // MenuItems commun à tous
  let menuItems = [
    { text: 'Accueil', icon: <HomeIcon />, path: getHomePath() },
    { text: 'Messages', icon: <MessageIcon />, path: '/messages' },
    { text: 'Cours', icon: <ClassIcon />, path: '/courses' },
  ];

  // Si le rôle est admin, on peut ajouter des liens spécifiques
  if (role === 'admin') {
    menuItems = [
      ...menuItems,
      { text: 'Étudiants', icon: <PeopleIcon />, path: '/admin-students' },
      { text: 'Enseignants', icon: <PersonIcon />, path: '/admin-teachers' },
    ];
  }

  // Clique sur un item du menu
  const handleItemClick = (path) => {
    navigate(path);
    setMobileOpen(false); // Fermer le drawer mobile après la navigation
  };

  // Bouton burger (mobile)
  const handleToggleMobileDrawer = () => {
    setMobileOpen(!mobileOpen);
  };

  // Déconnexion
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role'); // si tu stockes aussi le rôle
    navigate('/');
  };

  // Contenu de la sidebar
  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h8" component="div">
          {/* Titre ou logo */}

        </Typography>
      </Toolbar>

      <Divider />

      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => handleItemClick(item.path)}
            sx={{
              '&:hover': {
                backgroundColor: 'primary.light',
                color: 'white',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>

      <Divider />

      {/* Bouton de déconnexion en bas */}
      <Box sx={{ p: 2 }}>
        <ListItem
          button
          onClick={handleLogout}
          sx={{
            borderRadius: 1,
            '&:hover': {
              backgroundColor: 'error.main',
              color: 'white',
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Déconnexion" />
        </ListItem>
      </Box>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: 0 }}>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        sx={{ display: { sm: 'none' }, ml: 2, mt: 2 }}
        onClick={handleToggleMobileDrawer}
      >
        <MenuIcon />
      </IconButton>

      {/* Drawer permanent (desktop) */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            bgcolor: '#f5f5f5',
            color: '#333',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>

      {/* Drawer temporaire (mobile) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleToggleMobileDrawer}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            bgcolor: '#f5f5f5',
            color: '#333',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default AppSidebar;
