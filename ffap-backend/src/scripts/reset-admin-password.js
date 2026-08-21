// Reinitialise le mot de passe du compte admin existant (utile si le mot de passe est oublie).
// Usage : node src/scripts/reset-admin-password.js monemail@ffap.fr nouveauMotDePasse

require('dotenv').config();
const bcrypt = require('bcryptjs');
const adminModel = require('../models/admin.model');

async function run() {
  const [, , email, nouveauMotDePasse] = process.argv;

  if (!email || !nouveauMotDePasse) {
    console.error('Usage : node src/scripts/reset-admin-password.js <email> <nouveau_mot_de_passe>');
    process.exit(1);
  }

  const existant = await adminModel.findByEmail(email);
  if (!existant) {
    console.error(`Aucun admin trouve avec l'email ${email}`);
    process.exit(1);
  }

  const hash = await bcrypt.hash(nouveauMotDePasse, 10);
  await adminModel.updatePassword(email, hash);

  console.log(`Mot de passe mis a jour pour ${email}`);
  process.exit(0);
}

run().catch((error) => {
  console.error('Erreur lors de la reinitialisation :', error.message);
  process.exit(1);
});
