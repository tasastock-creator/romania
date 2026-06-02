(function () {
    const defaultSiteData = {
        schemaVersion: "combined-home-v5",
        buildVersion: "2026-05-21-header-horizontal-sunset-light-v14",
        pageTitle: "LionMode Elite | Road to Romania",
        topBarMessages: [
            { icon: "fa-mobile-screen-button", text: "1-555-644-5566" },
            { icon: "fa-location-dot", text: "Studio City, CA 91604" }
        ],
        searchPlaceholder: "Search ...",
        searchButtonLabel: "Search the site",
        brand: {
            logoImage: "home__lionmode-logo.webp",
            name: "LionMode Elite",
            tag: "Road to Romania"
        },
        headerLoginText: "Login",
        headerSocials: [
            { label: "Facebook", icon: "fa-facebook-f", href: "#" },
            { label: "Twitter", icon: "fa-twitter", href: "#" },
            { label: "Google", icon: "fa-google-plus-g", href: "#" },
            { label: "Instagram", icon: "fa-instagram", href: "#" }
        ],
        navigation: [
            { label: "About Us", href: "#lionmode" },
            { label: "Classes", href: "#benefits" },
            { label: "Instructors", href: "#expectations" },
            { label: "Schedule", href: "#roadmap" },
            { label: "Blog", href: "#login" },
            { label: "Contacts", href: "#footer" }
        ],
        hero: {
            eyebrow: "Road to Romania",
            titleHtml: 'Welcome to <span class="hero-title__accent">LionMode Elite</span>',
            subtitle: "Welcome to the journey",
            paragraphs: [
                "Welcome to the official LionMode Elite: Road to Romania athlete development platform.",
                "This program has been designed for dedicated athletes and families who are committed to competing at the highest level and preparing for the 2026 World Championships in Romania.",
                "Through this platform, parents and athletes will be able to track progress, view training schedules, monitor attendance, receive coach feedback, complete at-home programs, and follow the athlete’s journey leading up to the World Championships.",
                "At LionMode, we believe that world-class athletes are built through discipline, consistency, accountability, teamwork, and character development.",
                "This is more than karate.",
                "This is a journey towards excellence."
            ],
            buttonText: "Get Started Training Today",
            buttonLink: "login.html",
            image: "homepage-stock__hero-main.jpg"
        },
        programs: {
            eyebrow: "What Is LionMode Elite?",
            title: "The program combines:",
            cards: [
                {
                    title: "Elite karate coaching",
                    image: "homepage-stock__program-1.jpg",
                    imagePosition: "center center"
                },
                {
                    title: "Kata development",
                    image: "homepage-stock__program-2.jpg",
                    imagePosition: "center center"
                },
                {
                    title: "Kumite development",
                    image: "homepage-stock__program-3.jpg",
                    imagePosition: "center center"
                },
                {
                    title: "Strength & conditioning",
                    image: "homepage-stock__program-4.jpg",
                    imagePosition: "center center"
                }
            ]
        },
        about: {
            eyebrow: "What Is LionMode Elite?",
            title: "High-performance athlete development",
            intro: "LionMode Elite is a high-performance athlete development program focused on preparing selected athletes for national and international competition.",
            label: "The program combines:",
            items: [
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
            closing: "The goal is to develop complete martial artists both on and off the mat.",
            image: "homepage-stock__about-main.jpg"
        },
        benefits: {
            eyebrow: "What athletes will receive",
            title: "Athlete Benefits",
            cards: [
                {
                    title: "Weekly Elite Squad Sessions",
                    description: "Specialized technical and tactical training sessions focused on international-level performance.",
                    image: "homepage-stock__benefit-1.jpg",
                    imagePosition: "center center"
                },
                {
                    title: "Personal Training Sessions",
                    description: "Private or small group sessions tailored to each athlete’s individual needs.",
                    image: "homepage-stock__benefit-2.jpg",
                    imagePosition: "center center"
                },
                {
                    title: "Athlete Tracking Dashboard",
                    description: "Athletes and parents will be able to monitor:",
                    image: "homepage-stock__benefit-3.jpg",
                    imagePosition: "center center",
                    items: [
                        "Attendance",
                        "Fitness progress",
                        "Coach feedback",
                        "Tournament performance",
                        "Home program completion",
                        "Video submissions",
                        "Competition preparation"
                    ]
                }
            ],
            preparationTitle: "Athletes will be prepared for:",
            preparationItems: [
                "Dolphin League",
                "MASA Tournament",
                "International preparation events",
                "WUKF World Championships Romania 2026"
            ],
            preparationImage: "homepage-stock__benefit-4.jpg",
            campTitle: "Winter Elite Camp",
            campImage: "homepage-stock__benefit-5.jpg",
            campDescription: "A compulsory high-performance training camp designed to accelerate athlete development and team unity.",
            mentalTitle: "Mental Performance Support",
            mentalImage: "homepage-stock__benefit-6.jpg",
            mentalDescription: "Session with our in house psychologist",
            mentalLabel: "Athletes will work on:",
            mentalItems: [
                "Confidence",
                "Focus",
                "Emotional control",
                "Competition mindset",
                "Pressure management",
                "Managing stress"
            ]
        },
        expectations: {
            parentImage: "homepage-stock__expect-parent.jpg",
            parentEyebrow: "Parent Partnership",
            parentTitle: "Parent Expectations",
            parentIntro: "Parents play a vital role in athlete success.",
            parentLabel: "We ask parents to:",
            parentItems: [
                "Support athlete routines",
                "Encourage consistency",
                "Ensure attendance",
                "Assist with video logs",
                "Maintain positive communication",
                "Trust the coaching process"
            ],
            parentClosing: "We are building a team culture focused on long-term growth and development.",
            athleteImage: "homepage-stock__expect-athlete.jpg",
            athleteEyebrow: "Athlete Standards & Expectations",
            athleteTitle: "Athlete Expectations",
            athleteIntro: "Athletes accepted into LionMode Elite are expected to:",
            athleteLabel: "Excellence requires commitment:",
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
            athleteClosing: "Excellence requires consistency."
        },
        quote: {
            lineOne: "This is more than karate.",
            lineTwo: "This is a journey towards excellence."
        },
        login: {
            eyebrow: "Student access",
            title: "Login into your Profile",
            description: "Through this platform, parents and athletes will be able to track progress, view training schedules, monitor attendance, receive coach feedback, complete at-home programs, and follow the athlete’s journey leading up to the World Championships.",
            buttonText: "Open Login Page",
            buttonLink: "login.html"
        },
        roadmapSection: {
            eyebrow: "Roadmap to Romania 2026",
            title: "The journey. The process. The destination."
        },
        roadmap: {
            backgroundImage: "homepage-stock__roadmap-bg.jpg",
            brand: {
                logoImage: "home__lionmode-logo.webp",
                name: "LionMode",
                tag: "Elite"
            },
            hero: {
                pretitle: "Roadmap to",
                title: "Romania 2026",
                subtitle: "The journey. The process. The destination.",
                highlight: "Together we become elite",
                flagImage: "",
                mantraLines: [
                    "One team.",
                    "One mission.",
                    "One championship."
                ],
                highlightedMantraIndex: 2
            },
            phases: [
                {
                    number: "1",
                    badge: "Phase 1",
                    title: "Development Phase",
                    date: "April - May 2025",
                    icon: "fa-dumbbell",
                    markerImage: "",
                    accent: "#d9a436",
                    bullets: [
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
                    number: "2",
                    badge: "Phase 2",
                    title: "Competition Phase",
                    date: "June 2025",
                    icon: "fa-people-group",
                    markerImage: "",
                    accent: "#2b7de0",
                    events: [
                        {
                            date: "06 June 2025",
                            title: "Dolphin League"
                        },
                        {
                            date: "26 - 28 June 2025",
                            title: "MASA Tournament"
                        }
                    ],
                    bullets: [
                        "Tournament experience",
                        "Strategy development",
                        "Performance reviews",
                        "Ranking progression"
                    ],
                    tagline: "Test our skills. Gain experience."
                },
                {
                    number: "3",
                    badge: "Phase 3",
                    title: "Elite Camp Phase",
                    date: "3 - 6 July 2025",
                    icon: "fa-mountain-sun",
                    markerImage: "",
                    accent: "#7db94a",
                    leadText: "Winter Elite Camp",
                    bullets: [
                        "High performance training",
                        "Team building",
                        "Advanced techniques",
                        "Fitness & conditioning",
                        "Mental toughness",
                        "Strategy & simulation"
                    ],
                    tagline: "Train together. Grow together."
                },
                {
                    number: "4",
                    badge: "Phase 4",
                    title: "Final Preparation",
                    date: "7 - 18 July 2025",
                    icon: "fa-bullseye",
                    markerImage: "",
                    accent: "#a56aff",
                    bullets: [
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
                    number: "5",
                    badge: "Phase 5",
                    title: "Romania 2026",
                    date: "20 July 2026 onwards",
                    icon: "fa-trophy",
                    markerImage: "",
                    accent: "#ff5a43",
                    highlights: [
                        "WUKF World Championships",
                        "Romania 2026"
                    ],
                    bullets: [],
                    tagline: "Our destination. Our moment. Our legacy."
                }
            ],
            values: [
                {
                    icon: "fa-crown",
                    image: "",
                    title: "Discipline",
                    description: "Do it every day"
                },
                {
                    icon: "fa-shield-halved",
                    image: "",
                    title: "Consistency",
                    description: "Keep the standard"
                },
                {
                    icon: "fa-people-group",
                    image: "",
                    title: "Teamwork",
                    description: "We rise together"
                },
                {
                    icon: "fa-star",
                    image: "",
                    title: "Excellence",
                    description: "Be the best version"
                },
                {
                    icon: "fa-fire-flame-curved",
                    image: "",
                    title: "Legacy",
                    description: "Leave your mark"
                }
            ],
            note: "* Dates are subject to change. All information will be updated on the platform."
        },
        footer: {
            copy: "LionMode Elite Road to Romania athlete development platform."
        }
    };

    function mergeValues(baseValue, incomingValue) {
        if (Array.isArray(baseValue)) {
            return Array.isArray(incomingValue) ? incomingValue : baseValue;
        }

        if (baseValue && typeof baseValue === "object") {
            if (!incomingValue || typeof incomingValue !== "object" || Array.isArray(incomingValue)) {
                return { ...baseValue };
            }

            const mergedObject = {};
            Object.keys(baseValue).forEach(function (key) {
                mergedObject[key] = mergeValues(baseValue[key], incomingValue[key]);
            });

            Object.keys(incomingValue).forEach(function (key) {
                if (!(key in mergedObject)) {
                    mergedObject[key] = incomingValue[key];
                }
            });

            return mergedObject;
        }

        return typeof incomingValue === typeof baseValue ? incomingValue : baseValue;
    }

    window.defaultSiteData = defaultSiteData;
    window.mergeSiteData = function (incomingData) {
        if (!incomingData || incomingData.schemaVersion !== defaultSiteData.schemaVersion) {
            return mergeValues(defaultSiteData, {});
        }

        return mergeValues(defaultSiteData, incomingData);
    };
}());
