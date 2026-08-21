// Script a lancer une seule fois pour creer le compte admin.
// Usage : node src/scripts/create-admin.js monemail@ffap.fr monMotDePasse

require('dotenv').config();
const bcrypt = require('bcryptjs');
const adminModel = require('../models/admin.model');

async function run() {
  const [, , email, motDePasse] = process.argv;

  if (!email || !motDePasse) {
    console.error('Usage : node src/scripts/create-admin.js <email> <mot_de_passe>');
    process.exit(1);
  }

  const hash = await bcrypt.hash(motDePasse, 10);
  const id = await adminModel.create(email, hash);

  console.log(`Admin cree avec succes (id ${id}, email ${email})`);
  process.exit(0);
}

run().catch((error) => {
  console.error('Erreur lors de la creation de l\'admin :', error.message);
  process.exit(1);
});
