const mongoose = require('mongoose');
const Student = require('../models/Student');
const User = require('../models/User');

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Connecté à MongoDB'))
    .catch((err) => console.error('❌ Erreur de connexion MongoDB :', err));

const insertRandomStudents = async () => {
    try {
        const users = await User.find({ role: 'student' });
        console.log('Utilisateurs récupérés :', users);

        if (users.length === 0) {
            console.error('⚠️ Aucun utilisateur avec le rôle "student" trouvé.');
            return;
        }

        const randomPhotos = [
            'https://randomuser.me/api/portraits/men/1.jpg',
            'https://randomuser.me/api/portraits/women/1.jpg',
        ];

        const classId = mongoose.Types.ObjectId('64d3e5f687bc3'); // Convertir l'ID de classe en ObjectId

        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            if (!user) continue;

            const newStudent = new Student({
                user: user._id,
                firstName: `First${i + 1}`,
                lastName: `Last${i + 1}`,
                dateOfBirth: new Date(2000, i, 15),
                class: classId, // Utiliser l'ObjectId converti
                photo: randomPhotos[i % randomPhotos.length],
            });

            await newStudent.save();
            console.log(`✅ Étudiant ajouté avec succès : ${newStudent.firstName}`);
        }

        mongoose.disconnect();
    } catch (error) {
        console.error('❌ Erreur lors de l\'insertion des étudiants :', error);
    }
};

insertRandomStudents();
