const jwt = require('jsonwebtoken');
const User = require('../models/User');
const profile = require('../models/Profile');


exports.protect = async (req, res, next) => {
    const token = req.headers('x-auth-token');
    if (!token) {
        return res.status(401).json({message: 'No token, authorization denied'});
    }
    try {
        const decoded = jwt.verify(token, 'your_jwt_secret');

        const user = await User.findByPk(decoded.user.id, {
            include: [{model: profile}]
        });
        if (!user) {
            return res.status(401).json({message: 'User not found'});
        }
        req.user = {
            id: user.user_id,
            profile_id: user.profile.profile_id
        };
        // Refresh token
        const newPayload = {
            user: {
                id: user.user_id,
            },
        };

        const newToken = jwt.sign(
            newPayload,
            'your_jwt_secret',
            {expiresIn: '1h'}
        );

        res.setHeader('x-auth-token', newToken);
        next();
    } catch (err) {
        res.status(401).json({message: 'Token is not valid'});
    }
};
