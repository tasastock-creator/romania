// Default landing content based on the original Tenex Funnel page.
const defaultLanding = {
    // Hero background image URL
    heroImage: "karate__hero-wide.jpg",
    introTitle: "WELCOME TO LIONMODE ELITE",
    introSubtitle: "ROAD TO ROMANIA",
    introHeading: "Welcome to the journey",
    introBody: "Welcome to the official LionMode Elite: Road to Romania athlete development platform. This program has been designed for dedicated athletes and families who are committed to competing at the highest level and preparing for the 2026 World Championships in Romania. Through this platform, parents and athletes will be able to track progress, view training schedules, monitor attendance, receive coach feedback, complete at-home programs, and follow the athlete’s journey leading up to the World Championships. At LionMode, we believe that world-class athletes are built through discipline, consistency, accountability, teamwork, and character development. This is more than karate. This is a journey towards excellence.",
    programTitle: "What Is LionMode Elite?",
    programBody: "LionMode Elite is a high-performance athlete development program focused on preparing selected athletes for national and international competition. The program combines:",
    programItems: [
        "Elite karate coaching",
        "Kata development",
        "Kumite development",
        "Strength & conditioning",
        "Mental preparation",
        "Tournament strategy",
        "Psychological performance",
        "Fitness testing",
        "Recovery & mobility",
        "At-home training systems",
        "Athlete accountability tracking"
    ],
    goalText: "The goal is to develop complete martial artists both on and off the mat.",
    benefitsTitle: "Athlete Benefits",
    benefitsItems: [
        "Weekly Elite Squad Sessions",
        "Specialized technical and tactical training sessions focused on international-level performance",
        "Personal Training Sessions: Private or small group sessions tailored to each athlete’s individual needs"
    ],
    trackingItems: [
        "Attendance",
        "Fitness progress",
        "Coach feedback",
        "Tournament performance",
        "Home program completion",
        "Video submissions",
        "Competition preparation"
    ],
    preparationEvents: [
        "Dolphin League",
        "MASA Tournament",
        "International preparation events",
        "WUKF World Championships Romania 2026"
    ],
    campDescription: "Winter Elite Camp: A compulsory high-performance training camp designed to accelerate athlete development and team unity.",
    mentalSupportTitle: "Mental Performance Support",
    // Additional description for mental performance section
    mentalSupportDescription: "Session with our in-house psychologist",
    mentalSupportItems: [
        "Confidence",
        "Focus",
        "Emotional control",
        "Competition mindset",
        "Pressure management",
        "Managing stress"
    ],
    parentTitle: "Parent Expectations",
    parentIntro: "Parent partnership. Parents play a vital role in athlete success.",
    parentItems: [
        "Support athlete routines",
        "Encourage consistency",
        "Ensure attendance",
        "Assist with video logs",
        "Maintain positive communication",
        "Trust the coaching process"
    ],
    parentClosing: "We are building a team culture focused on long-term growth and development.",
    athleteTitle: "Athlete Expectations",
    athleteIntro: "Athlete Standards & Expectations. Athletes accepted into LionMode Elite are expected to:",
    athleteItems: [
        "Maintain discipline and respect",
        "Attend training consistently",
        "Complete all home programs",
        "Submit weekly training/video logs",
        "Arrive prepared for sessions",
        "Maintain a positive attitude",
        "Represent LionMode professionally",
        "Commit fully to the journey"
    ],
    athleteClosing: "Excellence requires consistency.",
    roadmapTitle: "Roadmap to Romania 2026",
    phases: [
        {
            phaseTitle: "Phase 1 – Development (Apr–May 2025)",
            items: [
                "Foundation building",
                "Technical development",
                "Strength & conditioning",
                "Fitness testing",
                "Mindset & discipline",
                "Individual assessments"
            ],
            tagline: "Build the foundation. Create the habits."
        },
        {
            phaseTitle: "Phase 2 – Competition (June 2025)",
            items: [
                "Dolphin League (6 Jun 2025)",
                "MASA Tournament (26–28 Jun 2025)",
                "Tournament experience",
                "Strategy development",
                "Performance reviews",
                "Ranking progression"
            ],
            tagline: "Test our skills. Gain experience."
        },
        {
            phaseTitle: "Phase 3 – Elite Camp (3–6 Jul 2025)",
            items: [
                "Winter Elite Camp",
                "High performance training",
                "Team building",
                "Advanced techniques",
                "Fitness & conditioning",
                "Mental toughness",
                "Strategy & simulations"
            ],
            tagline: "Train together. Grow together."
        },
        {
            phaseTitle: "Phase 4 – Final Preparation (7–18 Jul 2025)",
            items: [
                "Competition sharpening",
                "Tactical refinement",
                "Weakness elimination",
                "Mental preparation",
                "Recovery & mobility",
                "Peaking for performance",
                "Final team preparation"
            ],
            tagline: "Refine. Focus. Prepare to peak."
        },
        {
            phaseTitle: "Phase 5 – Romania 2026 (20 Jul 2026 onwards)",
            items: ["WUKF World Championships Romania 2026"],
            tagline: "Our destination. Our moment. Our legacy."
        }
    ],
    roadmapFooters: [
        "Discipline: Do it every day",
        "Consistency: Keep the standard",
        "Teamwork: Be together",
        "Excellence: Be the best version",
        "Legacy: Leave your mark"
    ],
    loginTitle: "Login into your Profile",
    loginDescription: "Students, please enter your name and password to access your dashboard."
};

// Load landing content from localStorage or use default
function loadLandingData() {
    const stored = localStorage.getItem('landingData');
    return stored ? JSON.parse(stored) : defaultLanding;
}

// Render landing content on the page
function renderLanding(data) {
    // Hero / Intro
    document.getElementById('intro-title').textContent = data.introTitle;
    document.getElementById('intro-subtitle').textContent = data.introSubtitle;
    // intro heading removed; we keep for compatibility if exists
    const headingEl = document.getElementById('intro-heading');
    if (headingEl) headingEl.textContent = data.introHeading || '';
    document.getElementById('intro-body').textContent = data.introBody;
    // Set hero background image
    const hero = document.getElementById('hero-section');
    if (hero && data.heroImage) {
        hero.style.backgroundImage = `url(${data.heroImage})`;
    }
    // Program
    document.getElementById('program-title').textContent = data.programTitle;
    document.getElementById('program-body').textContent = data.programBody;
    const programList = document.getElementById('program-items');
    programList.innerHTML = '';
    data.programItems.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        programList.appendChild(li);
    });
    document.getElementById('goal-text').textContent = data.goalText;
    // Benefits
    document.getElementById('benefits-title').textContent = data.benefitsTitle;
    const benefitsList = document.getElementById('benefits-items');
    benefitsList.innerHTML = '';
    data.benefitsItems.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        benefitsList.appendChild(li);
    });
    const trackingList = document.getElementById('tracking-items');
    trackingList.innerHTML = '';
    data.trackingItems.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        trackingList.appendChild(li);
    });
    const prepList = document.getElementById('preparation-events');
    prepList.innerHTML = '';
    data.preparationEvents.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        prepList.appendChild(li);
    });
    document.getElementById('camp-description').textContent = data.campDescription;
    document.getElementById('mental-support-title').textContent = data.mentalSupportTitle;
    // set mental support description if available
    const mentalDescEl = document.getElementById('mental-support-description');
    mentalDescEl.textContent = data.mentalSupportDescription || '';
    const mentalList = document.getElementById('mental-support-items');
    mentalList.innerHTML = '';
    data.mentalSupportItems.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        mentalList.appendChild(li);
    });
    // Expectations: Parent
    document.getElementById('parent-title').textContent = data.parentTitle;
    document.getElementById('parent-intro').textContent = data.parentIntro;
    const parentList = document.getElementById('parent-items');
    parentList.innerHTML = '';
    data.parentItems.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        parentList.appendChild(li);
    });
    document.getElementById('parent-closing').textContent = data.parentClosing;
    // Expectations: Athlete
    document.getElementById('athlete-title').textContent = data.athleteTitle;
    document.getElementById('athlete-intro').textContent = data.athleteIntro;
    const athleteList = document.getElementById('athlete-items');
    athleteList.innerHTML = '';
    data.athleteItems.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        athleteList.appendChild(li);
    });
    document.getElementById('athlete-closing').textContent = data.athleteClosing;
    // Roadmap
    document.getElementById('roadmap-title').textContent = data.roadmapTitle;
    const phasesContainer = document.getElementById('phases-container');
    phasesContainer.innerHTML = '';
    data.phases.forEach(phase => {
        const div = document.createElement('div');
        div.classList.add('phase');
        const title = document.createElement('h3');
        title.textContent = phase.phaseTitle;
        div.appendChild(title);
        const list = document.createElement('ul');
        phase.items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            list.appendChild(li);
        });
        div.appendChild(list);
        const tagline = document.createElement('p');
        tagline.textContent = phase.tagline;
        tagline.style.fontStyle = 'italic';
        tagline.style.color = '#aaa';
        div.appendChild(tagline);
        phasesContainer.appendChild(div);
    });
    const footers = document.getElementById('roadmap-footers');
    footers.innerHTML = '';
    data.roadmapFooters.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        footers.appendChild(li);
    });
    // Login section
    document.getElementById('login-title').textContent = data.loginTitle;
    document.getElementById('login-description').textContent = data.loginDescription || '';
}

// Handle login

document.addEventListener('DOMContentLoaded', () => {
    const data = loadLandingData();
    renderLanding(data);
    // Login functionality has moved to login.html. No setup needed here.
});
