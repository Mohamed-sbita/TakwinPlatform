const express = require('express');
const router = express.Router();
const {
  createSession,
  getFormateurSessions
} = require('../controllers/session');
const {
  markAttendance,
  getSessionAttendance,
  getStagiaireAbsences,
  getAllPresenceRecords
} = require('../controllers/attendance');

// Session routes
router.post('/sessions', createSession);
router.get('/sessions/me/:id', getFormateurSessions);

// Attendance routes
router.post('/mark', markAttendance);
router.get('/session/:sessionId/:id', getSessionAttendance);



router.get('/stagiaire/:stagiaireId', getStagiaireAbsences);

router.get('/admin/presence', getAllPresenceRecords);

module.exports = router;