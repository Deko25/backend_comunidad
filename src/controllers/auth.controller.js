const jwt = require('jsonwebtoken');
const { User } = require('../models/user.model'); // ajusta si tu modelo está exportado distinto

const loginSimulado = async (req, res) => {
  const { username } = req.body;

  try {
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const payload = {
      id: user.id,
      username: user.username,
      email: user.email
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'clave_local', {
      expiresIn: '1h'
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error al generar el token' });
  }
};

module.exports = { loginSimulado };
