import React, { useState } from 'react';
import '../styles/Header.css'

const LoginForm = ({ role, onSubmit }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="form-group">
      <h3>Connexion {role}</h3>
      <div className="mb-3">
        <label>Email :</label>
        <input
          type="email"
          className="form-control"
          placeholder="Entrez votre email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label>Mot de passe :</label>
        <input
          type="password"
          className="form-control"
          placeholder="Entrez votre mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary w-100">
        Se connecter
      </button>
    </form>
  );
};

export default LoginForm;
