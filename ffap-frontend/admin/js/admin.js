// Barre de navigation du back-office, injectee dans <div id="admin-nav"></div> sur
// chaque page (meme principe que js/footer.js sur le site public).

const ADMIN_API_BASE_URL = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
  const zoneNav = document.getElementById('admin-nav');
  if (!zoneNav) return;

  const page = document.body.dataset.page || '';
  const lienActif = (nom) => (page === nom ? ' class="active"' : '');

  zoneNav.innerHTML = `
    <div class="admin-nav-inner">
      <a href="index.html" class="admin-logo">Back-office F.F.A.P.</a>
      <nav class="admin-nav-links">
        <a href="actualites.html"${lienActif('actualites')}>Actualités &amp; événements</a>
        <a href="artistes.html"${lienActif('artistes')}>Artistes</a>
        <a href="associations.html"${lienActif('associations')}>Associations</a>
      </nav>
      <div class="admin-nav-actions">
        <a href="../index.html" target="_blank" rel="noopener noreferrer">Voir le site ↗</a>
        <button type="button" id="admin-deconnexion" class="btn btn-secondaire">Se déconnecter</button>
      </div>
    </div>
  `;

  const boutonDeconnexion = document.getElementById('admin-deconnexion');
  if (boutonDeconnexion) {
    boutonDeconnexion.addEventListener('click', deconnexion);
  }
});
