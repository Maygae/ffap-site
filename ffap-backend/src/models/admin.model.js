// Toutes les requetes SQL liees a la table "admin" passent par ce fichier.
// Objectif : garder les controleurs lisibles (logique metier) separes du SQL brut.

const db = require('../config/db');

async function findByEmail(email) {
  const [rows] = await db.query(
    'SELECT * FROM admin WHERE email = ? LIMIT 1',
    [email]
  );
  return rows[0] || null;
}

async function create(email, motDePasseHash) {
  const [result] = await db.query(
    'INSERT INTO admin (email, mot_de_passe) VALUES (?, ?)',
    [email, motDePasseHash]
  );
  return result.insertId;
}

async function updatePassword(email, motDePasseHash) {
  const [result] = await db.query(
    'UPDATE admin SET mot_de_passe = ? WHERE email = ?',
    [motDePasseHash, email]
  );
  return result.affectedRows;
}

module.exports = { findByEmail, create, updatePassword };
