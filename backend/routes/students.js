const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const User = require('../models/User'); // Import du modèle User




// PUT /api/students/:id => Mettre à jour les informations d'un étudiant (inclut la classe)
router.put('/:id', async (req, res) => {
  try {
    const studentId = req.params.id; // ID de l'étudiant depuis les paramètres
    const { firstName, lastName, email, dateOfBirth, photo, class: studentClass } = req.body;

    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      {
        firstName,
        lastName,
        email,
        dateOfBirth,
        photo,
        class: studentClass || null, // Met à jour ou supprime la classe si non fournie
      },
      { new: true } // Retourne l'objet mis à jour
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Étudiant introuvable" });
    }

    res.status(200).json({
      message: "Étudiant mis à jour avec succès",
      student: updatedStudent,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'étudiant :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});




// 1) POST /api/students/register => Ajouter un étudiant
router.post('/register', async (req, res) => {
  try {
    const { email, firstName, lastName, dateOfBirth, photo } = req.body;

    if (!email || !firstName || !lastName || !dateOfBirth) {
      return res.status(400).json({ message: 'Tous les champs obligatoires doivent être remplis.' });
    }

    // Vérification de l'unicité
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: 'Email déjà utilisé pour un étudiant.' });
    }

    const newStudent = new Student({
      email,
      firstName,
      lastName,
      dateOfBirth,
      photo,
    });

    const savedStudent = await newStudent.save();
    res.status(201).json({ message: 'Étudiant créé avec succès', student: savedStudent });
  } catch (error) {
    console.error('Erreur création étudiant :', error);
    res.status(500).json({ message: 'Erreur création étudiant.', error: error.message });
  }
});


// 2) GET /api/students => Récupérer tous les étudiants
router.get('/', async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    console.error('Erreur récupération étudiants :', error);
    res.status(500).json({ message: 'Erreur récupération étudiants', error: error.message });
  }
});

// 3) POST /api/students/check-or-create => Vérifie ou crée un étudiant
router.post('/check-or-create', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email manquant dans la requête.' });
    }

    const user = await User.findOne({ email, role: 'student' });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé ou rôle incorrect.' });
    }

    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(200).json({ exists: false, message: 'L’étudiant doit compléter son profil.' });
    }

    res.status(200).json({ exists: true, student });
  } catch (error) {
    console.error('Erreur lors de la vérification :', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// 4) GET /api/students/details => Récupérer les informations d'un étudiant
// GET /api/students/details
router.get('/details', async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: 'Email manquant dans la requête.' });
    }

    const student = await Student.findOne({ email })
      .populate({
        path: 'class',
        populate: [
          { path: 'teachers', select: 'name' },
          { path: 'students', select: 'firstName lastName' },
        ],
      });

    if (!student) {
      return res.status(404).json({ message: 'Étudiant introuvable.' });
    }

    res.status(200).json({ student });
  } catch (error) {
    console.error('Erreur lors de la récupération des informations de l\'étudiant :', error);
    res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
});

// 5) PUT /api/students/complete-profile => Compléter le profil d'un étudiant
router.put('/complete-profile', async (req, res) => {
  try {
    console.log('Requête reçue :', req.body);
    const { email, firstName, lastName, dateOfBirth, photo } = req.body;
    const updatedStudent = await Student.findOneAndUpdate(
      { email },
      { firstName, lastName, dateOfBirth, photo },
      { new: true }
    );
    console.log('Profil mis à jour :', updatedStudent);
    if (!updatedStudent) {
      return res.status(404).json({ message: 'Étudiant introuvable.' });
    }
    res.status(200).json({ message: 'Profil mis à jour avec succès.', student: updatedStudent });
  } catch (error) {
    console.error('Erreur lors de la mise à jour :', error);
    res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
});

// 6) GET /api/students/solde => Récupérer le solde d'un étudiant
router.get('/solde', async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: 'Email manquant dans la requête.' });
    }

    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(404).json({ message: 'Étudiant introuvable.' });
    }

    res.status(200).json({ solde: student.solde });
  } catch (error) {
    console.error('Erreur récupération du solde :', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});


// GET /api/students/class-details
router.get('/class-details', async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: 'Email manquant dans la requête.' });
    }

    // Trouver l'étudiant
    const student = await Student.findOne({ email }).populate('class');
    if (!student) {
      return res.status(404).json({ message: 'Étudiant introuvable.' });
    }

    // Vérifiez si l'étudiant est dans une classe
    if (!student.class) {
      return res.status(404).json({ message: 'L’étudiant n’est inscrit à aucune classe.' });
    }

    // Récupérer les détails de la classe avec les enseignants et les camarades
    const classDetails = await Class.findById(student.class._id)
      .populate('teachers', 'name') // Charger les enseignants (nom)
      .populate('students', 'firstName lastName') // Charger les camarades (nom, prénom)
      .populate('courses', 'name'); // Charger les cours (nom)

    res.status(200).json({
      student,
      classDetails,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des détails de la classe :', error);
    res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
});


module.exports = router;
