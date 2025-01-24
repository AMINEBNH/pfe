const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: String, required: true },
  price: { type: Number, required: true },
  teachers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }],
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  schedule: [
    {
      day: { type: String },
      time: { type: String },
      course: { type: String },
    },
  ],
});

module.exports = mongoose.model('Class', classSchema);