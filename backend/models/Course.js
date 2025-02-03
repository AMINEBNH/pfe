// models/Course.js
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher'
  },
  hours: { type: Number },
  documents: [{
    name: String,
    url: String,
    uploadedAt: { type: Date, default: Date.now }
  }]
});

module.exports = mongoose.model('Course', courseSchema);