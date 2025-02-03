// routes/courses.js
const multer = require('multer');
const express = require('express');
const Course = require('../models/Course');
const router = express.Router();
const auth = require('../routes/auth'); // Ajouter un middleware d'authentification


// Configuration de Multer pour le stockage des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Middleware d'autorisation
const authorize = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Accès non autorisé' });
  }
  next();
};

// Ajout de document (protégé par auth)
router.post('/:id/documents',
  auth,
  authorize(['teacher', 'admin']),
  upload.single('document'),
  async (req, res) => {
    try {
      const course = await Course.findById(req.params.id);
      if (!course) return res.status(404).json({ message: 'Cours introuvable' });

      const newDocument = {
        name: req.file.originalname,
        url: `/uploads/${req.file.filename}`
      };

      course.documents.push(newDocument);
      await course.save();

      res.status(201).json({ message: 'Document ajouté', document: newDocument });
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  }
);

// Récupération des cours avec sécurité
router.get('/', auth, async (req, res) => {
  try {
    const { role } = req.user;
    let courses;

    switch (role) {
      case 'admin':
        courses = await Course.find().populate('teacher', 'name subject image');
        break;
      case 'teacher':
        courses = await Course.find({ teacher: req.user.id }).populate('teacher', 'name subject image');
        break;
      case 'student':
        courses = await Course.find({ students: req.user.id }).populate('teacher', 'name subject image');
        break;
      case 'parent':
        if (!req.user.childId) {
          return res.status(400).json({ message: 'Aucun enfant assigné' });
        }
        courses = await Course.find({ students: req.user.childId }).populate('teacher', 'name subject image');
        break;
      default:
        return res.status(403).json({ message: 'Accès refusé' });
    }

    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});


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
  console.log('Route /courses/all appelée');
  try {
    const courses = await Course.find().populate('teacher', 'name subject image');
    console.log('Cours récupérés :', courses);
    res.status(200).json(courses);
  } catch (error) {
    console.error('Erreur dans /courses/all :', error);
    res.status(500).json({ message: 'Erreur récupération cours', error });
  }
});

// Détails d'un cours => GET /courses/:id
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('teacher', 'name subject image');
    if (!course) return res.status(404).json({ message: 'Cours introuvable' });

    // Ajouter les URLs compètes pour les documents
    const courseWithFullUrls = {
      ...course.toObject(),
      documents: course.documents.map(doc => ({
        ...doc,
        url: `${req.protocol}://${req.get('host')}${doc.url}`
      }))
    };

    res.status(200).json(courseWithFullUrls);
  } catch (error) {
    res.status(500).json({ message: 'Erreur récupération cours', error });
  }
});



module.exports = router;
