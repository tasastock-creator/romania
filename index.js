document.addEventListener("DOMContentLoaded", function () {
    const defaults = window.defaultSiteData || {};
    const mergeSiteData = typeof window.mergeSiteData === "function"
        ? window.mergeSiteData
        : function (data) { return data || defaults; };

    let siteData = defaults;
    try {
        const currentBuildVersion = defaults.buildVersion || "";
        const storedBuildVersion = localStorage.getItem("siteBuildVersion") || "";
        if (currentBuildVersion && storedBuildVersion !== currentBuildVersion) {
            localStorage.removeItem("siteData");
            localStorage.setItem("siteBuildVersion", currentBuildVersion);
        }

        const stored = localStorage.getItem("siteData");
        siteData = mergeSiteData(stored ? JSON.parse(stored) : null);
    } catch (error) {
        siteData = mergeSiteData(null);
    }

    document.title = siteData.pageTitle || document.title;

    renderHeader(siteData);
    renderHero(siteData.hero);
    renderPrograms(siteData.programs);
    renderAbout(siteData.about);
    renderBenefits(siteData.benefits);
    renderExpectations(siteData.expectations);
    renderQuote(siteData.quote);
    renderLogin(siteData.login);
    renderRoadmapIntro(siteData.roadmapSection);
    renderRoadmap(siteData.roadmap);
    renderFooter(siteData);
    setupMenuToggle();
});

function renderHeader(siteData) {
    const topBar = document.getElementById("top-bar-items");
    const mainNav = document.getElementById("main-nav");
    const headerSocials = document.getElementById("header-socials");

    document.getElementById("brand-logo").src = siteData.brand.logoImage;
    document.getElementById("brand-name").textContent = siteData.brand.name;
    document.getElementById("brand-tag").textContent = siteData.brand.tag;
    document.getElementById("header-login").textContent = siteData.headerLoginText || "Login";

    topBar.innerHTML = siteData.topBarMessages.map(function (item) {
        return `<span><i class="fa-solid ${item.icon}" aria-hidden="true"></i>${item.text}</span>`;
    }).join("");

    mainNav.innerHTML = siteData.navigation.map(function (item) {
        return `<a href="${item.href}">${item.label}</a>`;
    }).join("");

    headerSocials.innerHTML = (siteData.headerSocials || []).map(function (item) {
        return `
            <a href="${item.href}" aria-label="${item.label}" target="_blank" rel="noreferrer">
                <i class="fa-brands ${item.icon}" aria-hidden="true"></i>
            </a>
        `;
    }).join("");

    const searchInput = document.getElementById("top-bar-search-input");
    const searchButton = document.getElementById("top-bar-search-button");
    if (searchInput && siteData.searchPlaceholder) {
        searchInput.placeholder = siteData.searchPlaceholder;
    }
    if (searchButton && siteData.searchButtonLabel) {
        searchButton.setAttribute("aria-label", siteData.searchButtonLabel);
    }
}

function renderHero(hero) {
    const heroCopy = document.querySelector(".hero-copy");
    const heroBody = document.getElementById("hero-body");
    const readMoreButton = document.getElementById("hero-read-more");

    document.getElementById("hero-backdrop").style.backgroundImage =
        `linear-gradient(90deg, rgba(7, 7, 8, 0.9) 0%, rgba(7, 7, 8, 0.52) 52%, rgba(7, 7, 8, 0.88) 100%), url("${hero.image}")`;

    setText("hero-eyebrow", hero.eyebrow);
    document.getElementById("hero-title").innerHTML = hero.titleHtml || hero.title || "";
    setText("hero-subtitle", hero.subtitle);
    heroBody.innerHTML = hero.paragraphs.map(function (paragraph) {
        return `<p>${paragraph}</p>`;
    }).join("");

    const button = document.getElementById("hero-button");
    button.textContent = hero.buttonText;
    button.href = hero.buttonLink;

    heroCopy.classList.remove("hero-copy--expanded");
    if (readMoreButton) {
        const shouldShowToggle = Array.isArray(hero.paragraphs) && hero.paragraphs.length > 2;
        readMoreButton.hidden = !shouldShowToggle;
        readMoreButton.textContent = "Read more";
        readMoreButton.setAttribute("aria-expanded", "false");
    }
}

function renderPrograms(programs) {
    setText("programs-eyebrow", programs.eyebrow);
    setText("programs-title", programs.title);

    const cards = document.getElementById("program-cards");
    cards.innerHTML = programs.cards.map(function (card) {
        return `
            <article class="program-card">
                <div class="program-card__image" style="background-image:url('${card.image}')"></div>
                <div class="program-card__overlay">
                    <h3>${card.title}</h3>
                </div>
            </article>
        `;
    }).join("");
}

function renderAbout(about) {
    document.getElementById("about-image").src = about.image;
    setText("about-eyebrow", about.eyebrow);
    setText("about-title", about.title);
    setText("about-intro", about.intro);
    setText("about-label", about.label);
    document.getElementById("about-list").innerHTML = about.items.map(function (item) {
        return `<li>${item}</li>`;
    }).join("");
    setText("about-closing", about.closing);
}

function renderBenefits(benefits) {
    setText("benefits-eyebrow", benefits.eyebrow);
    setText("benefits-title", benefits.title);

    const cards = document.getElementById("benefit-cards");
    const detailCards = [
        {
            title: benefits.preparationTitle,
            description: "Competition planning and event readiness for the Road to Romania journey.",
            image: benefits.preparationImage,
            items: benefits.preparationItems
        },
        {
            title: benefits.campTitle,
            description: benefits.campDescription,
            image: benefits.campImage
        },
        {
            title: benefits.mentalTitle,
            description: benefits.mentalDescription,
            image: benefits.mentalImage,
            label: benefits.mentalLabel,
            items: benefits.mentalItems
        }
    ];

    const benefitCards = benefits.cards.concat(detailCards);

    cards.innerHTML = benefitCards.map(function (card) {
        const itemsHtml = Array.isArray(card.items) && card.items.length
            ? `<ul class="benefit-card__list">${card.items.map(function (item) { return `<li>${item}</li>`; }).join("")}</ul>`
            : "";
        const labelHtml = card.label ? `<p class="benefit-card__label">${card.label}</p>` : "";

        return `
            <article class="benefit-card">
                <div class="benefit-card__top">
                    <div class="benefit-card__media" style="background-image:url('${card.image || ""}')"></div>
                    <div class="benefit-card__content">
                        <h3>${card.title}</h3>
                        <p>${card.description || ""}</p>
                    </div>
                    <span class="benefit-card__icon"><i class="fa-solid fa-chevron-down" aria-hidden="true"></i></span>
                </div>
                ${labelHtml}
                ${itemsHtml}
            </article>
        `;
    }).join("");

    setText("prep-title", benefits.preparationTitle);
    setBackgroundImage("prep-image", benefits.preparationImage);
    document.getElementById("prep-list").innerHTML = benefits.preparationItems.map(function (item) {
        return `<li>${item}</li>`;
    }).join("");

    setText("camp-title", benefits.campTitle);
    setBackgroundImage("camp-image", benefits.campImage);
    setText("camp-description", benefits.campDescription);
    setText("mental-title", benefits.mentalTitle);
    setBackgroundImage("mental-image", benefits.mentalImage);
    setText("mental-description", benefits.mentalDescription);
    setText("mental-label", benefits.mentalLabel);
    document.getElementById("mental-list").innerHTML = benefits.mentalItems.map(function (item) {
        return `<li>${item}</li>`;
    }).join("");
}

function renderExpectations(expectations) {
    setBackgroundImage("parent-image", expectations.parentImage);
    setText("parent-eyebrow", expectations.parentEyebrow);
    setText("parent-title", expectations.parentTitle);
    setText("parent-intro", expectations.parentIntro);
    setText("parent-label", expectations.parentLabel);
    document.getElementById("parent-list").innerHTML = expectations.parentItems.map(function (item) {
        return `<li>${item}</li>`;
    }).join("");
    setText("parent-closing", expectations.parentClosing);

    setBackgroundImage("athlete-image", expectations.athleteImage);
    setText("athlete-eyebrow", expectations.athleteEyebrow);
    setText("athlete-title", expectations.athleteTitle);
    setText("athlete-intro", expectations.athleteIntro);
    setText("athlete-label", expectations.athleteLabel);
    document.getElementById("athlete-list").innerHTML = expectations.athleteItems.map(function (item) {
        return `<li>${item}</li>`;
    }).join("");
    setText("athlete-closing", expectations.athleteClosing);
}

function renderQuote(quote) {
    setText("quote-line-one", quote.lineOne);
    setText("quote-line-two", quote.lineTwo);
}

function renderLogin(login) {
    setText("login-eyebrow", login.eyebrow);
    setText("login-title", login.title);
    setText("login-description", login.description);
    const button = document.getElementById("login-button");
    button.textContent = login.buttonText;
    button.href = login.buttonLink;
}

function renderRoadmapIntro(roadmapSection) {
    setText("roadmap-eyebrow", roadmapSection.eyebrow);
    setText("roadmap-title", roadmapSection.title);
}

function renderRoadmap(roadmap) {
    document.getElementById("poster-backdrop").style.backgroundImage = `url("${roadmap.backgroundImage}")`;

    const brandLockup = document.getElementById("brand-lockup");
    brandLockup.innerHTML = `
        <img class="brand-lockup__logo" src="${roadmap.brand.logoImage}" alt="${roadmap.brand.name}">
        <div class="brand-lockup__text">
            <span class="brand-lockup__name">${roadmap.brand.name}</span>
            <span class="brand-lockup__tag">${roadmap.brand.tag}</span>
        </div>
    `;

    setText("poster-pretitle", roadmap.hero.pretitle);
    setText("poster-title", roadmap.hero.title);
    setText("poster-subtitle", roadmap.hero.subtitle);
    setText("poster-highlight", roadmap.hero.highlight);

    const heroFlag = document.getElementById("hero-flag");
    if (roadmap.hero.flagImage) {
        heroFlag.innerHTML = `<img src="${roadmap.hero.flagImage}" alt="Flag">`;
    } else {
        heroFlag.innerHTML = `
            <span class="hero-flag__stripe hero-flag__stripe--blue"></span>
            <span class="hero-flag__stripe hero-flag__stripe--yellow"></span>
            <span class="hero-flag__stripe hero-flag__stripe--red"></span>
        `;
    }

    const heroMantra = document.getElementById("hero-mantra");
    heroMantra.innerHTML = roadmap.hero.mantraLines.map(function (line, index) {
        const className = index === roadmap.hero.highlightedMantraIndex
            ? "hero-mantra__line hero-mantra__line--accent"
            : "hero-mantra__line";
        return `<span class="${className}">${line}</span>`;
    }).join("");

    renderMarkers(roadmap.phases);
    renderPhases(roadmap.phases);
    renderValues(roadmap.values);
    setText("poster-note", roadmap.note);
}

function renderMarkers(phases) {
    const markers = document.getElementById("timeline-markers");
    markers.innerHTML = phases.map(function (phase) {
        return `
            <div class="timeline-marker" style="--accent:${phase.accent}">
                <div class="timeline-marker__orb">
                    ${phase.markerImage
                        ? `<img src="${phase.markerImage}" alt="${phase.title}">`
                        : `<i class="fa-solid ${phase.icon}" aria-hidden="true"></i>`}
                </div>
                <div class="timeline-marker__pin">${phase.number}</div>
                <div class="timeline-marker__badge">${phase.badge}</div>
            </div>
        `;
    }).join("");
}

function renderPhases(phases) {
    const phaseGrid = document.getElementById("phase-grid");
    phaseGrid.innerHTML = phases.map(function (phase) {
        const eventsHtml = (phase.events || []).map(function (event) {
            return `
                <div class="phase-card__event">
                    <span class="phase-card__event-date">${event.date}</span>
                    <strong class="phase-card__event-title">${event.title}</strong>
                </div>
            `;
        }).join("");

        const highlightsHtml = (phase.highlights || []).map(function (line) {
            return `<strong class="phase-card__highlight">${line}</strong>`;
        }).join("");

        const bulletsHtml = (phase.bullets || []).length
            ? `<ul class="phase-card__bullets">${phase.bullets.map(function (bullet) {
                return `<li>${bullet}</li>`;
            }).join("")}</ul>`
            : "";

        return `
            <article class="phase-card" style="--accent:${phase.accent}">
                <div class="phase-card__banner">${phase.badge}</div>
                <h4 class="phase-card__title">${phase.title}</h4>
                <p class="phase-card__date">
                    <i class="fa-regular fa-calendar-days" aria-hidden="true"></i>
                    <span>${phase.date}</span>
                </p>
                ${phase.leadText ? `<p class="phase-card__lead">${phase.leadText}</p>` : ""}
                ${eventsHtml}
                ${highlightsHtml ? `<div class="phase-card__highlights">${highlightsHtml}</div>` : ""}
                ${bulletsHtml}
                <div class="phase-card__tagline">${phase.tagline}</div>
            </article>
        `;
    }).join("");
}

function renderValues(values) {
    const valuesBar = document.getElementById("values-bar");
    valuesBar.innerHTML = values.map(function (value) {
        return `
            <div class="value-card">
                <span class="value-card__icon">
                    ${value.image
                        ? `<img class="value-card__image" src="${value.image}" alt="${value.title}">`
                        : `<i class="fa-solid ${value.icon}" aria-hidden="true"></i>`}
                </span>
                <div class="value-card__copy">
                    <strong>${value.title}</strong>
                    <span>${value.description}</span>
                </div>
            </div>
        `;
    }).join("");
}

function renderFooter(siteData) {
    document.getElementById("footer-logo").src = siteData.brand.logoImage;
    document.getElementById("footer-brand-name").textContent = siteData.brand.name;
    document.getElementById("footer-brand-tag").textContent = siteData.brand.tag;
    document.getElementById("footer-copy").textContent = siteData.footer.copy;
    document.getElementById("footer-nav").innerHTML = siteData.navigation.map(function (item) {
        return `<a href="${item.href}">${item.label}</a>`;
    }).join("");
}

function setupMenuToggle() {
    const toggle = document.getElementById("menu-toggle");
    const nav = document.getElementById("main-nav");
    const searchForm = document.getElementById("top-bar-search");
    const heroReadMoreButton = document.getElementById("hero-read-more");
    const heroCopy = document.querySelector(".hero-copy");

    if (searchForm) {
        searchForm.addEventListener("submit", function (event) {
            event.preventDefault();
        });
    }

    toggle.addEventListener("click", function () {
        const isOpen = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.addEventListener("click", function (event) {
        if (event.target.tagName === "A") {
            nav.classList.remove("is-open");
            toggle.setAttribute("aria-expanded", "false");
        }
    });

    if (heroReadMoreButton && heroCopy) {
        heroReadMoreButton.addEventListener("click", function () {
            const isExpanded = heroCopy.classList.toggle("hero-copy--expanded");
            heroReadMoreButton.textContent = isExpanded ? "Show less" : "Read more";
            heroReadMoreButton.setAttribute("aria-expanded", String(isExpanded));
        });
    }
}

function setText(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value || "";
    }
}

function setBackgroundImage(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.style.backgroundImage = value ? `url("${value}")` : "";
    }
}
