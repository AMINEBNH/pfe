// routes/courses.js
const express = require('express');
const Course = require('../models/Course');
const router = express.Router();

// Ajouter un cours => POST /courses/add
router.post('/add', async (req, res) => {
  const { name, teacher, hours, documents } = req.body;
  try {
    const newCourse = new Course({ name, teacher, hours, documents });
    await newCourse.save();
    res.status(201).json({ message: 'Cours ajouté', course: newCourse });
  } catch (error) {
    res.status(500).json({ message: 'Erreur ajout cours', error });
  }
});

// Afficher tous les cours => GET /courses/all
router.get('/all', async (req, res) => {
  try {
    // populate teacher => name, subject, image
    const courses = await Course.find().populate('teacher', 'name subject image');
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Erreur récupération cours', error });
  }
});

// Détails d'un cours => GET /courses/:id
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('teacher', 'name subject image');
    if (!course) return res.status(404).json({ message: 'Cours introuvable' });
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Erreur récupération cours', error });
  }
});

module.exports = router;
