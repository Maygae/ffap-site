# Site F.F.A.P. — Fédération Française des Arts Plastiques

Site vitrine et back-office de gestion pour la F.F.A.P. Projet réalisé par Maygae.

## Aperçu

Le projet est composé de deux parties séparées, hébergées sur des services gratuits :

- **`ffap-frontend/`** — site public (HTML/CSS/JS, sans framework ni outil de build) + back-office admin dans `ffap-frontend/admin/`. Hébergé sur **Netlify**.
- **`ffap-backend/`** — API Node.js/Express, hébergée sur **Render** (région Frankfurt). La base de données MySQL est hébergée sur **Aiven** (Amsterdam).

Site en ligne : https://ffap-site.netlify.app
API : https://ffap-api.onrender.com

## Stack technique

- Backend : Node.js, Express, MySQL (via `mysql2`), authentification JWT (`jsonwebtoken` + `bcryptjs`), upload d'images (`multer`)
- Frontend : HTML/CSS/JS vanilla, aucun framework, aucun bundler
- Hébergement : Netlify (frontend statique), Render (API), Aiven (base de données MySQL)

## Structure du dépôt

```
ffap-backend/
  server.js               point d'entrée de l'API
  src/
    config/db.js           connexion MySQL (pool, SSL si DB_SSL_CA est défini)
    routes/                définition des routes /api/...
    controllers/            logique métier de chaque route
    models/                 requêtes SQL
    scripts/                scripts ponctuels (corrections de données, imports...)
  sql/
    schema.sql              schéma complet commenté
    schema_tables_only.sql   schéma brut (CREATE TABLE uniquement)
    import_data_production.sql  données importées en production
    aiven-ca.pem             certificat CA d'Aiven (public, sert à la connexion SSL)
    migration_*.sql          migrations ponctuelles (à exécuter une seule fois)
  uploads/                  anciennes images uploadées (versionnées, toujours servies)

ffap-frontend/
  *.html                   pages publiques du site
  admin/                    back-office (login, dashboard, gestion du contenu)
  css/, js/, assets/        styles, scripts, images statiques
```

## Lancer le projet en local

Prérequis : Node.js, et un serveur MySQL local (XAMPP par exemple).

1. Créer la base de données `ffap` et exécuter `ffap-backend/sql/schema.sql` dans phpMyAdmin.
2. Dans `ffap-backend/`, copier `.env.example` en `.env` et renseigner les identifiants de la base locale.
3. Installer les dépendances puis démarrer le serveur :
   ```
   cd ffap-backend
   npm install
   npm run dev
   ```
   L'API tourne sur `http://localhost:3000`.
4. Ouvrir les fichiers de `ffap-frontend/` avec un serveur local (ex. l'extension Live Server de VS Code, ou n'importe quel serveur statique). Le frontend détecte automatiquement s'il tourne en local ou en ligne et adapte l'URL de l'API en conséquence (voir `API_BASE_URL` dans `js/script.js` et `admin/js/admin.js`).

## Créer un compte admin

Pour accéder au back-office (`ffap-frontend/admin/`), un compte admin doit exister dans la table `admin`. Utiliser un script dans `ffap-backend/src/scripts/` (ex. création ou réinitialisation de mot de passe) en l'exécutant avec `node`.

Pour changer le mot de passe d'un compte en production :

```
cd ffap-backend
node src/scripts/changer-mot-de-passe-admin.js
```

Le script demande le mot de passe Aiven, l'email du compte et le nouveau mot de passe (rien ne s'affiche, rien n'est écrit dans le code).

## Déploiement

Le déploiement est automatique : chaque `git push` sur la branche `main` déclenche un redéploiement sur Render (backend) et Netlify (frontend), tous deux connectés au dépôt GitHub.

- **Render** (service `ffap-api`, offre Free, région Frankfurt) : Root Directory `ffap-backend/`, Build Command `npm install`, Start Command `npm start`. Les variables d'environnement sont dans le groupe d'environnement `ffap-env` relié au service : `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_SSL_CA` (certificat CA d'Aiven), `JWT_SECRET`.
- **Aiven** (service `ffap-db`, MySQL, offre Free, Amsterdam) : connexion SSL obligatoire, base `defaultdb`.
- **Netlify** : Base directory et Publish directory réglés sur `ffap-frontend`, pas de commande de build.

Les images envoyées depuis le back-office sont enregistrées dans la table `fichier` de la base (le disque de Render est effacé à chaque redéploiement) et servies par `GET /api/fichiers/:id`.

Pour importer le schéma et les données dans la base Aiven (le mot de passe est demandé au lancement) :

```
cd ffap-backend
node src/scripts/import-production-data.js
```

Après toute modification du schéma de la base (nouvelle colonne, nouvelle table), penser à exécuter la migration correspondante à la fois en local (phpMyAdmin) et en production (sur Aiven, via un script `mysql2` sur le modèle de `import-production-data.js`).

## Notes

- Offres gratuites : le service Render se met en veille après 15 minutes sans visite (le premier chargement prend alors environ 50 secondes) ; la base Aiven gratuite peut être mise en pause après une longue période d'inactivité (Aiven prévient par e-mail, il suffit de la rallumer).
- Les scripts dans `ffap-backend/src/scripts/` documentent les corrections ponctuelles effectuées sur le contenu (fautes, accents, migrations de données) — utile pour comprendre l'historique du contenu.
