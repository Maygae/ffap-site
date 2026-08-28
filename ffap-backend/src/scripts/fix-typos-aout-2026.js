// Corrige plusieurs fautes/incoherences reperees lors de la relecture d'aout 2026 :
// - actualite "2e Grand Salon des arts de la F.F.A.P." : (FFAP) -> (F.F.A.P.), "Salon des Arts" -> "Salon des arts", "site de la FFAP" -> "site de la F.F.A.P."
// - actualite "Sortie Avignon" : titre "palais" -> "Palais", contenu "Avignon visiter" -> "Avignon pour visiter"
// - bio de Christian Disty : "Federation des Arts Plastiques" -> "Federation Francaise des Arts Plastiques", reformulation phrase sur le prix de magie
//
// Usage : node src/scripts/fix-typos-aout-2026.js
// Pour la production : API_BASE_URL=https://ffap-site-production.up.railway.app node src/scripts/fix-typos-aout-2026.js

const readline = require('readline');

const API = process.env.API_BASE_URL || 'http://localhost:3000';
const ADMIN_EMAIL = 'ffap.83@gmail.com';

function demanderMotDePasse() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question('Mot de passe admin (ffap.83@gmail.com) : ', (reponse) => {
      rl.close();
      resolve(reponse);
    });
  });
}

async function login() {
  const password = await demanderMotDePasse();
  const res = await fetch(`${API}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, mot_de_passe: password }),
  });
  const data = await res.json();
  if (!res.ok) {
    console.error('Echec de connexion :', data.error);
    process.exit(1);
  }
  return data.token;
}

async function corrigerActualite(token, ancienTitre, corrections) {
  const listeRes = await fetch(`${API}/api/actualites`);
  const liste = await listeRes.json();
  const item = liste.find((a) => a.titre === ancienTitre);
  if (!item) {
    console.error(`Actualite introuvable : ${ancienTitre}`);
    return;
  }

  const nouveauTitre = corrections.titre ? corrections.titre(item.titre) : item.titre;
  const nouveauContenu = corrections.contenu ? corrections.contenu(item.contenu) : item.contenu;

  const form = new FormData();
  form.append('titre', nouveauTitre);
  form.append('categorie', item.categorie || 'evenement');
  form.append('lieu', item.lieu || '');
  form.append('date_evenement', item.date_evenement ? item.date_evenement.slice(0, 10) : '');
  form.append('contenu', nouveauContenu);
  form.append('a_la_une', item.a_la_une ? 'true' : 'false');

  const res = await fetch(`${API}/api/actualites/${item.id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  const data = await res.json();
  if (!res.ok) {
    console.error(`Echec pour "${ancienTitre}" :`, data.error);
  } else {
    console.log(`Actualite corrigee : ${nouveauTitre}`);
  }
}

async function corrigerArtiste(token, nom, corrigerBio) {
  const listeRes = await fetch(`${API}/api/artistes`);
  const liste = await listeRes.json();
  const resume = liste.find((a) => a.nom === nom);
  if (!resume) {
    console.error(`Artiste introuvable : ${nom}`);
    return;
  }

  // La liste ne contient pas la bio complete, il faut recuperer la fiche detaillee
  const detailRes = await fetch(`${API}/api/artistes/${resume.id}`);
  const item = await detailRes.json();

  const nouvelleBio = corrigerBio(item.bio);

  const form = new FormData();
  form.append('nom', item.nom);
  form.append('discipline', item.discipline || '');
  form.append('bio', nouvelleBio);

  const res = await fetch(`${API}/api/artistes/${item.id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  const data = await res.json();
  if (!res.ok) {
    console.error(`Echec pour "${nom}" :`, data.error);
  } else {
    console.log(`Artiste corrige : ${nom}`);
  }
}

async function main() {
  const token = await login();

  await corrigerActualite(token, '2e Grand Salon des arts de la F.F.A.P.', {
    contenu: (texte) =>
      texte
        .replace('(FFAP)', '(F.F.A.P.)')
        .replace('la tenue du 2e Grand Salon des Arts,', 'la tenue du 2e Grand Salon des arts,')
        .replace('prochainement sur le site de la FFAP.', 'prochainement sur le site de la F.F.A.P.'),
  });

  await corrigerActualite(token, 'Sortie Avignon — Le palais des Papes', {
    titre: (t) => t.replace('Le palais des Papes', 'Le Palais des Papes'),
    contenu: (texte) => texte.replace('a Avignon visiter le Palais des Papes', 'a Avignon pour visiter le Palais des Papes'),
  });

  await corrigerArtiste(token, 'Christian Disty', (bio) =>
    bio
      .replace(
        "avant d'accompagner sa transformation en Federation des Arts Plastiques en 2025",
        "avant d'accompagner sa transformation en Federation Francaise des Arts Plastiques en 2025"
      )
      .replace(
        'par le prix du plus bel effet magique au monde en originalite.',
        'par le prix du plus bel effet magique, dans la categorie originalite.'
      )
  );

  console.log('Termine.');
}

main();
