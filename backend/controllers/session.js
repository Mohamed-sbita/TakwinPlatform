const Session = require('../models/session');
const Attendance = require('../models/attendance');
const Groupe = require('../models/groupe');
const Matiere = require('../models/matiere');

// Create a new session
exports.createSession = async (req, res) => {
  try {
    const { matiere, groupe, creneau, formateur } = req.body;
  
    

    const session = await Session.create({ matiere, formateur, groupe, creneau });
    res.status(201).json(session);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get sessions for a formateur
exports.getFormateurSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ formateur: req.params.id })
      .populate('matiere', 'nom')
      .populate('groupe', 'nom')
      .sort({ date: -1 });
    
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};