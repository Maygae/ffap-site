const express = require('express');
const router = express.Router();
const evenementController = require('../controllers/evenement.controller');
const requireAuth = require('../middleware/auth.middleware');

// DELETE /api/images/:id — protege (admin), supprime une photo de la galerie d'un evenement
router.delete('/:id', requireAuth, evenementController.removeImage);

module.exports = router;
