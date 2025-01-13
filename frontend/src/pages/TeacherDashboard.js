import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/AppSidebar';
import {
  Container,
  Typography,
  Avatar,
  TextField,
  Button,
  Box,
  CircularProgress
} from '@mui/material';

const TeacherDashboard = () => {
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    email: localStorage.getItem('email') || '',
    password: '',
    image: ''
  });

  const fetchTeacher = async () => {
    const email = localStorage.getItem('email');
    console.log("Recherche de l'enseignant avec l'email:", email);
    if (!email) {
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get(`http://localhost:5000/api/teachers/by-email?email=${encodeURIComponent(email)}`);
      console.log("Enseignant récupéré :", response.data);
      setTeacher(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log("Aucun enseignant trouvé pour cet email.");
        setTeacher(null);
      } else {
        console.error("Erreur lors de la récupération de l'enseignant :", error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeacher();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateTeacher = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const response = await axios.post('http://localhost:5000/api/teachers/register', formData);
      setTeacher(response.data.teacher);
    } catch (error) {
      console.error("Erreur lors de la création de l'enseignant :", error);
      alert("Une erreur est survenue lors de la création de l'enseignant.");
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <Container style={{ textAlign: 'center', marginTop: '2rem' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <div className="d-flex">
      <Sidebar role="teacher" />
      <div className="content" style={{ padding: '2rem', flex: 1 }}>
        {!teacher ? (
          <Box component="form" onSubmit={handleCreateTeacher} sx={{ maxWidth: 400, mx: 'auto' }}>
            <Typography variant="h5" gutterBottom>
              Complétez vos informations
            </Typography>
            <TextField
              label="Nom"
              name="name"
              fullWidth
              margin="normal"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <TextField
              label="Matière"
              name="subject"
              fullWidth
              margin="normal"
              value={formData.subject}
              onChange={handleChange}
              required
            />
            <TextField
              label="Email"
              name="email"
              fullWidth
              margin="normal"
              value={formData.email}
              onChange={handleChange}
              disabled
            />
            <TextField
              label="Mot de passe"
              name="password"
              type="password"
              fullWidth
              margin="normal"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <TextField
              label="URL de l'image"
              name="image"
              fullWidth
              margin="normal"
              value={formData.image}
              onChange={handleChange}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={creating}
              sx={{ mt: 2 }}
            >
              {creating ? "Création en cours..." : "Créer mon profil"}
            </Button>
          </Box>
        ) : (
          <div>
            <Box display="flex" alignItems="center" mb={4}>
              <Avatar
                src={teacher.image || '/default-teacher.jpg'}
                alt={teacher.name}
                sx={{ width: 80, height: 80, mr: 2 }}
              />
              <Typography variant="h4">
                Bienvenue, {teacher.name}
              </Typography>
            </Box>
            <Typography variant="h6">Vos classes :</Typography>
            <ul>
              <li>Classe de Mathématiques</li>
              <li>Classe de Physique</li>
              {/* Ajoutez ici la liste des classes depuis vos données */}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;