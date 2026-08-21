const express = require('express');
const router = express.Router();
const associationController = require('../controllers/association.controller');
const requireAuth = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// Routes publiques
router.get('/', associationController.list);
router.get('/:id', associationController.getOne);

// Routes protegees (admin uniquement)
router.post('/', requireAuth, upload.single('logo'), associationController.create);
router.put('/:id', requireAuth, upload.single('logo'), associationController.update);
router.delete('/:id', requireAuth, associationController.remove);

module.exports = router;
