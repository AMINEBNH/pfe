// routes/documents.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const Document = require('../models/Document');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

router.post('/', upload.single('file'), async (req, res) => {
    try {
        const { course, class: classId, teacher } = req.body;

        const newDocument = new Document({
            name: req.file.originalname,
            url: '/uploads/' + req.file.filename,
            course,
            class: classId,
            teacher
        });

        await newDocument.save();
        res.status(201).json(newDocument);
    } catch (error) {
        res.status(500).json({ message: 'Erreur de téléchargement', error });
    }
});

module.exports = router;