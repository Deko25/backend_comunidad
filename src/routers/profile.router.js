import express from 'express';
import { updateProfile, getProfile, getProfileStatus, updateProfilePhoto } from '../controllers/profile.controller.js';
import { protect } from '../middleware/user.middleware.js'; 
import multer from 'multer';

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/profile_photos/'); 
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Ruta para solo actualizar la foto del perfil
router.put('/profile/photo', protect, upload.single('profilePhoto'), updateProfilePhoto);
router.put('/profile', protect, upload.single('profilePhoto'), updateProfile);
router.get('/profile', protect, getProfile);
router.get('/profile/status', protect, getProfileStatus); 

export default router;