// frontend/src/pages/AdminStudents.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import {
    Typography,
    Grid,
    Card,
    CardContent,
    Avatar,
    Box,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';

const AdminStudents = () => {
    // États pour les étudiants et classes
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [search, setSearch] = useState('');

    // Gestion de la Dialog
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    // État local pour le formulaire de mise à jour
    const [updatedStudent, setUpdatedStudent] = useState({
        fullName: '',
        email: '',
        dateOfBirth: '',
        photo: '',
    });

    // État pour la sélection de classe dans la Dialog
    const [selectedClass, setSelectedClass] = useState('');

    useEffect(() => {
        fetchStudents();
        fetchClasses();
    }, []);

    // 1) Récupérer la liste des étudiants
    const fetchStudents = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/students');
            setStudents(res.data);
            setFilteredStudents(res.data);
        } catch (error) {
            console.error('Erreur récupération étudiants :', error);
        }
    };

    // Récupérer la liste des classes
    const fetchClasses = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/classes');
            setClasses(res.data);
        } catch (error) {
            console.error('Erreur récupération classes :', error);
        }
    };

    // 2) Gestion de la recherche
    const handleSearchChange = (e) => {
        const val = e.target.value.toLowerCase();
        setSearch(val);
        const filtered = students.filter((st) =>
            `${st.fullName} ${st.email ?? ''}`.toLowerCase().includes(val)
        );
        setFilteredStudents(filtered);
    };

    // 3) Ouvrir la Dialog pour modifier / assigner une classe à un étudiant
    const handleOpenDialog = (student) => {
        console.log('handleOpenDialog =>', student);
        setSelectedStudent(student);
        setUpdatedStudent({
            fullName: student.fullName || '',
            email: student.email || '',
            dateOfBirth:
                student.dateOfBirth && student.dateOfBirth !== 'Non spécifiée'
                    ? new Date(student.dateOfBirth).toISOString().substring(0, 10)
                    : '',
            photo: student.photo || '',
        });
        setSelectedClass(student.class || ''); // Préselectionner la classe si existante
        setOpenDialog(true);
    };

    // 4) Fermer la Dialog
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedStudent(null);
        setUpdatedStudent({
            fullName: '',
            email: '',
            dateOfBirth: '',
            photo: '',
        });
        setSelectedClass('');
    };

    // Gestion des champs dans la Dialog
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedStudent((prev) => ({ ...prev, [name]: value }));
    };

    // 5) Valider la mise à jour (PUT /api/students/:id)
    const handleUpdateStudent = async () => {
        if (!selectedStudent?._id) {
            console.warn("Pas d'ID d'étudiant !");
            return;
        }

        // Décomposer "fullName" en firstName et lastName
        let firstName = '';
        let lastName = '';
        if (updatedStudent.fullName.trim()) {
            const parts = updatedStudent.fullName.trim().split(' ');
            firstName = parts.shift() || '';
            lastName = parts.join(' ') || '';
        }

        // Préparer l'objet payload pour la mise à jour, incluant la classe
        const payload = {
            firstName,
            lastName,
            email: updatedStudent.email,
            dateOfBirth: updatedStudent.dateOfBirth,
            photo: updatedStudent.photo,
            class: selectedClass,  // Assigner la classe sélectionnée
        };

        try {
            const url = `http://localhost:5000/api/students/${selectedStudent._id}`;
            await axios.put(url, payload);
            await fetchStudents();
            handleCloseDialog();
        } catch (error) {
            console.error('Erreur lors de la mise à jour :', error);
            alert('Échec de la mise à jour');
        }
    };

    return (
        <div style={{ padding: 20, background: '#f7f9fc' }}>
            <Typography variant="h4" gutterBottom>
                Gestion des Étudiants
            </Typography>

            {/* Barre de recherche */}
            <Box mb={2}>
                <TextField
                    fullWidth
                    label="Rechercher par nom / email"
                    variant="outlined"
                    value={search}
                    onChange={handleSearchChange}
                />
            </Box>

            {/* Liste d'étudiants */}
            <Grid container spacing={2}>
                {filteredStudents.map((student) => (
                    <Grid item xs={12} sm={6} md={4} key={student._id}>
                        <Card
                            sx={{ cursor: 'pointer' }}
                            onClick={() => handleOpenDialog(student)}
                        >
                            <CardContent sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                <Avatar
                                    src={student.photo}
                                    alt={student.fullName}
                                    sx={{ width: 60, height: 60 }}
                                />
                                <Box>
                                    <Typography variant="h6" fontWeight="bold">
                                        {student.fullName}
                                    </Typography>
                                    <Typography variant="body2">
                                        Email : {student.email || 'Aucun'}
                                    </Typography>
                                    <Typography variant="body2">
                                        Date de Naissance :{' '}
                                        {student.dateOfBirth && student.dateOfBirth !== 'Non spécifiée'
                                            ? new Date(student.dateOfBirth).toLocaleDateString()
                                            : 'Non spécifiée'}
                                    </Typography>
                                    <Typography variant="body2">
                                        Classe : {student.class || 'Non assignée'}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Dialog de mise à jour / assignation */}
            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                <DialogTitle>Modifier / Assigner une classe à l'étudiant</DialogTitle>
                <DialogContent dividers>
                    <Box display="flex" flexDirection="column" gap={2}>
                        <TextField
                            label="Nom complet"
                            name="fullName"
                            value={updatedStudent.fullName}
                            onChange={handleChange}
                        />
                        <TextField
                            label="Email"
                            name="email"
                            value={updatedStudent.email}
                            onChange={handleChange}
                        />
                        <TextField
                            label="Date de naissance"
                            name="dateOfBirth"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={updatedStudent.dateOfBirth}
                            onChange={handleChange}
                        />
                        <TextField
                            label="Photo (URL)"
                            name="photo"
                            value={updatedStudent.photo}
                            onChange={handleChange}
                        />
                        <FormControl fullWidth>
                            <InputLabel>Classe</InputLabel>
                            <Select
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                label="Classe"
                            >
                                {/* Option pour aucune classe */}
                                <MenuItem value="">
                                    <em>Aucune</em>
                                </MenuItem>
                                {classes.map((cls) => (
                                    <MenuItem key={cls._id} value={cls._id}>
                                        {cls.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Annuler</Button>
                    <Button onClick={handleUpdateStudent} variant="contained">
                        Enregistrer
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default AdminStudents;
