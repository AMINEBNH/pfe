// routes/class.js
const express = require('express');
const Class = require('../models/Class');
const router = express.Router();

// Ajouter une classe
router.post('/', async (req, res) => {
  try {
    const newClass = new Class(req.body);
    const savedClass = await newClass.save();
    res.status(201).json(savedClass);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de l\'ajout de la classe', error });
  }
});

// Récupérer toutes les classes
router.get('/', async (req, res) => {
  try {
    const classes = await Class.find().populate('students');
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des classes', error });
  }
});

// Mettre à jour une classe
router.put('/:id', async (req, res) => {
  try {
    const updatedClass = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedClass);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la mise à jour de la classe', error });
  }
});

// Supprimer une classe
router.delete('/:id', async (req, res) => {
  try {
    await Class.findByIdAndDelete(req.params.id);
    res.json({ message: 'Classe supprimée avec succès' });
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la suppression de la classe', error });
  }
});

module.exports = router;
