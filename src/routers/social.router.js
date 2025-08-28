import express from 'express';
import { getPosts, createPost, deletePost, updatePost } from '../controllers/social.controller.js';
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

// Routes for Postssssssssss
router.get('/posts', protect, getPosts);
router.post('/posts', protect, upload.single('postFile'), createPost);
router.delete('/posts/:postId', protect, deletePost);
router.put('/posts/:postId', protect, upload.single('postFile'), updatePost);

export default router;

