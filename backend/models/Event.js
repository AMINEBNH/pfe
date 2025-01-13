const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    day: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String, // URL ou chemin vers l'image
        required: false,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Event', EventSchema);
