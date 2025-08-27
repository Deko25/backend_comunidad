import Role from '../models/role.model.js';

export const getAllRoles = async (req, res) => {
    try {
        const roles = await Role.findAll({
            attributes: ['role_id', 'role_name']
        });
        res.status(200).json(roles);
    } catch (error) {
        console.error('Error getting roles:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};