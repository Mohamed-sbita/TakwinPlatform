const mongoose = require('mongoose');

const matiereSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  // formateur: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User'
  // },
  classes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Classe'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Matiere', matiereSchema);