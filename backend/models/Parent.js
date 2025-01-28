const mongoose = require('mongoose');

const parentSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }], // Référence aux étudiants
    phoneNumber: { type: String, required: true } // Numéro de téléphone du parent
});

module.exports = mongoose.model('Parent', parentSchema);
