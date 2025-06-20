const Classe = require('../models/class');


exports.getAllClasses = async (req, res) => {
  const classes = await Classe.find()
  .populate('idDepartment', 'nom ')
  .sort({ createdAt: -1 });
  res.status(200).send(classes);
};

exports.getClass = async (req, res) => {
  const classe = await Classe.findById(req.params.id).populate('idDepartment', 'nom');
  
  if (!classe) {
    res.status(404);
    throw new Error('Classe non trouvée');
  }
  
  res.status(200).send(classe);
};


exports.createClass = async (req, res) => {
  const { nom, idDepartment } = req.body;
  
  const classe = await Classe.create({
    nom,
    idDepartment
  });
  
  res.status(201).json({
    success: true,
    data: classe
  });
};


exports.updateClass = async (req, res) => {
  const { nom, idDepartment } = req.body;
  
  const classe = await Classe.findByIdAndUpdate(
    req.params.id,
    { nom, idDepartment, updatedAt: Date.now() },
    { new: true, runValidators: true }
  );
  
  if (!classe) {
    res.status(404);
    throw new Error('Classe non trouvée');
  }
  
  res.status(200).json({
    success: true,
    data: classe
  });
};


exports.deleteClass =async (req, res) => {
  const classe = await Classe.findByIdAndDelete(req.params.id);
  
  if (!classe) {
    res.status(404);
    throw new Error('Classe non trouvée');
  }
  
  res.status(200).json({
    success: true,
    data: {}
  });
};