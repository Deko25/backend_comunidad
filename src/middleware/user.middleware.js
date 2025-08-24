const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Profile = require('../models/profile.model');

exports.protect = async (req, res, next) => {

    const authHeader = req.headers.authorization; 


    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({message: 'No token or invalid format'});
    }
    

    const token = authHeader.split(' ')[1];
    
    try {
        const decoded = jwt.verify(token, 'your_jwt_secret');
        

        req.user = decoded.user;
        
        next();
    } catch (err) {
        res.status(401).json({message: 'Token is not valid'});
    }
};
