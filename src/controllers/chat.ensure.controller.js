import Chat from '../models/chat.model.js';
import UserChat from '../models/user_chat.model.js';
import { Op } from 'sequelize';

// POST /chat/ensure
export const ensureChat = async (req, res) => {
  try {
    let { fromUserId, toUserId } = req.body;
    if (!fromUserId || !toUserId) {
      return res.status(400).json({ error: 'fromUserId y toUserId son requeridos' });
    }
    // Ordenar los IDs para evitar duplicados
    const userAId = Math.min(fromUserId, toUserId);
    const userBId = Math.max(fromUserId, toUserId);
    // Buscar o crear el chat único entre estos dos usuarios
    const [chat, created] = await Chat.findOrCreate({
      where: { userAId, userBId },
      defaults: { userAId, userBId }
    });
    // Crear relaciones UserChat si es nuevo
    if (created) {
      await UserChat.bulkCreate([
        { chat_id: chat.chat_id, user_id: userAId },
        { chat_id: chat.chat_id, user_id: userBId }
      ]);
    }
    return res.json({ chatId: chat.chat_id });
  } catch (err) {
    console.error('Error en ensureChat:', err);
    return res.status(500).json({ error: 'Error asegurando el chat' });
  }
};
