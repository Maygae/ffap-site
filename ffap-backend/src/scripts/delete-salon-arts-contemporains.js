// Supprime l'actualite de test "Salon des Arts Contemporains" (creee lors des premiers tests de l'API).
// Usage : node src/scripts/delete-salon-arts-contemporains.js

const readline = require('readline');

const API = process.env.API_BASE_URL || 'http://localhost:3000';
const ADMIN_EMAIL = 'ffap.83@gmail.com';
const TITRE = 'Salon des Arts Contemporains';

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
    console.log(`Rien a supprimer : "${TITRE}" est introuvable (peut-etre deja supprime).`);
    return;
  }

  const res = await fetch(`${API}/api/actualites/${item.id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) {
    console.error('Echec :', data.error);
  } else {
    console.log(`Supprime : ${TITRE}`);
  }
}

main();
