const express = require('express');
const router = express.Router();
const {
  createRequest,
  getAllRequests,
  updateRequest,
  getUserRequests
} = require('../controllers/attestation');

// Stagiaire routes
router.post('/', createRequest);
router.get('/user/:userId', getUserRequests);

// Admin routes
router.get('/', getAllRequests);
router.put('/:id', updateRequest);

module.exports = router;