const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Student = require('../models/Student');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Ajouter un paiement
router.post('/', async (req, res) => {
  try {
    const { studentId, amount, method, transactionId } = req.body;

    // Vérifier que l'étudiant existe
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Étudiant introuvable" });
    }

    // Créer un nouveau paiement
    const payment = new Payment({
      student: studentId,
      amount,
      method,
      transactionId,
      status: 'pending',
    });

    const savedPayment = await payment.save();

    // Lier la transaction au modèle Student
    student.transactions.push(savedPayment._id);
    await student.save();

    res.status(201).json({ message: 'Paiement ajouté avec succès', payment: savedPayment });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du paiement : ', error);
    res.status(500).json({
      message: 'Erreur lors de l\'ajout du paiement',
      error: error.message,
    });
  }
});

// Récupérer tous les paiements
router.get('/', async (req, res) => {
  try {
    const payments = await Payment.find().populate('student');
    res.json(payments);
  } catch (error) {
    console.error('Erreur lors de la récupération des paiements :', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des paiements', error });
  }
});

// Récupérer les paiements par étudiant
router.get('/by-student', async (req, res) => {
  try {
    const { email } = req.query;
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({ message: "Étudiant introuvable" });
    }

    const payments = await Payment.find({ student: student._id });
    res.json(payments);
  } catch (error) {
    console.error('Erreur lors de la récupération des paiements de l\'étudiant : ', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des paiements', error });
  }
});

// Récupérer un paiement par ID
router.get('/:id', async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('student');
    if (!payment) {
      return res.status(404).json({ message: 'Paiement non trouvé' });
    }
    res.json(payment);
  } catch (error) {
    console.error('Erreur lors de la récupération du paiement :', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du paiement', error });
  }
});

// Route Stripe : Créer une session de paiement
router.post('/stripe', async (req, res) => {
  try {
    const { email, amount } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'Frais de scolarité' },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/payment-success`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-failed`,
    });

    // Enregistrer l'historique du paiement
    const student = await Student.findOne({ email });
    if (student) {
      student.transactions.push({
        amount,
        method: 'Stripe',
        transactionId: session.id,
      });
      await student.save();
    }

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Erreur lors de la création de la session Stripe :', error);
    res.status(500).json({ message: 'Erreur serveur', error });
  }
});


// Webhook Stripe : Traiter les paiements confirmés
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Erreur de vérification du webhook Stripe :', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Gérer les différents types d'événements Stripe
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Mettre à jour le paiement dans la base de données
    try {
      const payment = await Payment.findOneAndUpdate(
        { transactionId: session.id },
        { status: 'completed' },
        { new: true }
      );

      if (payment) {
        console.log('Paiement confirmé :', payment);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du paiement :', error);
    }
  }

  res.status(200).json({ received: true });
});


router.post('/stripe-intent', async (req, res) => {
  try {
    const { email, amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Montant en cents
      currency: 'usd',
      receipt_email: email,
    });

    res.status(200).json(paymentIntent.client_secret);
  } catch (error) {
    console.error('Erreur lors de la création du PaymentIntent :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


module.exports = router;
