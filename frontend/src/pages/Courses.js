// src/pages/Courses.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Courses.css';

const Courses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:5000/courses/all');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des cours');
        }
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        setError("Impossible de récupérer les cours. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="courses-container">
        <h2>Chargement des cours...</h2>
        <div className="loader"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="courses-container">
        <h2>Erreur</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="courses-container">
      <h2>Liste des Cours</h2>
      {courses.length === 0 ? (
        <p>Aucun cours disponible pour le moment.</p>
      ) : (
        <ul className="courses-list">
          {courses.map((course) => (
            <li
              key={course._id}
              className="course-item"
            >
              {/* Icône livre ou autre */}
              <div className="course-icon">📚</div>

              <div className="course-content">
                <div className="course-name">{course.name}</div>
                <div className="course-teacher">
                  Enseignant :{' '}
                  {course.teacher && typeof course.teacher === 'object'
                    ? course.teacher.name
                    : course.teacher || 'Non spécifié'}
                </div>
              </div>

              {/* Image prof si on a course.teacher.image */}
              {course.teacher && course.teacher.image && (
                <img
                  src={course.teacher.image}
                  alt={course.teacher.name}
                  className="course-teacher-image"
                  style={{ width: 50, height: 50, borderRadius: '50%', marginLeft: '1rem' }}
                />
              )}

              <button
                className="course-button"
                onClick={() => navigate(`/courses/${course._id}`)}
              >
                Plus d'infos
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Courses;
