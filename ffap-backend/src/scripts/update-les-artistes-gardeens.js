// Met a jour la description de "Les Artistes Gardeens" (logo deja en place, non touche ici).
// Usage : node src/scripts/update-les-artistes-gardeens.js

const readline = require('readline');

const API = process.env.API_BASE_URL || 'http://localhost:3000';
const ADMIN_EMAIL = 'ffap.83@gmail.com';
const NOM = 'Les Artistes Gardeens';

const description = `Presidee par Martine de Santis

L'Association Les Artistes Gardeens est un exemple vivant de la maniere dont un atelier d'art local peut stimuler la creativite et enrichir durablement la vie culturelle. Cette association offre bien plus qu'un simple lieu d'expression artistique : elle rassemble une veritable communaute ou artistes et amateurs d'art se rencontrent pour apprendre, creer et partager leur passion.

Un lieu dedie a l'apprentissage et a la pratique artistique
L'association accueille chaleureusement les artistes de tous niveaux, des debutants aux createurs confirmes. Elle propose des ateliers, des cours et des seances de pratique libre permettant d'explorer differentes disciplines telles que la peinture, la sculpture, le dessin et les techniques mixtes. Cette approche pratique encourage l'experimentation, le developpement personnel et la progression artistique.

Elle met notamment a disposition : des ateliers adaptes a tous les niveaux, du materiel et des outils de qualite professionnelle, ainsi que l'accompagnement d'artistes et d'intervenants experimentes.

En privilegiant la pratique, l'association permet a chacun de developper ses competences tout en renforcant sa confiance en lui. A titre d'exemple, un recent atelier consacre a la peinture a initie les participants a la theorie des couleurs et a la composition, avant de se conclure par une exposition collective mettant en valeur les oeuvres realisees.

Une dynamique humaine et collective
L'un des plus grands atouts de l'association reside dans sa capacite a creer une veritable dynamique humaine. Les artistes travaillent souvent de maniere isolee ; cet atelier leur offre un espace d'echange, de collaboration et de dialogue. Les critiques collectives, les expositions et les rencontres conviviales permettent aux membres de partager leurs experiences et leur passion.

Une ouverture vers le grand public
L'association s'adresse egalement au grand public en organisant regulierement des expositions ouvertes a tous. Ces manifestations permettent aux artistes de presenter leurs creations en dehors de l'atelier et favorisent les echanges avec les habitants autour de l'art et de la culture.
N'hesitez pas a decouvrir ou a rejoindre l'association afin de vivre pleinement l'experience enrichissante que l'art peut offrir a chacun.`;

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
