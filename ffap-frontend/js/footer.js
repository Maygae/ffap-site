// Injecte le pied de page dans toutes les pages qui possedent <footer id="site-footer"></footer>
// Objectif : ne pas dupliquer ce bloc dans chaque fichier HTML -> un seul endroit a modifier.

document.addEventListener('DOMContentLoaded', () => {
  const footer = document.getElementById('site-footer');
  if (!footer) return;

  footer.innerHTML = `
    <div class="footer-inner">
      <div class="footer-brand">
        <img class="footer-logo-badge" src="assets/images/logo-ffap.png" alt="Logo F.F.A.P." />
        <p class="footer-desc">La Federation Francaise des Arts Plastiques federe les artistes et associations d'arts plastiques autour d'actions communes : expositions, mutualisation de moyens et representation aupres des institutions.</p>
        <div class="footer-social">
          <a href="https://www.instagram.com/ffap_france/" target="_blank" rel="noopener noreferrer" aria-label="Instagram F.F.A.P.">
            <svg viewBox="0 0 50 50" aria-hidden="true"><path d="M 16 3 C 8.83 3 3 8.83 3 16 L 3 34 C 3 41.17 8.83 47 16 47 L 34 47 C 41.17 47 47 41.17 47 34 L 47 16 C 47 8.83 41.17 3 34 3 L 16 3 z M 37 11 C 38.1 11 39 11.9 39 13 C 39 14.1 38.1 15 37 15 C 35.9 15 35 14.1 35 13 C 35 11.9 35.9 11 37 11 z M 25 14 C 31.07 14 36 18.93 36 25 C 36 31.07 31.07 36 25 36 C 18.93 36 14 31.07 14 25 C 14 18.93 18.93 14 25 14 z M 25 16 C 20.04 16 16 20.04 16 25 C 16 29.96 20.04 34 25 34 C 29.96 34 34 29.96 34 25 C 34 20.04 29.96 16 25 16 z"/></svg>
          </a>
          <a href="https://www.facebook.com/ffartsplastiques" target="_blank" rel="noopener noreferrer" aria-label="Facebook F.F.A.P.">
            <svg viewBox="0 0 50 50" aria-hidden="true"><path d="M25,3C12.85,3,3,12.85,3,25c0,11.03,8.125,20.137,18.712,21.728V30.831h-5.443v-5.783h5.443v-3.848 c0-6.371,3.104-9.168,8.399-9.168c2.536,0,3.877,0.188,4.512,0.274v5.048h-3.612c-2.248,0-3.033,2.131-3.033,4.533v3.161h6.588 l-0.894,5.783h-5.694v15.944C38.716,45.318,47,36.137,47,25C47,12.85,37.15,3,25,3z"/></svg>
          </a>
          <a href="https://www.youtube.com/@FFAP-83" target="_blank" rel="noopener noreferrer" aria-label="YouTube F.F.A.P.">
            <svg viewBox="0 0 50 50" aria-hidden="true"><path d="M 44.898438 14.5 C 44.5 12.300781 42.601563 10.699219 40.398438 10.199219 C 37.101563 9.5 31 9 24.398438 9 C 17.800781 9 11.601563 9.5 8.300781 10.199219 C 6.101563 10.699219 4.199219 12.199219 3.800781 14.5 C 3.398438 17 3 20.5 3 25 C 3 29.5 3.398438 33 3.898438 35.5 C 4.300781 37.699219 6.199219 39.300781 8.398438 39.800781 C 11.898438 40.5 17.898438 41 24.5 41 C 31.101563 41 37.101563 40.5 40.601563 39.800781 C 42.800781 39.300781 44.699219 37.800781 45.101563 35.5 C 45.5 33 46 29.398438 46.101563 25 C 45.898438 20.5 45.398438 17 44.898438 14.5 Z M 19 32 L 19 18 L 31.199219 25 Z"/></svg>
          </a>
        </div>
      </div>

      <div class="footer-col">
        <h3>Navigation</h3>
        <a href="index.html">Accueil</a>
        <a href="artistes.html">Artistes</a>
        <a href="associations.html">Associations</a>
      </div>

      <div class="footer-col">
        <h3>Informations</h3>
        <a href="actualites.html">Evenements &amp; Sorties</a>
        <a href="federation.html">A propos</a>
        <a href="contact.html">Contact</a>
        <a href="https://www.helloasso.com/associations/federation-francaise-des-arts-plastiques-f-f-a-p/adhesions/adhesion-f-f-a-p-2026-2027" target="_blank" rel="noopener noreferrer">Adherer</a>
      </div>
    </div>

    <div class="footer-bottom">
      <p class="footer-copyright">&copy; 2026 F.F.A.P. réaliser par Maygae</p>
      <a href="mentions-legales.html" class="footer-copyright" style="text-decoration:underline;">Mentions legales</a>
    </div>
  `;
});
