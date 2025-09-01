import Notification from '../models/notification.model.js';
import Post from '../models/post.model.js';

/**
 * Crea una notificación de nuevo post para todos los demás perfiles (simplificado) o para un listado.
 * @param {Object} params
 * @param {number} params.postId
 * @param {number} params.authorProfileId
 * @param {number[]} [params.recipientProfileIds] Lista de perfiles destino; si no se pasa no crea nada (evitamos spam global).
 */
export async function notifyNewPost({ postId, authorProfileId, recipientProfileIds = [] }) {
  if (!postId || !authorProfileId) return;
  const uniqueRecipients = [...new Set(recipientProfileIds)].filter(id => id !== authorProfileId);
  if (!uniqueRecipients.length) return;
  const bulk = uniqueRecipients.map(rid => ({
    profile_id: rid,
    post_id: postId,
    type: 'post',
    message: 'Nuevo post',
    status: 'unread'
  }));
  await Notification.bulkCreate(bulk);
}
