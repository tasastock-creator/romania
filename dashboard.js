const defaultData = {
    name: "Rayna Panday",
    age: 7,
    athleteId: "LMELITE-RP-001",
    belt: "Yellow Belt",
    clubName: "LionMode Elite",
    coachName: "Sensei Sudhir",
    joinedProgram: "January 2025",
    goal: "World Champion – Romania 2026",
    division: "8 & Under",
    eventType: "Kata & Kumite",
    photo: "dashboard-athlete-reference.png",
    strengths: [
        "Strong kata basics",
        "Good stances & balance",
        "Fast learner",
        "Great focus in training",
        "Positive attitude",
        "Improving kumite movement"
    ],
    weaknesses: [
        "Kumite aggression",
        "Combination attacks",
        "Footwork & distancing",
        "Stamina & endurance",
        "Reaction to counter"
    ],
    goals: [
        "Improve kumite confidence and aggression",
        "Win Dolphin League Gold Medal",
        "Perform my best at MASA Tournament",
        "Be selected for Romania 2026 World Championships",
        "Become a World Champion"
    ],
    coachNote: "Rayna is a dedicated and focused athlete with a strong foundation. She shows great potential in both kata and kumite. With continued hard work on her weaknesses and consistency in training, she will achieve great things.",
    readiness: 78,
    readinessMetrics: [
        { label: "Technical Skills", value: 75, icon: "fa-solid fa-trophy" },
        { label: "Physical Fitness", value: 72, icon: "fa-solid fa-person-running" },
        { label: "Mental Strength", value: 70, icon: "fa-solid fa-brain" },
        { label: "Discipline & Attitude", value: 85, icon: "fa-solid fa-people-group" },
        { label: "Overall Consistency", value: 78, icon: "fa-regular fa-clock" }
    ],
    activitySummary: [
        { title: "Group Sessions", value: "12/14", percent: 86, icon: "fa-solid fa-people-group", status: "ATTENDED" },
        { title: "PT Sessions", value: "6/8", percent: 75, icon: "fa-solid fa-person", status: "ATTENDED" },
        { title: "At-Home Programs", value: "4/5", percent: 80, icon: "fa-solid fa-house", status: "SUBMITTED" },
        { title: "Video Logs", value: "4/5", percent: 80, icon: "fa-solid fa-video", status: "SUBMITTED" }
    ],
    events: [
        { date: "10 May 2025", name: "Dolphin League" },
        { date: "14 June 2025", name: "MASA Tournament" },
        { date: "07 – 10 July 2025", name: "Winter Elite Camp" },
        { date: "Aug – Sep 2025", name: "Final Preparation" },
        { date: "Romania 2026", name: "World Championships" }
    ],
    feedback: [
        { name: "Group Training", comment: "12 May 2025. Great energy and focus today. Keep working on kumite entries.", color: "green" },
        { name: "PT Session", comment: "10 May 2025. Improving speed and power. Keep pushing!", color: "blue" },
        { name: "At-Home Program", comment: "11 May 2025. Good effort on kata practice. Nice improvement.", color: "purple" }
    ]
};

function getStorageCandidates() {
    const stores = [];
    try { if (window.localStorage) stores.push(window.localStorage); } catch (error) {}
    try { if (window.sessionStorage) stores.push(window.sessionStorage); } catch (error) {}
    return stores;
}

const SHARED_STATE_MARKER = "__lionModeEliteSharedState";

function getWindowNameState() {
    try {
        const parsed = JSON.parse(window.name || "{}");
        if (parsed && parsed.marker === SHARED_STATE_MARKER && parsed.data && typeof parsed.data === "object") {
            return parsed.data;
        }
    } catch (error) {}
    return {};
}

function getWindowNameItem(key) {
    const data = getWindowNameState();
    return Object.prototype.hasOwnProperty.call(data, key) ? data[key] : null;
}

function getStoredItem(key) {
    for (const store of getStorageCandidates()) {
        try {
            const value = store.getItem(key);
            if (value !== null) {
                return value;
            }
        } catch (error) {}
    }
    return getWindowNameItem(key);
}

function parseJson(value, fallback) {
    if (!value) {
        return fallback;
    }
    try {
        return JSON.parse(value);
    } catch (error) {
        return fallback;
    }
}

function normalizePercent(value) {
    const numeric = Number(value);
    if (Number.isNaN(numeric)) {
        return 0;
    }
    return Math.max(0, Math.min(100, numeric));
}

function normalizeMetricValue(value) {
    if (typeof value === "string" && value.trim().endsWith("%")) {
        return normalizePercent(value.replace("%", ""));
    }
    return normalizePercent(value);
}

function normalizePhotoPath(value) {
    if (!value || value === "PHOTO-2026-05-17-10-27-52.jpg") {
        return defaultData.photo;
    }
    return value;
}

function getCurrentUser() {
    const raw = getStoredItem("currentUser");
    const parsed = parseJson(raw, null);
    if (parsed && typeof parsed === "object") {
        return parsed;
    }
    if (typeof raw === "string" && raw.trim().length) {
        return { name: raw.trim(), role: "athlete", childName: raw.trim() };
    }
    return null;
}

function getDashboards() {
    const output = {};
    const addDashboards = (storedDashboards, fallback) => {
        if (storedDashboards && typeof storedDashboards === "object" && !Array.isArray(storedDashboards)) {
            Object.entries(storedDashboards).forEach(([name, profile]) => {
                if (profile && typeof profile === "object") {
                    const profileName = profile.name || name;
                    output[profileName] = { ...profile, name: profileName };
                }
            });
        }
        if (fallback && typeof fallback === "object") {
            const fallbackName = fallback.name || defaultData.name;
            output[fallbackName] = { ...fallback, name: fallbackName };
        }
    };

    for (const store of getStorageCandidates()) {
        try {
            addDashboards(
                parseJson(store.getItem("dashboards"), null),
                parseJson(store.getItem("dojoData"), null)
            );
        } catch (error) {}
    }
    addDashboards(
        parseJson(getWindowNameItem("dashboards"), null),
        parseJson(getWindowNameItem("dojoData"), null)
    );
    return Object.keys(output).length ? output : { [defaultData.name]: defaultData };
}

function getDashboardForUser(user) {
    if (!user) {
        return defaultData;
    }

    const dashboards = getDashboards();
    const role = (user.role || "").toLowerCase();
    const normalize = (value) => (typeof value === "string" ? value.trim().toLowerCase() : "");

    const nameKey = normalize(user.name);
    const childKey = normalize(user.childName);
    const parentKey = normalize(user.parentName);

    const resolveDashboardKey = (key) => {
        if (!key) {
            return null;
        }
        if (dashboards[key]) {
            return dashboards[key];
        }
        const matchedKey = Object.keys(dashboards).find((dashboardName) => dashboardName.toLowerCase() === key);
        return matchedKey ? dashboards[matchedKey] : null;
    };

    const directMatch = resolveDashboardKey(childKey) || resolveDashboardKey(nameKey) || resolveDashboardKey(parentKey);
    if (directMatch) {
        return directMatch;
    }

    if ((role === "admin" || role === "coach") && Object.keys(dashboards).length) {
        return dashboards[Object.keys(dashboards)[0]];
    }

    const profileMatch = Object.values(dashboards).find((profile) => {
        const profileName = normalize(profile.name);
        const childUsername = normalize(profile.childUsername || "");
        const parentUsername = normalize(profile.parentName || "");
        return (
            (nameKey && (profileName === nameKey || childUsername === nameKey || parentUsername === nameKey)) ||
            (childKey && (profileName === childKey || childUsername === childKey || parentUsername === childKey))
        );
    });

    if (profileMatch) {
        return profileMatch;
    }

    return defaultData;
}

function setText(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value || "";
    }
}

function renderReadiness(data) {
    const readiness = normalizePercent(data.readiness);
    const circle = document.getElementById("readiness-circle");
    const value = document.getElementById("readiness-value");

    if (circle) {
        circle.style.background = `conic-gradient(#c89a2d 0% ${readiness}%, #292929 ${readiness}% 100%)`;
    }
    if (value) {
        value.textContent = `${readiness}%`;
    }

    const metricsContainer = document.getElementById("readiness-metrics");
    if (!metricsContainer) {
        return;
    }

    metricsContainer.innerHTML = "";
    const metrics = (data.readinessMetrics && data.readinessMetrics.length) ? data.readinessMetrics : defaultData.readinessMetrics;
    metrics.forEach((metric) => {
        const metricValue = normalizeMetricValue(metric.value);
        const row = document.createElement("div");
        row.className = "readiness-bar";

        const label = document.createElement("div");
        label.className = "readiness-bar__label";
        label.innerHTML = `<span><i class="${metric.icon || "fa-solid fa-star"}"></i>${metric.label || ""}</span><strong>${metricValue}%</strong>`;

        const track = document.createElement("div");
        track.className = "readiness-bar__track";

        const fill = document.createElement("div");
        fill.className = "readiness-bar__fill";
        fill.style.width = `${metricValue}%`;

        track.appendChild(fill);
        row.appendChild(label);
        row.appendChild(track);
        metricsContainer.appendChild(row);
    });
}

function renderSimpleList(containerId, items, className) {
    const container = document.getElementById(containerId);
    if (!container) {
        return;
    }
    container.innerHTML = "";
    (items || []).forEach((item) => {
        const li = document.createElement("li");
        if (className) {
            li.className = className;
        }
        li.textContent = item;
        container.appendChild(li);
    });
}

function renderGoals(goals) {
    const container = document.getElementById("goals-list");
    if (!container) {
        return;
    }
    container.innerHTML = "";
    (goals || []).forEach((goal) => {
        const li = document.createElement("li");
        li.textContent = goal;
        container.appendChild(li);
    });
}

function renderActivity(activitySummary) {
    const container = document.getElementById("activity-summary");
    if (!container) {
        return;
    }
    container.innerHTML = "";

    (activitySummary || []).forEach((item) => {
        const card = document.createElement("div");
        card.className = "activity-stat-card";

        const heading = document.createElement("div");
        heading.className = "activity-stat-card__heading";
        heading.innerHTML = `<span><i class="${item.icon || "fa-solid fa-chart-line"}"></i>${item.title || ""}</span>`;

        const body = document.createElement("div");
        body.className = "activity-stat-card__body";
        body.innerHTML = `<strong>${item.value || ""}</strong><span>${item.status || ""}</span>`;

        const meter = document.createElement("div");
        meter.className = "activity-stat-card__meter";
        meter.innerHTML = `<div class="activity-stat-card__track"><div class="activity-stat-card__fill" style="width:${normalizePercent(item.percent)}%"></div></div><small>${normalizePercent(item.percent)}%</small>`;

        card.appendChild(heading);
        card.appendChild(body);
        card.appendChild(meter);
        container.appendChild(card);
    });
}

function renderEvents(events) {
    const container = document.getElementById("events-list");
    if (!container) {
        return;
    }
    container.innerHTML = "";

    (events || []).forEach((event, index) => {
        const li = document.createElement("li");
        li.className = "dashboard-event-item";
        if (index === (events || []).length - 1) {
            li.classList.add("dashboard-event-item--highlight");
        }
        li.innerHTML = `<span class="dashboard-event-item__name">${event.name || ""}</span><span class="dashboard-event-item__date">${event.date || ""}</span>`;
        container.appendChild(li);
    });
}

function renderFeedback(feedback) {
    const container = document.getElementById("feedback-list");
    if (!container) {
        return;
    }
    container.innerHTML = "";

    (feedback || []).forEach((item) => {
        const li = document.createElement("li");
        li.className = "dashboard-feedback-item";

        const badge = document.createElement("span");
        badge.className = `dashboard-feedback-item__badge dashboard-feedback-item__badge--${item.color || "gold"}`;
        badge.innerHTML = '<i class="fa-solid fa-user"></i>';

        const copy = document.createElement("div");
        copy.className = "dashboard-feedback-item__copy";
        copy.innerHTML = `<strong>${item.name || ""}</strong><p>${item.comment || ""}</p>`;

        li.appendChild(badge);
        li.appendChild(copy);
        container.appendChild(li);
    });
}

function renderDashboard(data) {
    setText("child-name", data.name || defaultData.name);
    setText("child-age", data.age ? `${data.age} Years Old` : "");
    setText("athlete-id", data.athleteId || defaultData.athleteId);
    setText("child-belt", data.belt || defaultData.belt);
    setText("club-name", data.clubName || defaultData.clubName);
    setText("coach-name", data.coachName || defaultData.coachName);
    setText("joined-program", data.joinedProgram || defaultData.joinedProgram);
    setText("goal", data.goal || defaultData.goal);
    setText("division", data.division || defaultData.division);
    setText("event-type", data.eventType || defaultData.eventType);

    const photo = document.getElementById("child-photo");
    if (photo) {
        photo.src = normalizePhotoPath(data.photo);
    }

    const note = document.getElementById("coach-note");
    if (note) {
        note.textContent = data.coachNote || defaultData.coachNote;
    }

    const signature = document.querySelector(".dashboard-note-signature");
    if (signature) {
        signature.textContent = `– ${data.coachName || defaultData.coachName}`;
    }

    renderReadiness(data);
    renderSimpleList("strengths-list", (data.strengths && data.strengths.length) ? data.strengths : defaultData.strengths);
    renderSimpleList("weaknesses-list", (data.weaknesses && data.weaknesses.length) ? data.weaknesses : defaultData.weaknesses);
    renderGoals((data.goals && data.goals.length) ? data.goals : defaultData.goals);
    renderActivity((data.activitySummary && data.activitySummary.length) ? data.activitySummary : defaultData.activitySummary);
    renderEvents((data.events && data.events.length) ? data.events : defaultData.events);
    renderFeedback((data.feedback && data.feedback.length) ? data.feedback : defaultData.feedback);
}

function initSidebarNavigation() {
    const navItems = Array.from(document.querySelectorAll(".dashboard-sidebar__nav li"));
    if (!navItems.length) {
        return;
    }

    navItems.forEach((item) => {
        item.setAttribute("role", "button");
        item.setAttribute("tabindex", "0");

        item.addEventListener("click", () => {
            navItems.forEach((navItem) => navItem.classList.remove("is-active"));
            item.classList.add("is-active");
        });

        item.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                item.click();
            }
        });
    });
}

function initDashboard() {
    const currentUser = getCurrentUser();
    const dashboardData = getDashboardForUser(currentUser);
    renderDashboard({ ...defaultData, ...dashboardData });
    initSidebarNavigation();
}

initDashboard();
