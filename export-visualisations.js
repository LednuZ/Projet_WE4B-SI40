/**
 * Génère les fichiers CSV dans le dossier visualisations/
 * pour import dans Tableau ou tout autre outil de BI.
 *
 * Usage : node export-visualisations.js
 */

const mongoose = require('mongoose');
const fs       = require('fs');
const path     = require('path');

const MONGO_URI  = 'mongodb://localhost:27017/automarket_logs';
const OUTPUT_DIR = path.join(__dirname, 'visualisations');

// ── Schémas ──────────────────────────────────────────────────────────────────

const Log = mongoose.model('Log', new mongoose.Schema({
  action:    String,
  userId:    Number,
  userEmail: String,
  details:   mongoose.Schema.Types.Mixed,
  ip:        String,
  timestamp: { type: Date, default: Date.now }
}));

const FileMeta = mongoose.model('FileMeta', new mongoose.Schema({
  filename:     String,
  originalName: String,
  mimeType:     String,
  size:         Number,
  url:          String,
  annonceId:    Number,
  userId:       Number,
  userEmail:    String,
  uploadedAt:   { type: Date, default: Date.now }
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

function toCSV(rows, columns) {
  const header = columns.join(';');
  const lines  = rows.map(r => columns.map(c => {
    const v = r[c] ?? '';
    const s = String(v).replace(/"/g, '""');
    return s.includes(';') || s.includes('\n') ? `"${s}"` : s;
  }).join(';'));
  return '﻿' + header + '\n' + lines.join('\n');
}

function write(filename, csv) {
  const filepath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(filepath, csv, 'utf8');
  console.log(`✔ ${filename} (${(Buffer.byteLength(csv, 'utf8') / 1024).toFixed(1)} Ko)`);
}

// ── Export ────────────────────────────────────────────────────────────────────

async function run() {
  await mongoose.connect(MONGO_URI);
  console.log('MongoDB connecté\n');

  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

  // 1. Logs bruts
  const logs = await Log.find().sort({ timestamp: -1 }).lean();
  write('logs.csv', toCSV(
    logs.map(l => ({
      id:        l._id.toString(),
      action:    l.action,
      userId:    l.userId ?? '',
      userEmail: l.userEmail ?? '',
      details:   JSON.stringify(l.details ?? {}),
      ip:        l.ip ?? '',
      date:      new Date(l.timestamp).toISOString().slice(0, 10),
      heure:     new Date(l.timestamp).getHours(),
      timestamp: new Date(l.timestamp).toISOString()
    })),
    ['id','action','userId','userEmail','details','ip','date','heure','timestamp']
  ));

  // 2. Fichiers / métadonnées
  const files = await FileMeta.find().sort({ uploadedAt: -1 }).lean();
  write('fichiers.csv', toCSV(
    files.map(f => ({
      id:           f._id.toString(),
      filename:     f.filename,
      originalName: f.originalName,
      mimeType:     f.mimeType,
      taille_ko:    (f.size / 1024).toFixed(1),
      url:          f.url,
      annonceId:    f.annonceId ?? '',
      userId:       f.userId    ?? '',
      userEmail:    f.userEmail ?? '',
      date:         new Date(f.uploadedAt).toISOString().slice(0, 10),
      uploadedAt:   new Date(f.uploadedAt).toISOString()
    })),
    ['id','filename','originalName','mimeType','taille_ko','url','annonceId','userId','userEmail','date','uploadedAt']
  ));

  // 3. Activité agrégée par jour × action
  const activite = await Log.aggregate([
    { $group: {
      _id:   { date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } }, action: '$action' },
      count: { $sum: 1 }
    }},
    { $sort: { '_id.date': 1 } }
  ]);
  write('activite_par_jour.csv', toCSV(
    activite.map(d => ({ date: d._id.date, action: d._id.action, count: d.count })),
    ['date','action','count']
  ));

  // 4. Indicateurs clés (une ligne par action)
  const stats = await Log.aggregate([
    { $group: { _id: '$action', total: { $sum: 1 },
      premier: { $min: '$timestamp' }, dernier: { $max: '$timestamp' }
    }},
    { $sort: { total: -1 } }
  ]);
  write('indicateurs.csv', toCSV(
    stats.map(s => ({
      action:   s._id,
      total:    s.total,
      premier:  new Date(s.premier).toISOString().slice(0, 10),
      dernier:  new Date(s.dernier).toISOString().slice(0, 10)
    })),
    ['action','total','premier','dernier']
  ));

  // 5. Pics horaires
  const heures = await Log.aggregate([
    { $group: { _id: { $hour: '$timestamp' }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);
  write('activite_par_heure.csv', toCSV(
    Array.from({ length: 24 }, (_, h) => ({
      heure:  `${String(h).padStart(2,'0')}h`,
      count:  heures.find(d => d._id === h)?.count ?? 0
    })),
    ['heure','count']
  ));

  console.log(`\n✅ Exports terminés → dossier visualisations/`);
  await mongoose.disconnect();
}

run().catch(err => { console.error(err); process.exit(1); });
