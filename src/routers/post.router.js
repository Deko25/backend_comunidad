const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/auth.middleware');
const { getPosts } = require('../controllers/post.controller');

router.get('/posts', verifyToken, getPosts); // ✅ protegida

module.exports = router;
