// Back-office : liste et formulaire des actualites/evenements.
// S'appuie sur admin-auth.js (authFetch, exigerConnexion) et ADMIN_API_BASE_URL (admin.js).

const ETIQUETTES_CATEGORIE_ADMIN = {
  evenement: 'Événement',
  sorties: 'Sorties',
  exposition: 'Exposition',
};

// ===== Liste (page actualites.html) =====
document.addEventListener('DOMContentLoaded', async () => {
  const corps = document.getElementById('corps-table-actualites');
  if (!corps) return;

  async function charger() {
    try {
      const reponse = await authFetch(`${ADMIN_API_BASE_URL}/api/actualites`);
      const actualites = await reponse.json();

      if (actualites.length === 0) {
        corps.innerHTML = '<tr><td colspan="5"><div class="admin-etat-vide">Aucune actualité pour le moment.</div></td></tr>';
        return;
      }

      corps.innerHTML = actualites.map((item) => `
        <tr>
          <td class="admin-col-titre">${item.titre}</td>
          <td>${ETIQUETTES_CATEGORIE_ADMIN[item.categorie] || item.categorie}</td>
          <td>${item.date_evenement ? new Date(item.date_evenement).toLocaleDateString('fr-FR', { timeZone: 'UTC' }) : '—'}</td>
          <td>${item.a_la_une ? '<span class="admin-badge">À la une</span>' : '<span class="admin-badge admin-badge--off">Non</span>'}</td>
          <td>
            <div class="admin-table-actions">
              <a href="actualite-form.html?id=${item.id}">Modifier</a>
              <button type="button" class="danger" data-id="${item.id}" data-titre="${item.titre.replace(/"/g, '&quot;')}">Supprimer</button>
            </div>
          </td>
        </tr>
      `).join('');

      corps.querySelectorAll('button.danger').forEach((bouton) => {
        bouton.addEventListener('click', async () => {
          if (!confirm(`Supprimer « ${bouton.dataset.titre} » ? Cette action est irréversible.`)) return;
          const reponseDelete = await authFetch(`${ADMIN_API_BASE_URL}/api/actualites/${bouton.dataset.id}`, { method: 'DELETE' });
          if (reponseDelete.ok) {
            charger();
          } else {
            alert('La suppression a échoué.');
          }
        });
      });
    } catch (error) {
      corps.innerHTML = '<tr><td colspan="5"><div class="admin-etat-vide">Impossible de charger les actualités. Le serveur back-end est-il démarré ?</div></td></tr>';
    }
  }

  charger();
});

// ===== Formulaire (page actualite-form.html) =====
document.addEventListener('DOMContentLoaded', async () => {
  const formulaire = document.getElementById('form-actualite');
  if (!formulaire) return;

  const parametres = new URLSearchParams(window.location.search);
  const id = parametres.get('id');
  const estEdition = Boolean(id);

  document.getElementById('titre-page-form').textContent = estEdition ? 'Modifier l\'actualité' : 'Nouvelle actualité';

  const champTitre = document.getElementById('titre');
  const champCategorie = document.getElementById('categorie');
  const champLieu = document.getElementById('lieu');
  const champDate = document.getElementById('date_evenement');
  const champContenu = document.getElementById('contenu');
  const champALaUne = document.getElementById('a_la_une');
  const champImage = document.getElementById('image');
  const imageActuelle = document.getElementById('image-actuelle');
  const erreur = document.getElementById('form-erreur');
  const bouton = document.getElementById('form-submit');
  const zoneGalerie = document.getElementById('zone-galerie');

  let actualiteCourante = null;

  // Charge la galerie de photos supplementaires (disponible seulement en edition,
  // une fois l'actualite deja creee).
  async function chargerGalerie() {
    if (!estEdition || !zoneGalerie) return;
    const reponse = await authFetch(`${ADMIN_API_BASE_URL}/api/actualites/${id}`);
    const item = await reponse.json();
    const galerie = document.getElementById('galerie-photos');

    if (!item.images || item.images.length === 0) {
      galerie.innerHTML = '<p class="admin-champ-aide">Aucune photo supplémentaire pour le moment.</p>';
    } else {
      galerie.innerHTML = item.images.map((img) => `
        <div class="admin-galerie-item">
          <img src="${ADMIN_API_BASE_URL}${img.image}" alt="" />
          <button type="button" data-id="${img.id}" aria-label="Supprimer cette photo">×</button>
        </div>
      `).join('');

      galerie.querySelectorAll('button').forEach((bouton2) => {
        bouton2.addEventListener('click', async () => {
          if (!confirm('Supprimer cette photo de la galerie ?')) return;
          await authFetch(`${ADMIN_API_BASE_URL}/api/images/${bouton2.dataset.id}`, { method: 'DELETE' });
          chargerGalerie();
        });
      });
    }
  }

  if (estEdition) {
    try {
      const reponse = await authFetch(`${ADMIN_API_BASE_URL}/api/actualites/${id}`);
      if (!reponse.ok) throw new Error('Actualité introuvable');
      actualiteCourante = await reponse.json();

      champTitre.value = actualiteCourante.titre || '';
      champCategorie.value = actualiteCourante.categorie || 'evenement';
      champLieu.value = actualiteCourante.lieu || '';
      champDate.value = actualiteCourante.date_evenement ? actualiteCourante.date_evenement.slice(0, 10) : '';
      champContenu.value = actualiteCourante.contenu || '';
      champALaUne.checked = Boolean(actualiteCourante.a_la_une);

      if (actualiteCourante.image && imageActuelle) {
        imageActuelle.src = `${ADMIN_API_BASE_URL}${actualiteCourante.image}`;
        imageActuelle.style.display = 'block';
      }

      if (zoneGalerie) {
        zoneGalerie.style.display = '';
        chargerGalerie();
      }
    } catch (error) {
      erreur.textContent = 'Impossible de charger cette actualité.';
      erreur.style.display = 'block';
    }
  }

  formulaire.addEventListener('submit', async (event) => {
    event.preventDefault();
    erreur.style.display = 'none';

    if (!champTitre.value.trim() || !champCategorie.value) {
      erreur.textContent = 'Le titre et la catégorie sont obligatoires.';
      erreur.style.display = 'block';
      return;
    }

    const form = new FormData();
    form.append('titre', champTitre.value.trim());
    form.append('categorie', champCategorie.value);
    form.append('lieu', champLieu.value.trim());
    form.append('date_evenement', champDate.value);
    form.append('contenu', champContenu.value);
    form.append('a_la_une', champALaUne.checked ? 'true' : 'false');
    if (champImage.files[0]) {
      form.append('image', champImage.files[0]);
    }

    bouton.disabled = true;
    bouton.textContent = estEdition ? 'Enregistrement...' : 'Création...';

    try {
      const url = estEdition ? `${ADMIN_API_BASE_URL}/api/actualites/${id}` : `${ADMIN_API_BASE_URL}/api/actualites`;
      const reponse = await authFetch(url, { method: estEdition ? 'PUT' : 'POST', body: form });
      const donnees = await reponse.json();

      if (!reponse.ok) {
        erreur.textContent = donnees.error || 'Une erreur est survenue.';
        erreur.style.display = 'block';
        return;
      }

      window.location.href = 'actualites.html';
    } catch (error) {
      erreur.textContent = 'Impossible de contacter le serveur.';
      erreur.style.display = 'block';
    } finally {
      bouton.disabled = false;
      bouton.textContent = estEdition ? 'Enregistrer' : 'Créer';
    }
  });

  // Ajout d'une photo a la galerie (edition uniquement)
  const formGalerie = document.getElementById('form-ajout-photo');
  if (formGalerie) {
    formGalerie.addEventListener('submit', async (event) => {
      event.preventDefault();
      const champFichier = document.getElementById('nouvelle-photo');
      if (!champFichier.files[0]) return;

      const form = new FormData();
      form.append('image', champFichier.files[0]);

      const reponse = await authFetch(`${ADMIN_API_BASE_URL}/api/actualites/${id}/images`, { method: 'POST', body: form });
      if (reponse.ok) {
        champFichier.value = '';
        chargerGalerie();
      } else {
        alert('L\'ajout de la photo a échoué.');
      }
    });
  }
});
