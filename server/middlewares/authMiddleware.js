import jwt from 'jsonwebtoken';
import { User } from '../Schemas.js';

export const protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      const JWT_SECRET = process.env.JWT_SECRET || 'sbstockssecretkey12345';
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Decoded contains id or email
      // We can query the database
      const user = await User.findOne({ email: decoded.email });
      if (!user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }
      
      req.user = user;
      next();
    } catch (error) {
      console.error('Token verification error:', error.message);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.usertype === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized, admin privileges required' });
  }
};
