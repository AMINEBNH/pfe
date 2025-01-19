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
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [search, setSearch] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    const [updatedStudent, setUpdatedStudent] = useState({
        firstName: '',
        lastName: '',
        email: '',
        dateOfBirth: '',
        photo: '',
    });

    const [selectedClass, setSelectedClass] = useState('');

    useEffect(() => {
        fetchStudents();
        fetchClasses();
    }, []);

    // Récupérer tous les étudiants
    const fetchStudents = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/students');
            setStudents(res.data);
            setFilteredStudents(res.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des étudiants :', error);
        }
    };

    // Récupérer les classes
    const fetchClasses = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/classes');
            setClasses(res.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des classes :', error);
        }
    };

    // Recherche dynamique
    const handleSearchChange = (e) => {
        const val = e.target.value.toLowerCase();
        setSearch(val);
        const filtered = students.filter((st) =>
            `${st.firstName} ${st.lastName} ${st.email}`.toLowerCase().includes(val)
        );
        setFilteredStudents(filtered);
    };

    // Ouvrir la Dialog pour mise à jour
    const handleOpenDialog = (student) => {
        setSelectedStudent(student);
        setUpdatedStudent({
            firstName: student.firstName || '',
            lastName: student.lastName || '',
            email: student.email || '',
            dateOfBirth: student.dateOfBirth
                ? new Date(student.dateOfBirth).toISOString().substring(0, 10)
                : '',
            photo: student.photo || '',
        });
        setSelectedClass(student.class || '');
        setOpenDialog(true);
    };

    // Fermer la Dialog
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedStudent(null);
        setUpdatedStudent({
            firstName: '',
            lastName: '',
            email: '',
            dateOfBirth: '',
            photo: '',
        });
        setSelectedClass('');
    };

    // Mettre à jour un étudiant
    const handleUpdateStudent = async () => {
        if (!selectedStudent?._id) {
            console.warn("Pas d'ID étudiant !");
            return;
        }

        const payload = {
            ...updatedStudent,
            class: selectedClass || null, // Inclut la classe sélectionnée
        };

        try {
            const url = `http://localhost:5000/api/students/${selectedStudent._id}`;
            await axios.put(url, payload); // Envoi de la requête PUT avec les données mises à jour
            await fetchStudents(); // Recharge la liste des étudiants après la mise à jour
            handleCloseDialog(); // Ferme la boîte de dialogue
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

            {/* Recherche */}
            <Box mb={2}>
                <TextField
                    fullWidth
                    label="Rechercher par nom ou email"
                    variant="outlined"
                    value={search}
                    onChange={handleSearchChange}
                />
            </Box>

            {/* Liste des étudiants */}
            <Grid container spacing={2}>
                {filteredStudents.map((student) => (
                    <Grid item xs={12} sm={6} md={4} key={student._id}>
                        <Card
                            sx={{ cursor: 'pointer' }}
                            onClick={() => handleOpenDialog(student)}
                        >
                            <CardContent
                                sx={{ display: 'flex', gap: 2, alignItems: 'center' }}
                            >
                                <Avatar
                                    src={student.photo || '/default-avatar.png'}
                                    alt={`${student.firstName} ${student.lastName}`}
                                    sx={{ width: 60, height: 60 }}
                                />
                                <Box>
                                    <Typography variant="h6" fontWeight="bold">
                                        {`${student.firstName} ${student.lastName}`}
                                    </Typography>
                                    <Typography variant="body2">
                                        Email : {student.email || 'Aucun'}
                                    </Typography>
                                    <Typography variant="body2">
                                        Date de Naissance :{' '}
                                        {student.dateOfBirth
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

            {/* Dialog de mise à jour */}
            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                <DialogTitle>Modifier les informations de l'étudiant</DialogTitle>
                <DialogContent dividers>
                    <Box display="flex" flexDirection="column" gap={2}>
                        <TextField
                            label="Prénom"
                            name="firstName"
                            value={updatedStudent.firstName}
                            onChange={(e) =>
                                setUpdatedStudent({ ...updatedStudent, firstName: e.target.value })
                            }
                        />
                        <TextField
                            label="Nom"
                            name="lastName"
                            value={updatedStudent.lastName}
                            onChange={(e) =>
                                setUpdatedStudent({ ...updatedStudent, lastName: e.target.value })
                            }
                        />
                        <TextField
                            label="Email"
                            name="email"
                            value={updatedStudent.email}
                            onChange={(e) =>
                                setUpdatedStudent({ ...updatedStudent, email: e.target.value })
                            }
                        />
                        <TextField
                            label="Date de naissance"
                            name="dateOfBirth"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={updatedStudent.dateOfBirth}
                            onChange={(e) =>
                                setUpdatedStudent({ ...updatedStudent, dateOfBirth: e.target.value })
                            }
                        />
                        <TextField
                            label="Photo (URL)"
                            name="photo"
                            value={updatedStudent.photo}
                            onChange={(e) =>
                                setUpdatedStudent({ ...updatedStudent, photo: e.target.value })
                            }
                        />
                        <FormControl fullWidth>
                            <InputLabel>Classe</InputLabel>
                            <Select
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                label="Classe"
                            >
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
