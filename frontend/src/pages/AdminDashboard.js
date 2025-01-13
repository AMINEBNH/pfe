import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/AppSidebar';
import './AdminDashboard.css';

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
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  // -------------------------------------------------
  // ÉTATS GLOBAUX
  // -------------------------------------------------
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // États pour la visibilité des formulaires
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showTeacherForm, setShowTeacherForm] = useState(false);
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [courses, setCourses] = useState([]);
  const [classesList, setClassesList] = useState([]);


  // -------------------------------------------------
  // DONNÉES ET FORMULAIRES
  // -------------------------------------------------
  const [teachers, setTeachers] = useState([]);

  // Formulaire : Ajouter un cours
  const [newCourse, setNewCourse] = useState({
    name: '',
    teacher: '',
    hours: '',
    documents: [],
  });

  // Formulaire : Ajouter un enseignant
  const [newTeacher, setNewTeacher] = useState({
    name: '',
    subject: '',
    email: '',
    password: '',
  });

  // Formulaire : Ajouter un étudiant
  const [newStudent, setNewStudent] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    password: '',
  });

  // Formulaire : Ajouter un événement
  const [newEvent, setNewEvent] = useState({
    day: '',
    time: '',
    description: '',
    image: '',
  });

  // Snackbar (pour feedback)
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  // -------------------------------------------------
  // useEffect : Récupération initiale (liste teachers)
  // -------------------------------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const teachersResp = await axios.get('http://localhost:5000/api/teachers');
        setTeachers(teachersResp.data);
      } catch (error) {
        showSnackbar('Erreur lors de la récupération des données.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // -------------------------------------------------
  // 1) AJOUTER UN COURS
  // -------------------------------------------------
  const handleAddCourse = async (e) => {
    e.preventDefault();
    if (!newCourse.name || !newCourse.teacher || !newCourse.hours) {
      showSnackbar('Veuillez remplir tous les champs du cours.', 'warning');
      return;
    }
    try {
      await axios.post('http://localhost:5000/courses/add', newCourse);
      setNewCourse({ name: '', teacher: '', hours: '', documents: [] });
      showSnackbar('Cours ajouté avec succès.', 'success');
      setShowCourseForm(false);
      navigate('/courses'); // optionnel
    } catch (error) {
      showSnackbar("Erreur lors de l'ajout du cours.", 'error');
    }
  };

  // -------------------------------------------------
  // 2) AJOUTER UN ENSEIGNANT
  // -------------------------------------------------
  const handleAddTeacher = async (e) => {
    e.preventDefault();
    const { name, subject, email, password } = newTeacher;
    if (!name || !subject || !email || !password) {
      showSnackbar('Veuillez remplir tous les champs de l\'enseignant.', 'warning');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/teachers/register', newTeacher);
      setNewTeacher({ name: '', subject: '', email: '', password: '' });
      showSnackbar('Enseignant ajouté avec succès.', 'success');
      setShowTeacherForm(false);
    } catch (error) {
      showSnackbar("Erreur lors de l'ajout de l'enseignant.", 'error');
    }
  };

  // -------------------------------------------------
  // 3) AJOUTER UN ÉTUDIANT
  // -------------------------------------------------
  const handleAddStudent = async (e) => {
    e.preventDefault();
    const { firstName, lastName, dateOfBirth, email, password } = newStudent;
    if (!firstName || !lastName || !dateOfBirth || !email || !password) {
      showSnackbar('Veuillez remplir tous les champs de l\'étudiant.', 'warning');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/students/register', newStudent);
      setNewStudent({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        email: '',
        password: '',
      });
      showSnackbar('Étudiant ajouté avec succès.', 'success');
      setShowStudentForm(false);
    } catch (error) {
      showSnackbar("Erreur lors de l'ajout de l'étudiant.", 'error');
    }
  };

  // -------------------------------------------------
  // 4) AJOUTER UN ÉVÉNEMENT
  // -------------------------------------------------
  const handleAddEvent = async (e) => {
    e.preventDefault();
    const { day, time, description } = newEvent;
    if (!day || !time || !description) {
      showSnackbar('Veuillez remplir tous les champs de l\'événement.', 'warning');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/events/add', newEvent);
      setNewEvent({ day: '', time: '', description: '', image: '' });
      showSnackbar('Événement ajouté avec succès.', 'success');
      setShowEventForm(false);
    } catch (error) {
      showSnackbar("Erreur lors de l'ajout de l'événement.", 'error');
    }
  };


  // -------------------------------------------------
  // RENDU
  // -------------------------------------------------
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: '#34495e' }}>
          Tableau de bord Administrateur
        </Typography>

        {/* Bouton et formulaire : Ajouter un cours */}
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => setShowCourseForm(!showCourseForm)}
          sx={{
            mb: 2,
            borderRadius: 10,
            backgroundColor: '#e2e8f0',
            '&:hover': { backgroundColor: '#cbd5e0' },
          }}
        >
          {showCourseForm ? 'Cacher le formulaire de cours' : 'Ajouter un cours'}
        </Button>
        {showCourseForm && (
          <Card sx={{ mb: 4, p: 3, borderRadius: 3, backgroundColor: '#f7faff', boxShadow: 2 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Ajouter un nouveau cours
            </Typography>
            <Box
              component="form"
              onSubmit={handleAddCourse}
              sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}
            >
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
          </Card>
        )}

        {/* Bouton et formulaire : Ajouter un enseignant */}
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => setShowTeacherForm(!showTeacherForm)}
          sx={{
            mb: 2,
            borderRadius: 10,
            backgroundColor: '#e2e8f0',
            '&:hover': { backgroundColor: '#cbd5e0' },
          }}
        >
          {showTeacherForm ? 'Cacher le formulaire d\'enseignant' : 'Ajouter un enseignant'}
        </Button>
        {showTeacherForm && (
          <Card sx={{ mb: 4, p: 3, borderRadius: 3, backgroundColor: '#f7faff', boxShadow: 2 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Ajouter un nouvel enseignant
            </Typography>
            <Box
              component="form"
              onSubmit={handleAddTeacher}
              sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}
            >
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
          </Card>
        )}

        {/* Bouton et formulaire : Ajouter un étudiant */}
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => setShowStudentForm(!showStudentForm)}
          sx={{
            mb: 2,
            borderRadius: 10,
            backgroundColor: '#e2e8f0',
            '&:hover': { backgroundColor: '#cbd5e0' },
          }}
        >
          {showStudentForm ? 'Cacher le formulaire d\'étudiant' : 'Ajouter un étudiant'}
        </Button>
        {showStudentForm && (
          <Card sx={{ mb: 4, p: 3, borderRadius: 3, backgroundColor: '#f7faff', boxShadow: 2 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Ajouter un nouvel étudiant
            </Typography>
            <Box
              component="form"
              onSubmit={handleAddStudent}
              sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}
            >
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
          </Card>
        )}

        {/* Bouton et formulaire : Ajouter un événement */}
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => setShowEventForm(!showEventForm)}
          sx={{
            mb: 2,
            borderRadius: 10,
            backgroundColor: '#e2e8f0',
            '&:hover': { backgroundColor: '#cbd5e0' },
          }}
        >
          {showEventForm ? 'Cacher le formulaire d\'événement' : 'Ajouter un événement'}
        </Button>
        {showEventForm && (
          <Card sx={{ mb: 4, p: 3, borderRadius: 3, backgroundColor: '#f7faff', boxShadow: 2 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Ajouter un nouvel événement
            </Typography>
            <Box
              component="form"
              onSubmit={handleAddEvent}
              sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}
            >
              <TextField
                label="Jour"
                type="date"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                value={newEvent.day}
                onChange={(e) => setNewEvent({ ...newEvent, day: e.target.value })}
                fullWidth
                required
              />
              <TextField
                label="Heure"
                type="time"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                value={newEvent.time}
                onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                fullWidth
                required
              />
              <TextField
                label="Description"
                variant="outlined"
                multiline
                rows={4}
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                fullWidth
                required
              />
              <TextField
                label="URL de l'image"
                variant="outlined"
                value={newEvent.image}
                onChange={(e) => setNewEvent({ ...newEvent, image: e.target.value })}
                fullWidth
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
                Ajouter l'événement
              </Button>
            </Box>
          </Card>
        )}
      </div>

      {/* Snackbar (notifications) */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: '100%', fontWeight: 'bold' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AdminDashboard;