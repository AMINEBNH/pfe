/***************************************
 * models/Teacher.js
 ***************************************/
const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subject: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // Nouveau champ image (URL)
  image: { type: String, default: '' },
});

module.exports = mongoose.model('Teacher', teacherSchema);
