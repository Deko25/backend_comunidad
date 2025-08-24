const express = require('express');
const router = express.Router();
const {protect} = require('../middleware/authMiddleware');
const profile = require('../models/Profile');

router.get('/profile', protect, async (req, res) => {
    try {
        const profileData = await profile.findOne({where: {user_id: req.user.id}});
        if (!profileData) {
            return res.status(404).json({message: 'Profile not found'});
        }
        res.json(profileData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send({error: 'Server error'});
    }
});

module.exports = router;