import express from 'express';
import { getNotifications } from '../controllers/notification.controller.js';
import verifyToken from '../middleware/user.middleware.js';

const router = express.Router();

router.get('/notifications', verifyToken, getNotifications);

export default router;
