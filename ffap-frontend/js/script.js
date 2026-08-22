// Comportement du menu mobile : affiche/masque les liens de navigation
// Objectif : sur petit ecran, la nav est cachee par defaut (voir CSS @media),
// ce bouton permet de l'afficher/masquer au clic.

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');

  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const estOuvert = links.classList.toggle('nav-links-open');
    toggle.setAttribute('aria-expanded', String(estOuvert));
  });
});

// Barre de recherche du header : au clic sur la loupe, affiche le champ ;
// a la soumission, cherche le terme parmi artistes / associations / evenements
// et redirige vers la premiere fiche correspondante.
document.addEventListener('DOMContentLoaded', () => {
  const zoneRecherche = document.getElementById('nav-search');
  const boutonRecherche = document.getElementById('nav-search-toggle');
  const formRecherche = document.getElementById('form-recherche');
  const inputRecherche = document.getElementById('input-recherche');

  if (!zoneRecherche || !boutonRecherche || !formRecherche || !inputRecherche) return;

  boutonRecherche.addEventListener('click', () => {
    const estOuvert = zoneRecherche.classList.toggle('ouvert');
    if (estOuvert) inputRecherche.focus();
  });

  formRecherche.addEventListener('submit', async (event) => {
    event.preventDefault();
    const terme = inputRecherche.value.trim().toLowerCase();
    if (!terme) return;

    try {
      const [artistes, associations, evenements] = await Promise.all([
        fetch(`${API_BASE_URL}/api/artistes`).then((r) => r.json()).catch(() => []),
        fetch(`${API_BASE_URL}/api/associations`).then((r) => r.json()).catch(() => []),
        fetch(`${API_BASE_URL}/api/actualites`).then((r) => r.json()).catch(() => []),
      ]);

      const artisteTrouve = (artistes || []).find((a) => a.nom && a.nom.toLowerCase().includes(terme));
      if (artisteTrouve) {
        window.location.href = `artiste-detail.html?id=${artisteTrouve.id}`;
        return;
      }

      const associationTrouvee = (associations || []).find((a) => a.nom && a.nom.toLowerCase().includes(terme));
      if (associationTrouvee) {
        window.location.href = `association-detail.html?id=${associationTrouvee.id}`;
        return;
      }

      const evenementTrouve = (evenements || []).find((e) => e.titre && e.titre.toLowerCase().includes(terme));
      if (evenementTrouve) {
        window.location.href = `evenement-detail.html?id=${evenementTrouve.id}`;
        return;
      }

      alert('Aucun resultat pour « ' + inputRecherche.value + ' ».');
    } catch (erreur) {
      console.error('Erreur recherche :', erreur);
      alert('La recherche est momentanement indisponible.');
    }
  });
});

// Newsletter : pas encore de vrai service d'envoi branche (hors perimetre actuel du projet).
// On bloque juste la soumission et on informe le visiteur, en attendant une decision
// sur l'outil a utiliser (ex. Brevo, Mailchimp) pour la collecte reelle des emails.
document.addEventListener('DOMContentLoaded', () => {
  const formNewsletter = document.getElementById('form-newsletter');
  const note = document.getElementById('newsletter-note');
  if (!formNewsletter) return;

  formNewsletter.addEventListener('submit', (event) => {
    event.preventDefault();
    note.textContent = 'Fonctionnalite en cours de mise en place, merci de votre patience.';
  });
});

const API_BASE_URL = 'http://localhost:3000';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Renvoie les initiales d'un nom (ex. "Martine de Santis" -> "MD"),
// utilisees comme visuel de remplacement quand aucune photo n'est renseignee.
function initiales(nom) {
  return nom
    .split(' ')
    .filter(Boolean)
    .map((mot) => mot[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

// ===== Liste des artistes (page artistes.html) — GET /api/artistes =====
document.addEventListener('DOMContentLoaded', async () => {
  const conteneur = document.getElementById('liste-artistes');
  if (!conteneur) return;

  try {
    const reponse = await fetch(`${API_BASE_URL}/api/artistes`);
    if (!reponse.ok) throw new Error('Erreur API');
    const artistes = await reponse.json();

    if (artistes.length === 0) {
      conteneur.innerHTML = '<p class="texte-secondaire">Aucun artiste pour le moment.</p>';
      return;
    }

    conteneur.innerHTML = artistes.map((artiste) => `
      <a class="card" href="artiste-detail.html?id=${artiste.id}">
        <div class="card-media">
          ${artiste.photo
            ? `<img src="${API_BASE_URL}${artiste.photo}" alt="${artiste.nom}" />`
            : initiales(artiste.nom)}
        </div>
        <div class="card-body">
          ${artiste.discipline ? `<span class="card-tag card-tag--artiste">${artiste.discipline}</span>` : ''}
          <h3>${artiste.nom}</h3>
        </div>
      </a>
    `).join('');
  } catch (error) {
    conteneur.innerHTML = '<p class="texte-secondaire">Impossible de charger les artistes. Le serveur back-end est-il demarre ?</p>';
  }
});

// ===== Apercu des artistes sur la homepage (index.html) — GET /api/artistes =====
document.addEventListener('DOMContentLoaded', async () => {
  const conteneur = document.getElementById('liste-artistes-accueil');
  if (!conteneur) return;

  try {
    const reponse = await fetch(`${API_BASE_URL}/api/artistes`);
    if (!reponse.ok) throw new Error('Erreur API');
    const artistes = await reponse.json();

    if (artistes.length === 0) {
      conteneur.innerHTML = '<p class="texte-secondaire">Aucun artiste pour le moment.</p>';
      return;
    }

    conteneur.innerHTML = artistes.slice(0, 3).map((artiste) => `
      <a class="card" href="artiste-detail.html?id=${artiste.id}">
        <div class="card-media">
          ${artiste.photo
            ? `<img src="${API_BASE_URL}${artiste.photo}" alt="${artiste.nom}" />`
            : initiales(artiste.nom)}
        </div>
        <div class="card-body">
          ${artiste.discipline ? `<span class="card-tag card-tag--artiste">${artiste.discipline}</span>` : ''}
          <h3>${artiste.nom}</h3>
        </div>
      </a>
    `).join('');
  } catch (error) {
    conteneur.innerHTML = '<p class="texte-secondaire">Impossible de charger les artistes. Le serveur back-end est-il demarre ?</p>';
  }
});

// ===== Fiche detail d'un artiste (page artiste-detail.html) — GET /api/artistes/:id =====
document.addEventListener('DOMContentLoaded', async () => {
  const conteneur = document.getElementById('fiche-artiste');
  if (!conteneur) return;

  const parametres = new URLSearchParams(window.location.search);
  const id = parametres.get('id');

  if (!id) {
    conteneur.innerHTML = '<p class="texte-secondaire">Artiste introuvable.</p>';
    return;
  }

  try {
    const reponse = await fetch(`${API_BASE_URL}/api/artistes/${id}`);
    if (!reponse.ok) throw new Error('Erreur API');
    const artiste = await reponse.json();

    document.title = `${artiste.nom} — F.F.A.P.`;

    conteneur.innerHTML = `
      <div style="display:flex; align-items:center; gap:20px; margin:24px 0;">
        <div class="card-media" style="width:96px; height:96px; border-radius:50%; flex-shrink:0;">
          ${artiste.photo
            ? `<img src="${API_BASE_URL}${artiste.photo}" alt="${artiste.nom}" style="border-radius:50%;" />`
            : initiales(artiste.nom)}
        </div>
        <div>
          <h1 style="font-size:30px;">${artiste.nom}</h1>
          <p class="texte-secondaire">${artiste.discipline || ''}</p>
        </div>
      </div>
      <p>${artiste.bio || ''}</p>
    `;

    const galerie = document.getElementById('galerie-oeuvres');
    if (galerie) {
      if (!artiste.oeuvres || artiste.oeuvres.length === 0) {
        galerie.innerHTML = '<p class="texte-secondaire" style="text-align:center;">Aucune oeuvre publiee pour le moment.</p>';
      } else {
        galerie.innerHTML = artiste.oeuvres.map((oeuvre) => `
          <div class="card">
            <div class="card-media">
              <img src="${API_BASE_URL}${oeuvre.image}" alt="${oeuvre.titre || ''}" />
            </div>
          </div>
        `).join('');
      }
    }
  } catch (error) {
    conteneur.innerHTML = '<p class="texte-secondaire">Impossible de charger cet artiste. Le serveur back-end est-il demarre ?</p>';
  }
});

// ===== Actualites & evenements (page actualites.html) — GET /api/actualites =====
const ETIQUETTES_CATEGORIE = {
  evenement: 'Evenement',
  sorties: 'Sorties',
  exposition: 'Exposition',
};

// Construit le HTML d'une grille de cartes evenement/sortie
function construireCartesActualites(items) {
  return items.map((item) => {
    const date = item.date_evenement
      ? new Date(item.date_evenement).toLocaleDateString('fr-FR', { timeZone: 'UTC' })
      : '';
    return `
      <a class="card" href="evenement-detail.html?id=${item.id}">
        <div class="card-media">
          ${item.image ? `<img src="${API_BASE_URL}${item.image}" alt="${item.titre}" />` : ''}
        </div>
        <div class="card-body">
          <span class="card-tag card-tag--${item.categorie}">${ETIQUETTES_CATEGORIE[item.categorie] || item.categorie}</span>
          <h3>${item.titre}</h3>
          <p class="texte-secondaire">${[item.lieu, date].filter(Boolean).join(' — ')}</p>
        </div>
      </a>
    `;
  }).join('');
}

async function chargerActualites(categorie) {
  const conteneur = document.getElementById('liste-actualites');
  if (!conteneur) return;

  conteneur.innerHTML = '<p class="texte-secondaire">Chargement...</p>';

  try {
    const url = categorie && categorie !== 'tout'
      ? `${API_BASE_URL}/api/actualites?categorie=${categorie}`
      : `${API_BASE_URL}/api/actualites`;
    const reponse = await fetch(url);
    if (!reponse.ok) throw new Error('Erreur API');
    const actualites = await reponse.json();

    if (actualites.length === 0) {
      conteneur.innerHTML = '<p class="texte-secondaire">Aucun contenu dans cette categorie pour le moment.</p>';
      return;
    }

    // Separation "a venir" / "passes" : un contenu sans date est toujours considere a venir
    // (ex. actualite generale sans evenement precis associe).
    const aujourdhui = new Date();
    aujourdhui.setHours(0, 0, 0, 0);

    const aVenir = actualites
      .filter((item) => !item.date_evenement || new Date(item.date_evenement) >= aujourdhui)
      .sort((a, b) => new Date(a.date_evenement || 0) - new Date(b.date_evenement || 0));

    const passes = actualites
      .filter((item) => item.date_evenement && new Date(item.date_evenement) < aujourdhui)
      .sort((a, b) => new Date(b.date_evenement) - new Date(a.date_evenement));

    let html = '';

    html += `
      <div class="section-head" style="text-align:left; margin-bottom:20px;">
        <h2>A venir</h2>
      </div>
    `;
    html += aVenir.length > 0
      ? `<div class="grid grid-3">${construireCartesActualites(aVenir)}</div>`
      : '<p class="texte-secondaire">Aucun contenu a venir dans cette categorie pour le moment.</p>';

    if (passes.length > 0) {
      html += `
        <div class="section-head" style="text-align:left; margin:48px 0 20px;">
          <h2>Evenements passes</h2>
        </div>
        <div class="grid grid-3">${construireCartesActualites(passes)}</div>
      `;
    }

    conteneur.innerHTML = html;
  } catch (error) {
    conteneur.innerHTML = '<p class="texte-secondaire">Impossible de charger les actualites. Le serveur back-end est-il demarre ?</p>';
  }
}

// ===== Apercu evenements/sorties/expositions sur la homepage (index.html) — GET /api/actualites =====
document.addEventListener('DOMContentLoaded', async () => {
  const conteneur = document.getElementById('liste-actualites-accueil');
  if (!conteneur) return;

  try {
    const reponse = await fetch(`${API_BASE_URL}/api/actualites`);
    if (!reponse.ok) throw new Error('Erreur API');
    const items = (await reponse.json()).filter((item) => ['evenement', 'sorties', 'exposition'].includes(item.categorie));

    if (items.length === 0) {
      conteneur.innerHTML = '<p class="texte-secondaire">Aucun evenement pour le moment.</p>';
      return;
    }

    conteneur.innerHTML = items.slice(0, 3).map((item) => {
      const date = item.date_evenement
        ? new Date(item.date_evenement).toLocaleDateString('fr-FR', { timeZone: 'UTC' })
        : '';
      return `
        <a class="card" href="evenement-detail.html?id=${item.id}">
          <div class="card-media">
            ${item.image ? `<img src="${API_BASE_URL}${item.image}" alt="${item.titre}" />` : ''}
          </div>
          <div class="card-body">
            <span class="card-tag card-tag--${item.categorie}">${ETIQUETTES_CATEGORIE[item.categorie] || item.categorie}</span>
            <h3>${item.titre}</h3>
            <p class="texte-secondaire">${[item.lieu, date].filter(Boolean).join(' — ')}</p>
          </div>
        </a>
      `;
    }).join('');
  } catch (error) {
    conteneur.innerHTML = '<p class="texte-secondaire">Impossible de charger les evenements. Le serveur back-end est-il demarre ?</p>';
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const boutons = document.querySelectorAll('[data-filtre]');
  if (!boutons.length) return;

  chargerActualites('tout');

  boutons.forEach((bouton) => {
    bouton.addEventListener('click', () => {
      boutons.forEach((b) => b.classList.remove('filtre-actif'));
      bouton.classList.add('filtre-actif');
      chargerActualites(bouton.dataset.filtre);
    });
  });
});

// ===== Fiche detail d'un evenement/actualite (page evenement-detail.html) — GET /api/actualites/:id =====
document.addEventListener('DOMContentLoaded', async () => {
  const conteneur = document.getElementById('fiche-evenement');
  if (!conteneur) return;

  const parametres = new URLSearchParams(window.location.search);
  const id = parametres.get('id');

  if (!id) {
    conteneur.innerHTML = '<p class="texte-secondaire">Contenu introuvable.</p>';
    return;
  }

  try {
    const reponse = await fetch(`${API_BASE_URL}/api/actualites/${id}`);
    if (!reponse.ok) throw new Error('Erreur API');
    const item = await reponse.json();

    document.title = `${item.titre} — F.F.A.P.`;

    const date = item.date_evenement
      ? new Date(item.date_evenement).toLocaleDateString('fr-FR', { timeZone: 'UTC' })
      : '';

    const paragraphes = (item.contenu || '')
      .split('\n')
      .map((ligne) => ligne.trim())
      .filter(Boolean)
      .map((ligne) => `<p>${ligne}</p>`)
      .join('');

    conteneur.innerHTML = `
      ${item.image ? `<div style="margin:24px 0; border-radius:12px; overflow:hidden;"><img src="${API_BASE_URL}${item.image}" alt="${item.titre}" style="width:246px; height:auto; display:block;" /></div>` : ''}
      <span class="card-tag card-tag--${item.categorie}">${ETIQUETTES_CATEGORIE[item.categorie] || item.categorie}</span>
      <h1 style="font-size:30px; margin-top:12px;">${item.titre}</h1>
      <p class="texte-secondaire">${[item.lieu, date].filter(Boolean).join(' — ')}</p>
      <div style="margin-top:20px; line-height:1.8;">${paragraphes}</div>
    `;

    const galerie = document.getElementById('galerie-evenement');
    if (galerie && item.images && item.images.length > 0) {
      galerie.innerHTML = item.images.map((img) => `
        <div class="card">
          <div class="card-media">
            <img src="${API_BASE_URL}${img.image}" alt="${item.titre}" />
          </div>
        </div>
      `).join('');
    }
  } catch (error) {
    conteneur.innerHTML = '<p class="texte-secondaire">Impossible de charger ce contenu. Le serveur back-end est-il demarre ?</p>';
  }
});

// Renvoie un resume court d'un texte (ex. pour l'aperçu carte d'une association),
// en coupant proprement sur un mot entier et en ajoutant "..." si le texte est tronque.
function resumer(texte, longueur = 100) {
  if (!texte) return '';
  const uneLigne = texte.split('\n').map((l) => l.trim()).filter(Boolean)[0] || '';
  if (uneLigne.length <= longueur) return uneLigne;
  return `${uneLigne.slice(0, longueur).trim()}...`;
}

// ===== Associations membres (page associations.html) — GET /api/associations =====
document.addEventListener('DOMContentLoaded', async () => {
  const conteneur = document.getElementById('liste-associations');
  if (!conteneur) return;

  try {
    const reponse = await fetch(`${API_BASE_URL}/api/associations`);
    if (!reponse.ok) throw new Error('Erreur API');
    const associations = await reponse.json();

    if (associations.length === 0) {
      conteneur.innerHTML = '<p class="texte-secondaire">Aucune association pour le moment.</p>';
      return;
    }

    conteneur.innerHTML = associations.map((asso) => `
      <a class="card" href="association-detail.html?id=${asso.id}">
        <div class="card-media" style="background:#fff; height:220px;">
          ${asso.logo
            ? `<img src="${API_BASE_URL}${asso.logo}" alt="Logo ${asso.nom}" style="width:100%; height:100%; object-fit:contain; padding:4px;" />`
            : initiales(asso.nom)}
        </div>
        <div class="card-body">
          <h3>${asso.nom}</h3>
          <p class="texte-secondaire">${resumer(asso.description)}</p>
        </div>
      </a>
    `).join('');
  } catch (error) {
    conteneur.innerHTML = '<p class="texte-secondaire">Impossible de charger les associations. Le serveur back-end est-il demarre ?</p>';
  }
});

// ===== Fiche detail d'une association (page association-detail.html) — GET /api/associations/:id =====
document.addEventListener('DOMContentLoaded', async () => {
  const conteneur = document.getElementById('fiche-association');
  if (!conteneur) return;

  const parametres = new URLSearchParams(window.location.search);
  const id = parametres.get('id');

  if (!id) {
    conteneur.innerHTML = '<p class="texte-secondaire">Association introuvable.</p>';
    return;
  }

  try {
    const reponse = await fetch(`${API_BASE_URL}/api/associations/${id}`);
    if (!reponse.ok) throw new Error('Erreur API');
    const asso = await reponse.json();

    document.title = `${asso.nom} — F.F.A.P.`;

    const paragraphes = (asso.description || 'Aucune description pour le moment.')
      .split('\n')
      .map((ligne) => ligne.trim())
      .filter(Boolean)
      .map((ligne) => `<p>${ligne}</p>`)
      .join('');

    conteneur.innerHTML = `
      <div style="display:flex; align-items:center; gap:24px; margin:24px 0; flex-wrap:wrap;">
        <div class="card-media" style="width:240px; height:240px; border-radius:50%; flex-shrink:0; background:#fff;">
          ${asso.logo
            ? `<img src="${API_BASE_URL}${asso.logo}" alt="Logo ${asso.nom}" style="width:100%; height:100%; object-fit:contain; border-radius:50%; padding:16px;" />`
            : initiales(asso.nom)}
        </div>
        <h1 style="font-size:30px;">${asso.nom}</h1>
      </div>
      <div style="line-height:1.8;">${paragraphes}</div>
      ${asso.lien_externe ? `<a href="${asso.lien_externe}" target="_blank" rel="noopener noreferrer" class="btn btn-secondaire" style="margin-top:12px; display:inline-block;">Voir le site ↗</a>` : ''}
    `;
  } catch (error) {
    conteneur.innerHTML = '<p class="texte-secondaire">Impossible de charger cette association. Le serveur back-end est-il demarre ?</p>';
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const formContact = document.getElementById('form-contact');
  if (!formContact) return;

  const champPrenom = document.getElementById('prenom');
  const champNom = document.getElementById('nom');
  const champEmail = document.getElementById('email');
  const champTelephone = document.getElementById('telephone');
  const champMessage = document.getElementById('message');
  const champConsentement = document.getElementById('consentement');
  const erreur = document.getElementById('contact-erreur');
  const succes = document.getElementById('contact-succes');
  const boutonEnvoyer = document.getElementById('contact-submit');

  formContact.addEventListener('submit', async (event) => {
    event.preventDefault();
    erreur.style.display = 'none';
    succes.style.display = 'none';

    const prenom = champPrenom.value.trim();
    const nomFamille = champNom.value.trim();
    const nom = `${prenom} ${nomFamille}`.trim();
    const email = champEmail.value.trim();
    const telephone = champTelephone.value.trim();
    const message = champMessage.value.trim();

    // Validation cote client, en miroir de la validation cote serveur
    if (!prenom || !nomFamille || !email || !message) {
      erreur.textContent = 'Merci de remplir tous les champs obligatoires.';
      erreur.style.display = 'block';
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      erreur.textContent = 'Adresse email invalide.';
      erreur.style.display = 'block';
      return;
    }
    if (!champConsentement.checked) {
      erreur.textContent = 'Merci d\'accepter l\'utilisation de vos donnees pour continuer.';
      erreur.style.display = 'block';
      return;
    }

    boutonEnvoyer.disabled = true;
    boutonEnvoyer.textContent = 'Envoi en cours...';

    try {
      const reponse = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom, email, telephone, message }),
      });

      const donnees = await reponse.json();

      if (!reponse.ok) {
        erreur.textContent = donnees.error || 'Une erreur est survenue.';
        erreur.style.display = 'block';
        return;
      }

      succes.textContent = 'Votre message a bien ete envoye, merci !';
      succes.style.display = 'block';
      formContact.reset();
    } catch (error) {
      // Le plus souvent : le serveur back-end n'est pas demarre
      erreur.textContent = 'Impossible de contacter le serveur. Reessayez plus tard.';
      erreur.style.display = 'block';
    } finally {
      boutonEnvoyer.disabled = false;
      boutonEnvoyer.textContent = 'Envoyer';
    }
  });
});
