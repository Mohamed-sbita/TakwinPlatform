const express = require('express');
const router = express.Router();
const {
  creerEmploi,
  listerEmplois,
  obtenirEmploi,
  mettreAJourEmploi,
  supprimerEmploi,
  obtenirEmploiParClasse,
  byid,
  obtenirEmploiParUtilisateur,
  obtenirEmploiParFormateur
} = require('../controllers/emploiDuTemps');

// Routes CRUD de base
router.post('/', creerEmploi);
router.get('/', listerEmplois);
router.get('/:id', obtenirEmploi);
router.get('/details/:id', byid);
router.put('/:id', mettreAJourEmploi);
router.delete('/:id', supprimerEmploi);
router.get('/user/:userId', obtenirEmploiParUtilisateur);
router.get('/formateur/:formateurId', obtenirEmploiParFormateur);

router.get('/classe/:classeId', obtenirEmploiParClasse);

module.exports = router;