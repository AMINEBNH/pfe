const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'defaultSecret';

// Route d'inscription pour les étudiants et administrateurs
router.post('/signup/:role', async (req, res) => {
  const { email, password } = req.body;
  const { role } = req.params;

  try {
    // Vérification si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création de l'utilisateur selon le rôle
    const newUser = new User({
      email,
      password: hashedPassword,
      role, // Le rôle peut être 'admin', 'student', ou autre
    });

    await newUser.save();
    res.status(201).json({ message: 'Compte créé avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la création du compte:', error);
    res.status(500).json({ message: 'Erreur lors de la création du compte.', error });
  }
});

// Route de connexion pour différents rôles
router.post('/login/:role', async (req, res) => {
  const { role } = req.params;
  const { email, password } = req.body;

  try {
    console.log(`Tentative de connexion: ${email}, rôle: ${role}`);

    // Vérification de l'utilisateur et de son rôle
    const user = await User.findOne({ email, role });
    if (!user) {
      console.log(`Utilisateur non trouvé ou rôle incorrect: ${email}`);
      return res.status(401).json({ message: "L'utilisateur ou le rôle est incorrect." });
    }

    // Vérification du mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log(`Mot de passe incorrect pour ${email}`);
      return res.status(401).json({ message: 'Mot de passe incorrect.' });
    }

    // Génération du token JWT
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    console.log(`Connexion réussie pour: ${email}`);
    res.status(200).json({ token, role: user.role });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ message: 'Erreur lors de la connexion.', error });
  }
});

// Vérification du token JWT
router.get('/verify-token', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token manquant ou invalide.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.status(200).json({ valid: true, decoded });
  } catch (error) {
    console.error('Erreur lors de la vérification du token:', error);
    res.status(401).json({ message: 'Token invalide.', error });
  }
});

module.exports = router;
