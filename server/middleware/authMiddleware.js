const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
  // 1. Get token from header
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. ATTACH USER TO REQUEST (Critical for Logging)
    req.user = decoded; 
    
    next();
  } catch (err) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};