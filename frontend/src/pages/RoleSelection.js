import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Card, CardContent, Typography, Button, Box, Container } from '@mui/material';

const RoleSelection = () => {
  const navigate = useNavigate();

  // ✅ Utilisation de useEffect pour s'assurer que le DOM est prêt
  useEffect(() => {
    if (document.styleSheets.length > 0) {
      try {
        document.styleSheets[0].insertRule(`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `, 0);
      } catch (error) {
        console.warn("Erreur lors de l'insertion de la règle CSS :", error);
      }
    }
  }, []);

  return (
    <div style={styles.background}>
      <Container maxWidth="lg" sx={styles.container}>
        {/* Texte d'introduction */}
        <Box sx={styles.header}>
          <Typography variant="h3" sx={styles.title}>
            Choisissez votre rôle
          </Typography>
          <Typography variant="body1" sx={styles.subtitle}>
            Connectez-vous pour accéder à votre espace personnel.
          </Typography>
        </Box>

        {/* Grille des rôles */}
        <Grid container spacing={4} justifyContent="center">
          {roles.map((role) => (
            <Grid item xs={12} sm={6} md={3} key={role.name}>
              <Card sx={styles.card}>
                <Box sx={styles.imageContainer}>
                  <img src={role.image} alt={role.name} style={styles.image} />
                </Box>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: role.color }}>
                    {role.name}
                  </Typography>
                  <Typography variant="body2" sx={styles.description}>
                    {role.description}
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{ ...styles.button, backgroundColor: role.color }}
                    onClick={() => navigate(role.route)}
                  >
                    Se connecter
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

const roles = [
  {
    name: 'Étudiant',
    description: 'Accédez à vos cours et documents.',
    image: '/images/student-cartoon.webp',
    route: '/login-student',
    color: '#4A90E2'
  },
  {
    name: 'Enseignant',
    description: 'Gérez vos classes et ressources.',
    image: '/images/teacher-cartoon.webp',
    route: '/login-teacher',
    color: '#50E3C2'
  },
  {
    name: 'Parent',
    description: 'Suivez les activités de vos enfants.',
    image: '/images/parent-cartoon.png',
    route: '/login-parent',
    color: '#F5A623'
  },
  {
    name: 'Administrateur',
    description: 'Administrez la plateforme en toute simplicité.',
    image: '/images/admin-cartoon.webp',
    route: '/login-admin',
    color: '#D0021B'
  }
];

const styles = {
  background: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px'
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: '20px',
    padding: '30px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
    animation: 'fadeIn 1s ease-in-out'
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  title: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '10px'
  },
  subtitle: {
    color: '#666',
    fontSize: '16px'
  },
  card: {
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s, box-shadow 0.3s',
    '&:hover': {
      transform: 'translateY(-10px)',
      boxShadow: '0 12px 20px rgba(0, 0, 0, 0.2)'
    }
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
    padding: '20px'
  },
  image: {
    width: '100%',
    maxWidth: '180px',
    height: '180px',
    objectFit: 'contain',
    transition: 'transform 0.5s ease',
    '&:hover': {
      transform: 'scale(1.1)'
    }
  },
  description: {
    marginTop: '10px',
    color: '#555'
  },
  button: {
    marginTop: '15px',
    textTransform: 'none',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '8px',
    transition: 'background-color 0.3s, transform 0.3s',
    '&:hover': {
      transform: 'scale(1.05)',
      backgroundColor: '#333'
    }
  }
};

export default RoleSelection;
