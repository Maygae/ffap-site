// Ajoute les 2 oeuvres de Christian Disty a sa fiche (galerie).
// Les images doivent se trouver dans le dossier photos-a-importer/ a la racine de ffap-backend.
// Usage : node src/scripts/upload-oeuvres-christian.js

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const API = process.env.API_BASE_URL || 'http://localhost:3000';
const ADMIN_EMAIL = 'ffap.83@gmail.com';
const DOSSIER_PHOTOS = path.join(__dirname, '..', '..', 'photos-a-importer');
const NOM_ARTISTE = 'Christian Disty';

const oeuvres = [
  { titre: 'Lion', fichier: 'oeuvre-christian-lion.png' },
  { titre: 'Regard de louve', fichier: 'oeuvre-christian-louve.png' },
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
  const artiste = liste.find((a) => a.nom === NOM_ARTISTE);

  if (!artiste) {
    console.error(`Artiste introuvable : ${NOM_ARTISTE}`);
    process.exit(1);
  }

  for (const { titre, fichier } of oeuvres) {
    const cheminImage = path.join(DOSSIER_PHOTOS, fichier);
    if (!fs.existsSync(cheminImage)) {
      console.error(`Image introuvable : ${cheminImage}`);
      continue;
    }

    const buffer = fs.readFileSync(cheminImage);
    const blob = new Blob([buffer], { type: 'image/png' });

    const form = new FormData();
    form.append('titre', titre);
    form.append('image', blob, fichier);

    const res = await fetch(`${API}/api/artistes/${artiste.id}/oeuvres`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });
    const data = await res.json();
    if (!res.ok) {
      console.error(`Echec pour "${titre}" :`, data.error);
    } else {
      console.log(`Oeuvre ajoutee : ${titre}`);
    }
  }
}

main();
