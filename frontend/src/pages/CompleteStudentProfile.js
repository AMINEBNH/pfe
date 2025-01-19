import React, { useState } from 'react';
import axios from 'axios';

const CompleteStudentProfile = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        photo: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const email = localStorage.getItem('email'); // Récupère l'email stocké
            if (!email) {
                alert('Email non trouvé. Veuillez vous reconnecter.');
                return;
            }

            const response = await axios.post('http://localhost:5000/api/students/register', {
                email,
                ...formData,
            });

            alert('Profil complété avec succès !');
            console.log(response.data);
            window.location.href = '/student-dashboard'; // Redirection
        } catch (error) {
            console.error('Erreur lors de la soumission du profil :', error);
            alert('Erreur lors de la soumission du profil. Veuillez réessayer.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Complétez votre profil étudiant</h2>
            <div>
                <label>Nom :</label>
                <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Prénom :</label>
                <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Date de naissance :</label>
                <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Photo (URL) :</label>
                <input
                    type="text"
                    name="photo"
                    value={formData.photo}
                    onChange={handleChange}
                />
            </div>
            <button type="submit">Soumettre</button>
        </form>
    );
};

export default CompleteStudentProfile;
