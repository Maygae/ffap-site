// Associe une photo a chaque artiste existant (sans toucher au nom/discipline/bio deja en place).
// Les photos doivent se trouver dans le dossier photos-a-importer/ a la racine de ffap-backend.
// Usage : node src/scripts/upload-photos.js

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const API = process.env.API_BASE_URL || 'http://localhost:3000';
const ADMIN_EMAIL = 'ffap.83@gmail.com';
const DOSSIER_PHOTOS = path.join(__dirname, '..', '..', 'photos-a-importer');

const associations = [
  { nom: 'Martine de Santis', fichier: 'martine-de-santis.jpg' },
  { nom: 'Christian Disty', fichier: 'christian-disty.jpeg' },
  { nom: 'Lise Oerlemans', fichier: 'lise-oerlemans.jpeg' },
];

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

  const listeRes = await fetch(`${API}/api/artistes`);
  const liste = await listeRes.json();

  for (const { nom, fichier } of associations) {
    const existant = liste.find((a) => a.nom === nom);
    if (!existant) {
      console.error(`Artiste introuvable en base : ${nom} (lance d'abord update-bios.js)`);
      continue;
    }

    const cheminPhoto = path.join(DOSSIER_PHOTOS, fichier);
    if (!fs.existsSync(cheminPhoto)) {
      console.error(`Photo introuvable : ${cheminPhoto}`);
      continue;
    }

    const extension = path.extname(fichier).toLowerCase();
    const typeMime = extension === '.png' ? 'image/png'
      : extension === '.webp' ? 'image/webp'
      : 'image/jpeg';

    const buffer = fs.readFileSync(cheminPhoto);
    const blob = new Blob([buffer], { type: typeMime });

    const form = new FormData();
    form.append('nom', existant.nom);
    form.append('discipline', existant.discipline || '');
    form.append('bio', existant.bio || '');
    form.append('photo', blob, fichier);

    const res = await fetch(`${API}/api/artistes/${existant.id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });
    const data = await res.json();
    if (!res.ok) {
      console.error(`Echec pour ${nom} :`, data.error);
    } else {
      console.log(`Photo ajoutee : ${nom}`);
    }
  }
}

main();
