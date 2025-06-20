const Attestation = require('../models/attestation');
const User = require('../models/user');

// Create a new attestation request
exports.createRequest = async (req, res) => {
  try {
    const { userId } = req.body;
    
    // Check if user exists and is a stagiaire
    const user = await User.findById(userId);
    if (!user || user.role !== 'stagiaire') {
      return res.status(400).json({ message: 'Invalid user or role' });
    }
    
    // Check if user already has a pending request
    const existingRequest = await Attestation.findOne({ 
      stagiaire: userId, 
      status: 'pending' 
    });
    
    if (existingRequest) {
      return res.status(400).json({ message: 'You already have a pending request' });
    }
    
    const newRequest = new Attestation({
      stagiaire: userId
    });
    
    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all requests (for admin)
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await Attestation.find()
    .populate({
      path: 'stagiaire',
      select: 'nom prenom email idClasse',
      populate: {
        path: 'idClasse',
        select: 'nom idDepartment',
        populate: {
          path: 'idDepartment',
          select: 'nom' 
        }
      }
    });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update request status (for admin)
exports.updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminComment } = req.body;
    
    const request = await Attestation.findByIdAndUpdate(
      id,
      { 
        status,
        adminComment,
        processedAt: Date.now()
      },
      { new: true }
    ).populate('stagiaire', 'nom prenom');
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get requests for a specific stagiaire
exports.getUserRequests = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const requests = await Attestation.find({ stagiaire: userId })
      .sort({ requestedAt: -1 });
      
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


