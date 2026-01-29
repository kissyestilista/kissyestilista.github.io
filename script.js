document.addEventListener('DOMContentLoaded', () => {
    fetchData();
});

async function fetchData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error('Could not load data');
        }
        const data = await response.json();
        renderProfile(data.profile);
        renderLinks(data.links);
        renderSocials(data.socials);
        if (data.theme) {
            applyTheme(data.theme);
        }
    } catch (error) {
        console.error('Error loading data:', error);
        // Fallback or error message could go here
    }
}

function renderProfile(profile) {
    if (profile.name) {
        document.getElementById('name').textContent = profile.name;
        document.title = profile.name;
    }
    if (profile.description) {
        document.getElementById('description').textContent = profile.description;
    }
    if (profile.avatar) {
        const avatarImg = document.getElementById('avatar');
        avatarImg.src = profile.avatar;
        avatarImg.classList.remove('hidden');
    }
}

function renderLinks(links) {
    const container = document.getElementById('links-container');
    container.innerHTML = ''; // Clear existing

    links.forEach((link, index) => {
        const a = document.createElement('a');
        a.href = link.url;
        a.className = 'link-card';
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        
        // Stagger animation
        a.style.animationDelay = `${index * 100}ms`;

        const iconHtml = link.icon ? `<i class="${link.icon} link-icon"></i>` : '';
        
        a.innerHTML = `
            <div class="link-content">
                ${iconHtml}
                <span class="link-title">${link.title}</span>
            </div>
            <i class="fa-solid fa-chevron-right link-arrow"></i>
        `;
        
        container.appendChild(a);
    });
}

function renderSocials(socials) {
    const container = document.getElementById('socials-container');
    container.innerHTML = '';

    socials.forEach(social => {
        const a = document.createElement('a');
        a.href = social.url;
        a.className = 'social-link';
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.ariaLabel = social.platform;
        
        if (social.icon) {
            a.innerHTML = `<i class="${social.icon}"></i>`;
        }
        
        container.appendChild(a);
    });
}

function applyTheme(theme) {
    const root = document.documentElement;
    if (theme.accentColor) {
        root.style.setProperty('--accent', theme.accentColor);
    }
    if (theme.backgroundColor) {
        root.style.setProperty('--bg-color', theme.backgroundColor);
    }
    if (theme.textColor) {
        root.style.setProperty('--text-color', theme.textColor);
    }
}
