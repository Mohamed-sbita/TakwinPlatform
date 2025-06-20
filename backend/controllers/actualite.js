const Actualite = require('../models/actualite');
const Notification = require('../models/notification');

// Create actualité
exports.createActualite = async (req, res) => {
    try {
        const { title, content, categorie, author, tags } = req.body;
        
        const actualiteData = {
            title,
            content,
            categorie,
            author,
            tags: tags ? tags.split(',') : []
        };

        // Handle file uploads
        if (req.files) {
            if (req.files['image']) {
                actualiteData.image = req.files['image'][0].filename;
            }
            if (req.files['attachement']) {
                actualiteData.attachement = req.files['attachement'][0].filename;
            }
        }

        const actualite = await Actualite.create(actualiteData);
        // Création automatique notification liée à l'actualité
        const now = new Date();
        const notif = new Notification({
          titre: `Nouvelle actualité : ${title}`,
          contenu: content.length > 100 ? content.substring(0, 100) + '...' : content,
          date: now,
          time: now.toLocaleTimeString()
        });
        await notif.save();
        res.status(201).json(actualite);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all actualités
exports.getAllActualites = async (req, res) => {
    try {
        const actualites = await Actualite.find()
        .sort({ createdAt: -1 }) // Sort by createdAt in descending order
        .populate('author', 'fullname');
        res.status(200).json(actualites);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single actualité
exports.getActualiteById = async (req, res) => {
    try {
        const actualite = await Actualite.findById(req.params.id).populate('author', 'fullname');
        if (!actualite) {
            return res.status(404).json({ message: 'Actualité not found' });
        }
        res.status(200).json(actualite);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update actualité
exports.updateActualite = async (req, res) => {
    try {
        const { title, content, categorie, tags } = req.body;
        const updateData = { title, content, categorie };

        if (tags) {
            updateData.tags = tags.split(',');
        }

        // Handle file uploads
        if (req.files) {
            if (req.files['image']) {
                updateData.image = req.files['image'][0].filename;
            }
            if (req.files['attachement']) {
                updateData.attachement = req.files['attachement'][0].filename;
            }
        }

        const actualite = await Actualite.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!actualite) {
            return res.status(404).json({ message: 'Actualité not found' });
        }

        res.status(200).json(actualite);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete actualité
exports.deleteActualite = async (req, res) => {
    try {
        const actualite = await Actualite.findByIdAndDelete(req.params.id);
        if (!actualite) {
            return res.status(404).json({ message: 'Actualité not found' });
        }
        res.status(200).json({ message: 'Actualité deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });

    }

    
};