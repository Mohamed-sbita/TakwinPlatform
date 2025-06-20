const EmploiDuTemps = require('../models/emploiDuTemps');
const matiere = require('../models/matiere');
const User = require('../models/user');
const Classe = require('../models/class');
const mongoose = require('mongoose')

// Créer un nouvel emploi du temps
exports.creerEmploi = async (req, res) => {
  try {
    const nouvelEmploi = new EmploiDuTemps(req.body);
    await nouvelEmploi.save();
    res.status(201).json(nouvelEmploi);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Obtenir tous les emplois du temps
exports.listerEmplois = async (req, res) => {
  try {
    const emplois = await EmploiDuTemps.find()
    .sort({ createdAt: -1 }) 
    .populate('classe', 'nom');
    res.json(emplois);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.obtenirEmploi = async (req, res) => {
    try {
      // First get the emploi with main class populated
      const emploi = await EmploiDuTemps.findById(req.params.id)
        .populate('classe', 'nom');
      
      if (!emploi) {
        return res.status(404).json({ message: 'Emploi du temps non trouvé' });
      }
  
      // Convert to plain JavaScript object to modify it
      const emploiObj = emploi.toObject();
  
      // Get all unique formateur and matiere IDs from all creneaux
      const formateurIds = [];
      const matiereIds = [];
      
      emploiObj.jours.forEach(jour => {
        jour.creneaux.forEach(creneau => {
          if (creneau.formateur && !formateurIds.includes(creneau.formateur)) {
            formateurIds.push(new mongoose.Types.ObjectId(creneau.formateur));
          }
          if (creneau.matiere && !matiereIds.includes(creneau.matiere)) {
            matiereIds.push(new mongoose.Types.ObjectId(creneau.matiere));
          }
        });
      });
  
      //  all formateurs and matieres in bulk
      const [formateurs, matieres] = await Promise.all([
        formateurIds.length > 0 
          ? User.find({ _id: { $in: formateurIds } }, 'nom') 
          : [],
        matiereIds.length > 0 
          ? matiere.find({ _id: { $in: matiereIds } }, 'nom') 
          : []
      ]);
  
      // Create lookup objects for quick access
      const formateurMap = formateurs.reduce((acc, curr) => {
        acc[curr._id.toString()] = curr;
        return acc;
      }, {});
  
      const matiereMap = matieres.reduce((acc, curr) => {
        acc[curr._id.toString()] = curr;
        return acc;
      }, {});
  
      // Enrich each creneau with the additional data
      emploiObj.jours.forEach(jour => {
        jour.creneaux.forEach(creneau => {
          // Add formateur details
          creneau.formateur = {
            _id: creneau.formateur,
            nom: formateurMap[creneau.formateur]?.nom || 'Formateur inconnu'
          };
  
          // Add matiere details
          creneau.matiere = {
            _id: creneau.matiere,
            nom: matiereMap[creneau.matiere]?.nom || 'Matière inconnue'
          };
  
          // Add class details (same as main class)
          creneau.classe = {
            _id: emploiObj.classe._id,
            nom: emploiObj.classe.nom
          };
        });
      });
  
      res.json(emploiObj);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };


  // Obtenir un emploi du temps par ID
exports.byid = async (req, res) => {
    try {
      const emploi = await EmploiDuTemps.findById(req.params.id)
        .populate('classe', 'nom');
      
      if (!emploi) {
        return res.status(404).json({ message: 'Emploi du temps non trouvé' });
      }
      
      res.json(emploi);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  

// Mettre à jour un emploi du temps
exports.mettreAJourEmploi = async (req, res) => {
  try {
    const emploi = await EmploiDuTemps.findByIdAndUpdate(
      req.params.id, 
      { ...req.body, updatedAt: Date.now() }, 
      { new: true }
    ).populate('classe', 'nom');
    
    if (!emploi) {
      return res.status(404).json({ message: 'Emploi du temps non trouvé' });
    }
    
    res.json(emploi);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Supprimer un emploi du temps
exports.supprimerEmploi = async (req, res) => {
  try {
    const emploi = await EmploiDuTemps.findByIdAndDelete(req.params.id);
    
    if (!emploi) {
      return res.status(404).json({ message: 'Emploi du temps non trouvé' });
    }
    
    res.json({ message: 'Emploi du temps supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Obtenir l'emploi du temps d'une classe spécifique
exports.obtenirEmploiParClasse = async (req, res) => {
  try {
    const emploi = await EmploiDuTemps.findOne({ classe: req.params.classeId })
      .populate('classe', 'nom');
    
    if (!emploi) {
      return res.status(404).json({ message: 'Emploi du temps non trouvé pour cette classe' });
    }
    
    res.json(emploi);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Obtenir l'emploi du temps d'un utilisateur spécifique
exports.obtenirEmploiParUtilisateur = async (req, res) => {
  try {
    // First get the user to find their class
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    // Check if the user has a class assigned
    if (!user.idClasse) {
      return res.status(404).json({ message: "L'utilisateur n'a pas de classe assignée" });
    }
    
    // Get the emploi du temps for the user's class
    const emploi = await EmploiDuTemps.findOne({ classe: user.idClasse })
      .populate('classe', 'nom');
    
    if (!emploi) {
      return res.status(404).json({ message: 'Emploi du temps non trouvé pour cette classe' });
    }
    
    // Convert to plain object to modify
    const emploiObj = emploi.toObject();
    
    // Get all unique formateur and matiere IDs from all creneaux
    const formateurIds = [];
    const matiereIds = [];
    
    emploiObj.jours.forEach(jour => {
      jour.creneaux.forEach(creneau => {
        if (creneau.formateur && !formateurIds.includes(creneau.formateur)) {
          formateurIds.push(new mongoose.Types.ObjectId(creneau.formateur));
        }
        if (creneau.matiere && !matiereIds.includes(creneau.matiere)) {
          matiereIds.push(new mongoose.Types.ObjectId(creneau.matiere));
        }
      });
    });
    
    // Fetch all formateurs and matieres in bulk
    const [formateurs, matieres] = await Promise.all([
      formateurIds.length > 0 
        ? User.find({ _id: { $in: formateurIds } }, 'nom prenom') 
        : [],
      matiereIds.length > 0 
        ? matiere.find({ _id: { $in: matiereIds } }, 'nom') 
        : []
    ]);
    
    // Create lookup objects for quick access
    const formateurMap = formateurs.reduce((acc, curr) => {
      acc[curr._id.toString()] = curr;
      return acc;
    }, {});
    
    const matiereMap = matieres.reduce((acc, curr) => {
      acc[curr._id.toString()] = curr;
      return acc;
    }, {});
    
    // Enrich each creneau with the additional data
    emploiObj.jours.forEach(jour => {
      jour.creneaux.forEach(creneau => {
        // Add formateur details
        creneau.formateur = {
          _id: creneau.formateur,
          nom: formateurMap[creneau.formateur]?.nom || 'Formateur inconnu',
          prenom: formateurMap[creneau.formateur]?.prenom || ''
        };
        
        // Add matiere details
        creneau.matiere = {
          _id: creneau.matiere,
          nom: matiereMap[creneau.matiere]?.nom || 'Matière inconnue'
        };
        
        // Add class details (same as main class)
        creneau.classe = {
          _id: emploiObj.classe._id,
          nom: emploiObj.classe.nom
        };
        creneau.salle = creneau.salle || '';
      });
    });
    
    res.json(emploiObj);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// Obtenir l'emploi du temps d'un formateur
exports.obtenirEmploiParFormateur = async (req, res) => {
  try {
    // Get all emploi du temps that have creneaux with this formateur
    const emplois = await EmploiDuTemps.find({
      'jours.creneaux.formateur': req.params.formateurId
    }).populate('classe', 'nom');
    
    if (!emplois || emplois.length === 0) {
      return res.status(404).json({ message: 'Aucun emploi du temps trouvé pour ce formateur' });
    }
    
    // Convert to plain objects to modify
    const emploisObj = emplois.map(emploi => emploi.toObject());
    
    // Get all unique matiere IDs from all creneaux
    const matiereIds = [];
    const classeIds = [];
    
    emploisObj.forEach(emploi => {
      emploi.jours.forEach(jour => {
        jour.creneaux = jour.creneaux.filter(creneau => 
          creneau.formateur === req.params.formateurId
        );
        
        jour.creneaux.forEach(creneau => {
          if (creneau.matiere && !matiereIds.includes(creneau.matiere)) {
            matiereIds.push(new mongoose.Types.ObjectId(creneau.matiere));
          }
          if (creneau.classe && !classeIds.includes(creneau.classe)) {
            classeIds.push(new mongoose.Types.ObjectId(creneau.classe));
          }
        });
      });
    });
    
    // Fetch all matieres and classes in bulk
    const [matieres, classes] = await Promise.all([
      matiereIds.length > 0 
        ? matiere.find({ _id: { $in: matiereIds } }, 'nom') 
        : [],
      classeIds.length > 0 
        ? Classe.find({ _id: { $in: classeIds } }, 'nom') 
        : []
    ]);
    
    // Create lookup objects for quick access
    const matiereMap = matieres.reduce((acc, curr) => {
      acc[curr._id.toString()] = curr;
      return acc;
    }, {});
    
    const classeMap = classes.reduce((acc, curr) => {
      acc[curr._id.toString()] = curr;
      return acc;
    }, {});
    
    // Enrich each creneau with the additional data
    emploisObj.forEach(emploi => {
      emploi.jours.forEach(jour => {
        jour.creneaux.forEach(creneau => {
          // Add matiere details
          creneau.matiere = {
            _id: creneau.matiere,
            nom: matiereMap[creneau.matiere]?.nom || 'Matière inconnue'
          };
          
          // Add class details
          creneau.classe = {
            _id: creneau.classe,
            nom: classeMap[creneau.classe]?.nom || 'Classe inconnue'
          };
        });
      });
    });
    
    // Flatten all creneaux from all emplois into a single array
    const allCreneaux = [];
    emploisObj.forEach(emploi => {
      emploi.jours.forEach(jour => {
        jour.creneaux.forEach(creneau => {
          allCreneaux.push({
            ...creneau,
            jour: jour.nomJour,
            emploiTitre: emploi.titre
          });
        });
      });
    });
    
    res.json(allCreneaux);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};