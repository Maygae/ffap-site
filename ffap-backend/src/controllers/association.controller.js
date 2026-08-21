const associationModel = require('../models/association.model');

// GET /api/associations — liste publique
async function list(req, res) {
  try {
    const associations = await associationModel.findAll();
    res.json(associations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

// GET /api/associations/:id — fiche publique
async function getOne(req, res) {
  try {
    const association = await associationModel.findById(req.params.id);
    if (!association) {
      return res.status(404).json({ error: 'Association introuvable' });
    }
    res.json(association);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

// POST /api/associations — protege (admin)
async function create(req, res) {
  const { nom, description, lien_externe } = req.body;

  if (!nom) {
    return res.status(400).json({ error: 'Le nom de l\'association est requis' });
  }

  try {
    const logo = req.file ? `/uploads/${req.file.filename}` : null;
    const id = await associationModel.create({ nom, logo, description, lien_externe });
    res.status(201).json({ id, nom, logo, description, lien_externe });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

// PUT /api/associations/:id — protege (admin)
async function update(req, res) {
  const { nom, description, lien_externe } = req.body;

  if (!nom) {
    return res.status(400).json({ error: 'Le nom de l\'association est requis' });
  }

  try {
    const existante = await associationModel.findById(req.params.id);
    if (!existante) {
      return res.status(404).json({ error: 'Association introuvable' });
    }

    const logo = req.file ? `/uploads/${req.file.filename}` : null;
    await associationModel.update(req.params.id, { nom, logo, description, lien_externe });
    res.json({ message: 'Association mise a jour' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

// DELETE /api/associations/:id — protege (admin)
async function remove(req, res) {
  try {
    const existante = await associationModel.findById(req.params.id);
    if (!existante) {
      return res.status(404).json({ error: 'Association introuvable' });
    }
    await associationModel.remove(req.params.id);
    res.json({ message: 'Association supprimee' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

module.exports = { list, getOne, create, update, remove };
