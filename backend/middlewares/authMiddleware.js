const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized - No token provided' });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decoded._id).select('-password');
    console.log(decoded);
    
    if (!user) {
      return res.status(403).json({ message: 'Forbidden - User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Authentication error:', err);
    return res.status(403).json({ message: 'Forbidden - Invalid token' });
  }
};

exports.isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden - Admin access required' });
  }
  next();
};

exports.isFormateur = (req, res, next) => {
  if (!req.user || req.user.role !== 'formateur') {
    return res.status(403).json({ message: 'Forbidden - Formateur access required' });
  }
  next();
};

// Combined middleware for routes that need both authentication and role checking
exports.authAdmin = [this.authenticateToken, this.isAdmin];
exports.authFormateur = [this.authenticateToken, this.isFormateur];