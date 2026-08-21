const messageModel = require('../models/message.model');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STATUTS_VALIDES = ['nouveau', 'traite'];

// POST /api/contact — public, n'importe quel visiteur peut envoyer un message
async function create(req, res) {
  const { nom, email, message } = req.body;

  if (!nom || !email || !message) {
    return res.status(400).json({ error: 'Nom, email et message sont requis' });
  }
  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ error: 'Adresse email invalide' });
  }
  if (message.length > 3000) {
    return res.status(400).json({ error: 'Message trop long (3000 caracteres max)' });
  }

  try {
    const id = await messageModel.create({ nom, email, message });
    res.status(201).json({ id, message: 'Message envoye avec succes' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

// GET /api/contact — protege (admin uniquement, donnees privees)
async function list(req, res) {
  try {
    const messages = await messageModel.findAll();
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

// PUT /api/contact/:id — protege (admin), pour marquer un message comme traite
async function updateStatut(req, res) {
  const { statut } = req.body;

  if (!STATUTS_VALIDES.includes(statut)) {
    return res.status(400).json({
      error: `Statut invalide. Valeurs autorisees : ${STATUTS_VALIDES.join(', ')}`,
    });
  }

  try {
    const existant = await messageModel.findById(req.params.id);
    if (!existant) {
      return res.status(404).json({ error: 'Message introuvable' });
    }
    await messageModel.updateStatut(req.params.id, statut);
    res.json({ message: 'Statut mis a jour' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

// DELETE /api/contact/:id — protege (admin)
async function remove(req, res) {
  try {
    const existant = await messageModel.findById(req.params.id);
    if (!existant) {
      return res.status(404).json({ error: 'Message introuvable' });
    }
    await messageModel.remove(req.params.id);
    res.json({ message: 'Message supprime' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

module.exports = { create, list, updateStatut, remove };
