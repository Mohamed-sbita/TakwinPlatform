const mongoose = require('mongoose');

const User = mongoose.model('User', {
    nom: {
        type: String,
        required: true
    },
    prenom: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: 'admin.png'
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    dateNaissance: {
        type: Date,
        required: true
    },
    tel: {
        type: String
    },
    codeInscription: {
        type: String,
        unique: true,
        required: true
    },
    adresse: {
        type: String
    },
    nomParent: {
        type: String
    },
    telParent: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'formateur', 'stagiaire'],
        default: 'stagiaire'
    },
    idClasse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Classe'
    },
    idGroupe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Groupe'
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = User;