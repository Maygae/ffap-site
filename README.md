# Site F.F.A.P. — Fédération Française des Arts Plastiques

Site vitrine et back-office de gestion pour la F.F.A.P. Projet réalisé par Maygae.

## Aperçu

Le projet est composé de deux parties séparées, hébergées sur deux services différents :

- **`ffap-frontend/`** — site public (HTML/CSS/JS, sans framework ni outil de build) + back-office admin dans `ffap-frontend/admin/`. Hébergé sur **Netlify**.
- **`ffap-backend/`** — API Node.js/Express + base de données MySQL. Hébergé sur **Railway**.

Site en ligne : https://ffap-site.netlify.app
API : https://ffap-site-production.up.railway.app

## Stack technique

- Backend : Node.js, Express, MySQL (via `mysql2`), authentification JWT (`jsonwebtoken` + `bcryptjs`), upload d'images (`multer`)
- Frontend : HTML/CSS/JS vanilla, aucun framework, aucun bundler
- Hébergement : Railway (API + base de données MySQL), Netlify (frontend statique)

## Structure du dépôt

```
ffap-backend/
  server.js               point d'entrée de l'API
  src/
    config/db.js           connexion MySQL (pool)
    routes/                définition des routes /api/...
    controllers/            logique métier de chaque route
    models/                 requêtes SQL
    scripts/                scripts ponctuels (corrections de données, imports...)
  sql/
    schema.sql              schéma complet commenté
    schema_tables_only.sql   schéma brut (CREATE TABLE uniquement)
    migration_*.sql          migrations ponctuelles (à exécuter une seule fois)
  uploads/                  images uploadées (versionnées pour que Railway les ait aussi)

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

## Déploiement

Le déploiement est automatique : chaque `git push` sur la branche `main` déclenche un redéploiement sur Railway (backend) et Netlify (frontend), tous deux connectés au dépôt GitHub.

- Railway : Root Directory réglé sur `ffap-backend`, variables d'environnement `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET` à renseigner dans l'onglet Variables du service.
- Netlify : Base directory et Publish directory réglés sur `ffap-frontend`, pas de commande de build.

Après toute modification du schéma de la base (nouvelle colonne, nouvelle table), penser à exécuter la migration correspondante à la fois en local (phpMyAdmin) et en production (Railway → service MySQL → onglet Data, ou via un script `mysql2` en activant temporairement le "Public Networking" du service MySQL sur Railway).

## Notes

- Le plan gratuit de Railway est limité dans le temps/en crédit : au-delà, un plan payant (Hobby, 5$/mois) est nécessaire pour garder le site accessible en continu.
- Les scripts dans `ffap-backend/src/scripts/` documentent les corrections ponctuelles effectuées sur le contenu (fautes, accents, migrations de données) — utile pour comprendre l'historique du contenu.
