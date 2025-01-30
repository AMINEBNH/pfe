import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const AddCourseForm = ({ teachers, onAddCourse }) => {
    const [newCourse, setNewCourse] = useState({
        name: '',
        teacher: '',
        hours: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newCourse.name || !newCourse.teacher || !newCourse.hours) {
            alert('Veuillez remplir tous les champs du cours.');
            return;
        }
        onAddCourse(newCourse);
        setNewCourse({ name: '', teacher: '', hours: '' });
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
                label="Nom du cours"
                variant="outlined"
                value={newCourse.name}
                onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                fullWidth
                required
            />
            <FormControl fullWidth required>
                <InputLabel>Enseignant</InputLabel>
                <Select
                    value={newCourse.teacher}
                    onChange={(e) => setNewCourse({ ...newCourse, teacher: e.target.value })}
                >
                    {teachers.map((teacher) => (
                        <MenuItem key={teacher._id} value={teacher._id}>
                            {`${teacher.name} - ${teacher.subject}`}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <TextField
                label="Nombre d'heures"
                type="number"
                variant="outlined"
                value={newCourse.hours}
                onChange={(e) => setNewCourse({ ...newCourse, hours: e.target.value })}
                fullWidth
                required
                inputProps={{ min: 1 }}
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
                Ajouter le cours
            </Button>
        </Box>
    );
};

export default AddCourseForm;