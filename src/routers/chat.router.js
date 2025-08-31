import express from 'express';
import { protect } from '../middleware/user.middleware.js';
import { getUsers, getMessages, sendMessage, getUserChatIds } from '../controllers/chat.controller.js';

const router = express.Router();

router.get('/chat/users', protect, getUsers);
router.get('/chat/ids', protect, getUserChatIds);
router.get('/chat/messages/:userId', protect, getMessages);
router.post('/chat/messages', protect, sendMessage);

export default router;
