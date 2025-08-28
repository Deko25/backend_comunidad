import Notification from '../models/notification.model.js';

export const getNotifications = async (req, res) => {
  try {
    const { profile_id } = req.user;

    const notifications = await Notification.findAll({
      where: { profile_id },
      order: [['created_at', 'DESC']],
      limit: 10,
    });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener notificaciones.' });
  }
};

export const createNotification = async ({ profile_id, type, reference_id, message }) => {
  try {
    const notification = await Notification.create({
      profile_id,
      type,
      reference_id,
      message,
    });
    return notification;
  } catch (error) {
    console.error('Error al crear notificación:', error);
    throw error;
  }
};
