const mongoose = require('mongoose');

const parentSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
    phoneNumber: { type: String, required: true, match: /^[0-9]{10}$/ }, // Validation du numéro de téléphone
});

// Index pour optimiser les requêtes par email
parentSchema.index({ email: 1 });

module.exports = mongoose.model('Parent', parentSchema);