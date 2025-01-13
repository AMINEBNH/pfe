import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/CourseDetails.css';

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true); // Indicateur de chargement
  const [error, setError] = useState(null); // Gestion des erreurs

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`http://localhost:5000/courses/${id}`);
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération du cours');
        }
        const data = await response.json();
        setCourse(data);
      } catch (error) {
        setError("Impossible de récupérer les détails du cours. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) {
    return (
      <div className="course-details-container">
        <h2>Chargement des détails...</h2>
        <div className="loader"></div> {/* Indicateur de chargement */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="course-details-container">
        <h2>Erreur</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="course-details-container">
      <h2>Détails du cours : {course.name}</h2>
      <div className="course-details-content">
        <p>
          <strong>Enseignant :</strong>{' '}
          {course.teacher && typeof course.teacher === 'object'
            ? course.teacher.name
            : course.teacher || 'Non spécifié'}
        </p>
        <p>
          <strong>Heures :</strong> {course.hours || 'Non spécifié'}
        </p>
        <p>
          <strong>Documents :</strong>{' '}
          {course.documents?.length > 0
            ? course.documents.join(', ')
            : 'Aucun document disponible'}
        </p>
      </div>
      <button
        className="back-button"
        onClick={() => window.history.back()} // Retour à la page précédente
      >
        Retour
      </button>
    </div>
  );
};

export default CourseDetails;
