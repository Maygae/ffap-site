// Met a jour/cree les fiches des 3 artistes avec leurs vraies bios (fournies par la federation).
// Usage : node src/scripts/update-bios.js
// Demande le mot de passe admin en console (le mot de passe n'est pas affiche a l'ecran... enfin si, en clair,
// readline standard ne masque pas la saisie sans lib supplementaire, mais rien n'est enregistre sur disque).

const readline = require('readline');

const API = process.env.API_BASE_URL || 'http://localhost:3000';
const ADMIN_EMAIL = 'ffap.83@gmail.com';

const artistes = [
  {
    nom: 'Martine de Santis',
    discipline: 'Peinture, Sculpture',
    bio: `Depuis sa retraite en 2015, Martine de Santis consacre une grande partie de son temps a ses passions artistiques : la peinture et la sculpture. Ces deux pratiques, qu'elle mene en parallele, lui permettent d'exprimer sa creativite tout en continuant, a chaque oeuvre, a explorer de nouvelles techniques et de nouvelles sensibilites.

Pour Martine, creer est avant tout une source de plaisir, d'evasion et de rencontres. Chaque toile ou sculpture est une nouvelle aventure, l'occasion de traduire une emotion, une intuition ou un regard singulier sur le monde qui l'entoure.

Presidente des Artistes Gardeens

Martine de Santis preside l'association Les Artistes Gardeens, basee a La Garde, dans le Var. L'association a pour vocation de promouvoir l'art sous toutes ses formes — peinture, aquarelle, huiles, modelage, dessin, vitraux — a travers des cours, des ateliers libres et des expositions organisees tout au long de l'annee, notamment lors du Salon de Printemps et des expositions a la salle Gerard Philipe.

A la tete de cette structure, elle coordonne l'organisation des activites, des expositions et des projets de l'association, tout en favorisant les echanges entre les membres et les clubs partenaires. Cet engagement associatif lui permet de partager sa passion de l'art avec un large public et de contribuer activement a la vie culturelle de sa commune.

Presider une association d'artistes est pour elle une experience aussi enrichissante que sa pratique personnelle : elle y trouve un sens supplementaire a son engagement, entre transmission, organisation et vie collective autour de la creation.`,
  },
  {
    nom: 'Christian Disty',
    discipline: 'Peinture',
    bio: `Christian Disty est ne a Bruxelles, en Belgique, le 18 janvier 1950. Installe en France depuis 2012, il vit a Bormes-les-Mimosas, ou il poursuit son parcours artistique.

Artiste depuis plus de cinquante ans, il a mene l'essentiel de sa carriere dans l'univers de la magie, presentant ses spectacles a travers le monde aux cotes de son epouse, egalement son assistante de scene.

De la magie a la peinture

A la retraite, il realise un reve de longue date en se consacrant a la peinture. Cette nouvelle passion l'amene a rapprocher ses deux univers artistiques : la magie et les arts plastiques. De cette rencontre naissent les Tableaux Magiques, des oeuvres concues pour la scene, permettant aux magiciens de faire apparaitre ou disparaitre des objets ou des animaux directement depuis le tableau.

Au-dela de ce concept unique, Christian Disty developpe une peinture plus personnelle, portee notamment par une serie sur le theme des drapes et un travail exploratoire autour de la resine. Il realise egalement des portraits sur commande d'apres photographie, dans un style figuratif sensible qui prolonge, hors de la scene, son gout pour l'illusion et le mouvement.

En 2015, ses creations sont recompensees lors du championnat du monde de magie par le prix du plus bel effet magique au monde en originalite.

Un engagement au service des arts plastiques

Engage dans la promotion des arts plastiques, Christian Disty devient president du Mouvement des Arts en 2019, avant d'accompagner sa transformation en Federation des Arts Plastiques en 2025. Son action vise a soutenir les artistes a travers des evenements, conferences, ateliers et rencontres culturelles.

Sa devise resume son engagement : « Unissons nos forces pour valoriser les arts plastiques ! »`,
  },
  {
    nom: 'Lise Oerlemans',
    discipline: 'Peinture',
    bio: `Lise Oerlemans vit et travaille a Hyeres, ou elle est arrivee il y a plus de trente-cinq ans. Au fil du temps, elle y a construit un ancrage personnel et artistique fort, nourri par la lumiere et les paysages de la region.

Guidee dans ses debuts par une artiste peintre qui lui a transmis l'importance des jeux de lumiere, des ombres, du mouvement et des vibrations, Lise a progressivement affirme sa propre ecriture. Son travail se concentre aujourd'hui sur la peinture a l'huile au couteau, une technique qu'elle utilise pour traduire l'energie et la matiere de ses sujets.

Ses toiles representent principalement des paysages, inspires par ses voyages et ses rencontres avec la nature. Chaque oeuvre est l'occasion de saisir une atmosphere, une lumiere fugace ou une emotion liee a un lieu, que Lise retranscrit avec une touche dynamique et une palette sensible.

Une presence artistique ancree dans la duree

Investie de longue date dans la vie artistique locale, Lise Oerlemans a longtemps participe aux activites du Mouvement des Arts, aujourd'hui devenu la Federation Francaise des Arts Plastiques, dont la transformation a ete officialisee en 2025. Elle expose chaque annee au Forum du Casino de Hyeres et est egalement presente toute l'annee a la galerie de Giens, poursuivant ainsi un dialogue continu avec le public.`,
  },
];

function demanderMotDePasse() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question('Mot de passe admin (ffap.83@gmail.com) : ', (reponse) => {
      rl.close();
      resolve(reponse);
    });
  });
}

async function main() {
  const password = await demanderMotDePasse();

  const loginRes = await fetch(`${API}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, mot_de_passe: password }),
  });
  const loginData = await loginRes.json();
  if (!loginRes.ok) {
    console.error('Echec de connexion :', loginData.error);
    process.exit(1);
  }
  const token = loginData.token;

  const listeRes = await fetch(`${API}/api/artistes`);
  const liste = await listeRes.json();

  for (const artiste of artistes) {
    const existant = liste.find((a) => a.nom === artiste.nom);
    const method = existant ? 'PUT' : 'POST';
    const url = existant ? `${API}/api/artistes/${existant.id}` : `${API}/api/artistes`;

    const form = new FormData();
    form.append('nom', artiste.nom);
    form.append('discipline', artiste.discipline);
    form.append('bio', artiste.bio);

    const res = await fetch(url, {
      method,
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });
    const data = await res.json();
    if (!res.ok) {
      console.error(`Echec pour ${artiste.nom} :`, data.error);
    } else {
      console.log(`${method === 'PUT' ? 'Mis a jour' : 'Cree'} : ${artiste.nom}`);
    }
  }
}

main();
