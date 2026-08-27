// Importe le contenu de sql/import_data_production.sql dans la base Railway (production),
// en se connectant via l'adresse publique (proxy TCP) plutot que par la zone de requete
// du navigateur, qui coupe les textes trop longs.
//
// Usage : node src/scripts/import-production-data.js
//
// Rappel : desactive le "Public Networking" de la base MySQL sur Railway une fois
// l'import termine, pour ne pas laisser la base accessible depuis l'exterieur en permanence.

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const CONNEXION = {
  host: 'altaria.proxy.rlwy.net',
  port: 50857,
  user: 'root',
  password: 'NIFEJdsHxsQcfeLNtRaRXcWNxlzzOxJz',
  database: 'railway',
  multipleStatements: true,
};

async function run() {
  const cheminSql = path.join(__dirname, '..', '..', 'sql', 'import_data_production.sql');
  const sql = fs.readFileSync(cheminSql, 'utf8');

  console.log('Connexion a la base Railway...');
  const connexion = await mysql.createConnection(CONNEXION);

  console.log('Execution du script SQL...');
  await connexion.query(sql);

  console.log('Import termine avec succes.');
  await connexion.end();
}

run().catch((error) => {
  console.error('Erreur pendant l\'import :', error.message);
  process.exit(1);
});
