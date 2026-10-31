// Stockage des images directement dans la base MySQL (table "fichier").
// Pourquoi : l'hebergeur gratuit (Render) efface son disque a chaque redemarrage,
// les images envoyees depuis le back-office seraient donc perdues si on les gardait sur le disque.

const db = require('../config/db');

const CREATE_TABLE = `
  CREATE TABLE IF NOT EXISTS fichier (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom_original VARCHAR(255),
    type_mime VARCHAR(50) NOT NULL,
    donnees MEDIUMBLOB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`;

// Cree la table au demarrage du serveur si elle n'existe pas encore
async function ensureTable() {
  await db.query(CREATE_TABLE);
}

async function create({ nomOriginal, typeMime, donnees }) {
  const [result] = await db.query(
    'INSERT INTO fichier (nom_original, type_mime, donnees) VALUES (?, ?, ?)',
    [nomOriginal, typeMime, donnees]
  );
  return result.insertId;
}

async function findById(id) {
  const [rows] = await db.query('SELECT type_mime, donnees FROM fichier WHERE id = ?', [id]);
  return rows[0];
}

module.exports = { ensureTable, create, findById };
