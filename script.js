// Default data for the dashboard. Loaded if no data is stored in localStorage.
const defaultData = {
    name: "John Doe",
    belt: "Yellow Belt",
    photo: "dashboard-athlete-reference.png",
    strengths: ["Kicking Power", "Focus", "Respect"],
    weaknesses: ["Flexibility", "Patience"],
    goals: ["Learn advanced kicks", "Improve focus", "Earn Orange Belt"],
    coachNote: "John has shown great improvement this season. Keep pushing!",
    readiness: 85,
    bars: [
        { label: "Self‑Defense", value: 70 },
        { label: "Respect", value: 90 },
        { label: "Focus", value: 60 },
        { label: "Conditioning", value: 80 }
    ],
    activities: [
        { icon: "fa-hand-fist", color: "#00a86b", label: "Self-Defense", value: 10 },
        { icon: "fa-star", color: "#e0b60a", label: "Earned Points", value: 3 },
        { icon: "fa-bolt", color: "#d9534f", label: "Consecutive Strikes", value: 42 }
    ],
    events: [
        { date: "2026-06-15", name: "Belt Test: Orange Belt", location: "Dojo Main Hall" },
        { date: "2026-07-01", name: "City Tournament", location: "Durban Arena" },
        { date: "2026-07-15", name: "Summer Camp", location: "Training Grounds" }
    ],
    feedback: [
        { name: "Coach", comment: "Excellent progress.", rating: 5 },
        { name: "Parent", comment: "John loves the classes!", rating: 4 }
    ]
};

// Load data from localStorage or use default
function loadData() {
    const stored = localStorage.getItem('dojoData');
    return stored ? JSON.parse(stored) : defaultData;
}

// Update DOM elements with data
function renderDashboard(data) {
    // Child details
    // If a user is logged in (currentUser), override the name with the logged-in username
    const currentUser = localStorage.getItem('currentUser');
    const displayName = currentUser && currentUser.length > 0 ? currentUser : data.name;
    document.getElementById('child-name').textContent = displayName;
    document.getElementById('child-belt').textContent = data.belt;
    const photo = document.getElementById('child-photo');
    photo.src = data.photo;

    // Strengths
    const strengthsList = document.getElementById('strengths-list');
    strengthsList.innerHTML = '';
    data.strengths.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        strengthsList.appendChild(li);
    });

    // Weaknesses (Areas to Improve)
    const weaknessesList = document.getElementById('weaknesses-list');
    weaknessesList.innerHTML = '';
    data.weaknesses.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        weaknessesList.appendChild(li);
    });

    // Goals
    const goalsList = document.getElementById('goals-list');
    goalsList.innerHTML = '';
    data.goals.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        goalsList.appendChild(li);
    });

    // Coach note
    document.getElementById('coach-note').textContent = data.coachNote;

    // Readiness circle
    const readinessValue = document.getElementById('readiness-value');
    readinessValue.textContent = `${data.readiness}%`;
    const circle = document.getElementById('readiness-circle');
    circle.style.background = `conic-gradient(#e0b60a 0% ${data.readiness}%, #333 ${data.readiness}% 100%)`;

    // Bars
    const barsContainer = document.getElementById('bars-container');
    barsContainer.innerHTML = '';
    data.bars.forEach(bar => {
        const barDiv = document.createElement('div');
        barDiv.classList.add('bar');
        const label = document.createElement('div');
        label.classList.add('bar-label');
        label.textContent = bar.label;
        const track = document.createElement('div');
        track.classList.add('bar-track');
        const fill = document.createElement('div');
        fill.classList.add('bar-fill');
        fill.style.width = `${bar.value}%`;
        track.appendChild(fill);
        barDiv.appendChild(label);
        barDiv.appendChild(track);
        barsContainer.appendChild(barDiv);
    });

    // Activities
    const activitiesContainer = document.getElementById('activities-container');
    activitiesContainer.innerHTML = '';
    data.activities.forEach(item => {
        const wrapper = document.createElement('div');
        wrapper.classList.add('activity-item');
        const icon = document.createElement('i');
        icon.className = `fa-solid ${item.icon}`;
        icon.style.color = item.color;
        wrapper.appendChild(icon);
        const text = document.createElement('span');
        text.textContent = item.label;
        wrapper.appendChild(text);
        const value = document.createElement('span');
        value.classList.add('value');
        value.textContent = item.value;
        wrapper.appendChild(value);
        activitiesContainer.appendChild(wrapper);
    });

    // Events
    const eventsList = document.getElementById('events-list');
    eventsList.innerHTML = '';
    data.events.forEach(ev => {
        const li = document.createElement('li');
        const dateSpan = document.createElement('span');
        dateSpan.classList.add('date');
        dateSpan.textContent = new Date(ev.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
        li.appendChild(dateSpan);
        const text = document.createElement('span');
        text.textContent = `${ev.name} – ${ev.location}`;
        li.appendChild(text);
        eventsList.appendChild(li);
    });

    // Feedback
    const feedbackList = document.getElementById('feedback-list');
    feedbackList.innerHTML = '';
    data.feedback.forEach(item => {
        const li = document.createElement('li');
        const name = document.createElement('span');
        name.classList.add('name');
        name.textContent = `${item.name}: `;
        const comment = document.createElement('span');
        comment.textContent = item.comment;
        li.appendChild(name);
        li.appendChild(comment);
        feedbackList.appendChild(li);
    });
}

// Initialize the dashboard on page load
document.addEventListener('DOMContentLoaded', () => {
    const data = loadData();
    renderDashboard(data);
});
