const mongoose = require('mongoose');

const CoursSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
   
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Classe',
        required: true
    },
    attachement: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Cours', CoursSchema);