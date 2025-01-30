const express = require('express');
const router = express.Router();
const Parent = require('../models/Parent');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'defaultSecret';

// Route pour la connexion des parents
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const parent = await Parent.findOne({ email });
        if (!parent) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect." });
        }

        const isPasswordValid = await bcrypt.compare(password, parent.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect." });
        }

        const token = jwt.sign({ id: parent._id, role: 'parent' }, JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({ token, role: 'parent' });
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
});

// Route pour récupérer les détails d'un parent
router.get('/details', async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({ message: 'Email manquant dans la requête.' });
        }

        const parent = await Parent.findOne({ email }).populate('children');
        if (!parent) {
            return res.status(404).json({ message: 'Parent introuvable.' });
        }

        res.status(200).json({ parent });
    } catch (error) {
        console.error('Erreur récupération parent :', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
});


router.get('/children-details', async (req, res) => {
    try {
        const { ids } = req.query;

        if (!ids) {
            return res.status(400).json({ message: 'IDs des enfants manquants.' });
        }

        const children = await Student.find({ _id: { $in: ids.split(',') } }).populate('class');
        res.status(200).json(children);
    } catch (error) {
        console.error('Erreur récupération des enfants :', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
});

module.exports = router;