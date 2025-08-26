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

sequelize.sync({ alter: true })
    .then(() => {
        console.log('Database synced');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Unable to connect to the database', err.message); 
    });