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
        if (data.experience) {
            renderExperience(data.experience);
        }
        if (data.location) {
            renderLocation(data.location);
        }
        if (data.gallery) {
            renderGallery(data.gallery);
        }
        renderSocials(data.socials);
        initModal();
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



function renderGallery(images) {
    const container = document.getElementById('gallery-container');
    container.innerHTML = ''; // Clear existing

    // 0. Add Title
    const title = document.createElement('h2');
    title.textContent = 'TRABAJOS RECIENTES';
    title.className = 'section-title';
    container.appendChild(title);

    // 1. Create Wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'gallery-slider-wrapper';

    // 2. Create Slider
    const slider = document.createElement('div');
    slider.className = 'gallery-slider';

    const fragment = document.createDocumentFragment();

    images.forEach((imgUrl, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.style.cursor = 'pointer';
        item.style.animationDelay = `${index * 150}ms`;
        item.innerHTML = `<img src="${imgUrl}" alt="Gallery Image" loading="lazy">`;

        item.addEventListener('click', () => {
            showImageModal({ image: imgUrl, description: '' });
        });

        fragment.appendChild(item);
    });

    slider.appendChild(fragment);
    wrapper.appendChild(slider);

    // 3. Create Arrows
    const leftArrow = document.createElement('div');
    leftArrow.className = 'gallery-arrow gallery-arrow-left';
    leftArrow.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';

    const rightArrow = document.createElement('div');
    rightArrow.className = 'gallery-arrow gallery-arrow-right';
    rightArrow.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';

    container.appendChild(leftArrow);
    container.appendChild(wrapper);
    container.appendChild(rightArrow);

    // 4. Slider Logic
    let currentIndex = 0;
    const totalSlides = images.length;

    function updateSlider() {
        slider.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSlider();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateSlider();
    }

    rightArrow.addEventListener('click', () => {
        nextSlide();
        resetAutoScroll();
    });

    leftArrow.addEventListener('click', () => {
        prevSlide();
        resetAutoScroll();
    });

    // Auto-scroll
    let autoScrollInterval = setInterval(nextSlide, 5000);

    function resetAutoScroll() {
        clearInterval(autoScrollInterval);
        autoScrollInterval = setInterval(nextSlide, 5000);
    }

    // Touch Support
    let startX = 0;
    wrapper.addEventListener('touchstart', e => startX = e.touches[0].clientX);
    wrapper.addEventListener('touchend', e => {
        const endX = e.changedTouches[0].clientX;
        if (startX - endX > 50) nextSlide();
        else if (endX - startX > 50) prevSlide();
        resetAutoScroll();
    });
}


function renderSocials(socials) {
    const container = document.getElementById('socials-container');
    container.innerHTML = '';

    const fragment = document.createDocumentFragment();

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

        fragment.appendChild(a);
    });

    container.appendChild(fragment);
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

function renderExperience(experience) {
    const container = document.getElementById('experience-container');
    container.innerHTML = ''; // Clear existing

    // 1. Header (Collapsible toggle)
    const header = document.createElement('div');
    header.className = 'experience-header';
    header.innerHTML = `
        <h2>EXPERIENCIA</h2>
        <i class="fa-solid fa-chevron-down"></i>
    `;

    // 2. Content Wrapper (starts hidden)
    const content = document.createElement('div');
    content.className = 'experience-content';

    // Description
    const bioText = document.createElement('p');
    bioText.className = 'experience-description';
    bioText.textContent = experience.description;
    content.appendChild(bioText);

    // Highlights Bento Grid
    if (experience.highlights) {
        const bentoGrid = document.createElement('div');
        bentoGrid.className = 'experience-bento-grid';
        const bentoFragment = document.createDocumentFragment();

        experience.highlights.forEach((h, index) => {
            const item = document.createElement('div');
            item.className = `bento-item bento-item-${index + 1}`;
            item.innerHTML = `
                <img src="${h.image}" alt="Highlight" loading="lazy">
                <div class="bento-overlay">
                    <span class="highlight-text">${h.description}</span>
                </div>
            `;

            // Modal Interaction Logic
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                showImageModal(h);
            });

            bentoFragment.appendChild(item);
        });
        bentoGrid.appendChild(bentoFragment);
        content.appendChild(bentoGrid);
    }

    // Certificates Subsection Header
    const subTitle = document.createElement('h3');
    subTitle.className = 'experience-subtitle';
    subTitle.textContent = 'Certificaciones y Títulos';
    content.appendChild(subTitle);

    // Diplomas Carousel
    const carouselContainer = document.createElement('div');
    carouselContainer.className = 'diplomas-carousel-container';

    const track = document.createElement('div');
    track.className = 'diplomas-carousel-track';

    // Helper to create a diploma card
    const createCard = (diploma) => {
        const card = document.createElement('div');
        card.className = 'diploma-card';
        card.innerHTML = `<img src="${diploma.image}" alt="${diploma.title}" loading="lazy">`;

        card.addEventListener('click', () => {
            track.classList.add('paused');
            showImageModal(diploma, () => {
                track.classList.remove('paused');
            });
        });
        return card;
    };

    // Render original items and duplicate
    const trackFragment = document.createDocumentFragment();
    experience.diplomas.forEach(diploma => {
        trackFragment.appendChild(createCard(diploma));
    });
    experience.diplomas.forEach(diploma => {
        trackFragment.appendChild(createCard(diploma));
    });
    track.appendChild(trackFragment);

    carouselContainer.appendChild(track);
    content.appendChild(carouselContainer);

    container.appendChild(header);
    container.appendChild(content);

    // Toggle Logic
    header.addEventListener('click', () => {
        container.classList.toggle('active');
    });
}

function initModal() {
    if (!document.getElementById('diploma-modal')) {
        const modal = document.createElement('div');
        modal.id = 'diploma-modal';
        modal.innerHTML = `
            <div class="modal-content-wrapper">
                <span class="close-modal">&times;</span>
                <img id="modal-img" src="" alt="Modal Image">
                <div class="modal-info">
                    <div id="modal-title" class="modal-title"></div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.classList.remove('active');
            if (modal.onClose) modal.onClose();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                if (modal.onClose) modal.onClose();
            }
        });
    }
}

function showImageModal(data, onClose) {
    const modal = document.getElementById('diploma-modal');
    if (!modal) return;

    const img = document.getElementById('modal-img');
    const title = document.getElementById('modal-title');

    img.src = data.image;
    title.textContent = data.description || '';

    // Hide title if no description
    if (!data.description) {
        title.style.display = 'none';
    } else {
        title.style.display = 'block';
    }

    modal.onClose = onClose;
    modal.classList.add('active');
}

function renderLocation(location) {
    const container = document.getElementById('location-container');
    container.innerHTML = ''; // Clear existing

    // 1. Header and Maps Link
    const sectionTitle = document.createElement('h2');
    sectionTitle.textContent = 'UBICACIÓN';
    container.appendChild(sectionTitle);

    const mapsA = document.createElement('a');
    mapsA.href = location.maps_url;
    mapsA.className = 'maps-button';
    mapsA.target = '_blank';
    mapsA.rel = 'noopener noreferrer';
    mapsA.innerHTML = '<i class="fa-solid fa-location-dot"></i> Ver en Google Maps';
    container.appendChild(mapsA);

    // 2. Slider Container
    const sliderContainer = document.createElement('div');
    sliderContainer.className = 'location-slider-container';

    const slider = document.createElement('div');
    slider.className = 'location-slider';

    // To make it feel "infinite" easily, we'll double the items
    const doubleImages = [...location.images, ...location.images];
    const locationFragment = document.createDocumentFragment();

    doubleImages.forEach((imgUrl, index) => {
        const card = document.createElement('div');
        card.className = 'location-card';
        card.style.cursor = 'pointer';
        card.style.animationDelay = `${index * 100}ms`; // Stagger effect
        card.innerHTML = `<img src="${imgUrl}" alt="Local ${index + 1}" loading="lazy">`;

        card.addEventListener('click', () => {
            showImageModal({ image: imgUrl, description: '' });
        });

        locationFragment.appendChild(card);
    });

    slider.appendChild(locationFragment);
    sliderContainer.appendChild(slider);
    container.appendChild(sliderContainer);

    // 4. Slider Logic
    let currentIndex = 0;
    const totalSlides = location.images.length;

    const updateSlider = () => {
        const card = slider.querySelector('.location-card');
        if (!card) return;
        const cardWidth = card.offsetWidth;
        const gap = 24; // 1.5rem
        const moveAmount = currentIndex * (cardWidth + gap);
        slider.style.transform = `translateX(-${moveAmount}px)`;
    };

    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSlider();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateSlider();
    }

    let autoScrollInterval = setInterval(nextSlide, 4000);

    function resetAutoScroll() {
        clearInterval(autoScrollInterval);
        autoScrollInterval = setInterval(nextSlide, 4000);
    }

    // Touch Support
    let startX = 0;
    sliderContainer.addEventListener('touchstart', e => {
        startX = e.touches[0].clientX;
        clearInterval(autoScrollInterval);
    });

    sliderContainer.addEventListener('touchend', e => {
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        if (Math.abs(diff) > 30) {
            if (diff > 0) nextSlide();
            else prevSlide();
        }
        resetAutoScroll();
    });

    // Interaction Support
    slider.addEventListener('mouseenter', () => clearInterval(autoScrollInterval));
    slider.addEventListener('mouseleave', () => resetAutoScroll());
}

