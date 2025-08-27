import express from 'express';
import * as socialController from '../controllers/social.controller.js';
import { protect } from '../middleware/user.middleware.js';
import multer from 'multer';

const router = express.Router();

// Configuración de Multer para la subida de archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    // Especifica la carpeta de destino para los archivos
    cb(null, 'uploads/');
    },

    filename: function (req, file, cb) {
    // Usa un nombre de archivo único para evitar colisiones
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

router.put('/posts/:postId', protect, socialController.updatePost);
router.delete('/posts/:postId', protect, socialController.deletePost);


router.post('/posts', protect, upload.single('postFile'), socialController.createPost);

router.get('/posts', protect, socialController.getPosts);
router.post('/posts/:postId/comments', protect, socialController.createComment);
router.post('/posts/:postId/reactions', protect, socialController.createReaction);

export default router;
