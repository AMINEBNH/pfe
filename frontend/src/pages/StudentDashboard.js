import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/AppSidebar';
import axios from 'axios';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const [studentInfo, setStudentInfo] = useState({ firstName: '', lastName: '', photo: '' });
  const [price, setPrice] = useState(0); // Attribut `price` de la classe
  const [transactions, setTransactions] = useState([]);
  const [schedule, setSchedule] = useState([]); // Planning de la classe
  const [classDetails, setClassDetails] = useState({}); // Détails de la classe
  const [events, setEvents] = useState([]);
  const [showFullSchedule, setShowFullSchedule] = useState(false); // Basculer entre jour/semaine
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const email = localStorage.getItem('email');
        if (!email) {
          navigate('/login-student');
          return;
        }

        // Appel à l'API pour récupérer les détails de l'étudiant et de sa classe
        const studentResponse = await axios.get('http://localhost:5000/api/students/details', {
          params: { email },
        });

        if (studentResponse.data) {
          const { student } = studentResponse.data;

          // Mise à jour des états
          setStudentInfo({
            firstName: student.firstName,
            lastName: student.lastName,
            photo: student.photo,
          });

          if (student.class) {
            setClassDetails(student.class); // Met à jour les détails de la classe
            setPrice(student.class.price || 0); // Met à jour le prix de la classe
            setSchedule(student.class.schedule || []); // Met à jour le planning
          }
        }

        const transactionsResponse = await axios.get('http://localhost:5000/api/payments/by-student', {
          params: { email },
        });
        setTransactions(transactionsResponse.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
        setError('Impossible de récupérer les données. Veuillez réessayer plus tard.');
      }
    };

    fetchStudentData();
  }, [navigate]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/events');
        setEvents(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des événements :', error);
        setError('Impossible de récupérer les événements.');
      }
    };

    fetchEvents();
  }, []);

  const handlePaymentClick = async () => {
    try {
      const email = localStorage.getItem('email');
      const response = await axios.post('http://localhost:5000/api/payments/stripe', {
        email,
        amount: price,
      });

      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        setError('Impossible de rediriger vers Stripe.');
      }
    } catch (error) {
      console.error('Erreur lors de la création du paiement :', error);
      setError('Erreur lors de la création du paiement. Veuillez réessayer.');
    }
  };

  const filteredSchedule = showFullSchedule
    ? schedule // Planning complet
    : schedule.filter(
      (item) =>
        item.day === new Date().toLocaleDateString('fr-FR', { weekday: 'long' }) // Planning du jour
    );

  return (
    <div className="dashboard-container">
      <Sidebar role="student" />

      <div className="dashboard-content">
        {/* Section photo et nom */}
        <div className="student-header">
          <img
            src={studentInfo.photo || '/default-avatar.png'}
            alt={`${studentInfo.firstName} ${studentInfo.lastName}`}
            className="student-photo"
          />
          <h2 className="student-name">
            Bonjour, {studentInfo.firstName} {studentInfo.lastName}
          </h2>
        </div>

        <h1>Tableau de bord Étudiant</h1>
        <p className="intro-text">
          Bienvenue dans votre espace étudiant. Vous trouverez ici un aperçu de vos cours, le prix de votre classe,
          vos messages récents, ainsi qu’un planning de la journée et quelques événements à venir.
        </p>

        {error && <p className="error-message">{error}</p>}

        <div className="dashboard-sections">
          {/* SECTION PRIX DE LA CLASSE */}
          <div className="dashboard-card balance-card">
            <h2>Solde du</h2>
            <p className="balance-amount">${price.toFixed(2)}</p>
            <button className="action-button" onClick={handlePaymentClick}>
              Payer Maintenant
            </button>
          </div>

          {/* SECTION TRANSACTIONS */}
          <div className="dashboard-card transactions-card">
            <h2>Historique des Transactions</h2>
            {transactions.length > 0 ? (
              <ul className="transactions-list">
                {transactions.map((transaction) => (
                  <li key={transaction._id}>
                    {new Date(transaction.date).toLocaleDateString()} - ${transaction.amount} -{' '}
                    {transaction.status}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Aucune transaction pour le moment.</p>
            )}
          </div>

          {/* SECTION CLASSE */}
          <div className="dashboard-card class-card">
            <h2>Ma Classe</h2>
            <p>
              <strong>Nom :</strong> {classDetails.name || 'N/A'} <br />
              <strong>Niveau :</strong> {classDetails.level || 'N/A'}
            </p>

            {/* Enseignants */}
            <h3>Enseignants</h3>
            <ul>
              {classDetails.teachers && classDetails.teachers.length > 0 ? (
                classDetails.teachers.map((teacher) => (
                  <li key={teacher._id}>{teacher.name}</li>
                ))
              ) : (
                <li>Aucun enseignant disponible</li>
              )}
            </ul>

            {/* Camarades */}
            <h3>Camarades</h3>
            <ul>
              {classDetails.students && classDetails.students.length > 0 ? (
                classDetails.students.map((student) => (
                  <li key={student._id}>
                    {student.firstName} {student.lastName}
                  </li>
                ))
              ) : (
                <li>Aucun camarade disponible</li>
              )}
            </ul>
          </div>

          {/* SECTION PLANNING */}
          <div className="dashboard-card planning-card">
            <h2>{showFullSchedule ? 'Planning de la semaine' : 'Planning du jour'}</h2>
            <ul className="planning-list">
              {filteredSchedule.length > 0 ? (
                filteredSchedule.map((item, index) => (
                  <li key={index}>
                    <strong>{item.day} :</strong> {item.time} - {item.course || 'Cours inconnu'}
                  </li>
                ))
              ) : (
                <p>Aucun cours disponible.</p>
              )}
            </ul>
            <button
              className="action-button secondary"
              onClick={() => setShowFullSchedule(!showFullSchedule)}
            >
              {showFullSchedule ? 'Voir le planning du jour' : 'Voir le planning complet'}
            </button>
          </div>

          {/* SECTION ÉVÉNEMENTS */}
          <div className="dashboard-card events-card">
            <h2>Événements à venir</h2>
            <ul className="events-list">
              {events.length > 0 ? (
                events.map((evt) => {
                  const eventDate = new Date(evt.day);
                  return (
                    <li key={evt._id}>
                      <strong>
                        {eventDate.toLocaleDateString()} à {evt.time} :
                      </strong>{' '}
                      {evt.description}
                    </li>
                  );
                })
              ) : (
                <li>Aucun événement pour le moment.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
