const fs = require('fs');
const path = require('path');
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

app.use('/api', (req, res) => res.status(404).json({ error: 'Route inconnue' }));

// Sert le build du frontend s'il existe (deploiement en un seul service,
// type Render/Railway : "npm run build" puis "npm start"). En dev, le
// frontend tourne separement via "npm run dev --prefix client".
const clientDist = path.join(__dirname, '..', '..', 'client', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get(/.*/, (req, res) => res.sendFile(path.join(clientDist, 'index.html')));
}

app.use(errorHandler);

module.exports = app;
