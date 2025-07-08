const jwt = require('jsonwebtoken');
const User = require('../models/user.model'); // Import the User model

async function auth(req, res, next) {
  const token = req.header('x-auth-token');

  // Check for token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the full user object and attach it to the request
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ msg: 'User not found, authorization denied' });
    }
    req.user = user;
    next();
  } catch (e) {
    res.status(400).json({ msg: 'Token is not valid' });
  }
}

function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ msg: 'Forbidden: You do not have access to this resource' });
    }
    next();
  };
}

module.exports = { auth, authorizeRoles };