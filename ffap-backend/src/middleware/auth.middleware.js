// Verifie qu'une requete porte bien un token JWT valide avant de laisser
// passer vers une route protegee (ex : creation/suppression de contenu).

const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization; // format attendu : "Bearer <token>"

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentification requise' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.adminId = payload.adminId; // dispo dans les controleurs suivants si besoin
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Session invalide ou expiree' });
  }
}

module.exports = requireAuth;
