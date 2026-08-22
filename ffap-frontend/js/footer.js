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
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.2c3.2 0 3.6 0 4.85.07 1.17.05 1.97.24 2.43.42.55.2.99.47 1.42.9.43.43.7.87.9 1.42.18.46.37 1.26.42 2.43.06 1.25.07 1.65.07 4.85s-.01 3.6-.07 4.85c-.05 1.17-.24 1.97-.42 2.43-.2.55-.47.99-.9 1.42-.43.43-.87.7-1.42.9-.46.18-1.26.37-2.43.42-1.25.06-1.65.07-4.85.07s-3.6-.01-4.85-.07c-1.17-.05-1.97-.24-2.43-.42-.55-.2-.99-.47-1.42-.9-.43-.43-.7-.87-.9-1.42-.18-.46-.37-1.26-.42-2.43C2.21 15.6 2.2 15.2 2.2 12s.01-3.6.07-4.85c.05-1.17.24-1.97.42-2.43.2-.55.47-.99.9-1.42.43-.43.87-.7 1.42-.9.46-.18 1.26-.37 2.43-.42C8.4 2.21 8.8 2.2 12 2.2zm0 1.8c-3.15 0-3.52.01-4.76.07-.96.04-1.48.2-1.82.34-.46.18-.78.39-1.13.73-.34.35-.55.67-.73 1.13-.14.34-.3.86-.34 1.82C3.16 8.48 3.15 8.85 3.15 12s.01 3.52.07 4.76c.04.96.2 1.48.34 1.82.18.46.39.78.73 1.13.35.34.67.55 1.13.73.34.14.86.3 1.82.34 1.24.06 1.61.07 4.76.07s3.52-.01 4.76-.07c.96-.04 1.48-.2 1.82-.34.46-.18.78-.39 1.13-.73.34-.35.55-.67.73-1.13.14-.34.3-.86.34-1.82.06-1.24.07-1.61.07-4.76s-.01-3.52-.07-4.76c-.04-.96-.2-1.48-.34-1.82-.18-.46-.39-.78-.73-1.13a3.03 3.03 0 0 0-1.13-.73c-.34-.14-.86-.3-1.82-.34-1.24-.06-1.61-.07-4.76-.07zm0 3.7a4.3 4.3 0 1 1 0 8.6 4.3 4.3 0 0 1 0-8.6zm0 1.8a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zm4.47-2.02a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/></svg>
          </a>
          <a href="https://www.facebook.com/ffartsplastiques" target="_blank" rel="noopener noreferrer" aria-label="Facebook F.F.A.P.">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 21v-7.6h2.55l.38-2.96h-2.93V8.55c0-.86.24-1.44 1.47-1.44h1.57V4.46c-.27-.04-1.2-.12-2.28-.12-2.26 0-3.8 1.38-3.8 3.9v2.18H7.99v2.96h2.47V21h3.04z"/></svg>
          </a>
          <a href="https://www.youtube.com/@FFAP-83" target="_blank" rel="noopener noreferrer" aria-label="YouTube F.F.A.P.">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.58 7.2a2.75 2.75 0 0 0-1.94-1.95C17.9 4.75 12 4.75 12 4.75s-5.9 0-7.64.5A2.75 2.75 0 0 0 2.42 7.2 28.6 28.6 0 0 0 1.92 12c0 1.61.16 3.22.5 4.8a2.75 2.75 0 0 0 1.94 1.95c1.74.5 7.64.5 7.64.5s5.9 0 7.64-.5a2.75 2.75 0 0 0 1.94-1.95c.34-1.58.5-3.19.5-4.8 0-1.61-.16-3.22-.5-4.8zM9.9 15.02V8.98L15.5 12l-5.6 3.02z"/></svg>
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
