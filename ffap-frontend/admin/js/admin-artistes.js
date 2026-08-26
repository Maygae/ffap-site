// Back-office : liste et formulaire des artistes (+ gestion de leurs oeuvres).

// ===== Liste (page artistes.html) =====
document.addEventListener('DOMContentLoaded', async () => {
  const corps = document.getElementById('corps-table-artistes');
  if (!corps) return;

  async function charger() {
    try {
      const reponse = await authFetch(`${ADMIN_API_BASE_URL}/api/artistes`);
      const artistes = await reponse.json();

      if (artistes.length === 0) {
        corps.innerHTML = '<tr><td colspan="3"><div class="admin-etat-vide">Aucun artiste pour le moment.</div></td></tr>';
        return;
      }

      corps.innerHTML = artistes.map((artiste) => `
        <tr>
          <td class="admin-col-titre">${artiste.nom}</td>
          <td>${artiste.discipline || '—'}</td>
          <td>
            <div class="admin-table-actions">
              <a href="artiste-form.html?id=${artiste.id}">Modifier</a>
              <button type="button" class="danger" data-id="${artiste.id}" data-nom="${artiste.nom.replace(/"/g, '&quot;')}">Supprimer</button>
            </div>
          </td>
        </tr>
      `).join('');

      corps.querySelectorAll('button.danger').forEach((bouton) => {
        bouton.addEventListener('click', async () => {
          if (!confirm(`Supprimer « ${bouton.dataset.nom} » ? Ses œuvres seront supprimées aussi. Cette action est irréversible.`)) return;
          const reponseDelete = await authFetch(`${ADMIN_API_BASE_URL}/api/artistes/${bouton.dataset.id}`, { method: 'DELETE' });
          if (reponseDelete.ok) {
            charger();
          } else {
            alert('La suppression a échoué.');
          }
        });
      });
    } catch (error) {
      corps.innerHTML = '<tr><td colspan="3"><div class="admin-etat-vide">Impossible de charger les artistes. Le serveur back-end est-il démarré ?</div></td></tr>';
    }
  }

  charger();
});

// ===== Formulaire (page artiste-form.html) =====
document.addEventListener('DOMContentLoaded', async () => {
  const formulaire = document.getElementById('form-artiste');
  if (!formulaire) return;

  const parametres = new URLSearchParams(window.location.search);
  const id = parametres.get('id');
  const estEdition = Boolean(id);

  document.getElementById('titre-page-form').textContent = estEdition ? 'Modifier l\'artiste' : 'Nouvel artiste';

  const champNom = document.getElementById('nom');
  const champDiscipline = document.getElementById('discipline');
  const champBio = document.getElementById('bio');
  const champPhoto = document.getElementById('photo');
  const photoActuelle = document.getElementById('photo-actuelle');
  const erreur = document.getElementById('form-erreur');
  const bouton = document.getElementById('form-submit');
  const zoneOeuvres = document.getElementById('zone-oeuvres');

  async function chargerOeuvres() {
    if (!estEdition || !zoneOeuvres) return;
    const reponse = await authFetch(`${ADMIN_API_BASE_URL}/api/artistes/${id}`);
    const artiste = await reponse.json();
    const galerie = document.getElementById('galerie-oeuvres-admin');

    if (!artiste.oeuvres || artiste.oeuvres.length === 0) {
      galerie.innerHTML = '<p class="admin-champ-aide">Aucune œuvre publiée pour le moment.</p>';
    } else {
      galerie.innerHTML = artiste.oeuvres.map((oeuvre) => `
        <div class="admin-galerie-item">
          <img src="${ADMIN_API_BASE_URL}${oeuvre.image}" alt="${oeuvre.titre || ''}" />
          <button type="button" data-id="${oeuvre.id}" aria-label="Supprimer cette œuvre">×</button>
        </div>
      `).join('');

      galerie.querySelectorAll('button').forEach((bouton2) => {
        bouton2.addEventListener('click', async () => {
          if (!confirm('Supprimer cette œuvre ?')) return;
          await authFetch(`${ADMIN_API_BASE_URL}/api/oeuvres/${bouton2.dataset.id}`, { method: 'DELETE' });
          chargerOeuvres();
        });
      });
    }
  }

  if (estEdition) {
    try {
      const reponse = await authFetch(`${ADMIN_API_BASE_URL}/api/artistes/${id}`);
      if (!reponse.ok) throw new Error('Artiste introuvable');
      const artiste = await reponse.json();

      champNom.value = artiste.nom || '';
      champDiscipline.value = artiste.discipline || '';
      champBio.value = artiste.bio || '';

      if (artiste.photo && photoActuelle) {
        photoActuelle.src = `${ADMIN_API_BASE_URL}${artiste.photo}`;
        photoActuelle.style.display = 'block';
      }

      if (zoneOeuvres) {
        zoneOeuvres.style.display = '';
        chargerOeuvres();
      }
    } catch (error) {
      erreur.textContent = 'Impossible de charger cet artiste.';
      erreur.style.display = 'block';
    }
  }

  formulaire.addEventListener('submit', async (event) => {
    event.preventDefault();
    erreur.style.display = 'none';

    if (!champNom.value.trim()) {
      erreur.textContent = 'Le nom de l\'artiste est obligatoire.';
      erreur.style.display = 'block';
      return;
    }

    const form = new FormData();
    form.append('nom', champNom.value.trim());
    form.append('discipline', champDiscipline.value.trim());
    form.append('bio', champBio.value);
    if (champPhoto.files[0]) {
      form.append('photo', champPhoto.files[0]);
    }

    bouton.disabled = true;
    bouton.textContent = estEdition ? 'Enregistrement...' : 'Création...';

    try {
      const url = estEdition ? `${ADMIN_API_BASE_URL}/api/artistes/${id}` : `${ADMIN_API_BASE_URL}/api/artistes`;
      const reponse = await authFetch(url, { method: estEdition ? 'PUT' : 'POST', body: form });
      const donnees = await reponse.json();

      if (!reponse.ok) {
        erreur.textContent = donnees.error || 'Une erreur est survenue.';
        erreur.style.display = 'block';
        return;
      }

      window.location.href = 'artistes.html';
    } catch (error) {
      erreur.textContent = 'Impossible de contacter le serveur.';
      erreur.style.display = 'block';
    } finally {
      bouton.disabled = false;
      bouton.textContent = estEdition ? 'Enregistrer' : 'Créer';
    }
  });

  // Ajout d'une oeuvre a la galerie (edition uniquement)
  const formOeuvre = document.getElementById('form-ajout-oeuvre');
  if (formOeuvre) {
    formOeuvre.addEventListener('submit', async (event) => {
      event.preventDefault();
      const champFichier = document.getElementById('nouvelle-oeuvre-image');
      const champTitreOeuvre = document.getElementById('nouvelle-oeuvre-titre');
      if (!champFichier.files[0]) return;

      const form = new FormData();
      form.append('image', champFichier.files[0]);
      form.append('titre', champTitreOeuvre.value.trim());

      const reponse = await authFetch(`${ADMIN_API_BASE_URL}/api/artistes/${id}/oeuvres`, { method: 'POST', body: form });
      if (reponse.ok) {
        champFichier.value = '';
        champTitreOeuvre.value = '';
        chargerOeuvres();
      } else {
        alert('L\'ajout de l\'œuvre a échoué.');
      }
    });
  }
});
