const express = require('express');
const sequelize = require('./db');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const socialRoutes = require('./routes/socialRoutes');
const post = require('./models/Post');
const comment = require('./models/Comment');
const reaction = require('./models/Reaction');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api', authRoutes);
app.use('/api', profileRoutes);
app.use('/api', socialRoutes);

sequelize.sync()
    .then(() => {
        console.log('Database synced');
        app.listen(PORT,() => {
            console.log(`Server running in port${PORT}`);
        });
    })
    .catch(err => {
        console.error('Unable to connect to the database', err.message); 
    });