
import Chat from '../models/chat.model.js';
import UserChat from '../models/user_chat.model.js';
import Message from '../models/message.model.js';

// Mapa para contar conexiones simultáneas por usuario (multi‑tab)
const onlineUsersCount = new Map(); // userId -> count

function addOnline(userId) {
  const prev = onlineUsersCount.get(userId) || 0;
  onlineUsersCount.set(userId, prev + 1);
}

function removeOnline(userId) {
  const prev = onlineUsersCount.get(userId) || 0;
  if (prev <= 1) {
    onlineUsersCount.delete(userId);
    return true; // se desconectó último
  } else {
    onlineUsersCount.set(userId, prev - 1);
    return false;
  }
}

function currentOnlineUserIds() {
  return Array.from(onlineUsersCount.keys());
}

function chatSocket(io) {
  io.on('connection', (socket) => {
    console.log('[SOCKET] user connected:', socket.id);

    socket.on('joinChats', ({ userId, chatIds }) => {
      socket.data.userId = userId;
      if (Array.isArray(chatIds)) {
        chatIds.forEach(chatId => socket.join(`chat_${chatId}`));
      }
      addOnline(userId);
      // Enviar al usuario la lista completa de conectados (incluyéndose)
      socket.emit('online_users', currentOnlineUserIds());
      // Notificar a los demás que este usuario está online
      socket.broadcast.emit('user_online', userId);
    });

    socket.on('joinChat', ({ chatId }) => {
      if (chatId) socket.join(`chat_${chatId}`);
    });

    socket.on('typing', ({ chatId }) => {
      if (!chatId) return;
      socket.to(`chat_${chatId}`).emit('typing', { userId: socket.data.userId });
    });

    socket.on('send_message', async ({ chat_id, chatId, message }) => {
      const realChatId = chat_id || chatId;
      if (!message || !message.user_id || !message.to_user_id || !message.content) return;
      try {
        let chat = realChatId ? await Chat.findByPk(realChatId) : null;
        if (!chat) {
          // Intentar localizar chat por composición (userAId/userBId) si existen en payload
          const userAId = Math.min(message.user_id, message.to_user_id);
          const userBId = Math.max(message.user_id, message.to_user_id);
          chat = await Chat.findOne({ where: { userAId, userBId } });
          if (!chat) {
            chat = await Chat.create({ userAId, userBId });
            await UserChat.bulkCreate([
              { chat_id: chat.chat_id, user_id: userAId },
              { chat_id: chat.chat_id, user_id: userBId }
            ]);
          }
        }
        const savedMessage = await Message.create({
          chat_id: chat.chat_id,
          user_id: message.user_id,
          content: message.content
        });
        // asegurarse que el emisor está en la sala
        socket.join(`chat_${chat.chat_id}`);
        io.to(`chat_${chat.chat_id}`).emit('new_message', {
          message_id: savedMessage.message_id,
          chat_id: chat.chat_id,
          user_id: message.user_id,
          content: message.content,
          sent_date: savedMessage.sent_date,
          read_at: null
        });
      } catch (e) {
        console.error('[SOCKET] Error guardando mensaje por socket:', e.message);
      }
    });

    socket.on('disconnect', () => {
      if (socket.data.userId) {
        const last = removeOnline(socket.data.userId);
        if (last) io.emit('user_offline', socket.data.userId);
      }
    });
  });
}

export default chatSocket;
