const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Import des routes
const authRoutes = require('./routes/auth');
const teacherRoutes = require('./routes/teachers');
const courseRoutes = require('./routes/courses');
const studentRoutes = require('./routes/students');
const eventsRoutes = require('./routes/events');
const classRoutes = require('./routes/class');  // Import du routeur des classes

// Charger les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes d'authentification
app.use('/api/auth', authRoutes);
// Routes pour les événements
app.use('/api/events', eventsRoutes);
// Routes pour les enseignants
app.use('/api/teachers', teacherRoutes);
// Routes pour les cours
app.use('/courses', courseRoutes);
// Routes pour les étudiants
app.use('/api/students', studentRoutes);
// Routes pour les classes
app.use('/api/classes', classRoutes);  // Montage du routeur des classes sur /api/classes

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connecté à MongoDB'))
  .catch((err) => console.error('❌ Erreur de connexion MongoDB :', err));

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});
