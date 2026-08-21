const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');
const requireAuth = require('../middleware/auth.middleware');

// Route publique — envoi d'un message par un visiteur
router.post('/', messageController.create);

// Routes protegees (admin uniquement)
router.get('/', requireAuth, messageController.list);
router.put('/:id', requireAuth, messageController.updateStatut);
router.delete('/:id', requireAuth, messageController.remove);

module.exports = router;
