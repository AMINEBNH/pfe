/**********************************************
 * frontend/src/pages/AdminTeachers.js
 **********************************************/
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    TextField,
    Avatar,
} from '@mui/material';

const AdminTeachers = () => {
    const [teachers, setTeachers] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [updatedTeacher, setUpdatedTeacher] = useState({});

    // Récupérer la liste des enseignants
    const fetchTeachers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/teachers');
            setTeachers(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des enseignants :', error);
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    // Ouvrir la boîte de dialogue
    const handleOpenDialog = (teacher) => {
        setSelectedTeacher(teacher);
        // Copier les données, dont "image"
        setUpdatedTeacher({ ...teacher });
        setOpenDialog(true);
    };

    // Fermer la boîte de dialogue
    const handleCloseDialog = () => {
        setSelectedTeacher(null);
        setOpenDialog(false);
    };

    // Gérer la modification d'un champ
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedTeacher((prev) => ({ ...prev, [name]: value }));
    };

    // Mettre à jour l'enseignant
    const handleUpdateTeacher = async () => {
        if (!selectedTeacher) return;

        try {
            await axios.put(
                `http://localhost:5000/api/teachers/${selectedTeacher._id}`,
                updatedTeacher
            );
            // Après la mise à jour, on rafraîchit la liste
            await fetchTeachers();
            handleCloseDialog();
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'enseignant :", error);
            alert("Impossible de mettre à jour l'enseignant.");
        }
    };

    return (
        <div style={{ padding: '2rem', backgroundColor: '#f7f9fc', minHeight: '100vh' }}>
            <Typography variant="h4" gutterBottom>
                Gestion des Enseignants
            </Typography>

            <Grid container spacing={2}>
                {teachers.map((teacher) => (
                    <Grid item xs={12} sm={6} md={4} key={teacher._id}>
                        <Card
                            sx={{
                                borderRadius: 3,
                                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                                cursor: 'pointer',
                            }}
                            onClick={() => handleOpenDialog(teacher)}
                        >
                            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar
                                    src={teacher.image} // Affiche l'image
                                    alt={teacher.name}
                                    sx={{ width: 60, height: 60 }}
                                />
                                <Box>
                                    <Typography variant="h6">{teacher.name}</Typography>
                                    <Typography variant="body2">Sujet : {teacher.subject}</Typography>
                                    <Typography variant="body2">Email : {teacher.email}</Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Dialog de mise à jour d'un enseignant */}
            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                <DialogTitle>Modifier Enseignant</DialogTitle>
                <DialogContent dividers>
                    {selectedTeacher && (
                        <Box display="flex" flexDirection="column" gap={2}>
                            <TextField
                                label="Nom"
                                name="name"
                                variant="outlined"
                                value={updatedTeacher.name || ''}
                                onChange={handleChange}
                            />
                            <TextField
                                label="Sujet"
                                name="subject"
                                variant="outlined"
                                value={updatedTeacher.subject || ''}
                                onChange={handleChange}
                            />
                            <TextField
                                label="Email"
                                name="email"
                                variant="outlined"
                                value={updatedTeacher.email || ''}
                                onChange={handleChange}
                            />
                            <TextField
                                label="URL de l'image"
                                name="image"
                                variant="outlined"
                                value={updatedTeacher.image || ''}
                                onChange={handleChange}
                            />
                            <TextField
                                label="Mot de passe"
                                name="password"
                                type="password"
                                variant="outlined"
                                value={updatedTeacher.password || ''}
                                onChange={handleChange}
                            />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Annuler</Button>
                    <Button onClick={handleUpdateTeacher} variant="contained" color="primary">
                        Enregistrer
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default AdminTeachers;
