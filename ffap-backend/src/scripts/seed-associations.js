// Cree/met a jour les 4 associations membres de la FFAP (upsert, pas de doublon).
// Les logos doivent se trouver dans le dossier photos-a-importer/ a la racine de ffap-backend.
// Usage : node src/scripts/seed-associations.js

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const API = process.env.API_BASE_URL || 'http://localhost:3000';
const ADMIN_EMAIL = 'ffap.83@gmail.com';
const DOSSIER_PHOTOS = path.join(__dirname, '..', '..', 'photos-a-importer');

// nomExistant permet de retrouver une association deja en base sous un ancien nom
// (ex. "Galerie de Giens" renommee en "Les Artistes Arbanais").
const associations = [
  {
    nom: 'Les Artistes Gardeens',
    nomExistant: 'Les Artistes Gardeens',
    description: 'Association basee a La Garde, dediee a la promotion de l\'art sous toutes ses formes (peinture, aquarelle, modelage, dessin, vitraux), a travers cours, ateliers libres et expositions (Salon de Printemps, salle Gerard Philipe).',
    fichier: 'logo-artistes-gardeens.jpg',
    type: 'image/jpeg',
  },
  {
    nom: 'La Palette Valettoise',
    nomExistant: 'La Palette Valettoise',
    description: '',
    fichier: null,
    type: null,
  },
  {
    nom: 'Couleurs Revestoises',
    nomExistant: 'Couleurs Revestoises',
    description: "Association d'artistes du Revest-les-Eaux",
    fichier: 'logo-couleurs-revestoises.png',
    type: 'image/png',
  },
  {
    nom: 'Les Artistes Arbanais',
    nomExistant: 'Galerie de Giens', // ancien nom en base, a renommer
    description: 'Association des artistes arbanais, exposant notamment a la Galerie de Giens.',
    fichier: 'logo-galerie-de-giens.jpg',
    type: 'image/jpeg',
  },
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

  const listeRes = await fetch(`${API}/api/associations`);
  const liste = await listeRes.json();

  for (const asso of associations) {
    const existante = liste.find((a) => a.nom === asso.nomExistant);
    const method = existante ? 'PUT' : 'POST';
    const url = existante ? `${API}/api/associations/${existante.id}` : `${API}/api/associations`;

    const form = new FormData();
    form.append('nom', asso.nom);
    form.append('description', asso.description || '');

    if (asso.fichier) {
      const cheminLogo = path.join(DOSSIER_PHOTOS, asso.fichier);
      if (fs.existsSync(cheminLogo)) {
        const buffer = fs.readFileSync(cheminLogo);
        const blob = new Blob([buffer], { type: asso.type });
        form.append('logo', blob, asso.fichier);
      } else {
        console.warn(`Logo introuvable pour ${asso.nom} : ${cheminLogo}`);
      }
    }

    const res = await fetch(url, {
      method,
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });
    const data = await res.json();
    if (!res.ok) {
      console.error(`Echec pour ${asso.nom} :`, data.error);
    } else {
      console.log(`${method === 'PUT' ? 'Mise a jour' : 'Creee'} : ${asso.nom}`);
    }
  }
}

main();
