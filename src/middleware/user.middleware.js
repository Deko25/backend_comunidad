import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import Profile from '../models/profile.model.js';

export const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization; 

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token or invalid format' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, 'your_jwt_secret');

        req.user = decoded.user;

        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};