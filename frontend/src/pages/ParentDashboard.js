import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/AppSidebar';
import axios from 'axios';
import './ParentDashboard.css';

const ParentDashboard = () => {
    const [parentInfo, setParentInfo] = useState({ firstName: '', lastName: '', children: [] });
    const [childrenDetails, setChildrenDetails] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchParentData = async () => {
            try {
                const email = localStorage.getItem('email');
                if (!email) {
                    navigate('/login-parent');
                    return;
                }

                // Récupérer les informations du parent
                const parentResponse = await axios.get('http://localhost:5000/api/parents/details', {
                    params: { email },
                });

                if (parentResponse.data) {
                    const { parent } = parentResponse.data;
                    setParentInfo({
                        firstName: parent.firstName,
                        lastName: parent.lastName,
                        children: parent.children,
                    });

                    // Récupérer les détails des enfants si des enfants sont assignés
                    if (parent.children.length > 0) {
                        const childrenDetailsResponse = await axios.post('http://localhost:5000/api/students/details-by-ids', {
                            ids: parent.children,
                        });
                        setChildrenDetails(childrenDetailsResponse.data);
                    }
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des données :', error);
                setError('Impossible de récupérer les données. Veuillez réessayer plus tard.');
            }
        };

        fetchParentData();
    }, [navigate]);

    return (
        <div className="dashboard-container">
            <Sidebar role="parent" />

            <div className="dashboard-content">
                <div className="parent-header">
                    <h2 className="parent-name">
                        Bonjour, {parentInfo.firstName} {parentInfo.lastName}
                    </h2>
                </div>

                <h1>Tableau de bord Parent</h1>
                <p className="intro-text">
                    Bienvenue dans votre espace parent. Vous trouverez ici un aperçu des activités de vos enfants.
                </p>

                {error && <p className="error-message">{error}</p>}

                <div className="dashboard-sections">
                    {childrenDetails.length > 0 ? (
                        childrenDetails.map((child) => (
                            <div key={child._id} className="dashboard-card">
                                <h2>{child.firstName} {child.lastName}</h2>
                                <p><strong>Classe :</strong> {child.class?.name || 'N/A'}</p>
                                <p><strong>Enseignants :</strong> {child.class?.teachers?.map(t => t.name).join(', ') || 'N/A'}</p>
                                <p><strong>Planning :</strong></p>
                                <ul>
                                    {child.class?.schedule?.map((item, index) => (
                                        <li key={index}>
                                            <strong>{item.day} :</strong> {item.time} - {item.course || 'Cours inconnu'}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))
                    ) : (
                        <div className="dashboard-card">
                            <h2>Aucun enfant assigné</h2>
                            <p>Veuillez contacter l'administrateur pour assigner un enfant à votre compte.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ParentDashboard;