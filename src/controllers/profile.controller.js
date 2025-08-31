import Profile from '../models/profile.model.js';
import User from '../models/user.model.js';
import Reaction from '../models/reaction.model.js';
import Post from '../models/post.model.js';
import cloudinary from '../config/cloudinary.config.js';
import multer from 'multer';

const upload = multer({ dest: 'uploads/profile_photos/' });

export const updateProfile = async (req, res) => {
    try {
        const { bio } = req.body;
        let profilePhotoUrl = null;
        if (req.file) {
            try {
                const result = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'profile_photos',
                });
                profilePhotoUrl = result.secure_url;
            } catch (err) {
                console.error('Error uploading to Cloudinary:', err);
                return res.status(500).json({ message: 'Error uploading image to Cloudinary' });
            }
        }
        const user_id = req.user.id;
        const [profile, created] = await Profile.findOrCreate({
            where: { user_id },
            defaults: {
                bio: bio,
                profile_photo: profilePhotoUrl
            }
        });
        if (!created) {
            profile.bio = bio || profile.bio;
            profile.profile_photo = profilePhotoUrl || profile.profile_photo;
            await profile.save();
        }
        res.status(200).json({ message: 'Profile updated successfully', profile });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getProfile = async (req, res) => {
    try {
        const user_id = req.user.id;

        const profile = await Profile.findOne({
            where: { user_id },
            include: [{
                model: User,
                // Incluir user_id para que el frontend pueda obtenerlo sin depender del campo root
                attributes: ['user_id', 'first_name', 'last_name', 'email']
            }]
        });

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.status(200).json(profile);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getProfileStatus = async (req, res) => {
    try {
        const user_id = req.user.id;
        const profile = await Profile.findOne({
            where: { user_id },
        });

        const profileExists = !!profile?.bio || !!profile?.profile_photo;

        res.status(200).json({ profileExists });
    } catch (error) {
        console.error('Error fetching profile status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

