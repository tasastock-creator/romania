Sync server for cross-device data

What I added
- A minimal Node/Express sync server under `server/` that exposes a simple key-value API.
- Server files: `server/index.js`, `server/db.json`, `server/package.json`.

How it works (minimal)
- Client now POSTs changes to `/api/kv/:key` and the server stores them in `server/db.json`.
- On page load the client attempts to pull `users`, `dashboards`, and `dojoData` from the server and writes them into `localStorage` so other devices can read the updated state.

Run locally
1. Install dependencies and start the server:

```bash
cd server
npm install
npm start
```

2. Optionally set an API key for writes (recommended):

```bash
export API_KEY=your-secret
npm start
```

Client configuration
- By default the client will contact `http://localhost:4000`. To change this in a browser environment, set `window.REMOTE_API_BASE` before loading scripts (or edit the constant in `login.js`/`dashboard.js`/`landing.js`).
- If you enable `API_KEY`, also set `window.REMOTE_API_KEY` in the page to allow the client to POST.

Files I modified
- `login.js` — added remote sync pull at startup and POST-on-save inside `setStoredItem`.
- `dashboard.js` — added remote sync pull at startup.
- `landing.js` — added remote sync pull at startup and POST `currentUser` after login.

Next steps I recommend
- Harden authentication (JWT/session) for production.
- Replace synchronous XHR sync with an initial background fetch + UI loading state.
- Add merge/conflict handling for concurrent edits.
- Optionally add WebSocket or polling for near-real-time updates.
