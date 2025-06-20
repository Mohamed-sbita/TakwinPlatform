const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statController');
const authMiddleware = require('../middlewares/authMiddleware');

// Admin routes
router.get('/admin/summary', authMiddleware.authAdmin, statsController.getAdminSummaryStats);
router.get('/admin/student-distribution', authMiddleware.authAdmin, statsController.getStudentDistribution);
router.get('/admin/department-distribution', authMiddleware.authAdmin, statsController.getDepartmentDistribution);
router.get('/admin/attendance-trend', authMiddleware.authAdmin, statsController.getAttendanceTrend);

// Formateur routes
router.get('/formateur/summary', authMiddleware.authFormateur, statsController.getFormateurSummaryStats);
router.get('/formateur/student-distribution', authMiddleware.authFormateur, statsController.getFormateurStudentDistribution);
router.get('/formateur/attendance-trend', authMiddleware.authFormateur, statsController.getFormateurAttendanceTrend);

module.exports = router;