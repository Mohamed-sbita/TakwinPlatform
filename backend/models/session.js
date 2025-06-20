const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  matiere: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Matiere',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  formateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  groupe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Groupe',
    required: true
  },
  creneau: {
    type: String, // Could be "9h-11h", or reference your timetable system
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);