// Gere la reception des fichiers images envoyes par l'admin (photo artiste, image oeuvre...)
// Les fichiers sont stockes sur le disque dans /uploads, seul le chemin est stocke en base.

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const UPLOAD_DIR = path.join(__dirname, '../../uploads');

// On cree le dossier au demarrage s'il n'existe pas encore
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    // ex : 1723999999999-photo.jpg (timestamp pour eviter les collisions de noms)
    const extension = path.extname(file.originalname);
    cb(null, `${Date.now()}${extension}`);
  },
});

const TYPES_AUTORISES = ['image/jpeg', 'image/png', 'image/webp'];

function fileFilter(req, file, cb) {
  if (TYPES_AUTORISES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Format d\'image non autorise (jpg, png ou webp uniquement)'));
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 Mo max
});

module.exports = upload;
