import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CompleteParentProfile = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const email = localStorage.getItem('email');
            if (!email) {
                alert('Email non trouvé. Veuillez vous reconnecter.');
                return;
            }

            const response = await axios.post('http://localhost:5000/api/parents/register', {
                email,
                ...formData
            });

            alert('Profil complété avec succès ! Un administrateur doit maintenant valider votre compte.');
            navigate('/waiting-assignment');

        } catch (error) {
            console.error('Erreur lors de la soumission du profil :', error.response?.data || error);
            setError(error.response?.data?.message || 'Erreur lors de la soumission du profil.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Complétez votre profil parent</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required placeholder="Nom" />
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required placeholder="Prénom" />
            <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required placeholder="Numéro de téléphone" />
            <button type="submit">Soumettre</button>
        </form>
    );
};

export default CompleteParentProfile;
