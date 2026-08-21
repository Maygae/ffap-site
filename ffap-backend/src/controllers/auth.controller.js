const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const adminModel = require('../models/admin.model');

async function login(req, res) {
  const { email, mot_de_passe } = req.body;

  // Validation minimale des donnees recues
  if (!email || !mot_de_passe) {
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }

  try {
    const admin = await adminModel.findByEmail(email);

    // Meme message si l'email n'existe pas ou si le mot de passe est faux :
    // on ne donne jamais l'info "cet email n'existe pas" a quelqu'un qui essaie de deviner
    if (!admin) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }

    const motDePasseValide = await bcrypt.compare(mot_de_passe, admin.mot_de_passe);
    if (!motDePasseValide) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }

    // Le token contient juste l'id admin, et expire au bout de 8h
    const token = jwt.sign(
      { adminId: admin.id },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

module.exports = { login };
