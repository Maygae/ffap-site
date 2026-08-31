// Corrige les accents manquants (et quelques fautes) dans le contenu editorial :
// bios des artistes, descriptions des associations, textes des actualites.
// Les noms propres (Gardeens, Disty, Oerlemans, Bombaspheres...) ne sont pas modifies.
//
// Usage : node src/scripts/fix-accents-content.js
// Pour la production : API_BASE_URL=https://ffap-site-production.up.railway.app node src/scripts/fix-accents-content.js

const readline = require('readline');

const API = process.env.API_BASE_URL || 'http://localhost:3000';
const ADMIN_EMAIL = 'ffap.83@gmail.com';

function demanderMotDePasse() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question('Mot de passe admin (ffap.83@gmail.com) : ', (reponse) => {
      rl.close();
      resolve(reponse);
    });
  });
}

async function login() {
  const password = await demanderMotDePasse();
  const res = await fetch(`${API}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, mot_de_passe: password }),
  });
  const data = await res.json();
  if (!res.ok) {
    console.error('Echec de connexion :', data.error);
    process.exit(1);
  }
  return data.token;
}

// ===== Textes corriges (accents retablis) =====

const BIO_MARTINE = `Depuis sa retraite en 2015, Martine de Santis consacre une grande partie de son temps à ses passions artistiques : la peinture et la sculpture. Ces deux pratiques, qu'elle mène en parallèle, lui permettent d'exprimer sa créativité tout en continuant, à chaque œuvre, à explorer de nouvelles techniques et de nouvelles sensibilités.

Pour Martine, créer est avant tout une source de plaisir, d'évasion et de rencontres. Chaque toile ou sculpture est une nouvelle aventure, l'occasion de traduire une émotion, une intuition ou un regard singulier sur le monde qui l'entoure.

Présidente des Artistes Gardeens

Martine de Santis préside l'association Les Artistes Gardeens, basée à La Garde, dans le Var. L'association a pour vocation de promouvoir l'art sous toutes ses formes — peinture, aquarelle, huiles, modelage, dessin, vitraux — à travers des cours, des ateliers libres et des expositions organisées tout au long de l'année, notamment lors du Salon de Printemps et des expositions à la salle Gérard Philipe.

À la tête de cette structure, elle coordonne l'organisation des activités, des expositions et des projets de l'association, tout en favorisant les échanges entre les membres et les clubs partenaires. Cet engagement associatif lui permet de partager sa passion de l'art avec un large public et de contribuer activement à la vie culturelle de sa commune.

Présider une association d'artistes est pour elle une expérience aussi enrichissante que sa pratique personnelle : elle y trouve un sens supplémentaire à son engagement, entre transmission, organisation et vie collective autour de la création.`;

const BIO_CHRISTIAN = `Christian Disty est né à Bruxelles, en Belgique, le 18 janvier 1950. Installé en France depuis 2012, il vit à Bormes-les-Mimosas, où il poursuit son parcours artistique.

Artiste depuis plus de cinquante ans, il a mené l'essentiel de sa carrière dans l'univers de la magie, présentant ses spectacles à travers le monde aux côtés de son épouse, également son assistante de scène.

De la magie à la peinture

À la retraite, il réalise un rêve de longue date en se consacrant à la peinture. Cette nouvelle passion l'amène à rapprocher ses deux univers artistiques : la magie et les arts plastiques. De cette rencontre naissent les Tableaux Magiques, des œuvres conçues pour la scène, permettant aux magiciens de faire apparaître ou disparaître des objets ou des animaux directement depuis le tableau.

Au-delà de ce concept unique, Christian Disty développe une peinture plus personnelle, portée notamment par une série sur le thème des drapés et un travail exploratoire autour de la résine. Il réalise également des portraits sur commande d'après photographie, dans un style figuratif sensible qui prolonge, hors de la scène, son goût pour l'illusion et le mouvement.

En 2015, ses créations sont récompensées lors du championnat du monde de magie par le prix du plus bel effet magique, dans la catégorie originalité.

Un engagement au service des arts plastiques

Engagé dans la promotion des arts plastiques, Christian Disty devient président du Mouvement des Arts en 2019, avant d'accompagner sa transformation en Fédération Française des Arts Plastiques en 2025. Son action vise à soutenir les artistes à travers des événements, conférences, ateliers et rencontres culturelles.

Sa devise résume son engagement : « Unissons nos forces pour valoriser les arts plastiques ! »`;

const BIO_LISE = `Lise Oerlemans vit et travaille à Hyères, où elle est arrivée il y a plus de trente-cinq ans. Au fil du temps, elle y a construit un ancrage personnel et artistique fort, nourri par la lumière et les paysages de la région.

Guidée dans ses débuts par une artiste peintre qui lui a transmis l'importance des jeux de lumière, des ombres, du mouvement et des vibrations, Lise a progressivement affirmé sa propre écriture. Son travail se concentre aujourd'hui sur la peinture à l'huile au couteau, une technique qu'elle utilise pour traduire l'énergie et la matière de ses sujets.

Ses toiles représentent principalement des paysages, inspirés par ses voyages et ses rencontres avec la nature. Chaque œuvre est l'occasion de saisir une atmosphère, une lumière fugace ou une émotion liée à un lieu, que Lise retranscrit avec une touche dynamique et une palette sensible.

Une présence artistique ancrée dans la durée

Investie de longue date dans la vie artistique locale, Lise Oerlemans a longtemps participé aux activités du Mouvement des Arts, aujourd'hui devenu la Fédération Française des Arts Plastiques, dont la transformation a été officialisée en 2025. Elle expose chaque année au Forum du Casino de Hyères et est également présente toute l'année à la galerie de Giens, poursuivant ainsi un dialogue continu avec le public.`;

const DESC_GARDEENS = `Présidée par Martine de Santis

L'Association Les Artistes Gardeens est un exemple vivant de la manière dont un atelier d'art local peut stimuler la créativité et enrichir durablement la vie culturelle. Cette association offre bien plus qu'un simple lieu d'expression artistique : elle rassemble une véritable communauté où artistes et amateurs d'art se rencontrent pour apprendre, créer et partager leur passion.

Un lieu dédié à l'apprentissage et à la pratique artistique
L'association accueille chaleureusement les artistes de tous niveaux, des débutants aux créateurs confirmés. Elle propose des ateliers, des cours et des séances de pratique libre permettant d'explorer différentes disciplines telles que la peinture, la sculpture, le dessin et les techniques mixtes. Cette approche pratique encourage l'expérimentation, le développement personnel et la progression artistique.

Elle met notamment à disposition : des ateliers adaptés à tous les niveaux, du matériel et des outils de qualité professionnelle, ainsi que l'accompagnement d'artistes et d'intervenants expérimentés.

En privilégiant la pratique, l'association permet à chacun de développer ses compétences tout en renforçant sa confiance en lui. À titre d'exemple, un récent atelier consacré à la peinture a initié les participants à la théorie des couleurs et à la composition, avant de se conclure par une exposition collective mettant en valeur les œuvres réalisées.

Une dynamique humaine et collective
L'un des plus grands atouts de l'association réside dans sa capacité à créer une véritable dynamique humaine. Les artistes travaillent souvent de manière isolée ; cet atelier leur offre un espace d'échange, de collaboration et de dialogue. Les critiques collectives, les expositions et les rencontres conviviales permettent aux membres de partager leurs expériences et leur passion.

Une ouverture vers le grand public
L'association s'adresse également au grand public en organisant régulièrement des expositions ouvertes à tous. Ces manifestations permettent aux artistes de présenter leurs créations en dehors de l'atelier et favorisent les échanges avec les habitants autour de l'art et de la culture.
N'hésitez pas à découvrir ou à rejoindre l'association afin de vivre pleinement l'expérience enrichissante que l'art peut offrir à chacun.`;

const DESC_PALETTE = `83160 La Valette-du-Var

Une histoire ancrée dans la commune
La Palette Valettoise est une association Loi 1901, fondée en 1966 à La Valette-du-Var. C'est la plus ancienne association de la commune. Depuis sa création, les peintres amateurs peuvent donner libre cours à leur inspiration et à leur passion.

« La Peinture est une poésie qui se voit. » — Léonard de Vinci

Notre mission
L'association a pour objet de regrouper des artistes afin de favoriser les arts plastiques, en particulier la peinture, et toutes les activités qui s'y rapportent, suivant les rythmes et les envies de chacune et de chacun. Pour cela, elle propose une information régulière auprès de ses adhérents, ainsi que l'organisation d'expositions, d'échanges et de voyages culturels.
Notre public se compose d'adhérents qui sont tous des peintres amateurs.

La vie de l'atelier
L'atelier est ouvert trois après-midis par semaine — le lundi, le mercredi et le vendredi, de 14h00 à 17h30. Chaque peintre dispose d'un espace dédié et peut laisser l'ensemble de son matériel sur place, dans des locaux adaptés où règne une ambiance détendue, propice à la concentration. Des intervenants sont régulièrement sollicités pour dispenser des cours de dessin et de peinture.

Nos rendez-vous et partenariats
L'association organise actuellement une exposition annuelle au printemps, à la Salle du Lavoir, à La Valette-du-Var. Elle est par ailleurs sollicitée plusieurs fois par an par la Municipalité pour participer à certains événements (Téléthon, Octobre Rose...) et organiser des ateliers de peinture pour les enfants, à l'occasion de Noël, du Carnaval ou de la Fête de la Fraise. Ces ateliers remportent chaque fois un franc succès !

Nous rejoindre
Peintres amateurs, débutants ou confirmés : La Palette Valettoise vous accueille dans un cadre convivial et stimulant, riche de près de soixante ans d'histoire.
N'hésitez pas à venir découvrir l'atelier et à rejoindre notre communauté de passionnés.`;

const CONTENU_SALON_FFAP = `La Fédération Française des Arts Plastiques (F.F.A.P.) a le plaisir d'annoncer la tenue du 2e Grand Salon des arts, un rendez-vous incontournable dédié à la création sous toutes ses formes.

Du 4 au 7 mars 2027, le Forum du Casino de Hyères deviendra un véritable laboratoire artistique où se rencontreront talents confirmés, jeunes créateurs, collectifs et passionnés d'art contemporain. Après le succès de sa première édition, le Salon revient avec une ambition renouvelée et une programmation enrichie.

Les nouveautés de cette édition

Pour cette deuxième édition, la F.F.A.P. innove et enrichit l'expérience des visiteurs avec plusieurs nouveautés marquantes :

- Des stands habillés de tissus, proposés en deux harmonies de couleurs (tons chauds et tons froids), offrant une esthétique plus immersive et élégante, pensée pour sublimer chaque univers artistique.
- Des démonstrations de Live Painting, permettant au public d'assister en direct à la naissance d'une œuvre, dans une ambiance vibrante et participative.
- Un espace Street Art, où les artistes urbains réaliseront des fresques et performances en temps réel.
- La peinture sur vêtement, nouvelle discipline mise à l'honneur, fusionnant art visuel et expression textile.
- Un défilé exceptionnel, présentant les créations réalisées pendant le salon : pièces uniques, vêtements peints, silhouettes inspirées de l'univers graphique de l'affiche officielle, entre couleurs éclatantes, formes polygonales et énergie contemporaine.

Un large éventail de disciplines

Au-delà de ces nouveautés, le Salon continuera d'accueillir un large éventail de disciplines : peinture, sculpture, dessin, photographie, arts numériques, installations, street art, ainsi que des espaces dédiés aux associations et créateurs indépendants.

Avec cette édition renouvelée, la F.F.A.P. affirme sa volonté de célébrer l'art sans limites, de favoriser les rencontres, et d'offrir au public une expérience artistique riche, vivante et audacieuse.

Informations pratiques

Le Salon est ouvert au public du 4 au 7 mars 2027, au Forum du Casino de Hyères. Horaires, tarifs et modalités d'inscription pour les exposants seront précisés prochainement sur le site de la F.F.A.P.`;

const CONTENU_AVIGNON = `La Fédération Française des Arts Plastiques a également organisé une sortie culturelle à Avignon pour visiter le Palais des Papes, réunissant un groupe d'adhérents autour d'une journée de découverte artistique et patrimoniale. Entre patrimoine historique, lieux emblématiques et espaces d'exposition, cette escapade a permis d'explorer la richesse culturelle de la ville.

Dans une atmosphère conviviale, les participants ont pu échanger autour des œuvres, des lieux visités et de leurs propres pratiques artistiques. Cette sortie a été l'occasion de nourrir la curiosité, de partager des impressions et de renforcer les liens au sein de la Fédération.

En proposant ce type de rendez-vous, la Fédération Française des Arts Plastiques poursuit son engagement en faveur de la rencontre entre les artistes, les amateurs et les lieux de culture. D'autres sorties et événements seront programmés afin de continuer à offrir des moments de découverte, de dialogue et de plaisir partagé autour de l'art.`;

const CONTENU_CHATEAU = `Le 25 octobre 2025, la Fédération Française des Arts Plastiques a organisé une journée de découverte au Château La Coste, réunissant un groupe de cinquante participants. Dans un cadre mêlant art, architecture et nature, cette sortie a été l'occasion de partager un moment convivial autour de la création contemporaine.

La météo particulièrement agréable a permis de profiter pleinement du site, des promenades en extérieur et des œuvres disséminées dans le paysage. Entre sculptures monumentales, installations et expositions, les participants ont pu faire de belles découvertes artistiques tout au long du parcours.

Cette journée a également favorisé les échanges entre artistes et amateurs d'art, dans un esprit de rencontre et de partage. Chacun est reparti enrichi de nouvelles inspirations, de points de vue croisés et du souvenir d'un moment chaleureux passé ensemble.

En proposant ce type de sortie culturelle, la Fédération Française des Arts Plastiques poursuit sa mission de valorisation de la création artistique et de mise en lien des publics avec des lieux d'art majeurs.`;

const CONTENU_SALON_HYERES = `Du 30 avril au 3 mai 2026 — Forum du Casino à Hyères

La Fédération Française des Arts Plastiques organise son Salon des Arts Contemporains au Forum du Casino à Hyères, avenue Ambroise Thomas, du 30 avril au 3 mai 2026. Cet événement rassemblera peintres, sculpteurs, dessinateurs, aquarellistes, photographes et artisans d'art venus de toute la France pour quatre jours de création et de rencontres avec le public.

Les invitées d'honneur de cette édition seront les Bombaspheres, un collectif d'artistes parisiennes spécialisé dans le street art. Chaque jour, un show unique sera proposé, avec des performances en direct et la réalisation d'œuvres sur place, offrant aux visiteurs l'occasion d'assister au travail des artistes en temps réel.

Le salon sera ouvert de 10h à 19h, avec une entrée gratuite, afin de permettre au plus grand nombre de découvrir la diversité des pratiques artistiques contemporaines. Une restauration sur place sera également proposée pour profiter pleinement de la journée.`;

// ===== Appels API =====

async function corrigerArtiste(token, nom, nouvelleBio) {
  const listeRes = await fetch(`${API}/api/artistes`);
  const liste = await listeRes.json();
  const resume = liste.find((a) => a.nom === nom);
  if (!resume) {
    console.error(`Artiste introuvable : ${nom}`);
    return;
  }
  const detailRes = await fetch(`${API}/api/artistes/${resume.id}`);
  const item = await detailRes.json();

  const form = new FormData();
  form.append('nom', item.nom);
  form.append('discipline', item.discipline || '');
  form.append('bio', nouvelleBio);

  const res = await fetch(`${API}/api/artistes/${item.id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  const data = await res.json();
  if (!res.ok) {
    console.error(`Echec pour "${nom}" :`, data.error);
  } else {
    console.log(`Artiste corrige : ${nom}`);
  }
}

async function corrigerAssociation(token, nom, nouvelleDescription) {
  const listeRes = await fetch(`${API}/api/associations`);
  const liste = await listeRes.json();
  const item = liste.find((a) => a.nom === nom);
  if (!item) {
    console.error(`Association introuvable : ${nom}`);
    return;
  }

  const form = new FormData();
  form.append('nom', item.nom);
  form.append('description', nouvelleDescription);
  form.append('lien_externe', item.lien_externe || '');

  const res = await fetch(`${API}/api/associations/${item.id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  const data = await res.json();
  if (!res.ok) {
    console.error(`Echec pour "${nom}" :`, data.error);
  } else {
    console.log(`Association corrigee : ${nom}`);
  }
}

async function corrigerActualite(token, ancienTitre, corrections) {
  const listeRes = await fetch(`${API}/api/actualites`);
  const liste = await listeRes.json();
  const item = liste.find((a) => a.titre === ancienTitre);
  if (!item) {
    console.error(`Actualite introuvable : ${ancienTitre}`);
    return;
  }

  const nouveauTitre = corrections.titre || item.titre;
  const nouveauLieu = corrections.lieu !== undefined ? corrections.lieu : item.lieu;
  const nouveauContenu = corrections.contenu || item.contenu;

  const form = new FormData();
  form.append('titre', nouveauTitre);
  form.append('categorie', item.categorie || 'evenement');
  form.append('lieu', nouveauLieu || '');
  form.append('date_evenement', item.date_evenement ? item.date_evenement.slice(0, 10) : '');
  form.append('contenu', nouveauContenu);
  form.append('a_la_une', item.a_la_une ? 'true' : 'false');

  const res = await fetch(`${API}/api/actualites/${item.id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  const data = await res.json();
  if (!res.ok) {
    console.error(`Echec pour "${ancienTitre}" :`, data.error);
  } else {
    console.log(`Actualite corrigee : ${nouveauTitre}`);
  }
}

async function main() {
  const token = await login();

  await corrigerArtiste(token, 'Martine de Santis', BIO_MARTINE);
  await corrigerArtiste(token, 'Christian Disty', BIO_CHRISTIAN);
  await corrigerArtiste(token, 'Lise Oerlemans', BIO_LISE);

  await corrigerAssociation(token, 'Les Artistes Gardeens', DESC_GARDEENS);
  await corrigerAssociation(token, 'La Palette Valettoise', DESC_PALETTE);

  await corrigerActualite(token, '2e Grand Salon des arts de la F.F.A.P.', {
    contenu: CONTENU_SALON_FFAP,
    lieu: 'Forum du Casino de Hyères',
  });
  await corrigerActualite(token, 'Sortie Avignon — Le Palais des Papes', {
    contenu: CONTENU_AVIGNON,
  });
  await corrigerActualite(token, 'Sortie au Chateau La Coste', {
    titre: 'Sortie au Château La Coste',
    contenu: CONTENU_CHATEAU,
    lieu: 'Château La Coste',
  });
  await corrigerActualite(token, 'Salon des Arts Contemporains — Hyeres', {
    titre: 'Salon des Arts Contemporains — Hyères',
    contenu: CONTENU_SALON_HYERES,
    lieu: 'Forum du Casino, avenue Ambroise Thomas, Hyères',
  });

  console.log('Termine.');
}

main();
