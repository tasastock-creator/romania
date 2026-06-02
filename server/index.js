const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const DB_PATH = path.join(__dirname, 'db.json');
const API_KEY = process.env.API_KEY || '';

function readDb() {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(raw || '{}');
  } catch (e) {
    return {};
  }
}

function writeDb(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/ping', (req, res) => {
  res.json({ ok: true });
});

app.get('/api/kv/:key', (req, res) => {
  const db = readDb();
  const key = req.params.key;
  res.json({ value: db.hasOwnProperty(key) ? db[key] : null });
});

app.post('/api/kv/:key', (req, res) => {
  if (API_KEY && req.headers['x-api-key'] !== API_KEY) {
    return res.status(403).json({ error: 'invalid api key' });
  }
  const key = req.params.key;
  const db = readDb();
  db[key] = req.body && Object.prototype.hasOwnProperty.call(req.body, 'value') ? req.body.value : null;
  writeDb(db);
  res.json({ ok: true, key });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`romania-sync-server listening on ${port}`);
});
