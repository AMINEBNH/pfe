const express = require('express');
const Payment = require('../models/Payment');
const router = express.Router();

// Ajouter un paiement
router.post('/', async (req, res) => {
  try {
    const newPayment = new Payment(req.body);
    const savedPayment = await newPayment.save();
    res.status(201).json(savedPayment);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de l\'ajout du paiement', error });
  }
});

// Récupérer tous les paiements
router.get('/', async (req, res) => {
  try {
    const payments = await Payment.find().populate('student');
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des paiements', error });
  }
});

// Récupérer un paiement par ID
router.get('/:id', async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('student');
    res.json(payment);
  } catch (error) {
    res.status(404).json({ message: 'Paiement non trouvé', error });
  }
});

module.exports = router;
