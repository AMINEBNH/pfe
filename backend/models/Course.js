// models/Course.js
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher'
  },
  hours: { type: Number },
  documents: [String]
});

module.exports = mongoose.model('Course', courseSchema);
