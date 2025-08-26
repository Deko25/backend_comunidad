const express = require('express');
const router = express.Router();
const { loginSimulado } = require('../controllers/auth.controller');

router.post('/login-simulado', loginSimulado);

module.exports = router;
