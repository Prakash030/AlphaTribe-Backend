import pkg from 'jsonwebtoken';
const { verify } = pkg;
import User from '../models/User.js';

export async function authMiddleware(req, res, next) {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ success: false, message: 'Not authorized' });
    }
  } else {
    res.status(401).json({ success: false, message: 'No token, authorization denied' });
  }
}
