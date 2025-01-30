import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Card, CardContent, Typography, Button, Box, Container } from '@mui/material';

const RoleSelection = () => {
  const navigate = useNavigate();

  return (
    <Container
      maxWidth="lg"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        background: 'linear-gradient(to bottom, #f7f9fc, #eaf1f8)',
        padding: '2rem',
      }}
    >
      {/* Texte en haut */}
      <Box
        sx={{
          textAlign: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Choisissez votre rôle
        </Typography>
        <Typography variant="body1" sx={{ mt: 1, color: '#555' }}>
          Connectez-vous pour accéder à votre tableau de bord.
        </Typography>
      </Box>

      {/* Grille des cartes */}
      <Grid container spacing={2} justifyContent="center">
        {/* Carte Étudiant */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              borderRadius: '12px',
              boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              '&:hover': {
                transform: 'scale(1.04)',
                transition: 'transform 0.3s',
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                backgroundColor: '#f0f8ff',
                padding: '1rem',
              }}
            >
              <img
                src="/images/student-cartoon.webp"
                alt="Étudiant"
                style={{
                  width: '100%',
                  maxWidth: '220px',
                  height: '200px',
                  objectFit: 'contain',
                }}
              />
            </Box>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" fontWeight="bold">
                Étudiant
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Connectez-vous pour accéder à vos cours et documents.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2, textTransform: 'none' }}
                onClick={() => navigate('/login-student')}
              >
                Se connecter
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Carte Enseignant */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              borderRadius: '12px',
              boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              '&:hover': {
                transform: 'scale(1.04)',
                transition: 'transform 0.3s',
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                backgroundColor: '#f0f8ff',
                padding: '1rem',
              }}
            >
              <img
                src="/images/teacher-cartoon.webp"
                alt="Enseignant"
                style={{
                  width: '100%',
                  maxWidth: '220px',
                  height: '200px',
                  objectFit: 'contain',
                }}
              />
            </Box>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" fontWeight="bold">
                Enseignant
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Connectez-vous pour gérer vos classes et documents.
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                sx={{ mt: 2, textTransform: 'none' }}
                onClick={() => navigate('/login-teacher')}
              >
                Se connecter
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Carte Parent */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              borderRadius: '12px',
              boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              '&:hover': {
                transform: 'scale(1.04)',
                transition: 'transform 0.3s',
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                backgroundColor: '#f0f8ff',
                padding: '1rem',
              }}
            >
              <img
                src="/images/parent-cartoon.png"
                alt="Parent"
                style={{
                  width: '100%',
                  maxWidth: '220px',
                  height: '200px',
                  objectFit: 'contain',
                }}
              />
            </Box>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" fontWeight="bold">
                Parent
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Connectez-vous pour suivre les activités de vos enfants.
              </Typography>
              <Button
                variant="contained"
                color="success"
                sx={{ mt: 2, textTransform: 'none' }}
                onClick={() => navigate('/login-parent')}
              >
                Se connecter
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Carte Administrateur */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              borderRadius: '12px',
              boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              '&:hover': {
                transform: 'scale(1.04)',
                transition: 'transform 0.3s',
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                backgroundColor: '#f0f8ff',
                padding: '1rem',
              }}
            >
              <img
                src="/images/admin-cartoon.webp"
                alt="Administrateur"
                style={{
                  width: '100%',
                  maxWidth: '220px',
                  height: '200px',
                  objectFit: 'contain',
                }}
              />
            </Box>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" fontWeight="bold">
                Administrateur
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Connectez-vous pour gérer les utilisateurs et les cours.
              </Typography>
              <Button
                variant="contained"
                color="warning"
                sx={{ mt: 2, textTransform: 'none' }}
                onClick={() => navigate('/login-admin')}
              >
                Se connecter
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default RoleSelection;