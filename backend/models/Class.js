const mongoose = require('mongoose'); // Import de Mongoose

const classSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: String, required: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  teachers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }],
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  price: { type: Number, default: 0 }, // Ajout du champ prix
});

module.exports = mongoose.model('Class', classSchema); // Export du modèle
