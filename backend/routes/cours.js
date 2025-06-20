const express = require('express');
const router = express.Router();
const {
    createCourse,
    getAllCourses,
    getCoursesByClass,
    getCoursesByAuthor,
    getCourseById,
    updateCourse,
    deleteCourse
} = require('../controllers/cours');

const multer = require('multer');

// Configurer multer pour les fichiers
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });


// Créer un cours
router.post(
    '/create',
    upload.fields([{ name: 'attachement', maxCount: 1 }]),
    createCourse
);

// Obtenir tous les cours
router.get('/', getAllCourses);

// Obtenir les cours par classe
router.get('/class/:classId', getCoursesByClass);

// Obtenir les cours par auteur (formateur)
router.get('/author/:authorId', getCoursesByAuthor);


// get course by ID
router.get('/:id', getCourseById);
// Mettre à jour un cours
router.put(
    '/:id',
    upload.fields([{ name: 'attachement', maxCount: 1 }]),
    updateCourse
);

// Supprimer un cours
router.delete('/:id', deleteCourse);

module.exports = router;
