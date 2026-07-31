function requireAdmin(req, res, next) {
  if (!req.player) {
    return res.status(401).json({ error: 'Profil joueur requis' });
  }
  if (!req.player.is_admin) {
    return res.status(403).json({ error: 'Reserve aux admins' });
  }
  next();
}

module.exports = requireAdmin;
