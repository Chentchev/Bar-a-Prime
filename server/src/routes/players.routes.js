const express = require('express');
const players = require('../controllers/players.controller');

const router = express.Router();

router.get('/players', players.listPlayers);
router.post('/players', players.createPlayer);
router.get('/players/:id', players.getPlayer);
router.get('/players/:id/bets', players.getPlayerBets);

router.get('/leaderboard', players.getLeaderboard);

module.exports = router;
