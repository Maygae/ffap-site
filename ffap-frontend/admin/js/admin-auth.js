// Authentification du back-office : gestion du token JWT (stocke en localStorage),
// garde d'acces sur les pages protegees, et wrapper fetch qui ajoute le token
// et redirige automatiquement vers le login si la session est absente/expiree.
// Charge en tout premier sur chaque page admin (avant admin.js et le contenu de page),
// pour rediriger le plus vite possible si besoin.

const CLE_TOKEN = 'ffap_admin_token';

function getToken() {
  return localStorage.getItem(CLE_TOKEN);
}

function setToken(token) {
  localStorage.setItem(CLE_TOKEN, token);
}

function supprimerToken() {
  localStorage.removeItem(CLE_TOKEN);
}

// A appeler en haut de chaque page protegee (tout sauf login.html) :
// redirige immediatement vers le login si aucun token n'est present.
// (Ne garantit pas la validite du token : le serveur la revalide a chaque appel API,
// voir authFetch ci-dessous qui redirige aussi en cas de 401.)
function exigerConnexion() {
  if (!getToken()) {
    window.location.href = 'login.html';
  }
}

function deconnexion() {
  supprimerToken();
  window.location.href = 'login.html';
}

// Wrapper autour de fetch() : ajoute l'en-tete Authorization, et renvoie vers
// le login si l'API repond 401 (session expiree ou invalide).
async function authFetch(url, options = {}) {
  const headers = { ...(options.headers || {}), Authorization: `Bearer ${getToken()}` };
  const reponse = await fetch(url, { ...options, headers });
  if (reponse.status === 401) {
    supprimerToken();
    window.location.href = 'login.html';
    throw new Error('Session expiree');
  }
  return reponse;
}
