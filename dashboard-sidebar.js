(function () {
    const defaultSidebarTabs = [
        { label: 'Homepage', href: 'index.html', icon: 'fa-solid fa-house' },
        { label: 'Dashboard', href: 'dashboard.html', icon: 'fa-solid fa-house' },
        { label: 'Profile', href: 'profile.html', icon: 'fa-regular fa-user' },
        { label: 'Training Tracker', href: 'training-tracker.html', icon: 'fa-regular fa-calendar-check' },
        { label: 'Fitness Testing', href: 'fitness-testing.html', icon: 'fa-solid fa-crosshairs' },
        { label: 'Mental Performance', href: 'mental-performance.html', icon: 'fa-solid fa-shield-heart' },
        { label: 'At-Home Program', href: 'at-home-program.html', icon: 'fa-solid fa-box-open' },
        { label: 'Video Logs', href: 'video-logs.html', icon: 'fa-regular fa-circle-play' },
        { label: 'Tournament Prep', href: 'tournament-prep.html', icon: 'fa-solid fa-trophy' },
        { label: 'Winter Camp', href: 'winter-camp.html', icon: 'fa-solid fa-campground' },
        { label: 'Coach Feedback', href: 'coach-feedback.html', icon: 'fa-solid fa-comment-dots' }
    ];

    function parseSidebarConfig(value) {
        if (!value) return null;
        try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) return parsed;
        } catch (e) {
            // fall back to line parsing
        }
        return value.trim().split('\n').filter(Boolean).map(line => {
            const parts = line.split(',');
            const label = (parts[0] || '').trim();
            const href = (parts[1] || '').trim();
            const icon = (parts.slice(2).join(',') || '').trim() || 'fa-solid fa-circle';
            return { label, href: href || '#', icon };
        });
    }

    function getSiteData() {
        const siteData = localStorage.getItem('siteData');
        if (!siteData) return null;
        try {
            return JSON.parse(siteData);
        } catch (e) {
            return null;
        }
    }

    function getCurrentPageName() {
        const path = window.location.pathname.split('/').pop();
        return path || 'dashboard.html';
    }

    function normalizeHref(href) {
        if (!href) return '#';
        return href.trim();
    }

    function buildSidebar() {
        const nav = document.getElementById('dashboard-sidebar-nav');
        if (!nav) return;

        const siteData = getSiteData();
        const items = (siteData && Array.isArray(siteData.sidebarTabs) && siteData.sidebarTabs.length)
            ? siteData.sidebarTabs
            : defaultSidebarTabs;

        const currentPage = getCurrentPageName();
        nav.innerHTML = items.map(item => {
            const href = normalizeHref(item.href);
            const label = item.label || 'Link';
            const icon = item.icon || 'fa-solid fa-circle';
            const itemPage = href.split('/').pop();
            const isActive = itemPage === currentPage;
            return `<li${isActive ? ' class="is-active"' : ''}><a href="${href}"><i class="fa ${icon}" aria-hidden="true"></i><span>${label}</span></a></li>`;
        }).join('');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', buildSidebar);
    } else {
        buildSidebar();
    }
})();
