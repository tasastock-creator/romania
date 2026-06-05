// Login handling for separate login page
document.addEventListener('DOMContentLoaded', () => {
    const DEFAULT_ADMIN_USER = {
        name: 'Admin',
        password: 'LionMode2026!',
        role: 'admin'
    };
    const SHARED_STATE_MARKER = '__lionModeEliteSharedState';
    
    // Check for existing session and show logout option
    const checkExistingSession = () => {
        try {
            let currentUser = null;
            const stores = [];
            try { if (window.localStorage) stores.push(window.localStorage); } catch (e) {}
            try { if (window.sessionStorage) stores.push(window.sessionStorage); } catch (e) {}
            
            for (const store of stores) {
                try {
                    const raw = store.getItem('currentUser');
                    if (raw) {
                        currentUser = JSON.parse(raw);
                        if (currentUser && currentUser.name) break;
                    }
                } catch (e) {}
            }
            
            const sessionBanner = document.getElementById('session-banner');
            const logoutBtn = document.getElementById('logout-btn');
            const currentUserDisplay = document.getElementById('current-user-display');
            
            if (currentUser && currentUser.name && sessionBanner) {
                currentUserDisplay.textContent = currentUser.name;
                sessionBanner.classList.remove('hidden');
                
                if (logoutBtn) {
                    logoutBtn.addEventListener('click', () => {
                        // Clear all storage
                        const stores = [];
                        try { if (window.localStorage) stores.push(window.localStorage); } catch (e) {}
                        try { if (window.sessionStorage) stores.push(window.sessionStorage); } catch (e) {}
                        stores.forEach(store => {
                            try { store.removeItem('currentUser'); } catch (e) {}
                        });
                        
                        // Reload page to refresh the session banner
                        window.location.reload();
                    });
                }
            }
        } catch (e) {
            // Silently fail
        }
    };
    
    checkExistingSession();

    function getWindowNameState() {
        try {
            const parsed = JSON.parse(window.name || '{}');
            if (parsed && parsed.marker === SHARED_STATE_MARKER && parsed.data && typeof parsed.data === 'object') {
                return parsed.data;
            }
        } catch (e) {
            // window.name may contain unrelated browser data.
        }
        return {};
    }

    function setWindowNameItem(key, value) {
        try {
            const data = getWindowNameState();
            data[key] = value;
            window.name = JSON.stringify({ marker: SHARED_STATE_MARKER, data });
        } catch (e) {
            // If window.name is blocked, storage candidates above still handle normal browsers.
        }
    }

    function getWindowNameItem(key) {
        const data = getWindowNameState();
        return Object.prototype.hasOwnProperty.call(data, key) ? data[key] : null;
    }

    function getStorageCandidates() {
        const stores = [];
        try {
            if (window.localStorage) stores.push(window.localStorage);
        } catch (e) {
            // localStorage may be blocked for file:// pages in some browsers
        }
        try {
            if (window.sessionStorage) stores.push(window.sessionStorage);
        } catch (e) {
            // sessionStorage fallback
        }
        return stores;
    }

    // Remote sync configuration - adjust if your server runs elsewhere
    const REMOTE_API_BASE = window.REMOTE_API_BASE || 'http://localhost:4000';
    const REMOTE_API_KEY = window.REMOTE_API_KEY || '';

    // Attempt to pull server-stored keys into localStorage at startup (synchronous XHR)
    function syncFromServerKeys(keys) {
        try {
            keys.forEach(key => {
                try {
                    const xhr = new XMLHttpRequest();
                    xhr.open('GET', `${REMOTE_API_BASE}/api/kv/${encodeURIComponent(key)}`, false);
                    if (REMOTE_API_KEY) xhr.setRequestHeader('x-api-key', REMOTE_API_KEY);
                    xhr.send(null);
                    if (xhr.status === 200 && xhr.responseText) {
                        try {
                            const json = JSON.parse(xhr.responseText);
                            if (json && json.value != null) {
                                try { localStorage.setItem(key, typeof json.value === 'string' ? json.value : JSON.stringify(json.value)); } catch (e) {}
                            }
                        } catch (e) {}
                    }
                } catch (e) {}
            });
        } catch (e) {}
    }

    // Pull server state for commonly used keys
    try { syncFromServerKeys(['users','dashboards','dojoData']); } catch (e) {}

    function getStoredItem(key) {
        const stores = getStorageCandidates();
        for (const store of stores) {
            try {
                const value = store.getItem(key);
                if (value !== null) return value;
            } catch (e) {
                // keep trying next store
            }
        }
        return getWindowNameItem(key);
    }

    function setStoredItem(key, value) {
        const stores = getStorageCandidates();
        stores.forEach(store => {
            try {
                store.setItem(key, value);
            } catch (e) {
                // ignore blocked store
            }
        });
        setWindowNameItem(key, value);
        // Fire-and-forget: send the change to the remote sync server so other devices can pick it up
        (async function() {
            try {
                await fetch(`${REMOTE_API_BASE}/api/kv/${encodeURIComponent(key)}`, {
                    method: 'POST',
                    headers: Object.assign({ 'Content-Type': 'application/json' }, REMOTE_API_KEY ? { 'x-api-key': REMOTE_API_KEY } : {}),
                    body: JSON.stringify({ value: (() => {
                        try { return JSON.parse(value); } catch (e) { return value; }
                    })() })
                });
            } catch (e) {
                // ignore network errors
            }
        })();
    }

    function normalizeLoginName(value) {
        return typeof value === 'string' ? value.trim().toLowerCase() : '';
    }

    function parseUserLines(text) {
        return String(text || '').trim().split('\n').filter(Boolean).map(line => {
            const parts = line.split(':');
            return {
                name: String(parts[0] || '').trim(),
                password: String(parts[1] || '').trim(),
                role: String(parts[2] || '').trim(),
                childName: String(parts[3] || '').trim()
            };
        }).filter(user => user.name && user.password);
    }

    function getUsers() {
        const users = [];
        const addUsers = (parsed) => {
            if (!parsed) return;
            if (Array.isArray(parsed)) {
                parsed.forEach(rawUser => {
                    if (!rawUser || typeof rawUser !== 'object' || !rawUser.name || rawUser.password == null) return;
                    users.push({
                        name: String(rawUser.name).trim(),
                        password: String(rawUser.password).trim(),
                        role: String(rawUser.role || '').trim(),
                        childName: String(rawUser.childName || '').trim()
                    });
                });
                return;
            }
            if (typeof parsed === 'object') {
                Object.values(parsed).forEach(rawUser => {
                    if (!rawUser || typeof rawUser !== 'object' || !rawUser.name || rawUser.password == null) return;
                    users.push({
                        name: String(rawUser.name).trim(),
                        password: String(rawUser.password).trim(),
                        role: String(rawUser.role || '').trim(),
                        childName: String(rawUser.childName || '').trim()
                    });
                });
            }
        };

        getStorageCandidates().forEach(store => {
            try {
                const rawUsers = store.getItem('users');
                if (rawUsers) {
                    try {
                        addUsers(JSON.parse(rawUsers));
                    } catch (e) {
                        addUsers(parseUserLines(rawUsers));
                    }
                }
            } catch (e) {
                // Ignore invalid saved users and keep checking the other store.
            }
        });
        try {
            const rawUsers = getWindowNameItem('users');
            if (rawUsers) {
                try {
                    addUsers(JSON.parse(rawUsers));
                } catch (e) {
                    addUsers(parseUserLines(rawUsers));
                }
            }
        } catch (e) {
            // Ignore invalid shared users.
        }
        return users;
    }

    function parseJson(value) {
        try {
            return JSON.parse(value || 'null');
        } catch (e) {
            return null;
        }
    }

    function getDashboards() {
        const output = {};
        const addDashboards = (storedDashboards, fallbackProfile) => {
            if (storedDashboards && typeof storedDashboards === 'object' && !Array.isArray(storedDashboards)) {
                Object.entries(storedDashboards).forEach(([name, profile]) => {
                    if (profile && typeof profile === 'object') {
                        const profileName = profile.name || name;
                        output[profileName] = { ...profile, name: profileName };
                    }
                });
            }

            if (fallbackProfile && typeof fallbackProfile === 'object') {
                const fallbackName = fallbackProfile.name || 'Default Profile';
                output[fallbackName] = { ...fallbackProfile, name: fallbackName };
            }
        };

        getStorageCandidates().forEach(store => {
            const storedDashboards = parseJson(store.getItem('dashboards'));
            const fallbackProfile = parseJson(store.getItem('dojoData'));
            addDashboards(storedDashboards, fallbackProfile);
        });

        const windowDashboards = parseJson(getWindowNameItem('dashboards'));
        const windowDojoData = parseJson(getWindowNameItem('dojoData'));
        addDashboards(windowDashboards, windowDojoData);

        return output;
    }

    function isNameMatch(candidate, search) {
        if (!candidate || !search) return false;
        if (candidate === search) return true;
        const candidateWords = candidate.split(/\s+/).filter(Boolean);
        return candidateWords.includes(search);
    }

    function getProfileLoginUser(username, password) {
        const normalizedUsername = String(username || '').trim().toLowerCase();
        const normalizedPassword = String(password || '').trim();
        const dashboards = getDashboards();

        for (const profile of Object.values(dashboards)) {
            const profileName = String(profile.name || '').trim().toLowerCase();
            const childUsername = String(profile.childUsername || profile.name || '').trim().toLowerCase();
            const parentUsername = String(profile.parentName || '').trim().toLowerCase();
            const childPassword = String(profile.childPassword || profile.password || profile.loginPassword || profile.athletePassword || '').trim();
            const parentPassword = String(profile.parentPassword || profile.parentLoginPassword || '').trim();

            if (childPassword && childPassword === normalizedPassword) {
                const childUsernameMatches = childUsername && (childUsername === normalizedUsername || isNameMatch(childUsername, normalizedUsername) || isNameMatch(normalizedUsername, childUsername));
                const profileNameMatches = profileName && (profileName === normalizedUsername || isNameMatch(profileName, normalizedUsername) || isNameMatch(normalizedUsername, profileName));

                if (childUsernameMatches) {
                    return {
                        name: profile.childUsername ? profile.childUsername : profile.name,
                        password: childPassword,
                        role: 'athlete',
                        childName: profile.name || ''
                    };
                }
                if (profileNameMatches) {
                    return {
                        name: profile.name || '',
                        password: childPassword,
                        role: 'athlete',
                        childName: profile.name || ''
                    };
                }
            }

            if (parentPassword && parentPassword === normalizedPassword && parentUsername && (parentUsername === normalizedUsername || isNameMatch(parentUsername, normalizedUsername) || isNameMatch(normalizedUsername, parentUsername))) {
                return {
                    name: profile.parentName || '',
                    password: parentPassword,
                    role: 'parent',
                    childName: profile.name || ''
                };
            }
        }

        return null;
    }

    function ensureDefaultAdminUser() {
        const users = getUsers();
        const hasAdmin = users.some(user => {
            const role = (user.role || '').toLowerCase();
            return role === 'admin' && user.name === DEFAULT_ADMIN_USER.name;
        });

        if (!hasAdmin) {
            users.unshift(DEFAULT_ADMIN_USER);
            setStoredItem('users', JSON.stringify(users));
        }
    }

    ensureDefaultAdminUser();

    // Ensure at least one test child profile exists if none do
    function ensureTestChildProfile() {
        const dashboards = getDashboards();
        const users = getUsers();
        
        // Check if any child/athlete users exist
        const hasChildUsers = users.some(u => (u.role || '').toLowerCase() === 'athlete');
        const hasProfiles = Object.keys(dashboards).length > 0;
        
        if (!hasChildUsers && !hasProfiles) {
            // Initialize test data
            const testProfile = {
                name: 'Test Athlete',
                childUsername: 'athlete',
                childPassword: 'password123',
                role: 'athlete',
                belt: 'White',
                age: 12,
                division: 'U12 Male Kumite'
            };
            const testDashboards = { 'Test Athlete': testProfile };
            const testUsers = [
                DEFAULT_ADMIN_USER,
                {
                    name: 'athlete',
                    password: 'password123',
                    role: 'athlete',
                    childName: 'Test Athlete'
                }
            ];
            
            setStoredItem('dashboards', JSON.stringify(testDashboards));
            setStoredItem('dojoData', JSON.stringify(testProfile));
            setStoredItem('users', JSON.stringify(testUsers));
        }
    }
    
    ensureTestChildProfile();

    const loginBtn = document.getElementById('submit-login');
    const errorEl = document.getElementById('login-error');
    const usernameInput = document.getElementById('login-username');
    const passwordInput = document.getElementById('login-password');

    async function remoteLogin(username, password) {
        if (!REMOTE_API_BASE) {
            return null;
        }
        try {
            const response = await fetch(`${REMOTE_API_BASE}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            if (!response.ok) {
                return null;
            }
            const body = await response.json();
            return body && body.ok && body.user ? body.user : null;
        } catch (e) {
            return null;
        }
    }

    async function handleLogin() {
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value;
        const normalizedUsername = username.toLowerCase();
        const normalizedPassword = password.trim();
        
        // Retrieve user list from localStorage
        const users = getUsers();
        
        // DEBUG: Log what we're searching for
        const debugMode = localStorage.getItem('DEBUG_LOGIN') === 'true';
        if (debugMode) {
            console.log('=== LOGIN DEBUG ===');
            console.log('Input:', { username, password });
            console.log('Normalized:', { normalizedUsername, normalizedPassword });
            console.log('Users in storage:', users);
            console.log('Dashboards:', getDashboards());
        }
        
        // Exact username/password match first, then profile-based fallback.
        let user = users.find(u => {
            const uName = String(u.name).trim().toLowerCase();
            const uPass = String(u.password || '').trim();
            const match = uName === normalizedUsername && uPass === normalizedPassword;
            if (debugMode && match) console.log('Matched user from array:', u);
            return match;
        });

        if (!user) {
            user = getProfileLoginUser(username, password);
            if (debugMode && user) console.log('Matched user from profile:', user);
        }

        if (!user) {
            user = await remoteLogin(username, password);
            if (debugMode && user) console.log('Matched user from remote login:', user);
        }

        if (user) {
            errorEl.textContent = '';
            setStoredItem('currentUser', JSON.stringify(user));
            // redirect based on role
            const role = (user.role || '').toLowerCase();
            const userName = (user.name || '').trim();
            const isAdmin = role === 'admin' || role === 'coach' || userName === 'Admin';
            
            console.log('Login successful:', { userName, role, isAdmin });
            
            if (isAdmin) {
                console.log('Redirecting to admin.html');
                window.location.href = 'admin.html';
            } else {
                console.log('Redirecting to dashboard.html');
                window.location.href = 'dashboard.html';
            }
        } else {
            errorEl.textContent = 'Invalid name or password';
            
            // Enhanced error info in debug mode
            if (debugMode) {
                const dashboards = getDashboards();
                const dashboardNames = Object.keys(dashboards);
                const userNames = users.map(u => u.name);
                console.error('Login failed. Available:', { userNames, dashboardNames });
                alert(`
DEBUG: Login failed for "${username}"
Available users: ${userNames.join(', ') || '(none)'}
Available profiles: ${dashboardNames.join(', ') || '(none)'}
                `.trim());
            }
        }
    }

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            handleLogin();
        });
    } else {
        loginBtn.addEventListener('click', handleLogin);
        [usernameInput, passwordInput].forEach(input => {
            input.addEventListener('keydown', function (event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    handleLogin();
                }
            });
        });
    }
});
