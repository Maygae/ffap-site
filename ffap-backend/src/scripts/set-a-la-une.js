// Coche/decoche "A la une" sur une actualite/evenement existant, sans toucher au reste.
// A utiliser en attendant un vrai back-office avec case a cocher.
//
// Usage :
//   node src/scripts/set-a-la-une.js "Titre exact de l'actualite" on
//   node src/scripts/set-a-la-une.js "Titre exact de l'actualite" off
//
// Le titre doit correspondre exactement (copier-coller depuis la page /actualites.html
// ou depuis la reponse de GET /api/actualites).

const readline = require('readline');

const API = process.env.API_BASE_URL || 'http://localhost:3000';
const ADMIN_EMAIL = 'ffap.83@gmail.com';

const [, , titreArg, etatArg] = process.argv;

if (!titreArg || !etatArg || !['on', 'off'].includes(etatArg)) {
  console.error('Usage : node src/scripts/set-a-la-une.js "Titre exact" on|off');
  process.exit(1);
}

const NOUVEL_ETAT = etatArg === 'on';

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

  const listeRes = await fetch(`${API}/api/actualites`);
  const liste = await listeRes.json();
  const item = liste.find((a) => a.titre === titreArg);

  if (!item) {
    console.error(`Actualite introuvable : ${titreArg}`);
    console.error('Titres disponibles :');
    liste.forEach((a) => console.error(`  - ${a.titre}`));
    process.exit(1);
  }

  const form = new FormData();
  form.append('titre', item.titre);
  form.append('categorie', item.categorie);
  form.append('lieu', item.lieu || '');
  form.append('date_evenement', item.date_evenement ? item.date_evenement.slice(0, 10) : '');
  form.append('contenu', item.contenu || '');
  form.append('a_la_une', NOUVEL_ETAT ? 'true' : 'false');

  const res = await fetch(`${API}/api/actualites/${item.id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  const data = await res.json();
  if (!res.ok) {
    console.error('Echec :', data.error);
  } else {
    console.log(`"${item.titre}" est maintenant ${NOUVEL_ETAT ? 'a la une' : 'retire de la une'}.`);
  }
}

main();
