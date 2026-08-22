// Cree l'actualite "Sortie au Chateau La Coste" (categorie sorties).
// L'image doit se trouver dans le dossier photos-a-importer/ a la racine de ffap-backend.
// Usage : node src/scripts/create-sortie-chateau-la-coste.js

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const API = process.env.API_BASE_URL || 'http://localhost:3000';
const ADMIN_EMAIL = 'ffap.83@gmail.com';
const DOSSIER_PHOTOS = path.join(__dirname, '..', '..', 'photos-a-importer');
const CHEMIN_IMAGE = path.join(DOSSIER_PHOTOS, 'sortie-chateau-la-coste.jpeg');

const sortie = {
  titre: 'Sortie au Chateau La Coste',
  categorie: 'sorties',
  lieu: 'Chateau La Coste',
  date_evenement: '2025-10-25',
  contenu: `Le 25 octobre 2025, la Federation Francaise des Arts Plastiques a organise une journee de decouverte au Chateau La Coste, reunissant un groupe de cinquante participants. Dans un cadre melant art, architecture et nature, cette sortie a ete l'occasion de partager un moment convivial autour de la creation contemporaine.

La meteo particulierement agreable a permis de profiter pleinement du site, des promenades en exterieur et des oeuvres disseminees dans le paysage. Entre sculptures monumentales, installations et expositions, les participants ont pu faire de belles decouvertes artistiques tout au long du parcours.

Cette journee a egalement favorise les echanges entre artistes et amateurs d'art, dans un esprit de rencontre et de partage. Chacun est reparti enrichi de nouvelles inspirations, de points de vue croises et du souvenir d'un moment chaleureux passe ensemble.

En proposant ce type de sortie culturelle, la Federation Francaise des Arts Plastiques poursuit sa mission de valorisation de la creation artistique et de mise en lien des publics avec des lieux d'art majeurs.`,
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

  // Upsert : si l'actualite existe deja (meme titre), on la met a jour plutot que d'en creer une 2e.
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
    const blob = new Blob([buffer], { type: 'image/jpeg' });
    form.append('image', blob, 'sortie-chateau-la-coste.jpeg');
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
    return;
  }
  console.log(`${existante ? 'Sortie mise a jour' : 'Sortie creee'} :`, sortie.titre);

  const actualiteId = existante ? existante.id : data.id;

  // Ajoute la 2e photo dans la galerie de cette sortie
  const cheminImage2 = path.join(DOSSIER_PHOTOS, 'sortie-chateau-la-coste-2.jpeg');
  if (fs.existsSync(cheminImage2)) {
    const buffer2 = fs.readFileSync(cheminImage2);
    const blob2 = new Blob([buffer2], { type: 'image/jpeg' });
    const form2 = new FormData();
    form2.append('image', blob2, 'sortie-chateau-la-coste-2.jpeg');

    const res2 = await fetch(`${API}/api/actualites/${actualiteId}/images`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form2,
    });
    const data2 = await res2.json();
    if (!res2.ok) {
      console.error('Echec ajout 2e photo :', data2.error);
    } else {
      console.log('2e photo ajoutee a la galerie.');
    }
  } else {
    console.warn('2e image introuvable :', cheminImage2);
  }
}

main();
