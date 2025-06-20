const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  titre: String,
  contenu: String,
  date: { type: Date, default: Date.now },
  time: String,
    lu: { type: Boolean, default: false } 
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;

//