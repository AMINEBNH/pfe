import React, { useEffect } from 'react';
import { Button, Typography, Grid, Container, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  // ✅ Animation CSS insérée après le montage du composant
  useEffect(() => {
    if (document.styleSheets.length > 0) {
      document.styleSheets[0].insertRule(`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `, 0);
    }
  }, []);

  return (
    <div style={styles.background}>
      <Container maxWidth="lg" sx={styles.container}>
        <Grid container spacing={4} alignItems="center">

          {/* Texte */}
          <Grid item xs={12} md={6}>
            <Typography variant="h3" gutterBottom sx={styles.title}>
              Bienvenue sur notre plateforme
            </Typography>
            <Typography variant="body1" paragraph sx={styles.description}>
              Gérez facilement les inscriptions, les paiements et les classes grâce à notre
              système intuitif. Connectez-vous ou créez un compte pour démarrer !
            </Typography>

            <div style={styles.buttonGroup}>
              <Button
                variant="contained"
                color="primary"
                sx={styles.primaryButton}
                onClick={() => navigate('/role-selection')}
              >
                Connexion
              </Button>

              <Button
                variant="outlined"
                color="secondary"
                sx={styles.secondaryButton}
                onClick={() => navigate('/signup-student')}
              >
                Créer un compte
              </Button>
            </div>
          </Grid>

          {/* Image */}
          <Grid item xs={12} md={6} sx={styles.imageContainer}>
            <img
              src="/images/cartoon.webp"
              alt="Accueil"
              style={styles.image}
            />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

const styles = {
  background: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #74ebd5, #acb6e5)',
    display: 'flex',
    alignItems: 'center',
    padding: '20px',
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: '20px',
    padding: '40px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
    animation: 'fadeIn 1s ease-in-out',
  },
  title: {
    color: '#2575fc',
    fontWeight: 700,
    fontSize: '2.5rem',
    marginBottom: '16px',
  },
  description: {
    lineHeight: 1.8,
    color: '#555',
    fontSize: '1.1rem',
    marginBottom: '24px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '15px',
  },
  primaryButton: {
    padding: '12px 30px',
    fontSize: '16px',
    borderRadius: '8px',
    transition: 'transform 0.3s, background-color 0.3s',
    '&:hover': {
      transform: 'scale(1.05)',
      backgroundColor: '#1e63d9',
    },
  },
  secondaryButton: {
    padding: '12px 30px',
    fontSize: '16px',
    borderRadius: '8px',
    transition: 'background-color 0.3s, transform 0.3s',
    '&:hover': {
      backgroundColor: '#f0f0f0',
      transform: 'scale(1.05)',
    },
  },
  imageContainer: {
    textAlign: 'center',
  },
  image: {
    width: '100%',
    maxWidth: '450px',
    borderRadius: '20px',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
    transition: 'transform 0.5s ease',
    cursor: 'pointer',
    '&:hover': {
      transform: 'scale(1.03)',
    },
  },
};

export default Home;
