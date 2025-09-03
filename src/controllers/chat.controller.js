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
  const userId = req.user.id;  // usu autenticado
  const otherUserId = parseInt(req.params.userId); //otro usuario con el que se quiere chatear
  const limit = Math.min(parseInt(req.query.limit) || 50, 100);// max 100 pa no sobre cargar la pag
  const before = req.query.before ? new Date(req.query.before) : null; //soporte pag hacia atras
  try {
    const userAId = Math.min(userId, otherUserId); // ordernar id y evitar duplicado 
    const userBId = Math.max(userId, otherUserId);
    let chat = await Chat.findOne({ where: { userAId, userBId } });
    if (!chat) return res.json({ messages: [], otherUser: null, hasMore: false }); //develve vacios si no hay mess o user
    const where = { chat_id: chat.chat_id }; // filtros mensajes de chat
    if (before) where.sent_date = { [Op.lt]: before }; //mensajes anterior a la fecha
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
    const otherUser = otherUserRaw ? { //normaliza para el front llegue plano
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
    const io = req.app.get('io'); //recupera las instancia de socket si esta guarda en express
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
      { where: { chat_id: chatId, user_id: { [Op.ne]: req.user.id }, read_at: null } } //solo meg actuales/ solo meg que no fueron enviados por el user autenti/solo meg que no tiene marca de lectura
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
      where: { [Op.or]: [{ userAId: userId }, { userBId: userId }] },  // busca todos los chat en los que paticipa el user actual 
      order: [['creation_date', 'DESC']]
    });
    const result = []; //guardar la conversacion
    for (const chat of chats) {
      const otherUserId = chat.userAId === userId ? chat.userBId : chat.userAId; // cada chat tiene 2 user se identifica cual es el otro user en la conver
      const otherUserRaw = await User.findByPk(otherUserId, { 
        attributes: ['user_id', 'first_name', 'last_name'],
        include: [{ model: Profile, attributes: ['profile_photo'] }]
      });
      const otherUser = otherUserRaw ? {
        user_id: otherUserRaw.user_id,// objeto plano para el frontend mas comodo
        first_name: otherUserRaw.first_name,
        last_name: otherUserRaw.last_name,
        profile_photo: otherUserRaw.Profile ? otherUserRaw.Profile.profile_photo : null
      } : null;
      const lastMessage = await Message.findOne({ where: { chat_id: chat.chat_id }, order: [['sent_date', 'DESC']] }); // busca el ultimo mensaje enviado , mostrar el preview de la conver
      const unreadCount = await Message.count({ where: { chat_id: chat.chat_id, user_id: otherUserId, read_at: null } }); // cuanta mensajes no leidos
      result.push({ //construye el objeto de la conversacion con toda la info
        chat_id: chat.chat_id,
        otherUser,
        lastMessage,
        unreadCount
      });
    }
    res.json(result);  // devuelve el resultado a frontend
  } catch (err) {
    res.status(500).json({ error: 'Error fetching conversations' });
  }
};
