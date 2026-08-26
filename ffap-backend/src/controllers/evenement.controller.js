const evenementModel = require('../models/evenement.model');
const actualiteImageModel = require('../models/actualite-image.model');

const CATEGORIES_VALIDES = ['evenement', 'sorties', 'exposition'];

// Coerce la valeur envoyee par le formulaire (form-data) en booleen JS.
// Une case a cocher non cochee n'envoie souvent aucune valeur -> false par defaut.
function versBooleen(valeur) {
  return valeur === true || valeur === 'true' || valeur === '1' || valeur === 'on';
}

// GET /api/actualites?categorie=evenement — liste publique, filtre optionnel
async function list(req, res) {
  try {
    const { categorie } = req.query;

    if (categorie && !CATEGORIES_VALIDES.includes(categorie)) {
      return res.status(400).json({
        error: `Categorie invalide. Valeurs autorisees : ${CATEGORIES_VALIDES.join(', ')}`,
      });
    }

    const evenements = await evenementModel.findAll(categorie);
    res.json(evenements);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

// GET /api/actualites/:id — fiche publique
async function getOne(req, res) {
  try {
    const evenement = await evenementModel.findById(req.params.id);
    if (!evenement) {
      return res.status(404).json({ error: 'Evenement introuvable' });
    }
    const images = await actualiteImageModel.findByActualite(evenement.id);
    res.json({ ...evenement, images });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

// POST /api/actualites/:id/images — protege (admin), ajoute une photo a la galerie
async function addImage(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: 'Une image est requise' });
  }

  try {
    const evenement = await evenementModel.findById(req.params.id);
    if (!evenement) {
      return res.status(404).json({ error: 'Evenement introuvable' });
    }

    const image = `/uploads/${req.file.filename}`;
    const id = await actualiteImageModel.create({ actualiteId: req.params.id, image });
    res.status(201).json({ id, image });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

// DELETE /api/images/:id — protege (admin)
async function removeImage(req, res) {
  try {
    await actualiteImageModel.remove(req.params.id);
    res.json({ message: 'Image supprimee' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

// POST /api/actualites — protege (admin)
async function create(req, res) {
  const { titre, contenu, categorie, date_evenement, lieu } = req.body;
  const a_la_une = versBooleen(req.body.a_la_une);

  if (!titre || !categorie) {
    return res.status(400).json({ error: 'Le titre et la categorie sont requis' });
  }
  if (!CATEGORIES_VALIDES.includes(categorie)) {
    return res.status(400).json({
      error: `Categorie invalide. Valeurs autorisees : ${CATEGORIES_VALIDES.join(', ')}`,
    });
  }

  try {
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    const id = await evenementModel.create({ titre, contenu, image, categorie, date_evenement, lieu, a_la_une });
    res.status(201).json({ id, titre, contenu, image, categorie, date_evenement, lieu, a_la_une });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

// PUT /api/actualites/:id — protege (admin)
async function update(req, res) {
  const { titre, contenu, categorie, date_evenement, lieu } = req.body;
  const a_la_une = versBooleen(req.body.a_la_une);

  if (!titre || !categorie) {
    return res.status(400).json({ error: 'Le titre et la categorie sont requis' });
  }
  if (!CATEGORIES_VALIDES.includes(categorie)) {
    return res.status(400).json({
      error: `Categorie invalide. Valeurs autorisees : ${CATEGORIES_VALIDES.join(', ')}`,
    });
  }

  try {
    const existant = await evenementModel.findById(req.params.id);
    if (!existant) {
      return res.status(404).json({ error: 'Evenement introuvable' });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : null;
    await evenementModel.update(req.params.id, { titre, contenu, image, categorie, date_evenement, lieu, a_la_une });
    res.json({ message: 'Evenement mis a jour' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

// DELETE /api/actualites/:id — protege (admin)
async function remove(req, res) {
  try {
    const existant = await evenementModel.findById(req.params.id);
    if (!existant) {
      return res.status(404).json({ error: 'Evenement introuvable' });
    }
    await evenementModel.remove(req.params.id);
    res.json({ message: 'Evenement supprime' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

module.exports = { list, getOne, create, update, remove, addImage, removeImage };
