const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// Route pour ajouter un événement
router.post('/add', async (req, res) => {
    try {
        const { day, time, description, image } = req.body;

        // Validation minimale
        if (!day || !time || !description) {
            return res.status(400).json({ message: 'Tous les champs sont requis.' });
        }

        const newEvent = new Event({
            day,
            time,
            description,
            image, // vous pouvez gérer l'upload d'image séparément
        });

        await newEvent.save();
        return res.status(201).json({ message: 'Événement ajouté avec succès.' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erreur serveur.' });
    }
});


// Route pour récupérer tous les événements
router.get('/', async (req, res) => {
    try {
        const events = await Event.find().sort({ day: 1, time: 1 });
        res.json(events);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
});

module.exports = router;
