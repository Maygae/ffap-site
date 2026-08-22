require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const db = require('./src/config/db');
const authRoutes = require('./src/routes/auth.routes');
const artisteRoutes = require('./src/routes/artiste.routes');
const oeuvreRoutes = require('./src/routes/oeuvre.routes');
const evenementRoutes = require('./src/routes/evenement.routes');
const associationRoutes = require('./src/routes/association.routes');
const messageRoutes = require('./src/routes/message.routes');
const imageRoutes = require('./src/routes/image.routes');

const app = express();

// Middlewares globaux
app.use(cors());          // autorise le front (ex. http://127.0.0.1:5500) a appeler cette API
app.use(express.json());  // permet de lire du JSON envoye dans le corps des requetes (POST/PUT)

// Rend les images uploadees accessibles publiquement, ex : http://localhost:3000/uploads/xxx.jpg
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/artistes', artisteRoutes);
app.use('/api/oeuvres', oeuvreRoutes);
app.use('/api/actualites', evenementRoutes);
app.use('/api/associations', associationRoutes);
app.use('/api/contact', messageRoutes);
app.use('/api/images', imageRoutes);

// Route de test : verifie que le serveur tourne
app.get('/', (req, res) => {
  res.json({ message: 'API FFAP en ligne' });
});

// Route de test : verifie que la connexion a la base de donnees fonctionne
app.get('/api/health/db', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 AS ok');
    res.json({ db: 'connectee', result: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Connexion a la base de donnees impossible' });
  }
});

// Route inconnue -> 404 propre en JSON (au lieu de la page HTML par defaut d'Express)
app.use((req, res) => {
  res.status(404).json({ error: 'Route introuvable' });
});

// Gestionnaire d'erreurs global : dernier filet de securite.
// Sans lui, Express renvoie par defaut une page HTML avec la stack trace complete
// (chemins de fichiers, numeros de ligne) au client -> fuite d'information a eviter.
// Doit etre declare en dernier et avoir 4 parametres pour qu'Express le reconnaisse comme gestionnaire d'erreurs.
app.use((err, req, res, next) => {
  console.error(err);

  // Erreur de parsing JSON envoyee par express.json()
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'JSON invalide dans la requete' });
  }

  // Erreur multer (upload : fichier trop lourd, type non autorise...)
  if (err.name === 'MulterError' || err.message?.includes('non autorise')) {
    return res.status(400).json({ error: err.message });
  }

  res.status(500).json({ error: 'Erreur serveur inattendue' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur FFAP demarre sur http://localhost:${PORT}`);
});
