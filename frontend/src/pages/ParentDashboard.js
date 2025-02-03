import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEdit } from 'react-icons/fa';
import './ParentDashboard.css';

const ParentDashboard = () => {
    const [parentInfo, setParentInfo] = useState({ firstName: '', lastName: '', email: '', phoneNumber: '' });
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

                const response = await axios.get('http://localhost:5000/api/parents/profile', { params: { email } });

                if (response.data) {
                    setParentInfo({
                        firstName: response.data.firstName || '',
                        lastName: response.data.lastName || '',
                        email: response.data.email || '',
                        phoneNumber: response.data.phoneNumber || '',
                    });
                }

                const dashboardResponse = await axios.get('http://localhost:5000/api/parents/dashboard', { params: { email } });

                if (dashboardResponse.data.student) {
                    setStudentInfo({
                        firstName: dashboardResponse.data.student.firstName || '',
                        lastName: dashboardResponse.data.student.lastName || '',
                        class: dashboardResponse.data.student.class || { name: '', price: 0, schedule: [] },
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
            const email = localStorage.getItem('email');
            const response = await axios.post('http://localhost:5000/api/payments/stripe', {
                email,
                amount: studentInfo.class.price,
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
        if (!schedule || !Array.isArray(schedule)) return 'Aucun planning disponible';
        return schedule.map((item, index) => (
            <div key={index} className="schedule-item">
                <p><strong>Jour :</strong> {item.day}</p>
                <p><strong>Heure :</strong> {item.time}</p>
                <p><strong>Cours :</strong> {item.course}</p>
            </div>
        ));
    };

    if (loading) {
        return <div className="loading">Chargement en cours...</div>;
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-content">
                <div className="profile-header">
                    <h2>Bonjour, {parentInfo.firstName} {parentInfo.lastName}</h2>
                    <button className="edit-profile-button" onClick={handleEditProfile}>
                        <FaEdit /> Modifier le profil
                    </button>
                </div>

                {error && <p className="error-message">{error}</p>}

                <div className="card profile-info">
                    <h3>Informations du Profil</h3>
                    <p><strong>Email :</strong> {parentInfo.email}</p>
                    <p><strong>Téléphone :</strong> {parentInfo.phoneNumber}</p>
                </div>

                {studentInfo ? (
                    <div className="card student-info">
                        <h3>Informations de l'Étudiant</h3>
                        <p><strong>Nom :</strong> {studentInfo.firstName} {studentInfo.lastName}</p>
                        <p><strong>Classe :</strong> {studentInfo.class.name}</p>
                        <p><strong>Prix :</strong> ${studentInfo.class.price}</p>

                        <h4>Planning des Cours</h4>
                        <div className="schedule-container">{formatSchedule(studentInfo.class.schedule)}</div>

                        <button className="action-button" onClick={handlePaymentClick}>
                            Payer Maintenant
                        </button>
                    </div>
                ) : (
                    <div className="no-student-assigned card">
                        <h3>Aucun Enfant Assigné</h3>
                        <p>Veuillez contacter l'administration pour l'assignation d'un enfant.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ParentDashboard;
