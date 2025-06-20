const Groupe = require('../models/groupe');

// Create group
exports.createGroupe = async (req, res) => {
    try {
        const { nom, idClasse } = req.body;
        const groupe = await Groupe.create({ nom, idClasse });
        res.status(201).json(groupe);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all groups
exports.getAllGroupes = async (req, res) => {
    try {
        const groupes = await Groupe.find()
        .populate('idClasse', 'nom')
        .sort({ createdAt: -1 });
        res.status(200).json(groupes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single group
exports.getGroupeById = async (req, res) => {
    try {
        const groupe = await Groupe.findById(req.params.id).populate('idClasse', 'nom');
        if (!groupe) return res.status(404).json({ message: 'Groupe not found' });
        res.status(200).json(groupe);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getByClasse = async (req, res) => {
    try {
        const groupe = await Groupe.find({ idClasse: req.params.id}).populate('idClasse', 'nom');
        if (!groupe) return res.status(404).json({ message: 'Groupe not found' });
        res.status(200).json(groupe);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update group
exports.updateGroupe = async (req, res) => {
    try {
        const { nom, idClasse } = req.body;
        const groupe = await Groupe.findByIdAndUpdate(
            req.params.id,
            { nom, idClasse },
            { new: true }
        );
        if (!groupe) return res.status(404).json({ message: 'Groupe not found' });
        res.status(200).json(groupe);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete group
exports.deleteGroupe = async (req, res) => {
    try {
        const groupe = await Groupe.findByIdAndDelete(req.params.id);
        if (!groupe) return res.status(404).json({ message: 'Groupe not found' });
        res.status(200).json({ message: 'Groupe deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};