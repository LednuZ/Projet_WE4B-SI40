const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 3000;
const MONGO_URI = 'mongodb://localhost:27017/automarket_logs';

app.use(cors());
app.use(express.json());

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connecté sur automarket_logs'))
  .catch(err => console.error('Erreur connexion MongoDB:', err));

const logSchema = new mongoose.Schema({
  action:    { type: String, required: true },
  userId:    { type: Number, default: null },
  userEmail: { type: String, default: null },
  details:   { type: mongoose.Schema.Types.Mixed, default: {} },
  ip:        { type: String, default: null },
  timestamp: { type: Date, default: Date.now }
});

const Log = mongoose.model('Log', logSchema);

// Page d'accueil — liste des endpoints disponibles
app.get('/', (req, res) => {
  res.json({
    service: 'AutoMarket — Serveur de logs',
    endpoints: [
      { method: 'POST', path: '/logs',       description: 'Enregistrer une action' },
      { method: 'GET',  path: '/logs',       description: 'Lister les logs (filtres: action, userId, limit, skip)' },
      { method: 'GET',  path: '/logs/stats', description: 'Statistiques par type d\'action' },
    ]
  });
});

// Créer un log
app.post('/logs', async (req, res) => {
  try {
    const { action, userId, userEmail, details } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const log = new Log({ action, userId, userEmail, details, ip });
    await log.save();
    res.status(201).json({ success: true, id: log._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Stats par type d'action
app.get('/logs/stats', async (req, res) => {
  try {
    const [byAction, total] = await Promise.all([
      Log.aggregate([
        { $group: { _id: '$action', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Log.countDocuments()
    ]);
    res.json({ total, byAction });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Récupérer les logs (avec filtres optionnels)
app.get('/logs', async (req, res) => {
  try {
    const { action, userId, limit = 100, skip = 0 } = req.query;
    const filter = {};
    if (action) filter.action = action;
    if (userId) filter.userId = Number(userId);

    const [logs, total] = await Promise.all([
      Log.find(filter).sort({ timestamp: -1 }).skip(Number(skip)).limit(Number(limit)),
      Log.countDocuments(filter)
    ]);

    res.json({ logs, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Métadonnées de fichiers ──────────────────────────────────────────────────

const fileMetaSchema = new mongoose.Schema({
  filename:     { type: String, required: true },
  originalName: { type: String, required: true },
  mimeType:     { type: String, required: true },
  size:         { type: Number, required: true },
  url:          { type: String, required: true },
  annonceId:    { type: Number, default: null },
  userId:       { type: Number, default: null },
  userEmail:    { type: String, default: null },
  uploadedAt:   { type: Date,   default: Date.now }
});

const FileMeta = mongoose.model('FileMeta', fileMetaSchema);

// Enregistrer les métadonnées d'un fichier uploadé
app.post('/files', async (req, res) => {
  try {
    const { filename, originalName, mimeType, size, url, annonceId, userId, userEmail } = req.body;
    const meta = new FileMeta({ filename, originalName, mimeType, size, url, annonceId, userId, userEmail });
    await meta.save();
    res.status(201).json({ success: true, id: meta._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Lister les fichiers (filtres optionnels: annonceId, userId, limit, skip)
app.get('/files', async (req, res) => {
  try {
    const { annonceId, userId, limit = 50, skip = 0 } = req.query;
    const filter = {};
    if (annonceId) filter.annonceId = Number(annonceId);
    if (userId)    filter.userId    = Number(userId);

    const [files, total] = await Promise.all([
      FileMeta.find(filter).sort({ uploadedAt: -1 }).skip(Number(skip)).limit(Number(limit)),
      FileMeta.countDocuments(filter)
    ]);
    res.json({ files, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Stats fichiers : total uploads, répartition par type MIME
app.get('/files/stats', async (req, res) => {
  try {
    const [byType, total] = await Promise.all([
      FileMeta.aggregate([
        { $group: { _id: '$mimeType', count: { $sum: 1 }, totalSize: { $sum: '$size' } } },
        { $sort: { count: -1 } }
      ]),
      FileMeta.countDocuments()
    ]);
    res.json({ total, byType });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Export CSV ───────────────────────────────────────────────────────────────

function toCSV(rows, columns) {
  const header = columns.join(';');
  const lines  = rows.map(r => columns.map(c => {
    const v = r[c] ?? '';
    const s = String(v).replace(/"/g, '""');
    return s.includes(';') || s.includes('\n') ? `"${s}"` : s;
  }).join(';'));
  return '﻿' + header + '\n' + lines.join('\n'); // BOM UTF-8 pour Excel/Tableau
}

// Export logs → CSV
app.get('/export/logs.csv', async (req, res) => {
  try {
    const logs = await Log.find().sort({ timestamp: -1 }).limit(10000).lean();
    const rows = logs.map(l => ({
      id:        l._id.toString(),
      action:    l.action,
      userId:    l.userId ?? '',
      userEmail: l.userEmail ?? '',
      details:   JSON.stringify(l.details ?? {}),
      ip:        l.ip ?? '',
      timestamp: new Date(l.timestamp).toISOString()
    }));
    const csv = toCSV(rows, ['id','action','userId','userEmail','details','ip','timestamp']);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="logs.csv"');
    res.send(csv);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Export fichiers → CSV
app.get('/export/fichiers.csv', async (req, res) => {
  try {
    const files = await FileMeta.find().sort({ uploadedAt: -1 }).limit(10000).lean();
    const rows = files.map(f => ({
      id:           f._id.toString(),
      filename:     f.filename,
      originalName: f.originalName,
      mimeType:     f.mimeType,
      size:         f.size,
      url:          f.url,
      annonceId:    f.annonceId ?? '',
      userId:       f.userId    ?? '',
      userEmail:    f.userEmail ?? '',
      uploadedAt:   new Date(f.uploadedAt).toISOString()
    }));
    const csv = toCSV(rows, ['id','filename','originalName','mimeType','size','url','annonceId','userId','userEmail','uploadedAt']);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="fichiers.csv"');
    res.send(csv);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Export analytique → CSV (activité par jour)
app.get('/export/analytique.csv', async (req, res) => {
  try {
    const data = await Log.aggregate([
      {
        $group: {
          _id:    { date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } }, action: '$action' },
          count:  { $sum: 1 }
        }
      },
      { $sort: { '_id.date': 1, '_id.action': 1 } }
    ]);
    const rows = data.map(d => ({ date: d._id.date, action: d._id.action, count: d.count }));
    const csv  = toCSV(rows, ['date','action','count']);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="analytique.csv"');
    res.send(csv);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Analytique ───────────────────────────────────────────────────────────────

// Activité par jour sur les N derniers jours, par action
app.get('/analytics/activite', async (req, res) => {
  try {
    const jours = Number(req.query.jours) || 30;
    const depuis = new Date();
    depuis.setDate(depuis.getDate() - jours);

    const data = await Log.aggregate([
      { $match: { timestamp: { $gte: depuis } } },
      {
        $group: {
          _id: {
            date:   { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
            action: '$action'
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.date': 1 } }
    ]);

    // Construire la liste des jours
    const dates = [];
    for (let i = jours - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().slice(0, 10));
    }

    // Pivoter par action
    const actions = ['LOGIN', 'VIEW_ANNONCE', 'CREATE_ANNONCE', 'SOLD_ANNONCE', 'UPLOAD_PHOTO', 'SEND_MESSAGE'];
    const series = {};
    for (const action of actions) {
      series[action] = dates.map(date => {
        const found = data.find(d => d._id.date === date && d._id.action === action);
        return found ? found.count : 0;
      });
    }

    res.json({ dates, series });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Indicateurs clés : totaux par action + taux de conversion
app.get('/analytics/indicateurs', async (req, res) => {
  try {
    const [logStats, fileStats] = await Promise.all([
      Log.aggregate([
        { $group: { _id: '$action', count: { $sum: 1 } } }
      ]),
      FileMeta.aggregate([
        { $group: { _id: null, totalFichiers: { $sum: 1 }, totalTaille: { $sum: '$size' } } }
      ])
    ]);

    const get = (action) => (logStats.find(s => s._id === action)?.count ?? 0);

    const ventes       = get('SOLD_ANNONCE');
    const publications = get('CREATE_ANNONCE');
    const tauxConv     = publications > 0 ? ((ventes / publications) * 100).toFixed(1) : '0.0';

    res.json({
      connexions:       get('LOGIN'),
      inscriptions:     get('REGISTER'),
      consultations:    get('VIEW_ANNONCE'),
      publications,
      ventes,
      messages:         get('SEND_MESSAGE'),
      favorisAjoutes:   get('ADD_FAVORI'),
      photosUploadees:  get('UPLOAD_PHOTO'),
      tauxConversion:   tauxConv,
      totalFichiers:    fileStats[0]?.totalFichiers ?? 0,
      totalTaille:      fileStats[0]?.totalTaille   ?? 0,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Répartition de l'activité par heure de la journée
app.get('/analytics/heures', async (req, res) => {
  try {
    const data = await Log.aggregate([
      {
        $group: {
          _id:   { $hour: '$timestamp' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const heures = Array.from({ length: 24 }, (_, h) => {
      const found = data.find(d => d._id === h);
      return { heure: `${String(h).padStart(2, '0')}h`, count: found ? found.count : 0 };
    });

    res.json({ heures });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur de logs démarré sur http://localhost:${PORT}`);
});
