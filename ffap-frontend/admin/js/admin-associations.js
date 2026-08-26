// Back-office : liste et formulaire des associations.

// ===== Liste (page associations.html) =====
document.addEventListener('DOMContentLoaded', async () => {
  const corps = document.getElementById('corps-table-associations');
  if (!corps) return;

  async function charger() {
    try {
      const reponse = await authFetch(`${ADMIN_API_BASE_URL}/api/associations`);
      const associations = await reponse.json();

      if (associations.length === 0) {
        corps.innerHTML = '<tr><td colspan="3"><div class="admin-etat-vide">Aucune association pour le moment.</div></td></tr>';
        return;
      }

      corps.innerHTML = associations.map((asso) => `
        <tr>
          <td class="admin-col-titre">${asso.nom}</td>
          <td>${asso.lien_externe ? `<a href="${asso.lien_externe}" target="_blank" rel="noopener noreferrer">${asso.lien_externe}</a>` : '—'}</td>
          <td>
            <div class="admin-table-actions">
              <a href="association-form.html?id=${asso.id}">Modifier</a>
              <button type="button" class="danger" data-id="${asso.id}" data-nom="${asso.nom.replace(/"/g, '&quot;')}">Supprimer</button>
            </div>
          </td>
        </tr>
      `).join('');

      corps.querySelectorAll('button.danger').forEach((bouton) => {
        bouton.addEventListener('click', async () => {
          if (!confirm(`Supprimer « ${bouton.dataset.nom} » ? Cette action est irréversible.`)) return;
          const reponseDelete = await authFetch(`${ADMIN_API_BASE_URL}/api/associations/${bouton.dataset.id}`, { method: 'DELETE' });
          if (reponseDelete.ok) {
            charger();
          } else {
            alert('La suppression a échoué.');
          }
        });
      });
    } catch (error) {
      corps.innerHTML = '<tr><td colspan="3"><div class="admin-etat-vide">Impossible de charger les associations. Le serveur back-end est-il démarré ?</div></td></tr>';
    }
  }

  charger();
});

// ===== Formulaire (page association-form.html) =====
document.addEventListener('DOMContentLoaded', async () => {
  const formulaire = document.getElementById('form-association');
  if (!formulaire) return;

  const parametres = new URLSearchParams(window.location.search);
  const id = parametres.get('id');
  const estEdition = Boolean(id);

  document.getElementById('titre-page-form').textContent = estEdition ? 'Modifier l\'association' : 'Nouvelle association';

  const champNom = document.getElementById('nom');
  const champDescription = document.getElementById('description');
  const champLien = document.getElementById('lien_externe');
  const champLogo = document.getElementById('logo');
  const logoActuel = document.getElementById('logo-actuel');
  const erreur = document.getElementById('form-erreur');
  const bouton = document.getElementById('form-submit');

  if (estEdition) {
    try {
      const reponse = await authFetch(`${ADMIN_API_BASE_URL}/api/associations/${id}`);
      if (!reponse.ok) throw new Error('Association introuvable');
      const asso = await reponse.json();

      champNom.value = asso.nom || '';
      champDescription.value = asso.description || '';
      champLien.value = asso.lien_externe || '';

      if (asso.logo && logoActuel) {
        logoActuel.src = `${ADMIN_API_BASE_URL}${asso.logo}`;
        logoActuel.style.display = 'block';
      }
    } catch (error) {
      erreur.textContent = 'Impossible de charger cette association.';
      erreur.style.display = 'block';
    }
  }

  formulaire.addEventListener('submit', async (event) => {
    event.preventDefault();
    erreur.style.display = 'none';

    if (!champNom.value.trim()) {
      erreur.textContent = 'Le nom de l\'association est obligatoire.';
      erreur.style.display = 'block';
      return;
    }

    const form = new FormData();
    form.append('nom', champNom.value.trim());
    form.append('description', champDescription.value);
    form.append('lien_externe', champLien.value.trim());
    if (champLogo.files[0]) {
      form.append('logo', champLogo.files[0]);
    }

    bouton.disabled = true;
    bouton.textContent = estEdition ? 'Enregistrement...' : 'Création...';

    try {
      const url = estEdition ? `${ADMIN_API_BASE_URL}/api/associations/${id}` : `${ADMIN_API_BASE_URL}/api/associations`;
      const reponse = await authFetch(url, { method: estEdition ? 'PUT' : 'POST', body: form });
      const donnees = await reponse.json();

      if (!reponse.ok) {
        erreur.textContent = donnees.error || 'Une erreur est survenue.';
        erreur.style.display = 'block';
        return;
      }

      window.location.href = 'associations.html';
    } catch (error) {
      erreur.textContent = 'Impossible de contacter le serveur.';
      erreur.style.display = 'block';
    } finally {
      bouton.disabled = false;
      bouton.textContent = estEdition ? 'Enregistrer' : 'Créer';
    }
  });
});
