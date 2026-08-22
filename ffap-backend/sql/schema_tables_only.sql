-- A executer UNE FOIS PLACE DANS LA BASE "ffap" (onglet SQL de la base, pas du serveur)

CREATE TABLE admin (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(190) NOT NULL UNIQUE,
  mot_de_passe VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE artiste (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(150) NOT NULL,
  discipline VARCHAR(100),
  bio TEXT,
  photo VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE oeuvre (
  id INT AUTO_INCREMENT PRIMARY KEY,
  artiste_id INT NOT NULL,
  titre VARCHAR(150),
  image VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (artiste_id) REFERENCES artiste(id) ON DELETE CASCADE
);

CREATE TABLE actualite (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titre VARCHAR(200) NOT NULL,
  contenu TEXT,
  image VARCHAR(255),
  categorie ENUM('evenement', 'sorties', 'exposition') NOT NULL,
  date_evenement DATE NULL,
  lieu VARCHAR(150),
  published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE actualite_image (
  id INT AUTO_INCREMENT PRIMARY KEY,
  actualite_id INT NOT NULL,
  image VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (actualite_id) REFERENCES actualite(id) ON DELETE CASCADE
);

CREATE TABLE association (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(150) NOT NULL,
  logo VARCHAR(255),
  description TEXT,
  lien_externe VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE message_contact (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(150) NOT NULL,
  email VARCHAR(190) NOT NULL,
  telephone VARCHAR(30),
  message TEXT NOT NULL,
  statut ENUM('nouveau', 'traite') DEFAULT 'nouveau',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
