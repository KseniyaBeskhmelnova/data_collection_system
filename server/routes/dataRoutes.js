const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authenticateToken, saveData);
router.get('/', authenticateToken, getUserData);

module.exports = router;
