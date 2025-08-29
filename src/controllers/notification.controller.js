import Notification from '../models/notification.model.js';
import Profile from '../models/profile.model.js';

export const getNotifications = async (req, res) => {
    try {
        const profile_id = req.user.profile_id;
        const notifications = await Notification.findAll({
            where: { profile_id },
            order: [['date', 'DESC']],
            include: [{ model: Profile, attributes: ['profile_photo'] }]
        });
        res.json(notifications);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error getting notifications' });
    }
};

export const markAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const notification = await Notification.findByPk(notificationId);
        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }
        notification.status = 'read';
        await notification.save();
        res.json({ message: 'Notification marked as read' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error updating notification' });
    }
};
