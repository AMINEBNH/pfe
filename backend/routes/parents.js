const express = require('express');
const router = express.Router();
const Parent = require('../models/Parent');
const User = require('../models/User');
const Student = require('../models/Student');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'defaultSecret';


// ✅ Route pour récupérer tous les parents
router.get('/parents', async (req, res) => {
    try {
        const parents = await Parent.find({}); // Récupérer tous les parents
        res.status(200).json(parents);
    } catch (error) {
        console.error('Erreur récupération des parents :', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
});


// ✅ Route de connexion du parent
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Vérifier si l'utilisateur existe dans `users`
        const user = await User.findOne({ email, role: 'parent' });
        if (!user) {
            return res.status(401).json({ message: "L'utilisateur ou le rôle est incorrect." });
        }

        // Vérifier le mot de passe
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Mot de passe incorrect.' });
        }

        // Vérifier si le parent a un profil dans `parents`
        let parent = await Parent.findOne({ email });

        if (!parent) {
            return res.status(200).json({
                token: user.token,
                role: 'parent',
                profileComplete: false // Le frontend doit rediriger vers la complétion
            });
        }

        // Vérifier si le parent est assigné à un étudiant
        const hasChildAssigned = parent.children && parent.children.length > 0;

        // Générer le token JWT
        const token = jwt.sign({ id: user._id, role: 'parent' }, JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({
            token,
            role: 'parent',
            profileComplete: true,
            hasChildAssigned
        });
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
});

// ✅ Route pour compléter le profil du parent
router.post('/register', async (req, res) => {
    const { email, firstName, lastName, phoneNumber } = req.body;

    console.log("Données reçues :", req.body); // Ajoute ceci pour voir la requête reçue

    try {
        if (!email || !firstName || !lastName || !phoneNumber) {
            return res.status(400).json({ message: 'Tous les champs sont requis.' });
        }

        // Vérifier si l'utilisateur est enregistré dans `users`
        const user = await User.findOne({ email, role: 'parent' });
        if (!user) {
            return res.status(400).json({ message: 'Aucun compte utilisateur trouvé. Contactez l\'administrateur.' });
        }

        // Vérifier si le parent est déjà enregistré
        const existingParent = await Parent.findOne({ email });
        if (existingParent) {
            return res.status(400).json({ message: 'Profil déjà enregistré.' });
        }

        // Créer le profil parent
        const newParent = new Parent({
            email,
            firstName,
            lastName,
            phoneNumber,
            children: []
        });

        await newParent.save();
        res.status(201).json({ message: 'Profil complété avec succès. Un administrateur doit maintenant vous assigner un enfant.' });
    } catch (error) {
        console.error('Erreur lors de la création du profil parent:', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
});

// ✅ Route pour récupérer les informations du parent et de son enfant
router.get('/dashboard', async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({ message: 'Email manquant dans la requête.' });
        }

        const parent = await Parent.findOne({ email }).populate('children');
        if (!parent) {
            return res.status(404).json({ message: 'Parent introuvable. Veuillez compléter votre profil.' });
        }

        if (!parent.children || parent.children.length === 0) {
            return res.status(200).json({ message: 'Vous devez attendre que l\'administrateur vous assigne un enfant.' });
        }

        // Récupérer les détails de l'étudiant assigné
        const student = await Student.findById(parent.children[0]).populate('class');

        if (!student) {
            return res.status(404).json({ message: 'Aucun étudiant assigné.' });
        }

        res.status(200).json({
            parent: {
                firstName: parent.firstName,
                lastName: parent.lastName,
                email: parent.email,
                phoneNumber: parent.phoneNumber,
            },
            student: {
                firstName: student.firstName,
                lastName: student.lastName,
                class: student.class ? {
                    name: student.class.name,
                    price: student.class.price,
                    schedule: student.class.schedule
                } : {}
            }
        });
    } catch (error) {
        console.error('Erreur récupération du tableau de bord parent :', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
});

// ✅ Route pour mettre à jour le profil du parent
router.put('/update', async (req, res) => {
    try {
        const { email, firstName, lastName, phoneNumber } = req.body;

        if (!email || !firstName || !lastName || !phoneNumber) {
            return res.status(400).json({ message: 'Tous les champs sont requis.' });
        }

        const parent = await Parent.findOne({ email });
        if (!parent) {
            return res.status(404).json({ message: 'Parent introuvable.' });
        }

        parent.firstName = firstName;
        parent.lastName = lastName;
        parent.phoneNumber = phoneNumber;

        await parent.save();
        res.status(200).json({ message: 'Profil mis à jour avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du profil parent :', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
});

// ✅ Route pour récupérer les informations du parent (pour EditParentProfile)
router.get('/profile', async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({ message: 'Email manquant dans la requête.' });
        }

        const parent = await Parent.findOne({ email });
        if (!parent) {
            return res.status(404).json({ message: 'Parent introuvable.' });
        }

        res.status(200).json({
            firstName: parent.firstName,
            lastName: parent.lastName,
            email: parent.email,
            phoneNumber: parent.phoneNumber,
        });
    } catch (error) {
        console.error('Erreur récupération du profil parent :', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
});


router.get('/', async (req, res) => {
    try {
        const parents = await Parent.find({});
        console.log('📌 Parents trouvés :', parents); // Ajout du log
        res.status(200).json(parents);
    } catch (error) {
        console.error('Erreur récupération des parents :', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
});


// ✅ Route pour assigner un enfant à un parent
router.post('/assign-child', async (req, res) => {
    const { parentId, studentId } = req.body;

    if (!parentId || !studentId) {
        return res.status(400).json({ message: 'Parent et enfant sont requis.' });
    }

    try {
        // Vérifier si le parent existe
        const parent = await Parent.findById(parentId);
        if (!parent) {
            return res.status(404).json({ message: 'Parent non trouvé.' });
        }

        // Vérifier si l'enfant existe
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Étudiant non trouvé.' });
        }

        // Vérifier si l'enfant est déjà assigné à un parent
        if (parent.children.includes(studentId)) {
            return res.status(400).json({ message: 'Cet enfant est déjà assigné à ce parent.' });
        }

        // Ajouter l'enfant au parent
        parent.children.push(studentId);
        await parent.save();

        res.status(200).json({ message: 'Enfant assigné avec succès.' });
    } catch (error) {
        console.error('Erreur lors de l\'assignation de l\'enfant :', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
});



module.exports = router;