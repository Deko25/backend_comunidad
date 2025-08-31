import { Op } from 'sequelize';
import User from '../models/user.model.js';
import Chat from '../models/chat.model.js';
import UserChat from '../models/user_chat.model.js';
import Message from '../models/message.model.js';
import Profile from '../models/profile.model.js';

// Obtener lista de usuarios disponibles para chat (excluye al actual) con foto de perfil
export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { user_id: { [Op.ne]: req.user.id } },
      attributes: ['user_id', 'first_name', 'last_name'],
      include: [{ model: Profile, attributes: ['profile_photo'] }]
    });
    // Normalizar respuesta (aplanar profile_photo)
    const normalized = users.map(u => ({
      user_id: u.user_id,
      first_name: u.first_name,
      last_name: u.last_name,
      profile_photo: u.Profile ? u.Profile.profile_photo : null
    }));
    res.json(normalized);
  } catch (err) {
    console.error('Error en getUsers:', err);
    res.status(500).json({ error: 'Error interno', details: err.message });
  }
};

// Obtener historial de mensajes entre dos usuarios
export const getMessages = async (req, res) => {
  const userId = req.user.id;
  const otherUserId = parseInt(req.params.userId);
  const limit = Math.min(parseInt(req.query.limit) || 50, 100);
  const before = req.query.before ? new Date(req.query.before) : null;
  try {
    const userAId = Math.min(userId, otherUserId);
    const userBId = Math.max(userId, otherUserId);
    let chat = await Chat.findOne({ where: { userAId, userBId } });
    if (!chat) return res.json({ messages: [], otherUser: null, hasMore: false });
    const where = { chat_id: chat.chat_id };
    if (before) where.sent_date = { [Op.lt]: before };
    const rows = await Message.findAll({
      where,
      order: [['sent_date', 'DESC']],
      limit
    });
    // invertimos para mostrar ascendente
    const messages = rows.reverse();
    const otherUserRaw = await User.findByPk(otherUserId, { 
      attributes: ['user_id', 'first_name', 'last_name'],
      include: [{ model: Profile, attributes: ['profile_photo'] }]
    });
    const otherUser = otherUserRaw ? {
      user_id: otherUserRaw.user_id,
      first_name: otherUserRaw.first_name,
      last_name: otherUserRaw.last_name,
      profile_photo: otherUserRaw.Profile ? otherUserRaw.Profile.profile_photo : null
    } : null;
    // Calcular si hay más (si obtuvimos limit mensajes y existe uno más antiguo)
    let hasMore = false;
    if (rows.length === limit) {
      const oldest = rows[rows.length - 1].sent_date;
      const olderExists = await Message.findOne({ where: { chat_id: chat.chat_id, sent_date: { [Op.lt]: oldest } }, attributes: ['message_id'] });
      hasMore = !!olderExists;
    }
    // Marcar como leídos los mensajes del otro usuario que no tengan read_at (solo la página cargada)
    await Message.update(
      { read_at: new Date() },
      { where: { chat_id: chat.chat_id, user_id: otherUserId, read_at: null } }
    );
    res.json({ messages, otherUser, hasMore, chatId: chat.chat_id });
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
        message_id: message.message_id,
        chat_id: chat.chat_id,
        user_id: userId,
        content,
        sent_date: message.sent_date,
        read_at: null
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

// Marcar mensajes de un chat como leídos
export const markChatRead = async (req, res) => {
  const { chatId } = req.params;
  try {
    await Message.update(
      { read_at: new Date() },
      { where: { chat_id: chatId, user_id: { [Op.ne]: req.user.id }, read_at: null } }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Error marking messages as read' });
  }
};

// Lista de conversaciones con último mensaje y conteo de no leídos
export const getConversations = async (req, res) => {
  const userId = req.user.id;
  try {
    const chats = await Chat.findAll({
      where: { [Op.or]: [{ userAId: userId }, { userBId: userId }] },
      order: [['creation_date', 'DESC']]
    });
    const result = [];
    for (const chat of chats) {
      const otherUserId = chat.userAId === userId ? chat.userBId : chat.userAId;
      const otherUserRaw = await User.findByPk(otherUserId, { 
        attributes: ['user_id', 'first_name', 'last_name'],
        include: [{ model: Profile, attributes: ['profile_photo'] }]
      });
      const otherUser = otherUserRaw ? {
        user_id: otherUserRaw.user_id,
        first_name: otherUserRaw.first_name,
        last_name: otherUserRaw.last_name,
        profile_photo: otherUserRaw.Profile ? otherUserRaw.Profile.profile_photo : null
      } : null;
      const lastMessage = await Message.findOne({ where: { chat_id: chat.chat_id }, order: [['sent_date', 'DESC']] });
      const unreadCount = await Message.count({ where: { chat_id: chat.chat_id, user_id: otherUserId, read_at: null } });
      result.push({
        chat_id: chat.chat_id,
        otherUser,
        lastMessage,
        unreadCount
      });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching conversations' });
  }
};
