import Notification from '../models/notification.model.js';
import Profile from '../models/profile.model.js';
import User from '../models/user.model.js';
import Post from '../models/post.model.js';

export const getNotifications = async (req, res) => {
    try {
        const profile_id = req.user.profile_id;
        const notifications = await Notification.findAll({
            where: { profile_id },
            attributes: ['notification_id','profile_id','post_id','message','type','date','status'],
            order: [['date', 'DESC']],
            include: [
                { 
                    model: Profile, // receptor (dueño que recibe la notificación)
                    attributes: ['profile_photo', 'user_id'],
                    include: [{ model: User, attributes: ['first_name', 'last_name'] }]
                },
                {
                    model: Post,
                    attributes: ['post_id', 'profile_id'],
                    include: [{
                        model: Profile,
                        attributes: ['profile_photo','user_id','profile_id'],
                        include: [{ model: User, attributes: ['first_name','last_name'] }]
                    }]
                }
            ]
        });
        console.log('[getNotifications] total:', notifications.length);
        // Mapear para adjuntar nombre completo uniforme
        const mapped = notifications.map(n => {
            const plain = n.toJSON();
            // Autor (actor) es el dueño del post
            const authorProfile = plain.Post?.Profile;
            if (authorProfile?.User) {
                plain.actor_name = `${authorProfile.User.first_name} ${authorProfile.User.last_name}`.trim();
                plain.actor_photo = authorProfile.profile_photo;
            }
            // Fallback anterior
            if (!plain.user_name && plain.Profile?.User) {
                plain.user_name = `${plain.Profile.User.first_name} ${plain.Profile.User.last_name}`.trim();
            }
            if (!plain.actor_name) {
                console.log('[getNotifications] Sin actor para notification_id', plain.notification_id, 'post_id:', plain.post_id);
            }
            return plain;
        });
        res.json(mapped);
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
