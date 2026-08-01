const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const requireAdmin = require('../middleware/requireAdmin');
const { requirePlayer } = require('../middleware/currentPlayer');
const { resetGame } = require('../controllers/admin.controller');

const router = express.Router();

router.post('/admin/reset', requirePlayer, requireAdmin, asyncHandler(resetGame));

module.exports = router;
