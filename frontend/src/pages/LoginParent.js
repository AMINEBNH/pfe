import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box, Paper, Snackbar, Alert, Grid } from '@mui/material';

const LoginParent = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const showSnackbar = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setOpenSnackbar(true);
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setOpenSnackbar(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/parents/login', { email, password });
            const { token, profileComplete } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('role', 'parent');
            localStorage.setItem('email', email);

            showSnackbar('Connexion réussie !', 'success');

            setTimeout(() => {
                if (!profileComplete) {
                    navigate('/complete-parent-profile');
                } else {
                    navigate('/parent-dashboard');
                }
            }, 1500);
        } catch (error) {
            console.error('Erreur de connexion parent:', error);
            showSnackbar("Nom d'utilisateur ou mot de passe incorrect.", 'error');
        }
    };

    return (
        <Grid container sx={{ height: '100vh' }}>
            {/* Image section */}
            <Grid item xs={12} md={6} sx={{ backgroundColor: '#f0f4f8', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img src="/images/parent-cartoon.png" alt="Parent login" style={{ width: '70%', borderRadius: '16px' }} />
            </Grid>

            {/* Form section */}
            <Grid item xs={12} md={6} display="flex" alignItems="center" justifyContent="center">
                <Container maxWidth="sm">
                    <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
                        <Typography variant="h4" fontWeight="bold" gutterBottom>
                            Connexion Parent
                        </Typography>
                        <Typography variant="body1" gutterBottom color="textSecondary">
                            Veuillez entrer vos informations pour accéder au tableau de bord.
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                            <TextField
                                label="Email"
                                type="email"
                                variant="outlined"
                                fullWidth
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                label="Mot de passe"
                                type="password"
                                variant="outlined"
                                fullWidth
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                sx={{ mb: 2 }}
                            />
                            <Button variant="contained" color="primary" type="submit" fullWidth sx={{ fontSize: '18px', py: 1.5 }}>
                                Se connecter
                            </Button>
                        </Box>
                    </Paper>
                </Container>
            </Grid>

            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Grid>
    );
};

export default LoginParent;
