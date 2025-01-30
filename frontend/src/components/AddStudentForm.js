import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const AddStudentForm = ({ onAddStudent }) => {
    const [newStudent, setNewStudent] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        email: '',
        password: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newStudent.firstName || !newStudent.lastName || !newStudent.dateOfBirth || !newStudent.email || !newStudent.password) {
            alert('Veuillez remplir tous les champs de l\'étudiant.');
            return;
        }
        onAddStudent(newStudent);
        setNewStudent({
            firstName: '',
            lastName: '',
            dateOfBirth: '',
            email: '',
            password: '',
        });
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
                label="Prénom"
                variant="outlined"
                value={newStudent.firstName}
                onChange={(e) => setNewStudent({ ...newStudent, firstName: e.target.value })}
                fullWidth
                required
            />
            <TextField
                label="Nom"
                variant="outlined"
                value={newStudent.lastName}
                onChange={(e) => setNewStudent({ ...newStudent, lastName: e.target.value })}
                fullWidth
                required
            />
            <TextField
                label="Date de naissance"
                type="date"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                value={newStudent.dateOfBirth}
                onChange={(e) => setNewStudent({ ...newStudent, dateOfBirth: e.target.value })}
                fullWidth
                required
            />
            <TextField
                label="Email"
                type="email"
                variant="outlined"
                value={newStudent.email}
                onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                fullWidth
                required
            />
            <TextField
                label="Mot de passe"
                type="password"
                variant="outlined"
                value={newStudent.password}
                onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                fullWidth
                required
            />
            <Button
                variant="contained"
                color="primary"
                type="submit"
                startIcon={<AddCircleOutlineIcon />}
                sx={{
                    flex: '1 1 100%',
                    borderRadius: 10,
                    backgroundColor: '#5a67d8',
                    '&:hover': { backgroundColor: '#434aa1' },
                }}
            >
                Ajouter l'étudiant
            </Button>
        </Box>
    );
};

export default AddStudentForm;