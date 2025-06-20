const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// Public routes
router.post('/', contactController.sendMessage);

// Admin routes
router.get('/', contactController.getAllMessages);
router.get('/:id', contactController.getMessage);
router.delete('/:id', contactController.deleteMessage);

module.exports = router;