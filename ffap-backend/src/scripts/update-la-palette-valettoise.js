// Met a jour la description de "La Palette Valettoise" (aucun logo fourni pour le moment).
// Usage : node src/scripts/update-la-palette-valettoise.js

const readline = require('readline');

const API = process.env.API_BASE_URL || 'http://localhost:3000';
const ADMIN_EMAIL = 'ffap.83@gmail.com';
const NOM = 'La Palette Valettoise';

const description = `83160 La Valette-du-Var

Une histoire ancree dans la commune
La Palette Valettoise est une association Loi 1901, fondee en 1966 a La Valette-du-Var. C'est la plus ancienne association de la commune. Depuis sa creation, les peintres amateurs peuvent donner libre cours a leur inspiration et a leur passion.

« La Peinture est une poesie qui se voit. » — Leonard de Vinci

Notre mission
L'association a pour objet de regrouper des artistes afin de favoriser les arts plastiques, en particulier la peinture, et toutes les activites qui s'y rapportent, suivant les rythmes et les envies de chacune et de chacun. Pour cela, elle propose une information reguliere aupres de ses adherents, ainsi que l'organisation d'expositions, d'echanges et de voyages culturels.
Notre public se compose d'adherents qui sont tous des peintres amateurs.

La vie de l'atelier
L'atelier est ouvert trois apres-midis par semaine — le lundi, le mercredi et le vendredi, de 14h00 a 17h30. Chaque peintre dispose d'un espace dedie et peut laisser l'ensemble de son materiel sur place, dans des locaux adaptes ou regne une ambiance detendue, propice a la concentration. Des intervenants sont regulierement sollicites pour dispenser des cours de dessin et de peinture.

Nos rendez-vous et partenariats
L'association organise actuellement une exposition annuelle au printemps, a la Salle du Lavoir, a La Valette-du-Var. Elle est par ailleurs sollicitee plusieurs fois par an par la Municipalite pour participer a certains evenements (Telethon, Octobre Rose...) et organiser des ateliers de peinture pour les enfants, a l'occasion de Noel, du Carnaval ou de la Fete de la Fraise. Ces ateliers remportent chaque fois un franc succes !

Nous rejoindre
Peintres amateurs, debutants ou confirmes : La Palette Valettoise vous accueille dans un cadre convivial et stimulant, riche de pres de soixante ans d'histoire.
N'hesitez pas a venir decouvrir l'atelier et a rejoindre notre communaute de passionnes.`;

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
    console.error(`Association introuvable : ${NOM} (lance d'abord seed-associations.js)`);
    process.exit(1);
  }

  const form = new FormData();
  form.append('nom', asso.nom);
  form.append('description', description);

  const res = await fetch(`${API}/api/associations/${asso.id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  const data = await res.json();
  if (!res.ok) {
    console.error('Echec :', data.error);
  } else {
    console.log('Description mise a jour :', NOM);
  }
}

main();
