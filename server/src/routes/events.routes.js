const express = require('express');
const events = require('../controllers/events.controller');
const requireAdmin = require('../middleware/requireAdmin');
const { requirePlayer } = require('../middleware/currentPlayer');

const router = express.Router();

router.get('/events', events.listEvents);
router.get('/events/:id', events.getEvent);
router.post('/events', requirePlayer, requireAdmin, events.createEvent);
router.patch('/events/:id', requirePlayer, requireAdmin, events.updateEvent);
router.post('/events/:id/resolve', requirePlayer, requireAdmin, events.resolveEvent);

module.exports = router;
