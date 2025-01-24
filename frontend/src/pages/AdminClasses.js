import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    TextField,
    Button,
    Card,
    Snackbar,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    List,
    ListItem,
    ListItemText,
} from '@mui/material';
import './AdminClasses.css';

const AdminClasses = () => {
    const [classesList, setClassesList] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    const [teacherCourses, setTeacherCourses] = useState([]); // Cours associés aux enseignants
    const [newClass, setNewClass] = useState({
        name: '',
        level: '',
        price: 0,
        teachers: [],
        students: [],
        courses: [],
        schedule: [],
    });
    const [selectedClass, setSelectedClass] = useState(null);
    const [showClassForm, setShowClassForm] = useState(false);

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const showSnackbar = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setOpenSnackbar(true);
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [classesRes, teachersRes, studentsRes] = await Promise.all([
                axios.get('http://localhost:5000/api/classes'),
                axios.get('http://localhost:5000/api/teachers'),
                axios.get('http://localhost:5000/api/students'),
            ]);
            setClassesList(classesRes.data);
            setTeachers(teachersRes.data);
            setStudents(studentsRes.data);
        } catch (error) {
            showSnackbar('Erreur lors de la récupération des données.', 'error');
        }
    };

    const handleAddOrUpdateClass = async (e) => {
        e.preventDefault();

        if (newClass.schedule.some((item) => !item.day || !item.time || !item.course)) {
            showSnackbar('Veuillez remplir tous les champs du planning.', 'error');
            return;
        }

        try {
            if (selectedClass) {
                await axios.put(`http://localhost:5000/api/classes/${selectedClass._id}`, newClass);
                showSnackbar('Classe mise à jour avec succès.', 'success');
            } else {
                await axios.post('http://localhost:5000/api/classes', newClass);
                showSnackbar('Classe ajoutée avec succès.', 'success');
            }
            setNewClass({ name: '', level: '', price: 0, teachers: [], students: [], courses: [], schedule: [] });
            setShowClassForm(false);
            setSelectedClass(null);
            fetchData();
        } catch (error) {
            showSnackbar("Erreur lors de l'enregistrement de la classe.", 'error');
        }
    };

    const handleEditClass = (cls) => {
        setSelectedClass(cls);
        setNewClass(cls);
        setShowClassForm(true);
    };

    const handleDeleteClass = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/classes/${id}`);
            showSnackbar('Classe supprimée avec succès.', 'success');
            setClassesList(classesList.filter((cls) => cls._id !== id));
        } catch (error) {
            showSnackbar('Erreur lors de la suppression de la classe.', 'error');
        }
    };

    const handleTeacherChange = async (selectedTeachers) => {
        // Assurez-vous que `selectedTeachers` ne contient que des IDs
        const teacherIds = selectedTeachers.map((teacher) =>
            typeof teacher === 'object' ? teacher._id : teacher
        );

        setNewClass({ ...newClass, teachers: teacherIds });

        try {
            const courses = await Promise.all(
                teacherIds.map((teacherId) =>
                    axios
                        .get(`http://localhost:5000/courses?teacher=${teacherId}`)
                        .then((res) => res.data)
                )
            );
            const allCourses = courses.flat();
            setTeacherCourses(allCourses);
        } catch (error) {
            console.error('Erreur lors de la récupération des cours:', error);
            showSnackbar('Erreur lors de la récupération des cours.', 'error');
        }
    };

    const addScheduleItem = () => {
        setNewClass((prev) => ({
            ...prev,
            schedule: [...prev.schedule, { day: '', time: '', course: '' }],
        }));
    };

    const handleScheduleChange = (index, field, value) => {
        const updatedSchedule = [...newClass.schedule];
        updatedSchedule[index][field] = value;
        setNewClass((prev) => ({ ...prev, schedule: updatedSchedule }));
    };

    const removeScheduleItem = (index) => {
        setNewClass((prev) => ({
            ...prev,
            schedule: prev.schedule.filter((_, i) => i !== index),
        }));
    };

    return (
        <Box p={3} className="admin-classes-container">
            <Typography variant="h4" gutterBottom>
                Gestion des Classes
            </Typography>
            <Button
                variant="outlined"
                onClick={() => {
                    setShowClassForm(!showClassForm);
                    setSelectedClass(null);
                    setNewClass({ name: '', level: '', price: 0, teachers: [], students: [], courses: [], schedule: [] });
                }}
                sx={{ mb: 2 }}
            >
                {showClassForm ? 'Cacher le formulaire' : 'Ajouter une classe'}
            </Button>

            {showClassForm && (
                <Card className="class-form-card">
                    <Typography variant="h6">{selectedClass ? 'Modifier la classe' : 'Ajouter une classe'}</Typography>
                    <Box component="form" onSubmit={handleAddOrUpdateClass} sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            label="Nom de la classe"
                            value={newClass.name}
                            onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                            sx={{ mb: 2 }}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Niveau"
                            value={newClass.level}
                            onChange={(e) => setNewClass({ ...newClass, level: e.target.value })}
                            sx={{ mb: 2 }}
                            required
                        />
                        <TextField
                            fullWidth
                            type="number"
                            label="Prix"
                            value={newClass.price}
                            onChange={(e) => setNewClass({ ...newClass, price: e.target.value })}
                            sx={{ mb: 2 }}
                            required
                        />
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Enseignants</InputLabel>
                            <Select
                                multiple
                                value={newClass.teachers}
                                onChange={(e) => handleTeacherChange(e.target.value)}
                            >
                                {teachers.map((teacher) => (
                                    <MenuItem key={teacher._id} value={teacher._id}>
                                        {teacher.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Cours</InputLabel>
                            <Select
                                multiple
                                value={newClass.courses}
                                onChange={(e) => setNewClass({ ...newClass, courses: e.target.value })}
                            >
                                {teacherCourses.map((course) => (
                                    <MenuItem key={course._id} value={course._id}>
                                        {course.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Étudiants</InputLabel>
                            <Select
                                multiple
                                value={newClass.students}
                                onChange={(e) => setNewClass({ ...newClass, students: e.target.value })}
                            >
                                {students.map((student) => (
                                    <MenuItem key={student._id} value={student._id}>
                                        {`${student.firstName} ${student.lastName}`}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                            Planning
                        </Typography>
                        <Button variant="outlined" onClick={addScheduleItem} sx={{ mb: 2 }}>
                            Ajouter un horaire
                        </Button>
                        <Grid container spacing={2}>
                            {newClass.schedule.map((item, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <Card className="schedule-item" sx={{ p: 2, mb: 2 }}>
                                        <FormControl fullWidth sx={{ mb: 1 }}>
                                            <InputLabel>Jour</InputLabel>
                                            <Select
                                                value={item.day}
                                                onChange={(e) => handleScheduleChange(index, 'day', e.target.value)}
                                            >
                                                <MenuItem value="Lundi">Lundi</MenuItem>
                                                <MenuItem value="Mardi">Mardi</MenuItem>
                                                <MenuItem value="Mercredi">Mercredi</MenuItem>
                                                <MenuItem value="Jeudi">Jeudi</MenuItem>
                                                <MenuItem value="Vendredi">Vendredi</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <TextField
                                            fullWidth
                                            label="Heure"
                                            value={item.time}
                                            onChange={(e) => handleScheduleChange(index, 'time', e.target.value)}
                                            sx={{ mb: 2 }}
                                        />
                                        <FormControl fullWidth sx={{ mb: 1 }}>
                                            <InputLabel>Cours</InputLabel>
                                            <Select
                                                value={item.course}
                                                onChange={(e) => handleScheduleChange(index, 'course', e.target.value)}
                                            >
                                                {teacherCourses.map((course) => (
                                                    <MenuItem key={course._id} value={course.name}>
                                                        {course.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={() => removeScheduleItem(index)}
                                            fullWidth
                                        >
                                            Supprimer
                                        </Button>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        <Button variant="contained" type="submit" sx={{ mt: 3 }}>
                            {selectedClass ? 'Modifier la classe' : 'Ajouter la classe'}
                        </Button>
                    </Box>
                </Card>
            )}

            <Box>
                {classesList.map((cls) => (
                    <Card key={cls._id} className="class-card">
                        <Box p={2}>
                            <Typography variant="h6">{cls.name}</Typography>
                            <Typography>Niveau : {cls.level}</Typography>
                            <Typography>Prix : ${cls.price}</Typography>
                            <Typography variant="subtitle1" sx={{ mt: 2 }}>
                                Planning :
                            </Typography>
                            <List>
                                {cls.schedule.map((item, index) => (
                                    <ListItem key={index}>
                                        <ListItemText primary={`${item.day} - ${item.time} : ${item.course}`} />
                                    </ListItem>
                                ))}
                            </List>
                            <Button onClick={() => handleEditClass(cls)} sx={{ mt: 1 }}>
                                Modifier
                            </Button>
                            <Button onClick={() => handleDeleteClass(cls._id)} color="error" sx={{ mt: 1 }}>
                                Supprimer
                            </Button>
                        </Box>
                    </Card>
                ))}
            </Box>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={5000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AdminClasses;
