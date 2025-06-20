const express = require('express');
const router = express.Router();
const {
  creerMatiere,
  listerMatieres,
  obtenirMatiere,
  mettreAJourMatiere,
  supprimerMatiere
} = require('../controllers/matiere');

// Routes de base CRUD
router.post('/', creerMatiere);
router.get('/', listerMatieres);
router.get('/:id', obtenirMatiere);
router.put('/:id', mettreAJourMatiere);
router.delete('/:id', supprimerMatiere);

module.exports = router;