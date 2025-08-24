const express = require('express');
const sequelize = require('./config/db.config');
const cors = require('cors');

const User = require('./models/user.model');
const Profile = require('./models/profile.model');
const post = require('./models/post.model');
const comment = require('./models/comment.model');
const reaction = require('./models/reaction.model');

const authRoutes = require('./routers/user.router');
const profileRoutes = require('./routers/profile.router');
const socialRoutes = require('./routers/social.router');

require('./models/associations.model');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api', authRoutes);
app.use('/api', profileRoutes);
app.use('/api', socialRoutes);

sequelize.sync({alter: true})
    .then(() => {
        console.log('Database synced');
        app.listen(PORT,() => {
            console.log(`Server running in port${PORT}`);
        });
    })
    .catch(err => {
        console.error('Unable to connect to the database', err.message); 
    });