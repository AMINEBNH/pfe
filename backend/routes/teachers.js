/***************************************
 * routes/teachers.js
 ***************************************/
const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher');

// -----------------
// 1) Créer un prof
// POST /api/teachers/register
// -----------------
router.post('/register', async (req, res) => {
  try {
    const { name, subject, email, password } = req.body;
    // Vérifier si l'email existe déjà
    const existing = await Teacher.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email déjà utilisé.' });
    }

    const newTeacher = new Teacher({ name, subject, email, password });
    await newTeacher.save();

    res
      .status(201)
      .json({ message: 'Prof créé avec succès', teacher: newTeacher });
  } catch (error) {
    res.status(500).json({ message: 'Erreur création prof', error });
  }
});

// -----------------
// 2) Login prof
// POST /api/teachers/login
// -----------------
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(404).json({ message: 'Enseignant introuvable' });
    }
    if (teacher.password !== password) {
      return res.status(401).json({ message: 'Mot de passe invalide' });
    }
    res
      .status(200)
      .json({ message: 'Connexion réussie', teacher });
  } catch (error) {
    res.status(500).json({ message: 'Erreur login prof', error });
  }
});

// -----------------
// 3) Liste tous les profs
// GET /api/teachers
// -----------------
router.get('/', async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.status(200).json(teachers);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Erreur récupération teachers', error });
  }
});

// -----------------
// 4) Mettre à jour un enseignant
// PUT /api/teachers/:id
// -----------------
router.put('/:id', async (req, res) => {
  try {
    const teacherId = req.params.id;
    // Récupération des champs du body, dont "image"
    const { name, subject, email, password, image } = req.body;

    // Mise à jour
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      teacherId,
      { name, subject, email, password, image }, // On inclut "image"
      { new: true }
    );

    if (!updatedTeacher) {
      return res.status(404).json({ message: 'Enseignant introuvable' });
    }

    res.status(200).json({
      message: 'Enseignant mis à jour avec succès',
      teacher: updatedTeacher,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Erreur lors de la mise à jour', error });
  }
});

/* 
  (Optionnel) Route “fictive” si vous voulez définir la même image
  pour TOUS les profs existants, style "alter table".
*/
router.put('/add-image-to-all', async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ message: 'Veuillez fournir "image" dans le body' });
    }
    const result = await Teacher.updateMany({}, { $set: { image } });
    res.status(200).json({
      message: `Champ 'image' mis à jour pour tous les enseignants avec '${image}'`,
      result,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur updateMany teachers', error });
  }
});

// Récupérer un enseignant par email
router.get('/by-email', async (req, res) => {
  const { email } = req.query;
  try {
    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(404).json({ message: 'Enseignant non trouvé' });
    }
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
});




module.exports = router;
