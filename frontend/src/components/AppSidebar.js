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
  Avatar,
} from '@mui/material';
import {
  Home as HomeIcon,
  Message as MessageIcon,
  Class as ClassIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AppSidebar = ({ drawerWidth = 260 }) => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const role = localStorage.getItem('role');
  const userEmail = localStorage.getItem('email') || 'Utilisateur';

  const getHomePath = () => {
    if (role === 'admin') return '/admin-dashboard';
    if (role === 'teacher') return '/teacher-dashboard';
    if (role === 'student') return '/student-dashboard';
    return '/';
  };

  let menuItems = [{ text: 'Accueil', icon: <HomeIcon />, path: getHomePath() }];

  if (role === 'admin') {
    menuItems.push(
      { text: 'Étudiants', icon: <PeopleIcon />, path: '/admin-students' },
      { text: 'Enseignants', icon: <PersonIcon />, path: '/admin-teachers' },
      { text: 'Classes', icon: <SchoolIcon />, path: '/admin-classes' }
    );
  } else if (role === 'teacher') {
    menuItems.push(
      { text: 'Mes Cours', icon: <ClassIcon />, path: '/teacher-courses' },
      { text: 'Messages', icon: <MessageIcon />, path: '/messages' }
    );
  } else if (role === 'student') {
    menuItems.push(
      { text: 'Mes Cours', icon: <ClassIcon />, path: '/student-courses' },
      { text: 'Messages', icon: <MessageIcon />, path: '/messages' }
    );
  }

  const handleItemClick = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const handleToggleMobileDrawer = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#ffffff' }}>
      <Toolbar
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          display: 'flex',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          🎓 Gestion Scolaire
        </Typography>
      </Toolbar>

      {role && (
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>{userEmail.charAt(0).toUpperCase()}</Avatar>
          <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#333' }}>
            {userEmail}
          </Typography>
        </Box>
      )}

      <Divider />

      <List sx={{ flexGrow: 1, p: 1 }}>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => handleItemClick(item.path)}
            sx={{
              borderRadius: 2,
              mb: 1,
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'primary.light',
                color: 'white',
                transform: 'translateX(5px)',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>

      <Divider />

      {role && (
        <Box sx={{ p: 2 }}>
          <ListItem
            button
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              bgcolor: 'error.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'error.dark',
                transform: 'scale(1.05)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Déconnexion" />
          </ListItem>
        </Box>
      )}
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

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            bgcolor: '#fafafa',
            boxShadow: '4px 0 12px rgba(0, 0, 0, 0.1)',
            borderRight: 'none',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleToggleMobileDrawer}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            bgcolor: '#fafafa',
            boxShadow: '4px 0 12px rgba(0, 0, 0, 0.1)',
            borderRight: 'none',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default AppSidebar;
