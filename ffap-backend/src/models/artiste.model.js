const db = require('../config/db');

async function findAll() {
  const [rows] = await db.query(
    'SELECT id, nom, discipline, photo, created_at FROM artiste ORDER BY created_at DESC'
  );
  return rows;
}

async function findById(id) {
  const [rows] = await db.query('SELECT * FROM artiste WHERE id = ?', [id]);
  return rows[0] || null;
}

async function create({ nom, discipline, bio, photo }) {
  const [result] = await db.query(
    'INSERT INTO artiste (nom, discipline, bio, photo) VALUES (?, ?, ?, ?)',
    [nom, discipline, bio, photo]
  );
  return result.insertId;
}

async function update(id, { nom, discipline, bio, photo }) {
  // Si aucune nouvelle photo n'est envoyee, on garde l'ancienne (COALESCE)
  await db.query(
    `UPDATE artiste
     SET nom = ?, discipline = ?, bio = ?, photo = COALESCE(?, photo)
     WHERE id = ?`,
    [nom, discipline, bio, photo, id]
  );
}

async function remove(id) {
  await db.query('DELETE FROM artiste WHERE id = ?', [id]);
}

module.exports = { findAll, findById, create, update, remove };
