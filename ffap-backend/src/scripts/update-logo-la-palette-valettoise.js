// Ajoute le logo de "La Palette Valettoise" (sans toucher a la description deja en place).
// Le logo doit se trouver dans le dossier photos-a-importer/ a la racine de ffap-backend.
// Usage : node src/scripts/update-logo-la-palette-valettoise.js

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const API = process.env.API_BASE_URL || 'http://localhost:3000';
const ADMIN_EMAIL = 'ffap.83@gmail.com';
const NOM = 'La Palette Valettoise';
const CHEMIN_LOGO = path.join(__dirname, '..', '..', 'photos-a-importer', 'logo-la-palette-valettoise.jpg');

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

  const listeRes = await fetch(`${API}/api/associations`);
  const liste = await listeRes.json();
  const asso = liste.find((a) => a.nom === NOM);

  if (!asso) {
    console.error(`Association introuvable : ${NOM}`);
    process.exit(1);
  }

  if (!fs.existsSync(CHEMIN_LOGO)) {
    console.error(`Logo introuvable : ${CHEMIN_LOGO}`);
    process.exit(1);
  }

  const form = new FormData();
  form.append('nom', asso.nom);
  form.append('description', asso.description || '');
  const buffer = fs.readFileSync(CHEMIN_LOGO);
  const blob = new Blob([buffer], { type: 'image/jpeg' });
  form.append('logo', blob, 'logo-la-palette-valettoise.jpg');

  const res = await fetch(`${API}/api/associations/${asso.id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  const data = await res.json();
  if (!res.ok) {
    console.error('Echec :', data.error);
  } else {
    console.log('Logo ajoute :', NOM);
  }
}

main();
