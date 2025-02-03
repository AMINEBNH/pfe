import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrorMessage('');
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
        switch (formData.role) {
          case 'admin': navigate('/login-admin'); break;
          case 'student': navigate('/login-student'); break;
          case 'teacher': navigate('/login-teacher'); break;
          case 'parent': navigate('/login-parent'); break;
          default: navigate('/');
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
      <div style={styles.imageContainer}>
        <img src="/images/cartoon.webp" alt="Inscription" style={styles.image} />
      </div>

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
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #6a11cb, #2575fc)',
    padding: '20px',
    flexWrap: 'wrap'
  },
  imageContainer: {
    flex: '1',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px'
  },
  image: {
    width: '90%',
    maxWidth: '400px',
    borderRadius: '20px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
  },
  form: {
    width: '100%',
    maxWidth: '400px',
    padding: '30px',
    borderRadius: '12px',
    background: '#fff',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
    animation: 'fadeIn 1s ease-in-out'
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#2575fc',
    fontWeight: 'bold',
    fontSize: '24px'
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
    fontWeight: 'bold',
    color: '#333'
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
    transition: 'border 0.3s ease',
    outline: 'none',
    fontSize: '14px'
  },
  select: {
    width: '100%',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    background: '#fff',
    boxSizing: 'border-box'
  },
  button: {
    width: '100%',
    padding: '12px',
    borderRadius: '6px',
    border: 'none',
    background: '#2575fc',
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background 0.3s ease'
  }
};

// Animation simple pour le formulaire
document.styleSheets[0].insertRule(`
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`, 0);

export default Signup;
