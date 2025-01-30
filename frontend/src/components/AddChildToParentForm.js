import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import axios from 'axios';

const AddChildToParentForm = () => {
    const [parents, setParents] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedParent, setSelectedParent] = useState('');
    const [selectedStudent, setSelectedStudent] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Récupérer la liste des parents
        axios.get('http://localhost:5000/api/parents')
            .then((response) => setParents(response.data))
            .catch((error) => console.error('Erreur récupération parents :', error));

        // Récupérer la liste des étudiants
        axios.get('http://localhost:5000/api/students')
            .then((response) => setStudents(response.data))
            .catch((error) => console.error('Erreur récupération étudiants :', error));
    }, []);

    const handleAssign = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/parents/assign-child', {
                parentId: selectedParent,
                studentId: selectedStudent,
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.message || "Erreur lors de l'assignation.");
        }
    };

    return (
        <Box sx={{ maxWidth: 400, margin: 'auto', mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                Assigner un enfant à un parent
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Parent</InputLabel>
                <Select
                    value={selectedParent}
                    onChange={(e) => setSelectedParent(e.target.value)}
                >
                    {parents.map((parent) => (
                        <MenuItem key={parent._id} value={parent._id}>
                            {parent.firstName} {parent.lastName}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Enfant</InputLabel>
                <Select
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                >
                    {students.map((student) => (
                        <MenuItem key={student._id} value={student._id}>
                            {student.firstName} {student.lastName}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Button variant="contained" onClick={handleAssign} fullWidth>
                Assigner
            </Button>
            {message && <Typography sx={{ mt: 2 }}>{message}</Typography>}
        </Box>
    );
};

export default AddChildToParentForm; 