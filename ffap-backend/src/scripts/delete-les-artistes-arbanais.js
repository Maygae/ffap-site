// Supprime l'association "Les Artistes Arbanais".
// Usage : node src/scripts/delete-les-artistes-arbanais.js

const readline = require('readline');

const API = process.env.API_BASE_URL || 'http://localhost:3000';
const ADMIN_EMAIL = 'ffap.83@gmail.com';
const NOM = 'Les Artistes Arbanais';

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
    console.log(`Rien a supprimer : "${NOM}" est introuvable (peut-etre deja supprimee).`);
    return;
  }

  const res = await fetch(`${API}/api/associations/${asso.id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) {
    console.error('Echec :', data.error);
  } else {
    console.log(`Supprimee : ${NOM}`);
  }
}

main();
