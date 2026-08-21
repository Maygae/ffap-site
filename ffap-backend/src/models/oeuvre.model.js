const db = require('../config/db');

async function findByArtiste(artisteId) {
  const [rows] = await db.query(
    'SELECT * FROM oeuvre WHERE artiste_id = ? ORDER BY created_at DESC',
    [artisteId]
  );
  return rows;
}

async function create({ artisteId, titre, image, description }) {
  const [result] = await db.query(
    'INSERT INTO oeuvre (artiste_id, titre, image, description) VALUES (?, ?, ?, ?)',
    [artisteId, titre, image, description]
  );
  return result.insertId;
}

async function remove(id) {
  await db.query('DELETE FROM oeuvre WHERE id = ?', [id]);
}

module.exports = { findByArtiste, create, remove };
