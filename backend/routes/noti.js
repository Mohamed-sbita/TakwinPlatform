const express = require('express');
const router = express.Router();

const {
    
    getAllNotifications,
    readNotification

    
} = require('../controllers/noti');


router.get('/notifications', getAllNotifications);
router.put('/notification/:id', readNotification);

module.exports = router;
