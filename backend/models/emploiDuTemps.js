const mongoose = require('mongoose');

const creneauSchema = new mongoose.Schema({
  heureDebut: { type: String, required: true },
  heureFin: { type: String, required: true },
  matiere: { type: String, required: true },
  formateur: { type: String, required: true },
  classe: { type: String, required: true },
  salle: { type: String, required: true } 

});

const jourSchema = new mongoose.Schema({
  nomJour: { 
    type: String, 
    required: true,
    enum: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
  },
  creneaux: [creneauSchema]
});

const emploiDuTempsSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  description: String,
  classe: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Classe',
    required: true 
  },
  jours: [jourSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EmploiDuTemps', emploiDuTempsSchema);