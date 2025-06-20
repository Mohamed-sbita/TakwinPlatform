const Attendance = require('../models/attendance');
const Session = require('../models/session');
const User = require('../models/user');
const Groupe = require('../models/groupe');
// Mark attendance for multiple stagiaires
exports.markAttendance = async (req, res) => {
  try {
    const { sessionId, attendanceRecords, id } = req.body;
    
    // Verify session exists and belongs to this formateur
    const session = await Session.findOne({
      _id: sessionId,
      formateur: id
    });
    
    if (!session) {
      return res.status(404).json({ message: 'Session non trouvée ou non autorisée' });
    }

    console.log(session);
    console.log(attendanceRecords);
    
    // Process each attendance record
    const results = await Promise.all(
      attendanceRecords.map(async record => {
        try {
        

          const attendance = await Attendance.findOneAndUpdate(
            { session: sessionId, stagiaire: record.stagiaire },
            { status: record.status, notes: record.notes },
            { upsert: true, new: true }
          );
          
          return attendance;
        } catch (error) {
          return { 
            stagiaire: record.stagiaire, 
            error: error.message 
          };
        }
      })
    );

    res.json(results);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get attendance for a session
exports.getSessionAttendance = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    // Verify session exists and belongs to this formateur
    const session = await Session.findOne({
      _id: sessionId,
      formateur: req.params.id
    }).populate('groupe', 'nom');
    
    if (!session) {
      return res.status(404).json({ message: 'Session non trouvée ou non autorisée' });
    }

    const attendance = await Attendance.find({ session: sessionId })
      .populate('stagiaire', 'nom prenom');
    
    res.json({
      session,
      attendance
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// Get absences for a specific stagiaire
exports.getStagiaireAbsences = async (req, res) => {
  try {
    // Get all attendance records for this stagiaire where status is not 'present'
    const absences = await Attendance.find({
      stagiaire: req.params.stagiaireId,
      status: { $ne: 'present' }
    })
      .populate('session')
      .populate({
        path: 'session',
        populate: [
          { path: 'matiere', select: 'nom' },
          { path: 'groupe', select: 'nom' },
          { path: 'formateur', select: 'nom prenom' }
        ]
      })
      .sort({ createdAt: -1 });

    // Format the data
    const formattedAbsences = absences.map(absence => ({
      _id: absence._id,
      date: absence.session.date,
      matiere: absence.session.matiere.nom,
      groupe: absence.session.groupe.nom,
      formateur: `${absence.session.formateur.nom} ${absence.session.formateur.prenom}`,
      status: absence.status,
      notes: absence.notes,
      createdAt: absence.createdAt
    }));

    res.json({
      totalAbsences: formattedAbsences.length,
      absences: formattedAbsences
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Get all presence records with filters
exports.getAllPresenceRecords = async (req, res) => {
  try {
    const { startDate, endDate, formateurId, stagiaireId, matiereId, status } = req.query;
    
    const filter = {};
    
    // Date range filter
    if (startDate && endDate) {
      filter['session.date'] = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    // Formateur filter
    if (formateurId) {
      filter['session.formateur'] = formateurId;
    }
    
    // Stagiaire filter
    if (stagiaireId) {
      filter.stagiaire = stagiaireId;
    }
    
    // Matiere filter
    if (matiereId) {
      filter['session.matiere'] = matiereId;
    }
    
    // Status filter
    if (status) {
      filter.status = status;
    }
    
    const records = await Attendance.find(filter)
      .populate('session')
      .populate({
        path: 'session',
        populate: [
          { path: 'matiere', select: 'nom' },
          { path: 'groupe', select: 'nom' },
          { path: 'formateur', select: 'nom prenom' }
        ]
      })
      .populate('stagiaire', 'nom prenom')
      .sort({ 'session.date': -1 });
    
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};