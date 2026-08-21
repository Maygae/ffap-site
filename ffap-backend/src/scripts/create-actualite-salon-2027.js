// Cree l'actualite "2e Grand Salon des Arts de la FFAP" (categorie evenement).
// L'affiche doit se trouver dans le dossier photos-a-importer/ a la racine de ffap-backend.
// Usage : node src/scripts/create-actualite-salon-2027.js

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const API = process.env.API_BASE_URL || 'http://localhost:3000';
const ADMIN_EMAIL = 'ffap.83@gmail.com';
const CHEMIN_IMAGE = path.join(__dirname, '..', '..', 'photos-a-importer', 'actualite-salon-2027.png');

const actualite = {
  titre: '2e Grand Salon des Arts de la FFAP',
  categorie: 'evenement',
  lieu: 'Forum du Casino de Hyeres',
  date_evenement: '2027-03-04',
  contenu: `La Federation Francaise des Arts Plastiques (FFAP) a le plaisir d'annoncer la tenue du 2e Grand Salon des Arts, un rendez-vous incontournable dedie a la creation sous toutes ses formes.

Du 4 au 7 mars 2027, le Forum du Casino de Hyeres deviendra un veritable laboratoire artistique ou se rencontreront talents confirmes, jeunes createurs, collectifs et passionnes d'art contemporain. Apres le succes de sa premiere edition, le Salon revient avec une ambition renouvelee et une programmation enrichie.

Les nouveautes de cette edition

Pour cette deuxieme edition, la FFAP innove et enrichit l'experience des visiteurs avec plusieurs nouveautes marquantes :

- Des stands habilles de tissus, proposes en deux harmonies de couleurs (tons chauds et tons froids), offrant une esthetique plus immersive et elegante, pensee pour sublimer chaque univers artistique.
- Des demonstrations de Live Painting, permettant au public d'assister en direct a la naissance d'une oeuvre, dans une ambiance vibrante et participative.
- Un espace Street Art, ou les artistes urbains realiseront des fresques et performances en temps reel.
- La peinture sur vetement, nouvelle discipline mise a l'honneur, fusionnant art visuel et expression textile.
- Un defile exceptionnel, presentant les creations realisees pendant le salon : pieces uniques, vetements peints, silhouettes inspirees de l'univers graphique de l'affiche officielle, entre couleurs eclatantes, formes polygonales et energie contemporaine.

Un large eventail de disciplines

Au-dela de ces nouveautes, le Salon continuera d'accueillir un large eventail de disciplines : peinture, sculpture, dessin, photographie, arts numeriques, installations, street art, ainsi que des espaces dedies aux associations et createurs independants.

Avec cette edition renouvelee, la FFAP affirme sa volonte de celebrer l'art sans limites, de favoriser les rencontres, et d'offrir au public une experience artistique riche, vivante et audacieuse.

Informations pratiques

Le Salon est ouvert au public du 4 au 7 mars 2027, au Forum du Casino de Hyeres. Horaires, tarifs et modalites d'inscription pour les exposants seront precises prochainement sur le site de la FFAP.`,
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

  const form = new FormData();
  form.append('titre', actualite.titre);
  form.append('categorie', actualite.categorie);
  form.append('lieu', actualite.lieu);
  form.append('date_evenement', actualite.date_evenement);
  form.append('contenu', actualite.contenu);

  if (fs.existsSync(CHEMIN_IMAGE)) {
    const buffer = fs.readFileSync(CHEMIN_IMAGE);
    const blob = new Blob([buffer], { type: 'image/png' });
    form.append('image', blob, 'actualite-salon-2027.png');
  } else {
    console.warn('Image introuvable, l\'actualite sera creee sans affiche.');
  }

  const res = await fetch(`${API}/api/actualites`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  const data = await res.json();
  if (!res.ok) {
    console.error('Echec :', data.error);
  } else {
    console.log('Actualite creee :', actualite.titre);
  }
}

main();
