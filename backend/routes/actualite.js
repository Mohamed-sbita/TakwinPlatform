const express = require('express');
const router = express.Router();
const {
    createActualite,
    getAllActualites,
    getActualiteById,
    updateActualite,
    deleteActualite
} = require('../controllers/actualite');
const multer = require('multer');

// Simple file upload configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

// Basic CRUD routes
router.post('/create', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'attachement', maxCount: 1 }
]), createActualite);

router.get('/', getAllActualites);
router.get('/:id', getActualiteById);

router.put('/:id', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'attachement', maxCount: 1 }
]), updateActualite);

router.delete('/:id', deleteActualite);

module.exports = router;