// Change le mot de passe d'un compte du back-office, directement dans la base Aiven.
//
// Usage (depuis le dossier ffap-backend) :
//   node src/scripts/changer-mot-de-passe-admin.js
//
// Tout est demande au lancement, rien ne s'affiche a l'ecran et rien n'est ecrit
// dans le code ni dans l'historique du Terminal.

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

const SQL_DIR = path.join(__dirname, '..', '..', 'sql');

const CONNEXION = {
  host: process.env.AIVEN_HOST || 'ffap-db-ffap-site.g.aivencloud.com',
  port: Number(process.env.AIVEN_PORT || 25121),
  user: process.env.AIVEN_USER || 'avnadmin',
  database: process.env.AIVEN_DB || 'defaultdb',
  ssl: { ca: fs.readFileSync(path.join(SQL_DIR, 'aiven-ca.pem'), 'utf8') },
};

function demander(question, cache = false) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    process.stdout.write(question);
    if (cache) rl._writeToOutput = () => {};
    rl.question('', (reponse) => {
      rl.close();
      if (cache) process.stdout.write('\n');
      resolve(reponse.trim());
    });
  });
}

async function run() {
  const motDePasseAiven = process.env.AIVEN_PASSWORD
    || (await demander('Mot de passe Aiven (invisible) : ', true));
  const email = await demander('Email du compte back-office : ');
  const nouveau = await demander('Nouveau mot de passe du back-office (invisible) : ', true);
  const confirmation = await demander('Retape le nouveau mot de passe (invisible) : ', true);

  if (nouveau !== confirmation) throw new Error('Les deux mots de passe ne sont pas identiques.');
  if (nouveau.length < 12) throw new Error('Le mot de passe doit faire au moins 12 caracteres.');

  const connexion = await mysql.createConnection({ ...CONNEXION, password: motDePasseAiven });
  const hash = await bcrypt.hash(nouveau, 10);
  const [resultat] = await connexion.query('UPDATE admin SET mot_de_passe = ? WHERE email = ?', [hash, email]);
  await connexion.end();

  if (resultat.affectedRows === 0) throw new Error(`Aucun compte trouve avec l'email ${email}.`);
  console.log(`Mot de passe mis a jour pour ${email}.`);
}

run().catch((error) => {
  console.error('Erreur :', error.message);
  process.exit(1);
});
