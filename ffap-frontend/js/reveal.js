// Anime en douceur l'apparition des blocs de contenu au fil du scroll.
// N'affecte que des blocs déjà présents dans le HTML au chargement
// (en-têtes de section, grilles, cartes CTA...) : les grilles remplies
// dynamiquement (artistes, associations, actualités) sont animées comme
// un seul bloc, peu importe quand leur contenu arrive.

document.addEventListener('DOMContentLoaded', () => {
  const selecteurs = [
    'section .section-head',
    'section .grid',
    'section .two-col',
    'section .cta-compact',
    'section .rejoindre-carte',
    'section .newsletter',
    'section .campagne',
    'section .coordonnees',
    'section .partenaires-strip'
  ].join(', ');

  const elements = document.querySelectorAll(selecteurs);
  if (!elements.length) return;

  elements.forEach((el) => el.classList.add('reveal'));

  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elements.forEach((el) => el.classList.add('reveal--visible'));
    return;
  }

  const observateur = new IntersectionObserver((entrees) => {
    entrees.forEach((entree) => {
      if (entree.isIntersecting) {
        entree.target.classList.add('reveal--visible');
        observateur.unobserve(entree.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  elements.forEach((el) => observateur.observe(el));
});
