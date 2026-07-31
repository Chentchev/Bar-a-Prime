const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const players = require('../controllers/players.controller');

const router = express.Router();

router.get('/players', asyncHandler(players.listPlayers));
router.post('/players', asyncHandler(players.createPlayer));
router.get('/players/:id', asyncHandler(players.getPlayer));
router.get('/players/:id/bets', asyncHandler(players.getPlayerBets));

router.get('/leaderboard', asyncHandler(players.getLeaderboard));

module.exports = router;
