// models/Document.js
const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    url: { type: String, required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
    uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Document', documentSchema);