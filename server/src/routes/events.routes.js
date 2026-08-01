const express = require('express');
const events = require('../controllers/events.controller');
const asyncHandler = require('../middleware/asyncHandler');
const requireAdmin = require('../middleware/requireAdmin');
const { requirePlayer } = require('../middleware/currentPlayer');

const router = express.Router();

router.get('/events', asyncHandler(events.listEvents));
router.get('/events/:id', asyncHandler(events.getEvent));
router.post('/events', requirePlayer, requireAdmin, asyncHandler(events.createEvent));
router.patch('/events/:id', requirePlayer, requireAdmin, asyncHandler(events.updateEvent));
router.post('/events/:id/resolve', requirePlayer, requireAdmin, asyncHandler(events.resolveEvent));
router.delete('/events/:id', requirePlayer, requireAdmin, asyncHandler(events.deleteEvent));

module.exports = router;
