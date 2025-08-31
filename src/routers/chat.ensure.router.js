import express from 'express';
import { ensureChat } from '../controllers/chat.ensure.controller.js';
import { protect } from '../middleware/user.middleware.js';

const router = express.Router();

router.post('/chat/ensure', protect, ensureChat);

export default router;
