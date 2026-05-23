// Login handling for separate login page
document.addEventListener('DOMContentLoaded', () => {
    const DEFAULT_ADMIN_USER = {
        name: 'Admin',
        password: 'LionMode2026!',
        role: 'admin'
    };
    const SHARED_STATE_MARKER = '__lionModeEliteSharedState';

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

    function handleLogin() {
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

        if (!user && DEFAULT_ADMIN_USER.name.toLowerCase() === normalizedUsername && normalizedPassword === DEFAULT_ADMIN_USER.password) {
            user = DEFAULT_ADMIN_USER;
            if (debugMode) console.log('Matched admin user');
        }

        if (user) {
            errorEl.textContent = '';
            setStoredItem('currentUser', JSON.stringify(user));
            // redirect based on role
            const role = (user.role || '').toLowerCase();
            if (role === 'coach' || role === 'admin') {
                window.location.href = 'admin.html';
            } else {
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

    loginBtn.addEventListener('click', handleLogin);

    [usernameInput, passwordInput].forEach(input => {
        input.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                handleLogin();
            }
        });
    });
});
