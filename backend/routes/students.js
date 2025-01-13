/***************************************
 * routes/students.js
 ***************************************/
const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Class = require('../models/Class'); // Ajout de la dépendance au modèle Class

// 1) POST /api/students/register => Ajouter un étudiant
router.post('/register', async (req, res) => {
  try {
    const {
      email,
      firstName,
      lastName,
      dateOfBirth,
      class: studentClass,  // Référence à la classe
      courses,
      photo,
      // password, // si vous gérez un password
    } = req.body;

    // Vérification email unique
    const existing = await Student.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email déjà utilisé pour un étudiant.' });
    }

    const newStudent = new Student({
      email,
      firstName,
      lastName,
      dateOfBirth,
      class: studentClass,
      courses,
      photo,
      // password
    });

    const savedStudent = await newStudent.save();

    // Mettre à jour la classe en ajoutant cet étudiant à sa liste
    if (studentClass) {
      const classe = await Class.findById(studentClass);
      if (classe) {
        classe.students.push(savedStudent._id);
        await classe.save();
      }
    }

    res.status(201).json({
      message: 'Étudiant créé avec succès',
      student: savedStudent,
    });
  } catch (error) {
    console.error('Erreur création étudiant :', error);
    res.status(500).json({
      message: 'Erreur création étudiant',
      error: error.message,
    });
  }
});

// 2) GET /api/students => Récupérer tous les étudiants
router.get('/', async (req, res) => {
  try {
    const students = await Student.find();
    // Si vous voulez .populate('class') ou .populate('courses') :
    // const students = await Student.find().populate('class').populate('courses');

    // Formatage optionnel
    const formattedStudents = students.map((student) => ({
      _id: student._id,
      email: student.email,
      fullName: `${student.firstName} ${student.lastName}`,
      dateOfBirth: student.dateOfBirth,
      class: student.class,
      courses: student.courses,
      photo: student.photo,
    }));
    res.status(200).json(formattedStudents);
  } catch (error) {
    console.error('Erreur récupération étudiants :', error);
    res
      .status(500)
      .json({ message: 'Erreur récupération étudiants', error: error.message });
  }
});

// 3) PUT /api/students/:id => Mettre à jour un étudiant
router.put('/:id', async (req, res) => {
  try {
    const studentId = req.params.id;
    const {
      email,
      firstName,
      lastName,
      dateOfBirth,
      class: studentClass,
      courses,
      photo,
    } = req.body;

    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      {
        email,
        firstName,
        lastName,
        dateOfBirth,
        class: studentClass,
        courses,
        photo,
      },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: 'Étudiant introuvable' });
    }

    res.status(200).json({
      message: 'Étudiant mis à jour avec succès',
      student: updatedStudent,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'étudiant :", error);
    res
      .status(500)
      .json({ message: 'Erreur mise à jour étudiant', error: error.message });
  }
});

module.exports = router;
