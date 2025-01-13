import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'  // Valeur par défaut
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); // Indicateur de chargement
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrorMessage(''); // Effacer l'erreur lors d'un changement de champ
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`http://localhost:5000/api/auth/signup/${formData.role}`, {
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 201) {
        // Redirection selon le rôle
        switch (formData.role) {
          case 'admin':
            navigate('/login-admin');
            break;
          case 'student':
            navigate('/login-student');
            break;
          case 'teacher':
            navigate('/login-teacher');
            break;
          case 'parent':
            navigate('/login-parent');
            break;
          default:
            navigate('/');
        }
      }
    } catch (error) {
      const message = error.response?.data?.message
        || "Une erreur s'est produite lors de la création du compte.";
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h3 style={styles.title}>Créer un compte</h3>

        {errorMessage && <div style={styles.error}>{errorMessage}</div>}

        <div style={styles.formGroup}>
          <label style={styles.label}>Email :</label>
          <input
            type="email"
            name="email"
            style={styles.input}
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Mot de passe :</label>
          <input
            type="password"
            name="password"
            style={styles.input}
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Confirmer le mot de passe :</label>
          <input
            type="password"
            name="confirmPassword"
            style={styles.input}
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Choisir un rôle :</label>
          <select
            name="role"
            style={styles.select}
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="student">Étudiant</option>
            <option value="teacher">Enseignant</option>
            <option value="parent">Parent</option>
            <option value="admin">Administrateur</option>
          </select>
        </div>

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Inscription en cours..." : "S'inscrire"}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: '#f5f5f5'
  },
  form: {
    width: '100%',
    maxWidth: '400px',
    padding: '20px',
    borderRadius: '8px',
    background: '#fff',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px'
  },
  error: {
    marginBottom: '15px',
    padding: '10px',
    borderRadius: '4px',
    backgroundColor: '#f8d7da',
    color: '#842029',
    textAlign: 'center'
  },
  formGroup: {
    marginBottom: '15px'
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold'
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    boxSizing: 'border-box'
  },
  select: {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    boxSizing: 'border-box'
  },
  button: {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: 'none',
    background: '#007bff',
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer'
  }
};

export default Signup;
