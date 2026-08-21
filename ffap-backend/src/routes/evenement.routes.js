const express = require('express');
const router = express.Router();
const evenementController = require('../controllers/evenement.controller');
const requireAuth = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// Routes publiques
router.get('/', evenementController.list);
router.get('/:id', evenementController.getOne);

// Routes protegees (admin uniquement)
router.post('/', requireAuth, upload.single('image'), evenementController.create);
router.put('/:id', requireAuth, upload.single('image'), evenementController.update);
router.delete('/:id', requireAuth, evenementController.remove);

module.exports = router;
