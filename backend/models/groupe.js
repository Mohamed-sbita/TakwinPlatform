const mongoose = require('mongoose');

const groupeSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    idClasse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Classe',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Groupe', groupeSchema);