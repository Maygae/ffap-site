const artisteModel = require('../models/artiste.model');
const oeuvreModel = require('../models/oeuvre.model');

// GET /api/artistes — liste publique
async function list(req, res) {
  try {
    const artistes = await artisteModel.findAll();
    res.json(artistes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

// GET /api/artistes/:id — fiche publique avec ses oeuvres
async function getOne(req, res) {
  try {
    const artiste = await artisteModel.findById(req.params.id);
    if (!artiste) {
      return res.status(404).json({ error: 'Artiste introuvable' });
    }
    const oeuvres = await oeuvreModel.findByArtiste(artiste.id);
    res.json({ ...artiste, oeuvres });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

// POST /api/artistes — protege (admin)
async function create(req, res) {
  const { nom, discipline, bio } = req.body;

  if (!nom) {
    return res.status(400).json({ error: 'Le nom de l\'artiste est requis' });
  }

  try {
    const photo = req.file ? `/uploads/${req.file.filename}` : null;
    const id = await artisteModel.create({ nom, discipline, bio, photo });
    res.status(201).json({ id, nom, discipline, bio, photo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

// PUT /api/artistes/:id — protege (admin)
async function update(req, res) {
  const { nom, discipline, bio } = req.body;

  if (!nom) {
    return res.status(400).json({ error: 'Le nom de l\'artiste est requis' });
  }

  try {
    const existant = await artisteModel.findById(req.params.id);
    if (!existant) {
      return res.status(404).json({ error: 'Artiste introuvable' });
    }

    const photo = req.file ? `/uploads/${req.file.filename}` : null;
    await artisteModel.update(req.params.id, { nom, discipline, bio, photo });
    res.json({ message: 'Artiste mis a jour' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

// DELETE /api/artistes/:id — protege (admin)
async function remove(req, res) {
  try {
    const existant = await artisteModel.findById(req.params.id);
    if (!existant) {
      return res.status(404).json({ error: 'Artiste introuvable' });
    }
    await artisteModel.remove(req.params.id);
    res.json({ message: 'Artiste supprime' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

// POST /api/artistes/:id/oeuvres — protege (admin)
async function addOeuvre(req, res) {
  const { titre, description } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: 'Une image est requise pour l\'oeuvre' });
  }

  try {
    const artiste = await artisteModel.findById(req.params.id);
    if (!artiste) {
      return res.status(404).json({ error: 'Artiste introuvable' });
    }

    const image = `/uploads/${req.file.filename}`;
    const id = await oeuvreModel.create({
      artisteId: req.params.id,
      titre,
      image,
      description,
    });
    res.status(201).json({ id, titre, image, description });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

// DELETE /api/oeuvres/:id — protege (admin)
async function removeOeuvre(req, res) {
  try {
    await oeuvreModel.remove(req.params.id);
    res.json({ message: 'Oeuvre supprimee' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

module.exports = { list, getOne, create, update, remove, addOeuvre, removeOeuvre };
