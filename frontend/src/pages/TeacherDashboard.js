import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Avatar,
  Card,
  CardContent,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Button,
  Input,
  CircularProgress,
  Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

const TeacherDashboard = () => {
  const [teacher, setTeacher] = useState(null);
  const [classes, setClasses] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState({}); // Gestion des fichiers par cours
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  // Fonction pour récupérer les données de l'enseignant et ses classes
  const fetchData = async () => {
    const email = localStorage.getItem('email');
    if (!email) return;

    try {
      // Récupération des infos de l'enseignant
      const teacherRes = await axios.get(`http://localhost:5000/api/teachers/by-email?email=${email}`);
      setTeacher(teacherRes.data);

      // Récupération des classes associées
      const classesRes = await axios.get(`http://localhost:5000/api/classes/teacher/${teacherRes.data._id}`);
      setClasses(classesRes.data);
    } catch (error) {
      console.error('Erreur de récupération des données:', error);
      setError('Erreur lors de la récupération des données. Veuillez réessayer.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Gestion du changement de fichier pour chaque cours
  const handleFileChange = (courseId, file) => {
    setSelectedFiles((prev) => ({
      ...prev,
      [courseId]: file,
    }));
  };

  // Gestion du téléchargement de fichier
  const handleFileUpload = async (courseId) => {
    const file = selectedFiles[courseId];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('document', file);

      const response = await axios.post(
        `http://localhost:5000/api/courses/${courseId}/documents`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Mettre à jour l'état local avec le nouveau document
      setClasses((prev) =>
        prev.map((cls) => {
          if (cls.courses.some((c) => c._id === courseId)) {
            return {
              ...cls,
              courses: cls.courses.map((course) => {
                if (course._id === courseId) {
                  return {
                    ...course,
                    documents: [...(course.documents || []), response.data.document],
                  };
                }
                return course;
              }),
            };
          }
          return cls;
        })
      );

      // Réinitialiser le fichier sélectionné pour ce cours
      setSelectedFiles((prev) => ({
        ...prev,
        [courseId]: null,
      }));
    } catch (error) {
      console.error('Erreur de téléchargement:', error);
      setError('Erreur lors du téléchargement du fichier. Veuillez réessayer.');
    } finally {
      setUploading(false);
    }
  };

  if (!teacher) {
    return (
      <Container style={{ textAlign: 'center', marginTop: '2rem' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar existante */}

      <div style={{ flex: 1, padding: '2rem', backgroundColor: '#f5f5f5' }}>
        {/* En-tête avec les informations de l'enseignant */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
          <Avatar src={teacher.image} sx={{ width: 80, height: 80, mr: 2 }} />
          <div>
            <Typography variant="h4">{teacher.name}</Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {teacher.subject}
            </Typography>
          </div>
        </div>

        {/* Liste des classes */}
        <Typography variant="h5" gutterBottom>
          Mes Classes
        </Typography>

        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {classes.map((cls) => (
            <Card key={cls._id} sx={{ borderRadius: '10px', boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {cls.name} - {cls.level}
                </Typography>

                {/* Liste des élèves */}
                <div style={{ marginBottom: '1rem' }}>
                  <Typography variant="body2" color="textSecondary">
                    Élèves inscrits:
                  </Typography>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {cls.students.map((student) => (
                      <Chip
                        key={student._id}
                        label={`${student.firstName} ${student.lastName}`}
                        size="small"
                      />
                    ))}
                  </div>
                </div>

                {/* Liste des cours */}
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Cours dispensés:
                </Typography>

                {cls.courses.map((course) => (
                  <Accordion key={course._id} sx={{ mb: 1 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>{course.name}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" paragraph>
                        {course.description}
                      </Typography>

                      {/* Liste des documents */}
                      {(course.documents || []).length > 0 ? (
                        (course.documents || []).map((document, index) => (
                          <Box key={index} sx={{ mb: 2 }}>
                            <a href={document.url} target="_blank" rel="noopener noreferrer">
                              {document.name}
                            </a>
                            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                              Téléchargé le {new Date(document.uploadedAt).toLocaleDateString()}
                            </Typography>
                          </Box>
                        ))
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          Aucun document disponible pour ce cours.
                        </Typography>
                      )}

                      {/* Formulaire de téléchargement de fichier */}
                      <div style={{ marginTop: '1rem' }}>
                        <Input
                          type="file"
                          onChange={(e) => handleFileChange(course._id, e.target.files[0])}
                          sx={{ display: 'none' }}
                          id={`file-upload-${course._id}`}
                        />
                        <label htmlFor={`file-upload-${course._id}`}>
                          <Button
                            variant="outlined"
                            component="span"
                            startIcon={<InsertDriveFileIcon />}
                          >
                            Choisir un fichier
                          </Button>
                        </label>

                        {selectedFiles[course._id] && (
                          <div style={{ marginTop: '1rem' }}>
                            <Typography variant="body2">
                              Fichier sélectionné: {selectedFiles[course._id].name}
                            </Typography>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleFileUpload(course._id)}
                              disabled={uploading}
                              sx={{ mt: 1 }}
                            >
                              {uploading ? 'Téléchargement...' : 'Envoyer le fichier'}
                            </Button>
                          </div>
                        )}
                      </div>
                    </AccordionDetails>
                  </Accordion>
                ))}

                {/* Emploi du temps */}
                <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                  Emploi du temps:
                </Typography>
                <List dense>
                  {cls.schedule.map((sched, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={`${sched.day} - ${sched.time}`}
                        secondary={sched.course}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Affichage des erreurs */}
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;