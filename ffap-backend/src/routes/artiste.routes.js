const express = require('express');
const router = express.Router();
const artisteController = require('../controllers/artiste.controller');
const requireAuth = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// Routes publiques (lecture seule)
router.get('/', artisteController.list);
router.get('/:id', artisteController.getOne);

// Routes protegees (admin uniquement)
router.post('/', requireAuth, upload.single('photo'), artisteController.create);
router.put('/:id', requireAuth, upload.single('photo'), artisteController.update);
router.delete('/:id', requireAuth, artisteController.remove);

router.post('/:id/oeuvres', requireAuth, upload.single('image'), artisteController.addOeuvre);

module.exports = router;
