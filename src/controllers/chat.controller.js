import { Op } from 'sequelize';
import User from '../models/user.model.js';
import Chat from '../models/chat.model.js';
import UserChat from '../models/user_chat.model.js';
import Message from '../models/message.model.js';

// Obtener lista de usuarios disponibles para chat
export const getUsers = async (req, res) => {
  try {
    // Prueba sin filtro para depuración
    const users = await User.findAll({
      attributes: ['user_id', 'first_name', 'last_name']
    });
    res.json(users);
  } catch (err) {
    console.error('Error en getUsers:', err);
    res.status(500).json({ error: 'Error interno', details: err.message });
  }
};

// Obtener historial de mensajes entre dos usuarios
export const getMessages = async (req, res) => {
  const userId = req.user.id;
  const otherUserId = parseInt(req.params.userId);
  try {
    // Ordenar los IDs para garantizar búsqueda única
    const userAId = Math.min(userId, otherUserId);
    const userBId = Math.max(userId, otherUserId);
    let chat = await Chat.findOne({ where: { userAId, userBId } });
    if (!chat) return res.json([]);
    // Obtener mensajes
    const messages = await Message.findAll({
      where: { chat_id: chat.chat_id },
      order: [['sent_date', 'ASC']]
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching messages' });
  }
};

// Enviar nuevo mensaje
export const sendMessage = async (req, res) => {
  const userId = req.user.id;
  const { toUserId, content } = req.body;
  try {
    // Ordenar los IDs para garantizar chat único
    const userAId = Math.min(userId, toUserId);
    const userBId = Math.max(userId, toUserId);
    let chat = await Chat.findOne({ where: { userAId, userBId } });
    if (!chat) {
      chat = await Chat.create({ userAId, userBId });
      await UserChat.bulkCreate([
        { chat_id: chat.chat_id, user_id: userAId },
        { chat_id: chat.chat_id, user_id: userBId }
      ]);
    }
    // Crear mensaje
    const message = await Message.create({
      chat_id: chat.chat_id,
      user_id: userId,
      content
    });
    // Emitir por socket (si está disponible)
    const io = req.app.get('io');
    if (io) {
      io.to(`chat_${chat.chat_id}`).emit('new_message', {
        chat_id: chat.chat_id,
        user_id: userId,
        content,
        sent_date: message.sent_date
      });
    }
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: 'Error sending message' });
  }
};

// Obtener solo los chat_ids del usuario autenticado
export const getUserChatIds = async (req, res) => {
  try {
    const rows = await UserChat.findAll({ where: { user_id: req.user.id }, attributes: ['chat_id'] });
    const chatIds = [...new Set(rows.map(r => r.chat_id))];
    res.json({ chatIds });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching chat ids' });
  }
};
