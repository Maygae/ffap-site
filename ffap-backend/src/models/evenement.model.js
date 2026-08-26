const db = require('../config/db');

async function findAll(categorie) {
  if (categorie) {
    const [rows] = await db.query(
      'SELECT * FROM actualite WHERE categorie = ? ORDER BY published_at DESC',
      [categorie]
    );
    return rows;
  }
  const [rows] = await db.query('SELECT * FROM actualite ORDER BY published_at DESC');
  return rows;
}

async function findById(id) {
  const [rows] = await db.query('SELECT * FROM actualite WHERE id = ?', [id]);
  return rows[0] || null;
}

async function create({ titre, contenu, image, categorie, date_evenement, lieu, a_la_une }) {
  const [result] = await db.query(
    `INSERT INTO actualite (titre, contenu, image, categorie, date_evenement, lieu, a_la_une)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [titre, contenu, image, categorie, date_evenement || null, lieu, a_la_une ? 1 : 0]
  );
  return result.insertId;
}

async function update(id, { titre, contenu, image, categorie, date_evenement, lieu, a_la_une }) {
  await db.query(
    `UPDATE actualite
     SET titre = ?, contenu = ?, image = COALESCE(?, image),
         categorie = ?, date_evenement = ?, lieu = ?, a_la_une = ?
     WHERE id = ?`,
    [titre, contenu, image, categorie, date_evenement || null, lieu, a_la_une ? 1 : 0, id]
  );
}

async function remove(id) {
  await db.query('DELETE FROM actualite WHERE id = ?', [id]);
}

module.exports = { findAll, findById, create, update, remove };
