const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: false }, // Référence à une classe
  solde: { type: Number, default: 0 },
  photo: { type: String, default: '' },
  transactions: [
    {
      date: { type: Date, default: Date.now },
      amount: { type: Number, required: true },
      method: { type: String, required: true },
      transactionId: { type: String, required: true },
    },
  ],
});

module.exports = mongoose.model('Student', studentSchema);
