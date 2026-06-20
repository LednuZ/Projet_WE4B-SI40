/**
 * Génère la présentation PowerPoint du projet AutoMarket (Phase 2)
 * Usage : node generate-pptx.js
 */

const PptxGenJS = require('pptxgenjs');
const path = require('path');

const pptx = new PptxGenJS();

// ── Thème ──────────────────────────────────────────────────────────────────
const C = {
  noir:         '1a1a2e',
  bleu:         '2563eb',
  bleuClair:    '3b82f6',
  bleuPale:     'dbeafe',
  vert:         '16a34a',
  vertPale:     'dcfce7',
  violet:       '7c3aed',
  violetPale:   'ede9fe',
  orange:       'f97316',
  orangePale:   'ffedd5',
  rouge:        'e74c3c',
  rougePale:    'fee2e2',
  jaune:        'ca8a04',
  jaunePale:    'fef9c3',
  blanc:        'FFFFFF',
  grisClair:    'f1f5f9',
  gris:         '64748b',
  fondSlide:    'f8fafc',
};

pptx.layout  = 'LAYOUT_WIDE';
pptx.author  = 'Groupe WE4B / SI40';
pptx.subject = 'AutoMarket — Phase 2';
pptx.title   = 'Présentation Projet AutoMarket';

// ── Helpers ────────────────────────────────────────────────────────────────

function bandeTitre(slide, couleur = C.bleu) {
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: '100%', h: 1.3,
    fill: { color: couleur },
    line: { color: couleur }
  });
}

function titrePrincipal(slide, texte, couleur = C.bleu) {
  slide.addText(texte, {
    x: 0, y: 0, w: '100%', h: 1.3,
    align: 'center', valign: 'middle',
    fontSize: 28, bold: true, color: C.blanc,
    fontFace: 'Calibri'
  });
}

function sousTitre(slide, texte, y = 1.5) {
  slide.addText(texte, {
    x: 0.5, y, w: '92%', h: 0.5,
    fontSize: 14, bold: true, color: C.bleu, fontFace: 'Calibri'
  });
}

function corps(slide, texte, x, y, w, h, opts = {}) {
  slide.addText(texte, {
    x, y, w, h,
    fontSize: 11, color: '1e293b', fontFace: 'Calibri',
    valign: 'top', ...opts
  });
}

function carte(slide, x, y, w, h, titre, contenu, couleur = C.bleu) {
  slide.addShape(pptx.ShapeType.rect, {
    x, y, w, h,
    fill: { color: C.blanc },
    line: { color: couleur, width: 2 },
    shadow: { type: 'outer', color: '94a3b8', blur: 4, offset: 2, angle: 45, opacity: 0.3 }
  });
  slide.addShape(pptx.ShapeType.rect, {
    x, y, w: w, h: 0.35,
    fill: { color: couleur },
    line: { color: couleur }
  });
  slide.addText(titre, {
    x: x + 0.1, y: y + 0.05, w: w - 0.2, h: 0.3,
    fontSize: 9, bold: true, color: C.blanc, fontFace: 'Calibri'
  });
  slide.addText(contenu, {
    x: x + 0.12, y: y + 0.42, w: w - 0.24, h: h - 0.5,
    fontSize: 9.5, color: '1e293b', fontFace: 'Calibri', valign: 'top'
  });
}

function puce(texte, niveau = 0) {
  return { text: texte, options: { bullet: { indent: 15 + niveau * 15 }, fontSize: 11, color: '1e293b', breakLine: true } };
}

function fond(slide) {
  slide.background = { color: C.fondSlide };
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 1 — Couverture
// ══════════════════════════════════════════════════════════════════════════════

{
  const s = pptx.addSlide();
  s.background = { color: C.noir };

  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: '55%', fill: { color: C.bleu }, line: { color: C.bleu } });

  s.addText('AutoMarket', {
    x: 0, y: 0.8, w: '100%', h: 1.2,
    align: 'center', fontSize: 48, bold: true, color: C.blanc, fontFace: 'Calibri'
  });
  s.addText('Plateforme de vente de véhicules d\'occasion', {
    x: 0, y: 2.0, w: '100%', h: 0.6,
    align: 'center', fontSize: 18, color: 'bfdbfe', fontFace: 'Calibri', italic: true
  });
  s.addShape(pptx.ShapeType.rect, { x: 3.5, y: 2.85, w: 6.5, h: 0.04, fill: { color: C.blanc }, line: { color: C.blanc } });

  s.addText('Phase 2 — WE4B / SI40', {
    x: 0, y: 3.2, w: '100%', h: 0.5,
    align: 'center', fontSize: 15, bold: true, color: C.blanc, fontFace: 'Calibri'
  });
  s.addText('Application Angular · API Symfony · MySQL · MongoDB · Node.js', {
    x: 0, y: 3.8, w: '100%', h: 0.4,
    align: 'center', fontSize: 12, color: '93c5fd', fontFace: 'Calibri'
  });
  s.addText('Année 2025–2026', {
    x: 0, y: 6.2, w: '100%', h: 0.4,
    align: 'center', fontSize: 11, color: '64748b', fontFace: 'Calibri'
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 2 — Sommaire
// ══════════════════════════════════════════════════════════════════════════════

{
  const s = pptx.addSlide();
  fond(s);
  bandeTitre(s, C.noir);
  titrePrincipal(s, 'Sommaire', C.noir);

  const items = [
    ['01', 'Contexte & Objectifs',        C.bleu],
    ['02', 'Architecture technique',       C.violet],
    ['03', 'Application Angular (WE4B)',   C.vert],
    ['04', 'API Symfony & Base MySQL',     C.orange],
    ['05', 'NoSQL MongoDB — Journalisation', C.bleu],
    ['06', 'NoSQL MongoDB — Fichiers & Métadonnées', C.violet],
    ['07', 'Analyses & Visualisations',    C.vert],
    ['08', 'Dashboard Admin',              C.orange],
    ['09', 'Export & Tableau',             C.rouge],
    ['10', 'Bilan & Perspectives',         C.gris],
  ];

  items.forEach(([num, label, couleur], i) => {
    const col = i < 5 ? 0 : 1;
    const row = i % 5;
    const x = col === 0 ? 0.5 : 7.0;
    const y = 1.5 + row * 0.9;

    s.addShape(pptx.ShapeType.rect, { x, y, w: 0.55, h: 0.55, fill: { color: couleur }, line: { color: couleur }, rounding: true });
    s.addText(num, { x, y: y + 0.08, w: 0.55, h: 0.4, align: 'center', fontSize: 14, bold: true, color: C.blanc, fontFace: 'Calibri' });
    s.addText(label, { x: x + 0.65, y: y + 0.1, w: 5.8, h: 0.4, fontSize: 13, color: '1e293b', fontFace: 'Calibri', bold: false });
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 3 — Contexte & Objectifs
// ══════════════════════════════════════════════════════════════════════════════

{
  const s = pptx.addSlide();
  fond(s);
  bandeTitre(s, C.bleu);
  titrePrincipal(s, '01 — Contexte & Objectifs');

  carte(s, 0.4, 1.4, 6.0, 2.4, 'Contexte du projet',
    'La Phase 2 enrichit l\'application AutoMarket (Phase 1) avec des fonctionnalités avancées. Deux UE se croisent :\n\n• WE4B : transformer l\'interface en SPA moderne avec Angular, connectée aux services back-end\n• SI40 : compléter l\'architecture relationnelle existante par des bases NoSQL pour les données non structurées',
    C.bleu
  );

  carte(s, 6.6, 1.4, 6.5, 2.4, 'Objectifs SI40 (NoSQL)',
    '✔ Historiques de connexion et activités utilisateurs\n✔ Fichiers et métadonnées (images, documents)\n✔ Suivi et analyse des performances\n✔ Rapports et visualisations dynamiques',
    C.violet
  );

  carte(s, 0.4, 4.1, 12.7, 1.8, 'Thématique — Marché automobile d\'occasion',
    'AutoMarket est une plateforme de petites annonces automobiles. Les données suivies incluent : consultations d\'annonces, publications, ventes, messages entre particuliers, photos de véhicules, connexions/inscriptions et favoris.',
    C.vert
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 4 — Architecture technique
// ══════════════════════════════════════════════════════════════════════════════

{
  const s = pptx.addSlide();
  fond(s);
  bandeTitre(s, C.violet);
  titrePrincipal(s, '02 — Architecture technique', C.violet);

  const couches = [
    { label: 'Frontend Angular',  detail: 'SPA · Port 4200\nComponents · Services · RxJS · Chart.js', couleur: C.bleu,   x: 0.3 },
    { label: 'API Symfony',       detail: 'REST · Port 8000\nPHP 8.4 · JWT · PDO', couleur: C.violet, x: 3.8 },
    { label: 'MySQL (XAMPP)',      detail: 'Port 3306\nutilisateur · annonce\nphoto · message…', couleur: C.vert,   x: 7.3 },
    { label: 'Node.js / Express', detail: 'Port 3000\nLogs · Fichiers\nAnalytiques · Export CSV', couleur: C.orange, x: 10.8 },
  ];

  couches.forEach(({ label, detail, couleur, x }) => {
    s.addShape(pptx.ShapeType.rect, { x, y: 1.5, w: 3.0, h: 2.5, fill: { color: couleur }, line: { color: couleur }, shadow: { type: 'outer', blur: 6, offset: 3, angle: 45, opacity: 0.3 } });
    s.addText(label, { x: x + 0.1, y: 1.6, w: 2.8, h: 0.5, align: 'center', fontSize: 13, bold: true, color: C.blanc, fontFace: 'Calibri' });
    s.addText(detail, { x: x + 0.1, y: 2.2, w: 2.8, h: 1.6, align: 'center', fontSize: 10, color: C.blanc, fontFace: 'Calibri' });
  });

  // Flèches
  [[3.3, 2.75], [6.8, 2.75], [10.3, 2.75]].forEach(([x, y]) => {
    s.addText('→', { x, y, w: 0.5, h: 0.4, align: 'center', fontSize: 20, bold: true, color: C.gris });
  });

  s.addText('MongoDB', { x: 10.65, y: 4.2, w: 3.2, h: 0.4, align: 'center', fontSize: 11, bold: true, color: C.orange, fontFace: 'Calibri' });
  s.addShape(pptx.ShapeType.rect, { x: 10.8, y: 4.6, w: 3.0, h: 0.8, fill: { color: 'fff7ed' }, line: { color: C.orange, width: 1.5 } });
  s.addText('automarket_logs\n  → logs · file_metadata', { x: 10.9, y: 4.65, w: 2.8, h: 0.7, fontSize: 9, color: '92400e', fontFace: 'Calibri' });

  s.addText('Séparation des données : MySQL = données relationnelles structurées  |  MongoDB = données non structurées / semi-structurées', {
    x: 0.3, y: 5.8, w: '95%', h: 0.4,
    align: 'center', fontSize: 10, italic: true, color: C.gris, fontFace: 'Calibri'
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 5 — Application Angular
// ══════════════════════════════════════════════════════════════════════════════

{
  const s = pptx.addSlide();
  fond(s);
  bandeTitre(s, C.vert);
  titrePrincipal(s, '03 — Application Angular (WE4B)', C.vert);

  const fonctionnalites = [
    ['Authentification',    'Login · Inscription · Guards de routes · Rôles (particulier / professionnel / admin)', C.bleu],
    ['Catalogue annonces',  'Liste filtrée · Recherche par marque, modèle, prix, km · Tri · Détail annonce', C.violet],
    ['Espace vendeur',      'Créer / modifier / supprimer annonce · Upload photos · Pause / reprise / vendu', C.vert],
    ['Messagerie',          'Échange de messages entre acheteurs et vendeurs · Temps réel', C.orange],
    ['Favoris',             'Ajouter / retirer des annonces favorites · Liste personnelle', C.rouge],
    ['Avis',                'Laisser un avis sur un vendeur ou un modèle · Note + commentaire', C.jaune],
    ['Profil utilisateur',  'Voir / modifier ses informations · Changer mot de passe · Supprimer compte', C.bleu],
    ['Dashboard Admin',     'Stats globales · Gestion utilisateurs / annonces / avis / catalogue · Logs · Fichiers · Analyses', C.violet],
  ];

  fonctionnalites.forEach(([titre, detail, couleur], i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = col === 0 ? 0.3 : 6.9;
    const y = 1.5 + row * 1.3;
    carte(s, x, y, 6.3, 1.2, titre, detail, couleur);
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 6 — API Symfony & MySQL
// ══════════════════════════════════════════════════════════════════════════════

{
  const s = pptx.addSlide();
  fond(s);
  bandeTitre(s, C.orange);
  titrePrincipal(s, '04 — API Symfony & Base MySQL', C.orange);

  carte(s, 0.3, 1.4, 5.5, 4.5, 'Endpoints REST (Symfony)',
    '/api/auth/login  POST\n/api/auth/register  POST\n/api/annonces  GET · POST\n/api/annonces/{id}  GET · PUT · DELETE\n/api/annonces/{id}/photos  POST\n/api/annonces/{id}/pause  POST\n/api/annonces/{id}/vendu  POST\n/api/profil  GET · PUT\n/api/messagerie  GET · POST\n/api/favoris  GET · POST · DELETE\n/api/avis  GET · POST · DELETE\n/api/admin/*  (protégé rôle admin)',
    C.orange
  );

  carte(s, 6.1, 1.4, 7.0, 4.5, 'Tables MySQL principales',
    'utilisateur (id, nom, prenom, email, mdp, role, numero_phone, date_inscription)\n\nannonce (id_annonce, titre, prix, kilometrage, annee, statut, id_utilisateur, id_version)\n\nphoto (id_photo, url_photo, id_annonce)\n\nmessage (id_message, contenu, date_envoi, id_expediteur, id_destinataire)\n\nfavori (id_utilisateur, id_annonce)\n\navis_utilisateur · avis_modele\n\nmarque · modele · generation · version · moteur · reservoir · coffre · type_vehicule',
    C.bleu
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 7 — NoSQL MongoDB : Journalisation
// ══════════════════════════════════════════════════════════════════════════════

{
  const s = pptx.addSlide();
  fond(s);
  bandeTitre(s, C.bleu);
  titrePrincipal(s, '05 — NoSQL MongoDB — Journalisation');

  carte(s, 0.3, 1.4, 5.8, 2.2, 'Collection : logs',
    'Chaque action utilisateur génère un document JSON :\n{\n  action: "LOGIN",\n  userId: 42,\n  userEmail: "user@mail.com",\n  details: { email: "user@mail.com" },\n  ip: "::1",\n  timestamp: ISODate("2026-06-20T10:00:00Z")\n}',
    C.bleu
  );

  carte(s, 6.4, 1.4, 6.8, 2.2, 'Actions tracées (LogAction)',
    'LOGIN · LOGOUT · REGISTER\nVIEW_ANNONCE · CREATE_ANNONCE\nUPDATE_ANNONCE · DELETE_ANNONCE\nPAUSE_ANNONCE · RESUME_ANNONCE\nSOLD_ANNONCE · UPLOAD_PHOTO\nADD_FAVORI · REMOVE_FAVORI\nSEND_MESSAGE',
    C.violet
  );

  carte(s, 0.3, 3.8, 5.8, 2.1, 'Flux de journalisation',
    'Action Angular → LogService.log(action, details)\n  → POST http://localhost:3000/logs\n    → Node.js/Express → MongoDB\n\nLogService est injecté dans :\nAuthService · AnnonceService · FavoriService · MessageService',
    C.vert
  );

  carte(s, 6.4, 3.8, 6.8, 2.1, 'Endpoints Node.js',
    'POST /logs         Enregistrer un log\nGET  /logs         Lister (filtres action, userId)\nGET  /logs/stats   Statistiques par action\nGET  /analytics/*  Analytique avancée\nGET  /export/logs.csv  Export Tableau',
    C.orange
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 8 — NoSQL MongoDB : Fichiers & Métadonnées
// ══════════════════════════════════════════════════════════════════════════════

{
  const s = pptx.addSlide();
  fond(s);
  bandeTitre(s, C.violet);
  titrePrincipal(s, '06 — NoSQL MongoDB — Fichiers & Métadonnées', C.violet);

  sousTitre(s, 'Séparation pertinente des données', 1.4);

  const cols = [
    { titre: 'MySQL', sous: 'Données relationnelles', contenu: 'Table photo :\nid_photo · url_photo · id_annonce\n\nLien structuré et indexé entre\nune photo et son annonce', couleur: C.bleu, x: 0.3 },
    { titre: 'MongoDB', sous: 'Données non structurées', contenu: 'Collection file_metadata :\nfilename · originalName\nmimeType · size (octets)\nurl · annonceId · userId\nuserEmail · uploadedAt', couleur: C.violet, x: 4.6 },
    { titre: 'Pourquoi cette séparation ?', sous: '', contenu: 'Les métadonnées sont variables\net évolutives (nouveaux champs\npossibles sans ALTER TABLE).\nMongoDB permet un stockage\nflexible en documents JSON.', couleur: C.vert, x: 8.9 },
  ];

  cols.forEach(({ titre, sous, contenu, couleur, x }) => {
    s.addShape(pptx.ShapeType.rect, { x, y: 1.9, w: 4.0, h: 3.8, fill: { color: C.blanc }, line: { color: couleur, width: 2 } });
    s.addShape(pptx.ShapeType.rect, { x, y: 1.9, w: 4.0, h: 0.7, fill: { color: couleur }, line: { color: couleur } });
    s.addText(titre, { x: x + 0.1, y: 1.95, w: 3.8, h: 0.35, align: 'center', fontSize: 13, bold: true, color: C.blanc, fontFace: 'Calibri' });
    if (sous) s.addText(sous, { x: x + 0.1, y: 2.28, w: 3.8, h: 0.28, align: 'center', fontSize: 9, color: C.blanc, fontFace: 'Calibri', italic: true });
    s.addText(contenu, { x: x + 0.15, y: 2.75, w: 3.7, h: 2.8, fontSize: 10, color: '1e293b', fontFace: 'Calibri', valign: 'top' });
  });

  carte(s, 0.3, 5.85, 12.9, 0.95, 'Flux d\'upload complet',
    'Angular (input file) → POST /api/annonces/{id}/photos (Symfony) → fichier sauvegardé dans public/uploads/photos/ → MySQL stocke l\'URL → Angular reçoit {url} → FileMetadataService.save() → POST /files (Node.js) → MongoDB stocke les métadonnées',
    C.orange
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 9 — Analyses & Visualisations
// ══════════════════════════════════════════════════════════════════════════════

{
  const s = pptx.addSlide();
  fond(s);
  bandeTitre(s, C.vert);
  titrePrincipal(s, '07 — Analyses & Visualisations dynamiques', C.vert);

  const kpis = [
    ['Consultations', 'VIEW_ANNONCE', C.bleu],
    ['Publications',  'CREATE_ANNONCE', C.vert],
    ['Ventes',        'SOLD_ANNONCE', C.jaune],
    ['Taux de conv.', 'ventes/publications', C.violet],
    ['Messages',      'SEND_MESSAGE', C.orange],
    ['Stockage',      'file_metadata', C.rouge],
  ];

  kpis.forEach(([label, source, couleur], i) => {
    const x = 0.3 + (i % 3) * 4.4;
    const y = 1.5 + Math.floor(i / 3) * 1.3;
    s.addShape(pptx.ShapeType.rect, { x, y, w: 4.0, h: 1.1, fill: { color: couleur + '22' }, line: { color: couleur, width: 1.5 } });
    s.addShape(pptx.ShapeType.rect, { x, y, w: 0.08, h: 1.1, fill: { color: couleur }, line: { color: couleur } });
    s.addText(label, { x: x + 0.2, y: y + 0.08, w: 3.7, h: 0.35, fontSize: 13, bold: true, color: couleur, fontFace: 'Calibri' });
    s.addText(`Source : logs MongoDB\n${source}`, { x: x + 0.2, y: y + 0.5, w: 3.7, h: 0.5, fontSize: 9, color: C.gris, fontFace: 'Calibri' });
  });

  const charts = [
    ['Courbe temporelle', 'Activité par jour sur 7 / 30 / 90 jours\n(connexions, consultations, ventes…)', C.bleu],
    ['Doughnut',          'Répartition globale de toutes\nles actions utilisateurs', C.violet],
    ['Barres horaires',   'Pics d\'activité par heure\n(00h → 23h)', C.vert],
  ];

  charts.forEach(([titre, detail, couleur], i) => {
    const x = 0.3 + i * 4.4;
    s.addShape(pptx.ShapeType.rect, { x, y: 4.1, w: 4.0, h: 1.7, fill: { color: C.blanc }, line: { color: couleur, width: 1.5 } });
    s.addShape(pptx.ShapeType.rect, { x, y: 4.1, w: 4.0, h: 0.32, fill: { color: couleur }, line: { color: couleur } });
    s.addText(`Chart.js — ${titre}`, { x: x + 0.1, y: 4.12, w: 3.8, h: 0.28, fontSize: 9, bold: true, color: C.blanc, fontFace: 'Calibri' });
    s.addText(detail, { x: x + 0.1, y: 4.5, w: 3.8, h: 1.2, fontSize: 9.5, color: '1e293b', fontFace: 'Calibri' });
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 10 — Dashboard Admin
// ══════════════════════════════════════════════════════════════════════════════

{
  const s = pptx.addSlide();
  fond(s);
  bandeTitre(s, C.orange);
  titrePrincipal(s, '08 — Dashboard Admin', C.orange);

  const onglets = [
    ['Statistiques',   'KPIs globaux : utilisateurs, annonces, ventes\nGraphiques : carburants, statuts, prix moyens', C.bleu],
    ['Utilisateurs',   'Liste complète · Recherche · Modifier le rôle\nSupprimer un compte', C.violet],
    ['Annonces',       'Toutes les annonces · Filtrer par statut\nSuspendre (avec commentaire) · Réactiver · Supprimer', C.vert],
    ['Avis',           'Avis vendeurs et avis modèles\nRecherche · Suppression abusive', C.orange],
    ['Catalogue',      'CRUD complet : Marques · Types · Modèles\nGénérations · Versions · Moteurs · Réservoirs · Coffres', C.rouge],
    ['Journaux',       'Tableau paginé des logs MongoDB\nFiltre par type d\'action · Compteurs', C.bleu],
    ['Fichiers',       'Liste des médias uploadés\nType MIME · Taille · Utilisateur · Lien aperçu', C.violet],
    ['Analyses',       'KPIs dynamiques · 3 graphiques Chart.js\nSélecteur de période · Export CSV', C.vert],
  ];

  onglets.forEach(([titre, detail, couleur], i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = col === 0 ? 0.3 : 6.9;
    const y = 1.4 + row * 1.25;
    carte(s, x, y, 6.3, 1.15, titre, detail, couleur);
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 11 — Export & Tableau
// ══════════════════════════════════════════════════════════════════════════════

{
  const s = pptx.addSlide();
  fond(s);
  bandeTitre(s, C.rouge);
  titrePrincipal(s, '09 — Export & Tableau / BI', C.rouge);

  carte(s, 0.3, 1.4, 6.0, 2.6, 'Endpoints d\'export CSV (Node.js)',
    'GET /export/logs.csv\n   → Tous les logs (action, user, ip, timestamp)\n\nGET /export/fichiers.csv\n   → Métadonnées fichiers (type, taille, annonce)\n\nGET /export/analytique.csv\n   → Activité agrégée par jour × action',
    C.rouge
  );

  carte(s, 6.6, 1.4, 6.5, 2.6, 'Script export-visualisations.js',
    'Génère 5 fichiers dans visualisations/ :\n\n• logs.csv (logs bruts + heure extraite)\n• fichiers.csv (taille en Ko)\n• activite_par_jour.csv (pivot jour × action)\n• indicateurs.csv (totaux + dates)\n• activite_par_heure.csv (00h–23h)',
    C.orange
  );

  carte(s, 0.3, 4.2, 12.7, 1.6, 'Connexion à Tableau',
    'Option A — Fichier local : Ouvrir Tableau Desktop > Données > Fichier texte > sélectionner logs.csv (dossier visualisations/)\n\nOption B — URL directe : Données > Serveur Web > http://localhost:3000/export/logs.csv (Tableau Public/Desktop avec connecteur web)\n\nOption C — MySQL direct : Données > MySQL > localhost:3306 > base automarket (tables relationnelles)',
    C.bleu
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 12 — Bilan & Perspectives
// ══════════════════════════════════════════════════════════════════════════════

{
  const s = pptx.addSlide();
  fond(s);
  bandeTitre(s, C.noir);
  titrePrincipal(s, '10 — Bilan & Perspectives', C.noir);

  carte(s, 0.3, 1.4, 6.0, 4.4, 'Ce qui a été réalisé ✔',
    '✔ SPA Angular avec routing, guards, services RxJS\n✔ API REST Symfony (PHP 8.4) sécurisée par token\n✔ Base MySQL normalisée (utilisateurs, annonces, catalogue…)\n✔ MongoDB — journalisation complète de 14 actions\n✔ MongoDB — métadonnées fichiers avec séparation relationnelle\n✔ Serveur Node.js/Express dédié aux données NoSQL\n✔ Dashboard admin complet (8 onglets)\n✔ Analyses dynamiques avec Chart.js (3 graphiques)\n✔ Export CSV multi-sources pour Tableau\n✔ Dossier visualisations/ avec 5 jeux de données',
    C.vert
  );

  carte(s, 6.6, 1.4, 6.5, 2.0, 'Points clés de la Phase 2',
    'Séparation MySQL / MongoDB justifiée par la nature des données\n\nTraçabilité complète de l\'activité via logs NoSQL\n\nArchitecture 3 serveurs (Symfony + Node.js + Angular)',
    C.bleu
  );

  carte(s, 6.6, 3.6, 6.5, 2.2, 'Perspectives d\'évolution',
    '→ Authentification OAuth2 / SSO\n→ Recherche full-text (Elasticsearch)\n→ Notifications temps réel (WebSocket)\n→ Application mobile (Ionic / React Native)\n→ CI/CD et déploiement cloud',
    C.violet
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 13 — Questions
// ══════════════════════════════════════════════════════════════════════════════

{
  const s = pptx.addSlide();
  s.background = { color: C.noir };

  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: '100%', fill: { color: C.bleuPale }, line: { color: C.bleuPale }, transparency: 85 });

  s.addText('Merci', {
    x: 0, y: 1.5, w: '100%', h: 1.2,
    align: 'center', fontSize: 52, bold: true, color: C.blanc, fontFace: 'Calibri'
  });
  s.addText('Questions ?', {
    x: 0, y: 2.8, w: '100%', h: 0.7,
    align: 'center', fontSize: 24, color: '93c5fd', fontFace: 'Calibri', italic: true
  });

  s.addShape(pptx.ShapeType.rect, { x: 4.5, y: 3.7, w: 4.5, h: 0.04, fill: { color: C.bleu }, line: { color: C.bleu } });

  const stack = [
    'Angular 17  •  Symfony 7  •  PHP 8.4',
    'MySQL (XAMPP)  •  MongoDB  •  Node.js / Express',
    'Chart.js  •  Bootstrap 5  •  RxJS',
  ];
  stack.forEach((line, i) => {
    s.addText(line, { x: 0, y: 4.0 + i * 0.45, w: '100%', h: 0.4, align: 'center', fontSize: 12, color: '94a3b8', fontFace: 'Calibri' });
  });
}

// ── Génération ────────────────────────────────────────────────────────────────

const outputPath = path.join(__dirname, 'visualisations', 'AutoMarket_Presentation.pptx');
pptx.writeFile({ fileName: outputPath })
  .then(() => console.log(`✅ Présentation générée : ${outputPath}`))
  .catch(err => console.error('Erreur :', err));
