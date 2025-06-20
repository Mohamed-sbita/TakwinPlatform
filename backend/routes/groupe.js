const express = require('express');
const router = express.Router();
const {
  createGroupe,
  getAllGroupes,
  getGroupeById,
  updateGroupe,
  deleteGroupe,
  getByClasse
} = require('../controllers/groupe');

router.post('/', createGroupe);
router.get('/', getAllGroupes);
router.get('/:id', getGroupeById);
router.get('/byclasse/:id', getByClasse);
router.put('/:id', updateGroupe);
router.delete('/:id', deleteGroupe);

module.exports = router;