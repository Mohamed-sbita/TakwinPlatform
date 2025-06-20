const Matiere = require('../models/matiere');

// Créer une matière
exports.creerMatiere = async (req, res) => {
  try {
    const matiere = await Matiere.create(req.body);
    res.status(201).json(matiere);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Lister toutes les matières
exports.listerMatieres = async (req, res) => {
  try {
    const matieres = await Matiere.find()
    .sort({ createdAt: -1 })
    .populate('classes' , 'nom');
    res.json(matieres);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Obtenir une matière par ID
exports.obtenirMatiere = async (req, res) => {
  try {
    const matiere = await Matiere.findById(req.params.id)
      .populate('classes', 'nom');
    
    if (!matiere) {
      return res.status(404).json({ message: 'Matière non trouvée' });
    }
    
    res.json(matiere);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mettre à jour une matière
exports.mettreAJourMatiere = async (req, res) => {
  try {
    const matiere = await Matiere.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    
    if (!matiere) {
      return res.status(404).json({ message: 'Matière non trouvée' });
    }
    
    res.json(matiere);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Supprimer une matière
exports.supprimerMatiere = async (req, res) => {
  try {
    const matiere = await Matiere.findByIdAndDelete(req.params.id);
    
    if (!matiere) {
      return res.status(404).json({ message: 'Matière non trouvée' });
    }
    
    res.json({ message: 'Matière supprimée' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};