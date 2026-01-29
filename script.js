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
        if (data.gallery) {
            renderGallery(data.gallery);
        }
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



function renderGallery(images) {
    const container = document.getElementById('gallery-container');
    container.innerHTML = '';

    images.forEach(imgUrl => {
        const div = document.createElement('div');
        div.className = 'gallery-item';
        div.innerHTML = `<img src="${imgUrl}" alt="Gallery Image" loading="lazy">`;
        container.appendChild(div);
    });

    // Auto-scroll logic
    let scrollAmount = 0;
    const scrollStep = 1; // Speed
    const delay = 30; // 30ms

    let scrollInterval = setInterval(() => {
        if (container.scrollWidth - container.clientWidth <= container.scrollLeft + 1) {
            // Reset to start for infinite feel (simplistic approach)
            // Or bounce back? Let's just reset or stop. 
            // Ideally for carousel "infinite" we need cloned nodes, but simplistic auto-scroll usually just scrolls.
            // Let's make it bounce or reset. Resetting might be jarring.
            // Let's toggle direction or just reset smoothly.
            // Simple: Loop back to 0
            container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            container.scrollLeft += scrollStep;
        }
    }, delay);

    // Better Auto-scroll: Slide one item at a time every few seconds
    clearInterval(scrollInterval); // Clear the smooth one above, let's do a snap-based one

    let autoScroll = setInterval(() => {
        if (container.matches(':hover')) return; // Pause on hover (desktop)

        const itemWidth = container.querySelector('.gallery-item').offsetWidth;
        const gap = 16; // 1rem

        const maxScroll = container.scrollWidth - container.clientWidth;

        if (container.scrollLeft >= maxScroll - 10) {
            container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            container.scrollBy({ left: itemWidth + gap, behavior: 'smooth' });
        }
    }, 3000); // 3 seconds

    // Pause on interaction
    container.addEventListener('touchstart', () => clearInterval(autoScroll));
    // container.addEventListener('touchend', () => ... restart?); // simpler to just stop auto-scroll on interaction
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
        a.classList.add(`social-link-${social.platform.toLowerCase()}`);

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
