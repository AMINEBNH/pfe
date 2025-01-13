/***************************************
 * models/Student.js
 ***************************************/
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },

  // Classe : si vous gérez réellement les classes, sinon mettez-le en optionnel
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },

  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  solde: { type: Number, default: 0 },
  photo: { type: String, default: '' },

  // password: { type: String }, // si vous voulez gérer un password étudiant
});

module.exports = mongoose.model('Student', studentSchema);
