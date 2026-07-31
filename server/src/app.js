const express = require('express');
const cors = require('cors');

const { currentPlayer } = require('./middleware/currentPlayer');
const { errorHandler } = require('./middleware/errorHandler');

const playersRoutes = require('./routes/players.routes');
const eventsRoutes = require('./routes/events.routes');
const betsRoutes = require('./routes/bets.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(currentPlayer);

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use('/api', playersRoutes);
app.use('/api', eventsRoutes);
app.use('/api', betsRoutes);

app.use((req, res) => res.status(404).json({ error: 'Route inconnue' }));
app.use(errorHandler);

module.exports = app;
