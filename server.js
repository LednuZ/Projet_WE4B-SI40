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

app.listen(PORT, () => {
  console.log(`Serveur de logs démarré sur http://localhost:${PORT}`);
});
