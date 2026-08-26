-- Migration : ajoute la case "A la une" aux actualites/evenements existants.
-- A executer UNE FOIS dans phpMyAdmin (base "ffap" -> onglet SQL), sans rien perdre
-- des donnees deja en base (toutes les lignes existantes passeront a FALSE par defaut).

ALTER TABLE actualite
  ADD COLUMN a_la_une BOOLEAN NOT NULL DEFAULT FALSE AFTER lieu;
