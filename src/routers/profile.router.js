import express from 'express';
import { protect } from '../middleware/user.middleware.js';
import { createProfile } from '../controllers/profile.controller.js';
import Profile from '../models/profile.model.js';

const router = express.Router();

router.get('/profile', protect, async (req, res) => {
    try {
        const profileData = await Profile.findOne({ where: { user_id: req.user.id } });
        if (!profileData) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.json(profileData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ error: 'Server error' });
    }
});

router.post('/profile', protect, createProfile);

export default router;