// Galerie photo d'une actualite/evenement (plusieurs images possibles), sur le meme principe
// que la galerie d'oeuvres d'un artiste.

const db = require('../config/db');

async function findByActualite(actualiteId) {
  const [rows] = await db.query(
    'SELECT * FROM actualite_image WHERE actualite_id = ? ORDER BY created_at ASC',
    [actualiteId]
  );
  return rows;
}

async function create({ actualiteId, image }) {
  const [result] = await db.query(
    'INSERT INTO actualite_image (actualite_id, image) VALUES (?, ?)',
    [actualiteId, image]
  );
  return result.insertId;
}

async function remove(id) {
  await db.query('DELETE FROM actualite_image WHERE id = ?', [id]);
}

module.exports = { findByActualite, create, remove };
