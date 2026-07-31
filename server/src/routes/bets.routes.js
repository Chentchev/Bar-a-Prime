const express = require('express');
const bets = require('../controllers/bets.controller');
const asyncHandler = require('../middleware/asyncHandler');
const { requirePlayer } = require('../middleware/currentPlayer');

const router = express.Router();

router.post('/bets', requirePlayer, asyncHandler(bets.createBet));

module.exports = router;
