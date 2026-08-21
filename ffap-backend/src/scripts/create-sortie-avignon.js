// Cree l'actualite "Sortie Avignon - Le palais des Papes" (categorie sorties).
// L'image doit se trouver dans le dossier photos-a-importer/ a la racine de ffap-backend.
// Usage : node src/scripts/create-sortie-avignon.js

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const API = process.env.API_BASE_URL || 'http://localhost:3000';
const ADMIN_EMAIL = 'ffap.83@gmail.com';
const CHEMIN_IMAGE = path.join(__dirname, '..', '..', 'photos-a-importer', 'sortie-avignon.png');

const sortie = {
  titre: 'Sortie Avignon — Le palais des Papes',
  categorie: 'sorties',
  lieu: 'Avignon',
  date_evenement: '2026-01-17',
  contenu: `La Federation Francaise des Arts Plastiques a egalement organise une sortie culturelle a Avignon visiter le Palais des Papes, reunissant un groupe d'adherents autour d'une journee de decouverte artistique et patrimoniale. Entre patrimoine historique, lieux emblematiques et espaces d'exposition, cette escapade a permis d'explorer la richesse culturelle de la ville.

Dans une atmosphere conviviale, les participants ont pu echanger autour des oeuvres, des lieux visites et de leurs propres pratiques artistiques. Cette sortie a ete l'occasion de nourrir la curiosite, de partager des impressions et de renforcer les liens au sein de la Federation.

En proposant ce type de rendez-vous, la Federation Francaise des Arts Plastiques poursuit son engagement en faveur de la rencontre entre les artistes, les amateurs et les lieux de culture. D'autres sorties et evenements seront programmes afin de continuer a offrir des moments de decouverte, de dialogue et de plaisir partage autour de l'art.`,
};

function demanderMotDePasse() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question('Mot de passe admin (ffap.83@gmail.com) : ', (reponse) => {
      rl.close();
      resolve(reponse);
    });
  });
}

async function main() {
  const password = await demanderMotDePasse();

  const loginRes = await fetch(`${API}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, mot_de_passe: password }),
  });
  const loginData = await loginRes.json();
  if (!loginRes.ok) {
    console.error('Echec de connexion :', loginData.error);
    process.exit(1);
  }
  const token = loginData.token;

  // Upsert : si la sortie existe deja (meme titre), on la met a jour au lieu d'en creer une 2e.
  const listeRes = await fetch(`${API}/api/actualites`);
  const liste = await listeRes.json();
  const existante = liste.find((a) => a.titre === sortie.titre);

  const form = new FormData();
  form.append('titre', sortie.titre);
  form.append('categorie', sortie.categorie);
  form.append('lieu', sortie.lieu);
  form.append('date_evenement', sortie.date_evenement);
  form.append('contenu', sortie.contenu);

  if (fs.existsSync(CHEMIN_IMAGE)) {
    const buffer = fs.readFileSync(CHEMIN_IMAGE);
    const blob = new Blob([buffer], { type: 'image/png' });
    form.append('image', blob, 'sortie-avignon.png');
  } else {
    console.warn('Image introuvable, la sortie sera enregistree sans photo.');
  }

  const url = existante ? `${API}/api/actualites/${existante.id}` : `${API}/api/actualites`;
  const method = existante ? 'PUT' : 'POST';

  const res = await fetch(url, {
    method,
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  const data = await res.json();
  if (!res.ok) {
    console.error('Echec :', data.error);
  } else {
    console.log(`${existante ? 'Sortie mise a jour' : 'Sortie creee'} :`, sortie.titre);
  }
}

main();
