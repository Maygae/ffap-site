# Comment démarrer le site FFAP en local

Petit pense-bête pour ne plus avoir à redemander à chaque fois.

## 1. Démarrer MySQL (MAMP ou XAMPP)

Avant toute chose, ouvre MAMP (ou XAMPP) et démarre les serveurs (au minimum MySQL).
Si tu oublies cette étape, le backend affichera une erreur `ECONNREFUSED` au démarrage.

## 2. Ouvrir le Terminal

- Ouvre l'application **Terminal** (Spotlight avec Cmd+Espace puis tape "Terminal").
- Tu arrives dans ton dossier utilisateur par défaut.

## 3. Aller dans le dossier du backend

Tape (ou copie-colle) ce chemin **absolu** — il fonctionne à tous les coups, peu importe où ton terminal s'ouvre par défaut :

```
cd ~/Desktop/FFAP/ffap-backend
```

⚠️ Ne tape pas `cd Desktop/FFAP/ffap-backend` (sans le `~`) : ça ne marche que si ton terminal démarre dans ton dossier utilisateur. Si ton terminal s'ouvre déjà dans `Desktop/FFAP` (regarde ton prompt, ex. `jo@macbook-air25 FFAP %`), cette commande relative se trompe de dossier et tu obtiens une erreur `no such file or directory`. Le chemin avec `~` évite ce problème.

Astuce : si tu veux juste vérifier où tu es, tape `pwd`.

## 4. Lancer le serveur

```
npm run dev
```

Si tout se passe bien, tu dois voir un message du type `Serveur demarre sur le port 3000`.

**Important : laisse ce terminal ouvert.** Le serveur tourne en continu dedans — si tu fermes l'onglet ou tapes une nouvelle commande dedans, ça coupe le serveur.

## 5. Besoin de lancer autre chose en même temps (un script, une commande) ?

N'utilise pas ce même onglet de terminal (il est occupé par `npm run dev`). Ouvre un **nouvel onglet** :

- Cmd+T dans le Terminal, ou
- Cmd+N pour une nouvelle fenêtre

Puis refais `cd Desktop/FFAP/ffap-backend` dans ce nouvel onglet avant de taper ta commande.

## 6. Ouvrir le site

Une fois le backend lancé, ouvre le fichier `ffap-frontend/index.html` dans ton navigateur (ou utilise l'extension Live Server si tu l'as, à l'adresse `127.0.0.1:5500`).

---

### Résumé express

```
cd ~/Desktop/FFAP/ffap-backend
npm run dev
```

(après avoir vérifié que MAMP/XAMPP tourne)
