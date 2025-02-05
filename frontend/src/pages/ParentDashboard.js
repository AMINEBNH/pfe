import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEdit } from 'react-icons/fa';
import './ParentDashboard.css';

const ParentDashboard = () => {
    const [parentInfo, setParentInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: ''
    });
    const [studentInfo, setStudentInfo] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchParentData = async () => {
            setLoading(true);
            try {
                const email = localStorage.getItem('email');
                if (!email) {
                    navigate('/login-parent');
                    return;
                }

                // Récupération des informations du parent
                const parentResponse = await axios.get('http://localhost:5000/api/parents/profile', {
                    params: { email }
                });
                setParentInfo({
                    firstName: parentResponse.data.firstName || '',
                    lastName: parentResponse.data.lastName || '',
                    email: parentResponse.data.email || '',
                    phoneNumber: parentResponse.data.phoneNumber || '',
                });

                // Récupération des informations de l'étudiant
                const studentResponse = await axios.get('http://localhost:5000/api/parents/dashboard', {
                    params: { email }
                });

                if (studentResponse.data.student) {
                    setStudentInfo({
                        firstName: studentResponse.data.student.firstName,
                        lastName: studentResponse.data.student.lastName,
                        class: studentResponse.data.student.class || null
                    });
                }

            } catch (error) {
                console.error('Erreur lors de la récupération des données :', error);
                setError('Impossible de récupérer les données. Veuillez réessayer plus tard.');
            } finally {
                setLoading(false);
            }
        };

        fetchParentData();
    }, [navigate]);

    const handleEditProfile = () => {
        navigate('/edit-parent-profile');
    };

    const handlePaymentClick = async () => {
        setError('');
        try {
            const response = await axios.post('http://localhost:5000/api/payments/stripe', {
                email: parentInfo.email,
                amount: studentInfo.class?.price
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

    const formatSchedule = (schedule) => {
        if (!schedule || !Array.isArray(schedule)) return null;

        return schedule.map((item, index) => (
            <div key={index} className="schedule-item">
                <p><strong>Jour :</strong> {item.day}</p>
                <p><strong>Heure :</strong> {item.time}</p>
                <p><strong>Cours :</strong> {item.course}</p>
            </div>
        ));
    };

    if (loading) {
        return (
            <div className="dashboard-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Chargement en cours...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-content">
                {/* En-tête du profil */}
                <div className="profile-header">
                    <h2>Bonjour, {parentInfo.firstName} {parentInfo.lastName}</h2>
                    <button
                        className="edit-profile-button"
                        onClick={handleEditProfile}
                    >
                        <FaEdit className="edit-icon" />
                        Modifier le profil
                    </button>
                </div>

                {/* Message d'erreur */}
                {error && <div className="error-message">{error}</div>}

                {/* Carte d'information du parent */}
                <div className="info-card">
                    <h3>Informations du parent</h3>
                    <div className="info-grid">
                        <div className="info-item">
                            <label>Email :</label>
                            <p>{parentInfo.email}</p>
                        </div>
                        <div className="info-item">
                            <label>Téléphone :</label>
                            <p>{parentInfo.phoneNumber || 'Non renseigné'}</p>
                        </div>
                    </div>
                </div>

                {/* Section étudiant */}
                {studentInfo ? (
                    <div className="info-card">
                        <h3>Informations de l'étudiant</h3>
                        <div className="student-details">
                            <div className="info-item">
                                <label>Nom complet :</label>
                                <p>{studentInfo.firstName} {studentInfo.lastName}</p>
                            </div>

                            {studentInfo.class ? (
                                <>
                                    <div className="info-item">
                                        <label>Classe :</label>
                                        <p>{studentInfo.class.name}</p>
                                    </div>
                                    <div className="info-item">
                                        <label>Frais scolaires :</label>
                                        <p>${studentInfo.class.price}</p>
                                    </div>

                                    <div className="schedule-section">
                                        <h4>Emploi du temps</h4>
                                        {studentInfo.class.schedule?.length > 0 ? (
                                            <div className="schedule-grid">
                                                {formatSchedule(studentInfo.class.schedule)}
                                            </div>
                                        ) : (
                                            <div className="no-schedule">
                                                Aucun emploi du temps disponible
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        className="payment-button"
                                        onClick={handlePaymentClick}
                                    >
                                        Payer les frais scolaires
                                    </button>
                                </>
                            ) : (
                                <div className="no-class-assigned">
                                    <h4>Aucune classe assignée</h4>
                                    <p>
                                        Votre enfant n'est actuellement assigné à aucune classe.<br />
                                        Veuillez contacter l'administration scolaire.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="no-student-assigned">
                        <h3>Aucun enfant assigné</h3>
                        <p>
                            Vous n'avez actuellement aucun enfant associé à votre compte.<br />
                            Veuillez contacter l'administration pour effectuer une assignation.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ParentDashboard;