const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Student = require('./models/Student');
const User = require('./models/User');

// Charger les variables d'environnement
dotenv.config();

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Connecté à MongoDB'))
    .catch((err) => console.error('❌ Erreur de connexion MongoDB :', err));

const migrateStudents = async () => {
    try {
        const users = await User.find({ role: 'student' });
        console.log(`🔄 Utilisateurs étudiants trouvés : ${users.length}`);

        if (users.length === 0) {
            console.log('⚠️ Aucun utilisateur avec le rôle "student" trouvé.');
            return;
        }

        // ID de classe valide (24 caractères hexadécimaux)
        const classId = new mongoose.Types.ObjectId('64f9b20d456789abcdef1234');

        for (const user of users) {
            const existingStudent = await Student.findOne({ user: user._id });
            if (existingStudent) {
                console.log(`🔹 Étudiant déjà présent : ${user.email}`);
                continue;
            }

            const newStudent = new Student({
                user: user._id,
                firstName: `First-${user.email.split('@')[0]}`,
                lastName: 'LastName',
                dateOfBirth: new Date(2000, 1, 1),
                class: classId,
                photo: 'https://randomuser.me/api/portraits/men/1.jpg',
            });

            await newStudent.save();
            console.log(`✅ Étudiant migré : ${newStudent.firstName} ${newStudent.lastName}`);
        }

        console.log('🎉 Migration terminée avec succès !');
        mongoose.disconnect();
    } catch (error) {
        console.error('❌ Erreur lors de la migration :', error);
    }
};

migrateStudents();
