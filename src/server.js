require('dotenv').config(); // 👈 Asegura que las variables del .env estén disponibles

const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const { Server } = require('socket.io');
const { createServer } = require('node:http');

const sequelize = require('./config/db.config');
const chatSocket = require('./sockets/chat.socket.js');

// Modelos
require('./models/user.model');
require('./models/profile.model');
require('./models/post.model');
require('./models/comment.model');
require('./models/reaction.model');
require('./models/associations.model');

// Rutas
const authRoutes = require('./routers/user.router');
const profileRoutes = require('./routers/profile.router');
const socialRoutes = require('./routers/social.router');
const notificationRoutes = require('./routers/notification.router');
const jwtRoutes = require('./routers/auth.router'); 



const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(logger('dev'));

app.use('/api', jwtRoutes);

// Rutas API
app.use('/api', authRoutes);
app.use('/api', profileRoutes);
app.use('/api', socialRoutes);
app.use('/api', notificationRoutes);

// Ruta raíz opcional para evitar el 404
app.get('/', (req, res) => {
  res.send('🚀 API Comunidad Riwi corriendo correctamente');
});

// Socket.io
const server = createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {}
});

io.on('connection', (socket) => {
  console.log('🔌 Usuario conectado');

  socket.on('disconnect', () => {
    console.log('❌ Usuario desconectado');
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});

chatSocket(io);

// Sincronización con Sequelize
sequelize.sync({ alter: true })
  .then(() => {
    console.log('✅ Database synced');
    server.listen(PORT, () => {
      console.log(`🌐 Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Unable to connect to the database:', err.message);
  });
