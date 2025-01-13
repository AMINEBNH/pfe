import React from 'react';
import { Button, Typography, Grid, Container, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: 4,
        backgroundColor: theme.palette.background.default,
        borderRadius: 3,
        padding: 4,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Grid container spacing={4} alignItems="center">
        {/* Texte */}
        <Grid item xs={12} md={6}>
          <Typography
            variant="h3"
            gutterBottom
            sx={{ color: theme.palette.primary.main, fontWeight: 600 }}
          >
            Bienvenue sur notre plateforme
          </Typography>
          <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
            Gérez facilement les inscriptions, les paiements et les classes avec notre
            système. Connectez-vous pour accéder à vos fonctionnalités.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{
              mr: 2,
              padding: '10px 20px',
              fontSize: '16px',
              textTransform: 'none',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
            onClick={() => navigate('/role-selection')}
          >
            Connexion
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            sx={{
              padding: '10px 20px',
              fontSize: '16px',
              textTransform: 'none',
              transition: 'background-color 0.3s',
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            }}
            onClick={() => navigate('/signup-student')}
          >
            Créer un compte
          </Button>
        </Grid>

        {/* Image */}
        <Grid item xs={12} md={6}>
        <img
  src="/images/cartoon.webp" // Chemin relatif à partir du dossier `public/`
  alt="Accueil"
  style={{
    width: '100%',
    borderRadius: 16,
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
  }}
/>

          
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
