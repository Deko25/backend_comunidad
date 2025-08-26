import express from 'express';
import * as socialController from '../controllers/social.controller.js';
import { protect } from '../middleware/user.middleware.js';

const router = express.Router();

router.put('/posts/:postId', protect, socialController.updatePost);
router.delete('/posts/:postId', protect, socialController.deletePost);
router.post('/posts', protect, socialController.createPost);
router.get('/posts', protect, socialController.getPosts);
router.post('/posts/:postId/comments', protect, socialController.createComment);
router.post('/posts/:postId/reactions', protect, socialController.createReaction);

export default router;
