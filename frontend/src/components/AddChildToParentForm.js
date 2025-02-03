import React, { useState, useEffect } from 'react';
import { Box, Typography, MenuItem, FormControl, InputLabel, Select, Button, Alert } from '@mui/material';
import axios from 'axios';

const AddChildToParentForm = () => {
    const [parents, setParents] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedParent, setSelectedParent] = useState('');
    const [selectedStudent, setSelectedStudent] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        // Récupérer la liste des parents
        axios.get('http://localhost:5000/api/parents')
            .then((response) => {
                console.log('✅ Parents récupérés :', response.data);
                setParents(response.data);
            })
            .catch((error) => {
                console.error('❌ Erreur récupération parents :', error);
                setError("Impossible de récupérer les parents. Vérifiez si le serveur est en cours d'exécution et si l'API fonctionne.");
            });

        // Récupérer la liste des étudiants
        axios.get('http://localhost:5000/api/students')
            .then((response) => {
                console.log('✅ Étudiants récupérés :', response.data);
                setStudents(response.data);
            })
            .catch((error) => {
                console.error('❌ Erreur récupération étudiants :', error);
                setError("Impossible de récupérer les étudiants. Vérifiez si le serveur est en cours d'exécution et si l'API fonctionne.");
            });
    }, []);

    const handleAssign = async () => {
        if (!selectedParent || !selectedStudent) {
            setError("Veuillez sélectionner un parent et un étudiant avant d'assigner.");
            return;
        }
        setMessage('');
        setError('');

        try {
            const response = await axios.post('http://localhost:5000/api/parents/assign-child', {
                parentId: selectedParent,
                studentId: selectedStudent,
            });
            setMessage(response.data.message);
        } catch (error) {
            setError(error.response?.data?.message || "Erreur lors de l'assignation.");
        }
    };

    return (
        <Box sx={{ maxWidth: 500, margin: 'auto', mt: 4, p: 3, border: '1px solid #ccc', borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom>
                Assigner un enfant à un parent
            </Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}

            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Parent</InputLabel>
                <Select
                    value={selectedParent}
                    onChange={(e) => setSelectedParent(e.target.value)}
                >
                    {parents.length > 0 ? (
                        parents.map((parent) => (
                            <MenuItem key={parent._id} value={parent._id}>
                                {parent.firstName} {parent.lastName} ({parent.email})
                            </MenuItem>
                        ))
                    ) : (
                        <MenuItem disabled>Aucun parent trouvé</MenuItem>
                    )}
                </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Enfant</InputLabel>
                <Select
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                >
                    {students.length > 0 ? (
                        students.map((student) => (
                            <MenuItem key={student._id} value={student._id}>
                                {student.firstName} {student.lastName} ({student.email})
                            </MenuItem>
                        ))
                    ) : (
                        <MenuItem disabled>Aucun étudiant trouvé</MenuItem>
                    )}
                </Select>
            </FormControl>

            <Button variant="contained" onClick={handleAssign} fullWidth>
                Assigner
            </Button>
        </Box>
    );
};

export default AddChildToParentForm;
