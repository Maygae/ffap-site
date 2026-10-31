const express = require('express');
const router = express.Router();
const fichierModel = require('../models/fichier.model');

// GET /api/fichiers/:id — public, renvoie l'image stockee en base
router.get('/:id', async (req, res) => {
  try {
    const fichier = await fichierModel.findById(req.params.id);
    if (!fichier) {
      return res.status(404).json({ error: 'Image introuvable' });
    }
    res.set('Content-Type', fichier.type_mime);
    // Une image ne change jamais pour un meme id : le navigateur peut la garder en cache 1 an
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
    res.send(fichier.donnees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
