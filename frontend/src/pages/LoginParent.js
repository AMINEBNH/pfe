import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';

const LoginParent = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login/parent', { email, password });
            const { token } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('role', 'parent');
            localStorage.setItem('email', email);
            navigate('/parent-dashboard');
        } catch (error) {
            setError(error.response?.data?.message || "Erreur de connexion. Veuillez réessayer.");
        }
    };

    return (
        <Grid container sx={{ height: '100vh' }}>
            {/* Section Image */}
            <Grid item xs={12} md={6} sx={{ backgroundColor: '#e3f2fd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" sx={{ textAlign: 'center', mb: 2 }}>
                        Bienvenue Parent 👨‍👩‍👧‍👦
                    </Typography>
                    <img
                        src="/images/parent-cartoon.png" // Assurez-vous que cette image existe dans le dossier public/images
                        alt="Parent login"
                        style={{ width: '100%', maxWidth: '400px', borderRadius: '12px' }}
                    />
                </Box>
            </Grid>

            {/* Section Formulaire */}
            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 4 }}>
                <Box component="form" onSubmit={handleLogin} sx={{ width: '100%', maxWidth: '400px' }}>
                    <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
                        Connexion Parent
                    </Typography>
                    <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        sx={{ mb: 2 }}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Mot de passe"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        sx={{ mb: 2 }}
                        required
                    />
                    {error && (
                        <Typography color="error" sx={{ mb: 2 }}>
                            {error}
                        </Typography>
                    )}
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Se connecter
                    </Button>
                </Box>
            </Grid>
        </Grid>
    );
};

export default LoginParent;