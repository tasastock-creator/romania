const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const DB_PATH = path.join(__dirname, 'db.json');
const API_KEY = process.env.API_KEY || '';
const DEFAULT_DB = {
  users: [],
  dashboards: {},
  dojoData: null
};

function ensureDbDefaults(db) {
  if (!db || typeof db !== 'object') {
    db = {};
  }
  if (!Array.isArray(db.users)) db.users = [];
  if (!db.dashboards || typeof db.dashboards !== 'object' || Array.isArray(db.dashboards)) db.dashboards = {};
  if (!Object.prototype.hasOwnProperty.call(db, 'dojoData')) db.dojoData = null;
  return db;
}

function readDb() {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    return ensureDbDefaults(JSON.parse(raw || '{}'));
  } catch (e) {
    return ensureDbDefaults({});
  }
}

function writeDb(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(ensureDbDefaults(data), null, 2), 'utf8');
}

function normalize(value) {
  return String(value || '').trim().toLowerCase();
}

function findLoginUser(username, password) {
  const normalizedUsername = normalize(username);
  const normalizedPassword = String(password || '').trim();
  const db = readDb();

  const users = Array.isArray(db.users) ? db.users : [];
  for (const user of users) {
    const name = normalize(user.name);
    const pass = String(user.password || '').trim();
    if (name === normalizedUsername && pass === normalizedPassword) {
      return {
        name: user.name,
        role: user.role || 'athlete',
        childName: user.childName || '',
        parentName: user.parentName || ''
      };
    }
  }

  const dashboards = db.dashboards || {};
  for (const profileKey of Object.keys(dashboards)) {
    const profile = dashboards[profileKey] || {};
    const profileName = normalize(profile.name || profileKey);
    const childUsername = normalize(profile.childUsername || profile.name || '');
    const parentUsername = normalize(profile.parentName || '');
    const childPassword = String(profile.childPassword || profile.password || profile.loginPassword || profile.athletePassword || '').trim();
    const parentPassword = String(profile.parentPassword || profile.parentLoginPassword || '').trim();

    const matchesUsername = (candidate) => {
      if (!candidate) return false;
      if (candidate === normalizedUsername) return true;
      const parts = candidate.split(/\s+/).filter(Boolean);
      return parts.includes(normalizedUsername);
    };

    if (childPassword && childPassword === normalizedPassword && (matchesUsername(childUsername) || matchesUsername(profileName))) {
      return {
        name: profile.childUsername || profile.name || profileKey,
        role: 'athlete',
        childName: profile.name || profileKey,
        parentName: profile.parentName || ''
      };
    }

    if (parentPassword && parentPassword === normalizedPassword && parentUsername && matchesUsername(parentUsername)) {
      return {
        name: profile.parentName || profileKey,
        role: 'parent',
        childName: profile.name || profileKey,
        parentName: profile.parentName || profileKey
      };
    }
  }

  return null;
}

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/ping', (req, res) => {
  res.json({ ok: true });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required' });
  }
  const user = findLoginUser(username, password);
  if (!user) {
    return res.status(401).json({ error: 'invalid credentials' });
  }
  res.json({ ok: true, user });
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

const staticCandidates = [
  path.join(__dirname, '..'),
  path.join(__dirname),
  process.cwd()
].map((root) => path.resolve(root));
for (const root of staticCandidates) {
  app.use(express.static(root));
}

const staticRoot = staticCandidates.find((root) => fs.existsSync(path.join(root, 'index.html'))) || staticCandidates[0];
const indexFile = path.join(staticRoot, 'index.html');
console.log('Using static root:', staticRoot);
app.get('*', (req, res) => {
  res.sendFile(indexFile);
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`romania-sync-server listening on ${port}`);
});
