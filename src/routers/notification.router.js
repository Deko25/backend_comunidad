import express from 'express';
import { getNotifications, markAsRead } from '../controllers/notification.controller.js';
import { protect } from '../middleware/user.middleware.js';

const router = express.Router();

router.get('/notifications', protect, getNotifications);
router.put('/notifications/:notificationId/read', protect, markAsRead);

export default router;
