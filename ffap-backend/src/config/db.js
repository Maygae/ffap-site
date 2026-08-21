// Connexion a la base de donnees MySQL, partagee par toute l'application.
// On utilise un "pool" de connexions (plutot qu'une seule connexion) :
// chaque requete emprunte une connexion libre dans le pool puis la rend,
// ce qui evite de saturer le serveur MySQL si plusieurs requetes arrivent en meme temps.

require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  // Sans cette option, mysql2 convertit les colonnes DATE en objets Date JS
  // en utilisant le fuseau horaire du serveur Node, ce qui decale la date
  // (ex. 2027-03-04 devient 2027-03-03 une fois converti en UTC pour le JSON).
  // "dateStrings: true" garde les dates telles quelles, en chaine "AAAA-MM-JJ".
  dateStrings: true,
});

module.exports = pool;
