import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/AppSidebar';
import axios from 'axios';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const [studentInfo, setStudentInfo] = useState({ firstName: '', lastName: '', photo: '' });
  const [solde, setSolde] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [planning, setPlanning] = useState([
    { time: '9h00', title: 'Cours de Mathématiques' },
    { time: '11h00', title: 'TP de Physique' },
    { time: '14h00', title: 'Cours d’Informatique' },
  ]);

  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const email = localStorage.getItem('email');
        if (!email) {
          navigate('/login-student');
          return;
        }

        // Récupérer les informations de l'étudiant
        const studentResponse = await axios.get('http://localhost:5000/api/students/details', {
          params: { email },
        });

        if (studentResponse.data && studentResponse.data.student) {
          const { firstName, lastName, photo } = studentResponse.data.student;
          setStudentInfo({ firstName, lastName, photo });
        }

        // Récupérer le solde
        const soldeResponse = await axios.get('http://localhost:5000/api/students/solde', {
          params: { email },
        });
        setSolde(soldeResponse.data.solde);

        // Récupérer les transactions
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

  const handlePaymentClick = async () => {
    try {
      const email = localStorage.getItem('email');
      const response = await axios.post('http://localhost:5000/api/payments/stripe', {
        email,
        amount: solde,
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
          Bienvenue dans votre espace étudiant. Vous trouverez ici un aperçu de vos cours, votre solde,
          vos messages récents, ainsi qu’un planning de la journée et quelques événements à venir.
        </p>

        {error && <p className="error-message">{error}</p>}

        <div className="dashboard-sections">
          {/* SECTION SOLDE */}
          <div className="dashboard-card balance-card">
            <h2>Votre Solde</h2>
            <p className="balance-amount">${solde.toFixed(2)}</p>
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

          {/* SECTION COURS */}
          <div className="dashboard-card courses-card">
            <h2>Vos Cours</h2>
            <ul className="courses-list">
              <li>Mathématiques</li>
              <li>Sciences</li>
              <li>Histoire</li>
              <li>Informatique</li>
            </ul>
            <button className="action-button secondary" onClick={() => navigate('/courses')}>
              Voir tous les cours
            </button>
          </div>

          {/* SECTION MESSAGES */}
          <div className="dashboard-card messages-card">
            <h2>Messages</h2>
            <div className="messages-list">
              <p>
                <strong>Prof. Dupont :</strong> Rendez-vous demain à 10h.
              </p>
              <p>
                <strong>Administration :</strong> N'oubliez pas de payer vos frais avant le 15.
              </p>
              <p>
                <strong>Prof. Martin :</strong> Nouveaux exercices ajoutés sur la plateforme.
              </p>
            </div>
            <button className="action-button info" onClick={() => navigate('/messages')}>
              Voir tous les messages
            </button>
          </div>

          {/* SECTION PLANNING */}
          <div className="dashboard-card planning-card">
            <h2>Planning du jour</h2>
            <ul className="planning-list">
              {planning.map((item, index) => (
                <li key={index}>
                  <strong>{item.time} :</strong> {item.title}
                </li>
              ))}
            </ul>
            <button
              className="action-button secondary"
              onClick={() => alert('Planning complet à venir...')}
            >
              Voir le planning complet
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
