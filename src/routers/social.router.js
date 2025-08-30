import express from 'express';
import { getPosts, createPost, deletePost, updatePost, createComment, createReaction } from '../controllers/social.controller.js';
import { protect } from '../middleware/user.middleware.js';
import multer from 'multer';

const router = express.Router();

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/posts/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Routes for Posts
router.get('/posts', protect, getPosts);
router.post('/posts', protect, upload.fields([
  { name: 'postFile', maxCount: 1 },
  { name: 'image', maxCount: 1 },
  { name: 'file', maxCount: 1 }
]), createPost);
router.delete('/posts/:postId', protect, deletePost);
router.put('/posts/:postId', protect, upload.fields([
  { name: 'postFile', maxCount: 1 },
  { name: 'image', maxCount: 1 },
  { name: 'file', maxCount: 1 }
]), updatePost);

// NUEVAS RUTAS PARA COMENTARIOS Y REACCIONES
router.post('/posts/:postId/comments', protect, createComment);
router.post('/posts/:postId/reactions', protect, createReaction);

export default router;

