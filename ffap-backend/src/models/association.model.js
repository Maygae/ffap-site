const db = require('../config/db');

async function findAll() {
  const [rows] = await db.query('SELECT * FROM association ORDER BY nom ASC');
  return rows;
}

async function findById(id) {
  const [rows] = await db.query('SELECT * FROM association WHERE id = ?', [id]);
  return rows[0] || null;
}

async function create({ nom, logo, description, lien_externe }) {
  const [result] = await db.query(
    'INSERT INTO association (nom, logo, description, lien_externe) VALUES (?, ?, ?, ?)',
    [nom, logo, description, lien_externe]
  );
  return result.insertId;
}

async function update(id, { nom, logo, description, lien_externe }) {
  await db.query(
    `UPDATE association
     SET nom = ?, logo = COALESCE(?, logo), description = ?, lien_externe = ?
     WHERE id = ?`,
    [nom, logo, description, lien_externe, id]
  );
}

async function remove(id) {
  await db.query('DELETE FROM association WHERE id = ?', [id]);
}

module.exports = { findAll, findById, create, update, remove };
