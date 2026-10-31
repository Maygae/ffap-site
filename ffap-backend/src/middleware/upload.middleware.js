// Gere la reception des fichiers images envoyes par l'admin (photo artiste, image oeuvre...)
// Les images sont stockees dans la base MySQL (table "fichier") et non plus sur le disque :
// l'hebergeur gratuit (Render) efface son disque a chaque redemarrage.
// Apres l'envoi, req.file.url contient l'adresse publique de l'image, ex : /api/fichiers/12

const multer = require('multer');
const fichierModel = require('../models/fichier.model');

const TYPES_AUTORISES = ['image/jpeg', 'image/png', 'image/webp'];

function fileFilter(req, file, cb) {
  if (TYPES_AUTORISES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Format d\'image non autorise (jpg, png ou webp uniquement)'));
  }
}

const multerUpload = multer({
  storage: multer.memoryStorage(), // le fichier reste en memoire le temps de l'enregistrer en base
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 Mo max
});

// Enregistre le fichier recu dans la base puis expose son adresse dans req.file.url
async function enregistrerEnBase(req, res, next) {
  if (!req.file) return next();
  try {
    const id = await fichierModel.create({
      nomOriginal: req.file.originalname,
      typeMime: req.file.mimetype,
      donnees: req.file.buffer,
    });
    req.file.url = `/api/fichiers/${id}`;
    next();
  } catch (error) {
    next(error);
  }
}

// Meme utilisation qu'avant dans les routes : upload.single('photo')
module.exports = {
  single: (champ) => [multerUpload.single(champ), enregistrerEnBase],
};
