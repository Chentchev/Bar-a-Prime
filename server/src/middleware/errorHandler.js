// Erreur "attendue" (validation, regle metier) qu'on veut renvoyer telle
// quelle au client plutot que masquee derriere un 500 generique.
class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  if (status >= 500) {
    console.error(err);
  }
  res.status(status).json({ error: err.message || 'Erreur serveur' });
}

module.exports = { HttpError, errorHandler };
