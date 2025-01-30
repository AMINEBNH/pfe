import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const AddTeacherForm = ({ onAddTeacher }) => {
    const [newTeacher, setNewTeacher] = useState({
        name: '',
        subject: '',
        email: '',
        password: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newTeacher.name || !newTeacher.subject || !newTeacher.email || !newTeacher.password) {
            alert('Veuillez remplir tous les champs de l\'enseignant.');
            return;
        }
        onAddTeacher(newTeacher);
        setNewTeacher({ name: '', subject: '', email: '', password: '' });
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
                label="Nom"
                variant="outlined"
                value={newTeacher.name}
                onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
                fullWidth
                required
            />
            <TextField
                label="Matière"
                variant="outlined"
                value={newTeacher.subject}
                onChange={(e) => setNewTeacher({ ...newTeacher, subject: e.target.value })}
                fullWidth
                required
            />
            <TextField
                label="Email"
                type="email"
                variant="outlined"
                value={newTeacher.email}
                onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
                fullWidth
                required
            />
            <TextField
                label="Mot de passe"
                type="password"
                variant="outlined"
                value={newTeacher.password}
                onChange={(e) => setNewTeacher({ ...newTeacher, password: e.target.value })}
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
                Ajouter l'enseignant
            </Button>
        </Box>
    );
};

export default AddTeacherForm;