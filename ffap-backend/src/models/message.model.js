const db = require('../config/db');

async function findAll() {
  const [rows] = await db.query('SELECT * FROM message_contact ORDER BY created_at DESC');
  return rows;
}

async function findById(id) {
  const [rows] = await db.query('SELECT * FROM message_contact WHERE id = ?', [id]);
  return rows[0] || null;
}

async function create({ nom, email, telephone, message }) {
  const [result] = await db.query(
    'INSERT INTO message_contact (nom, email, telephone, message) VALUES (?, ?, ?, ?)',
    [nom, email, telephone || null, message]
  );
  return result.insertId;
}

async function updateStatut(id, statut) {
  await db.query('UPDATE message_contact SET statut = ? WHERE id = ?', [statut, id]);
}

async function remove(id) {
  await db.query('DELETE FROM message_contact WHERE id = ?', [id]);
}

module.exports = { findAll, findById, create, updateStatut, remove };
