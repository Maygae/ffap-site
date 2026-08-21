// Corrige la categorie de l'actualite "2e Grand Salon des Arts de la FFAP" -> evenement
// (sans toucher au reste du contenu). Usage : node src/scripts/fix-categorie-salon-2027.js

const readline = require('readline');

const API = process.env.API_BASE_URL || 'http://localhost:3000';
const ADMIN_EMAIL = 'ffap.83@gmail.com';
const TITRE = '2e Grand Salon des Arts de la FFAP';

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
  const item = liste.find((a) => a.titre === TITRE);

  if (!item) {
    console.error(`Actualite introuvable : ${TITRE}`);
    process.exit(1);
  }

  console.log('Categorie actuelle en base :', item.categorie);

  const form = new FormData();
  form.append('titre', item.titre);
  form.append('categorie', 'evenement');
  form.append('lieu', item.lieu || '');
  form.append('date_evenement', item.date_evenement ? item.date_evenement.slice(0, 10) : '');
  form.append('contenu', item.contenu || '');

  const res = await fetch(`${API}/api/actualites/${item.id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  const data = await res.json();
  if (!res.ok) {
    console.error('Echec :', data.error);
  } else {
    console.log('Categorie corrigee : evenement');
  }
}

main();
