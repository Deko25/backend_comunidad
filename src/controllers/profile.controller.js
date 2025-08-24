const Profile = require('../models/profile.model');

exports.createProfile = async (req, res) => {
    const { bio, skills, experience, projects } = req.body;
    const user_id = req.user.id;

    try {
        await Profile.update(
            { bio, skills, experience, projects },
            { where: { user_id: user_id } }
        );

        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};