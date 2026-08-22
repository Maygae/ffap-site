// Cree l'evenement "Salon des Arts Contemporains - Hyeres" (categorie evenement).
// Aucune image fournie pour le moment.
// Usage : node src/scripts/create-salon-arts-contemporains-2026.js

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const API = process.env.API_BASE_URL || 'http://localhost:3000';
const ADMIN_EMAIL = 'ffap.83@gmail.com';
const CHEMIN_IMAGE = path.join(__dirname, '..', '..', 'photos-a-importer', 'salon2026.jpg');

const evenement = {
  titre: 'Salon des Arts Contemporains — Hyeres',
  categorie: 'evenement',
  lieu: 'Forum du Casino, avenue Ambroise Thomas, Hyeres',
  date_evenement: '2026-04-30',
  contenu: `Du 30 avril au 3 mai 2026 — Forum du Casino a Hyeres

La Federation Francaise des Arts Plastiques organise son Salon des Arts Contemporains au Forum du Casino a Hyeres, avenue Ambroise Thomas, du 30 avril au 3 mai 2026. Cet evenement rassemblera peintres, sculpteurs, dessinateurs, aquarellistes, photographes et artisans d'art venus de toute la France pour quatre jours de creation et de rencontres avec le public.

Les invitees d'honneur de cette edition seront les Bombaspheres, un collectif d'artistes parisiennes specialise dans le street art. Chaque jour, un show unique sera propose, avec des performances en direct et la realisation d'oeuvres sur place, offrant aux visiteurs l'occasion d'assister au travail des artistes en temps reel.

Le salon sera ouvert de 10h a 19h, avec une entree gratuite, afin de permettre au plus grand nombre de decouvrir la diversite des pratiques artistiques contemporaines. Une restauration sur place sera egalement proposee pour profiter pleinement de la journee.`,
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

  // Upsert : si un evenement du meme titre existe deja, on le met a jour plutot que d'en creer un 2e.
  const listeRes = await fetch(`${API}/api/actualites`);
  const liste = await listeRes.json();
  const existant = liste.find((a) => a.titre === evenement.titre);

  const form = new FormData();
  form.append('titre', evenement.titre);
  form.append('categorie', evenement.categorie);
  form.append('lieu', evenement.lieu);
  form.append('date_evenement', evenement.date_evenement);
  form.append('contenu', evenement.contenu);

  if (fs.existsSync(CHEMIN_IMAGE)) {
    const buffer = fs.readFileSync(CHEMIN_IMAGE);
    const blob = new Blob([buffer], { type: 'image/jpeg' });
    form.append('image', blob, 'salon2026.jpg');
  } else {
    console.warn('Image introuvable, l\'evenement sera enregistre sans photo.');
  }

  const url = existant ? `${API}/api/actualites/${existant.id}` : `${API}/api/actualites`;
  const method = existant ? 'PUT' : 'POST';

  const res = await fetch(url, {
    method,
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  const data = await res.json();
  if (!res.ok) {
    console.error('Echec :', data.error);
  } else {
    console.log(`${existant ? 'Evenement mis a jour' : 'Evenement cree'} :`, evenement.titre);
  }
}

main();
