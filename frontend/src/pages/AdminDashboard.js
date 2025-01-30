import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/AppSidebar';
import './AdminDashboard.css';
import {
  Box,
  Typography,
  Button,
  Card,
  Snackbar,
  Alert,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddCourseForm from '../components/AddCourseForm';
import AddTeacherForm from '../components/AddTeacherForm';
import AddStudentForm from '../components/AddStudentForm';
import AddEventForm from '../components/AddEventForm';
import AddChildToParentForm from '../components/AddChildToParentForm';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showTeacherForm, setShowTeacherForm] = useState(false);
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showAssignChildForm, setShowAssignChildForm] = useState(false);
  const [teachers, setTeachers] = useState([]);
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

  const handleAddCourse = async (newCourse) => {
    try {
      await axios.post('http://localhost:5000/courses/add', newCourse);
      showSnackbar('Cours ajouté avec succès.', 'success');
      setShowCourseForm(false);
    } catch (error) {
      showSnackbar("Erreur lors de l'ajout du cours.", 'error');
    }
  };

  const handleAddTeacher = async (newTeacher) => {
    try {
      await axios.post('http://localhost:5000/api/teachers/register', newTeacher);
      showSnackbar('Enseignant ajouté avec succès.', 'success');
      setShowTeacherForm(false);
    } catch (error) {
      showSnackbar("Erreur lors de l'ajout de l'enseignant.", 'error');
    }
  };

  const handleAddStudent = async (newStudent) => {
    try {
      await axios.post('http://localhost:5000/api/students/register', newStudent);
      showSnackbar('Étudiant ajouté avec succès.', 'success');
      setShowStudentForm(false);
    } catch (error) {
      showSnackbar("Erreur lors de l'ajout de l'étudiant.", 'error');
    }
  };

  const handleAddEvent = async (newEvent) => {
    try {
      await axios.post('http://localhost:5000/api/events/add', newEvent);
      showSnackbar('Événement ajouté avec succès.', 'success');
      setShowEventForm(false);
    } catch (error) {
      showSnackbar("Erreur lors de l'ajout de l'événement.", 'error');
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: '#34495e' }}>
          Tableau de bord Administrateur
        </Typography>

        {/* Boutons pour afficher les formulaires */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setShowCourseForm(!showCourseForm)}
          >
            {showCourseForm ? 'Cacher le formulaire de cours' : 'Ajouter un cours'}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setShowTeacherForm(!showTeacherForm)}
          >
            {showTeacherForm ? 'Cacher le formulaire d\'enseignant' : 'Ajouter un enseignant'}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setShowStudentForm(!showStudentForm)}
          >
            {showStudentForm ? 'Cacher le formulaire d\'étudiant' : 'Ajouter un étudiant'}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setShowEventForm(!showEventForm)}
          >
            {showEventForm ? 'Cacher le formulaire d\'événement' : 'Ajouter un événement'}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setShowAssignChildForm(!showAssignChildForm)}
          >
            {showAssignChildForm ? 'Cacher le formulaire d\'assignation' : 'Assigner un enfant'}
          </Button>
        </Box>

        {/* Affichage des formulaires */}
        {showCourseForm && (
          <Card sx={{ mb: 4, p: 3, borderRadius: 3, backgroundColor: '#f7faff', boxShadow: 2 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Ajouter un nouveau cours
            </Typography>
            <AddCourseForm teachers={teachers} onAddCourse={handleAddCourse} />
          </Card>
        )}

        {showTeacherForm && (
          <Card sx={{ mb: 4, p: 3, borderRadius: 3, backgroundColor: '#f7faff', boxShadow: 2 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Ajouter un nouvel enseignant
            </Typography>
            <AddTeacherForm onAddTeacher={handleAddTeacher} />
          </Card>
        )}

        {showStudentForm && (
          <Card sx={{ mb: 4, p: 3, borderRadius: 3, backgroundColor: '#f7faff', boxShadow: 2 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Ajouter un nouvel étudiant
            </Typography>
            <AddStudentForm onAddStudent={handleAddStudent} />
          </Card>
        )}

        {showEventForm && (
          <Card sx={{ mb: 4, p: 3, borderRadius: 3, backgroundColor: '#f7faff', boxShadow: 2 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Ajouter un nouvel événement
            </Typography>
            <AddEventForm onAddEvent={handleAddEvent} />
          </Card>
        )}

        {showAssignChildForm && (
          <Card sx={{ mb: 4, p: 3, borderRadius: 3, backgroundColor: '#f7faff', boxShadow: 2 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Assigner un enfant à un parent
            </Typography>
            <AddChildToParentForm />
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