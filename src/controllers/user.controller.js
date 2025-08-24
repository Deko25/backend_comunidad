const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model'); 
const Profile = require('../models/profile.model');

// Register an user
exports.register = async (req, res) => {
    const {first_name, last_name, email, password} = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            first_name,
            last_name,
            email,
            password_hash
        });

        await Profile.create({
            user_id: newUser.user_id,
            bio: '',
            skills: '',
            experience: '',
            projects: ''
        });

        res.status(201).json({message: 'User registered successfully'});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Error registering user'});
    }
};

// user login
exports.login = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({where: {email}});
        if (!user) {
            return res.status(400).json({error: 'Invalid email or password'});
        }
        
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({error: 'Invalid email or password'});
        }

        const userProfile = await Profile.findOne({where: {user_id: user.user_id}});

        const payload = {
            user: {
                id: user.user_id,
            },
        };

        jwt.sign(
            payload,
            'your_jwt_secret',
            {expiresIn: '1h'},
            (err, token) => {
                if (err) throw err;

                if(!userProfile.bio) {
                    return res.json({token, profileExists: false});
                }
                res.json({token, profileExists: true});
            }
        );
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Error in the server' });
    }
};