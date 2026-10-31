// Importe le schema et les donnees (sql/import_data_production.sql) dans la base
// de production MySQL hebergee chez Aiven.
//
// Usage (depuis le dossier ffap-backend) :
//   node src/scripts/import-production-data.js
//
// Le mot de passe Aiven est demande au lancement (il n'est jamais ecrit dans le code).
// Le certificat CA d'Aiven est lu dans sql/aiven-ca.pem.

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const mysql = require('mysql2/promise');

const SQL_DIR = path.join(__dirname, '..', '..', 'sql');

const CONNEXION = {
  host: process.env.AIVEN_HOST || 'ffap-db-ffap-site.g.aivencloud.com',
  port: Number(process.env.AIVEN_PORT || 25121),
  user: process.env.AIVEN_USER || 'avnadmin',
  database: process.env.AIVEN_DB || 'defaultdb',
  ssl: { ca: fs.readFileSync(path.join(SQL_DIR, 'aiven-ca.pem'), 'utf8') },
  multipleStatements: true,
};

// Demande le mot de passe sans l'afficher a l'ecran
function demanderMotDePasse() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    process.stdout.write('Mot de passe Aiven (rien ne s\'affiche quand tu tapes ou colles) : ');
    rl._writeToOutput = () => {};
    rl.question('', (reponse) => {
      rl.close();
      process.stdout.write('\n');
      resolve(reponse.trim());
    });
  });
}

async function run() {
  const password = process.env.AIVEN_PASSWORD || (await demanderMotDePasse());

  console.log('Connexion a la base Aiven...');
  const connexion = await mysql.createConnection({ ...CONNEXION, password });

  // 1) Tables : on ne cree que celles qui n'existent pas encore
  const schema = fs
    .readFileSync(path.join(SQL_DIR, 'schema_tables_only.sql'), 'utf8')
    .replace(/CREATE TABLE (?!IF NOT EXISTS)/g, 'CREATE TABLE IF NOT EXISTS ');
  console.log('Creation des tables...');
  await connexion.query(schema);

  // 2) Donnees : vide les tables puis reinsere le contenu
  const donnees = fs.readFileSync(path.join(SQL_DIR, 'import_data_production.sql'), 'utf8');
  console.log('Import des donnees...');
  await connexion.query(donnees);

  // 3) Verification
  const tables = ['artiste', 'oeuvre', 'actualite', 'actualite_image', 'association', 'admin', 'message_contact', 'fichier'];
  for (const table of tables) {
    const [rows] = await connexion.query(`SELECT COUNT(*) AS n FROM \`${table}\``);
    console.log(`  ${table} : ${rows[0].n} ligne(s)`);
  }

  console.log('Import termine avec succes.');
  await connexion.end();
}

run().catch((error) => {
  console.error('Erreur pendant l\'import :', error.message);
  process.exit(1);
});
