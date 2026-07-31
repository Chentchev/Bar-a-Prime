const express = require('express');
const bets = require('../controllers/bets.controller');
const { requirePlayer } = require('../middleware/currentPlayer');

const router = express.Router();

router.post('/bets', requirePlayer, bets.createBet);

module.exports = router;
