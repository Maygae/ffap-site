const express = require('express');
const router = express.Router();
const artisteController = require('../controllers/artiste.controller');
const requireAuth = require('../middleware/auth.middleware');

// DELETE /api/oeuvres/:id — protege (admin)
router.delete('/:id', requireAuth, artisteController.removeOeuvre);

module.exports = router;
