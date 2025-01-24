const express = require('express');
const Class = require('../models/Class');
const router = express.Router();

// Ajouter une classe
router.post('/', async (req, res) => {
  try {
    const { name, level, price, teachers, students, courses, schedule } = req.body;

    if (!name || !level || price === undefined) {
      return res.status(400).json({ message: 'Nom, niveau et prix sont obligatoires' });
    }

    const newClass = new Class({
      name,
      level,
      price,
      teachers,
      students,
      courses,
      schedule,
    });

    const savedClass = await newClass.save();
    res.status(201).json(savedClass);
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la classe :', error);
    res.status(400).json({ message: 'Erreur lors de l\'ajout de la classe', error });
  }
});

// Récupérer toutes les classes
router.get('/', async (req, res) => {
  try {
    const classes = await Class.find()
      .populate('students', 'firstName lastName')
      .populate('teachers', 'name')
      .populate('courses', 'name');
    res.status(200).json(classes);
  } catch (error) {
    console.error('Erreur lors de la récupération des classes :', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des classes', error });
  }
});

// Mettre à jour une classe
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'ID de classe invalide' });
    }

    const updatedClass = await Class.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedClass) {
      return res.status(404).json({ message: 'Classe introuvable' });
    }

    res.status(200).json(updatedClass);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la classe :', error);
    res.status(400).json({ message: 'Erreur lors de la mise à jour de la classe', error });
  }
});

// Supprimer une classe
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'ID de classe invalide' });
    }

    const deletedClass = await Class.findByIdAndDelete(id);

    if (!deletedClass) {
      return res.status(404).json({ message: 'Classe introuvable' });
    }

    res.status(200).json({ message: 'Classe supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la classe :', error);
    res.status(400).json({ message: 'Erreur lors de la suppression de la classe', error });
  }
});

module.exports = router;
