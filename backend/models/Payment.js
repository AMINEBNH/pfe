const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true }, // Élève concerné par le paiement
  amount: { type: Number, required: true }, // Montant du paiement
  date: { type: Date, default: Date.now }, // Date du paiement
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' } // Statut du paiement
});

module.exports = mongoose.model('Payment', paymentSchema);
