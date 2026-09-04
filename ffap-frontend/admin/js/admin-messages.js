// Back-office : liste des messages recus via le formulaire de contact public.
// S'appuie sur admin-auth.js (authFetch, exigerConnexion) et ADMIN_API_BASE_URL (admin.js).

document.addEventListener('DOMContentLoaded', () => {
  const corps = document.getElementById('corps-table-messages');
  if (!corps) return;

  async function charger() {
    try {
      const reponse = await authFetch(`${ADMIN_API_BASE_URL}/api/contact`);
      const messages = await reponse.json();

      if (messages.length === 0) {
        corps.innerHTML = '<tr><td colspan="7"><div class="admin-etat-vide">Aucun message pour le moment.</div></td></tr>';
        return;
      }

      // Les plus recents en premier
      messages.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      corps.innerHTML = messages.map((item) => `
        <tr>
          <td class="admin-col-titre">${item.nom}</td>
          <td><a href="mailto:${item.email}">${item.email}</a></td>
          <td>${item.telephone || '—'}</td>
          <td style="max-width:320px; white-space:pre-wrap;">${item.message}</td>
          <td>${new Date(item.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
          <td>${item.statut === 'traite' ? '<span class="admin-badge">Traité</span>' : '<span class="admin-badge admin-badge--off">Nouveau</span>'}</td>
          <td>
            <div class="admin-table-actions">
              <button type="button" class="basculer-statut" data-id="${item.id}" data-statut="${item.statut}">
                ${item.statut === 'traite' ? 'Marquer nouveau' : 'Marquer traité'}
              </button>
              <button type="button" class="danger" data-id="${item.id}" data-nom="${item.nom.replace(/"/g, '&quot;')}">Supprimer</button>
            </div>
          </td>
        </tr>
      `).join('');

      corps.querySelectorAll('button.basculer-statut').forEach((bouton) => {
        bouton.addEventListener('click', async () => {
          const nouveauStatut = bouton.dataset.statut === 'traite' ? 'nouveau' : 'traite';
          const reponseMaj = await authFetch(`${ADMIN_API_BASE_URL}/api/contact/${bouton.dataset.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ statut: nouveauStatut }),
          });
          if (reponseMaj.ok) {
            charger();
          } else {
            alert('La mise à jour du statut a échoué.');
          }
        });
      });

      corps.querySelectorAll('button.danger').forEach((bouton) => {
        bouton.addEventListener('click', async () => {
          if (!confirm(`Supprimer le message de « ${bouton.dataset.nom} » ? Cette action est irréversible.`)) return;
          const reponseDelete = await authFetch(`${ADMIN_API_BASE_URL}/api/contact/${bouton.dataset.id}`, { method: 'DELETE' });
          if (reponseDelete.ok) {
            charger();
          } else {
            alert('La suppression a échoué.');
          }
        });
      });
    } catch (error) {
      corps.innerHTML = '<tr><td colspan="7"><div class="admin-etat-vide">Impossible de charger les messages. Le serveur back-end est-il démarré ?</div></td></tr>';
    }
  }

  charger();
});
