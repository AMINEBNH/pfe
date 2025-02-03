import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EditParentProfile = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchParentData = async () => {
            try {
                const email = localStorage.getItem('email');
                const response = await axios.get('http://localhost:5000/api/parents/profile', {
                    params: { email },
                });

                console.log('Réponse de l\'API (EditParentProfile) :', response.data); // Debugging

                if (response.data) {
                    setFormData({
                        firstName: response.data.firstName || '',
                        lastName: response.data.lastName || '',
                        phoneNumber: response.data.phoneNumber || '',
                    });
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des données :', error);
                setError('Impossible de récupérer les données. Veuillez réessayer plus tard.');
            }
        };

        fetchParentData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const email = localStorage.getItem('email');
            await axios.put('http://localhost:5000/api/parents/update', {
                email,
                ...formData,
            });

            alert('Profil mis à jour avec succès !');
            navigate('/parent-dashboard');
        } catch (error) {
            console.error('Erreur lors de la mise à jour du profil :', error);
            setError('Erreur lors de la mise à jour du profil. Veuillez réessayer.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Modifier le profil</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div>
                <label>Prénom</label>
                <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Nom</label>
                <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Numéro de téléphone</label>
                <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit">Enregistrer les modifications</button>
        </form>
    );
};

export default EditParentProfile;