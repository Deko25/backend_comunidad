import express from 'express';
import sequelize from './config/db.config.js';
import cors from 'cors';

import User from './models/user.model.js';
import Profile from './models/profile.model.js';
import Post from './models/post.model.js';
import Comment from './models/comment.model.js';
import Reaction from './models/reaction.model.js';

import authRoutes from './routers/user.router.js';
import profileRoutes from './routers/profile.router.js';
import socialRoutes from './routers/social.router.js';

import './models/associations.model.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api', authRoutes);
app.use('/api', profileRoutes);
app.use('/api', socialRoutes);

const server = createServer(app)

const io = new Server(server, {
    connectionStateRecovery: {
        maxDisconnectionDuration // El tiempo maximo de desconexion
    }
})

io.on('connection', (socket) => {
    console.log('an user has connected')

    socket.on('disconnect', () => {
        console.log('an user has disconnected')
    })

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg)
    })
})

chatSocket(io)

app.use(logger('dev'))

sequelize.sync({alter: true})
    .then(() => {
        console.log('Database synced');
        app.listen(PORT,() => {
            console.log(`Server running in port http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Unable to connect to the database', err.message); 
    });