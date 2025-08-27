import express from 'express';
import sequelize from './config/db.config.js';
import cors from 'cors';
import {createServer} from 'node:http';
import {Server} from 'socket.io';
import chatSocket from './sockets/chat.socket.js';
import logger from 'morgan';

import User from './models/user.model.js';
import Profile from './models/profile.model.js';
import Post from './models/post.model.js';
import Comment from './models/comment.model.js';
import Reaction from './models/reaction.model.js';

import authRoutes from './routers/user.router.js';
import profileRoutes from './routers/profile.router.js';
import socialRoutes from './routers/social.router.js';
import roleRoutes from './routers/role.router.js';

import './models/associations.model.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(logger('dev'))
app.use(express.json());
app.use('/api', authRoutes);
app.use('/api', profileRoutes);
app.use('/api', socialRoutes);
app.use('/api', roleRoutes);

const server = createServer(app)

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    },
    connectionStateRecovery: {
        // maxDisconnectionDuration // El tiempo maximo de desconexion
    }
})

chatSocket(io)

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