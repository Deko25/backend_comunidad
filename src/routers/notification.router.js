const express = require('express');
const router = express.Router();
const { getPostNotifications } = require('../controllers/notification.controller');

router.get('/posts', getPostNotifications);

module.exports = router;
