const express = require('express');
const router = express.Router();
const {
    createAdminAccount,
    createUserAccount,
    signIn,
    list,
    byId,
    deleteUser,
    update,
    bulkCreateStagiaires,
    byGroupe
} = require('../controllers/user');
const { forgotPassword, resetPassword } = require('../controllers/resetPassword');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
        let name = Date.now() + '.' + file.mimetype.split('/')[1];
        req.image = name;
        cb(null, name);
    }
});

const upload = multer({ storage: storage });

// Existing routes
router.post('/createuseraccount', createUserAccount);
router.post('/signin', signIn);
router.get('/list', list);
router.get('/groupe/:id', byGroupe);
router.get('/byid/:id', byId);
router.delete('/delete/:id', deleteUser);
router.put('/update/:id', upload.any('image'), update);

// Password reset routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// New bulk create route
router.post('/bulk-create-stagiaires', upload.single('file'), bulkCreateStagiaires);

module.exports = router;