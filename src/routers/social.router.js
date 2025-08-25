const express = require('express');
const router = express.Router();
const socialController = require('../controllers/social.controller');
const { protect } = require('../middleware/user.middleware');
const { updatePost } = require('../controllers/social.controller');
const { deletePost } = require('../controllers/social.controller');

router.put('/posts/:postId', protect, updatePost);
router.delete('/posts/:postId', protect, deletePost);
router.post('/posts', protect, socialController.createPost);
router.get('/posts', protect, socialController.getPosts);
router.post('/posts/:postId/comments', protect, socialController.createComment);
router.post('/posts/:postId/reactions', protect, socialController.createReaction);

module.exports = router;