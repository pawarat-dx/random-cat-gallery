const MAX_CATS = 9;
const galleryElement = document.getElementById('gallery');
const statusMessage = document.getElementById('statusMessage');
const fetchButton = document.getElementById('fetchButton');
const themeToggle = document.getElementById('themeToggle');
let lightboxElement;

function createLightbox() {
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';

  const backdrop = document.createElement('div');
  backdrop.className = 'lightbox__backdrop';
  lightbox.appendChild(backdrop);

  const content = document.createElement('div');
  content.className = 'lightbox__content';
  content.setAttribute('role', 'dialog');
  content.setAttribute('aria-modal', 'true');
  content.setAttribute('aria-label', 'Full-size cat photo');

  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.className = 'lightbox__close';
  closeButton.setAttribute('aria-label', 'Close');
  closeButton.innerHTML = '&times;';

  const image = document.createElement('img');
  image.className = 'lightbox__image';
  image.alt = 'Full-size cat';

  content.appendChild(closeButton);
  content.appendChild(image);
  lightbox.appendChild(content);

  document.body.appendChild(lightbox);
  return lightbox;
}

function getLightbox() {
  if (!lightboxElement) {
    lightboxElement = createLightbox();
  }
  return lightboxElement;
}

function openLightbox(url) {
  const lightbox = getLightbox();
  const image = lightbox.querySelector('.lightbox__image');
  image.src = url;
  lightbox.classList.add('is-visible');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!lightboxElement) return;
  lightboxElement.classList.remove('is-visible');
  document.body.style.overflow = '';
}

/**
 * Fetch a random cat image from The Cat API (no key required for this demo).
 * @returns {Promise<string>} URL of the cat image.
 */
async function fetchCatImage() {
  const endpoint = 'https://api.thecatapi.com/v1/images/search?size=small';
  const response = await fetch(endpoint);

  if (!response.ok) {
    throw new Error(`Cat API returned ${response.status}`);
  }

  const data = await response.json();
  if (!Array.isArray(data) || data.length === 0 || !data[0].url) {
    throw new Error('Unexpected API response');
  }

  return data[0].url;
}

/**
 * Add a new image card to the gallery and trim to the latest MAX_CATS.
 * @param {string} url - Image URL.
 */
function addCatToGallery(url) {
  const card = document.createElement('article');
  card.className = 'card';

  const button = document.createElement('button');
  button.className = 'card__trigger';
  button.type = 'button';
  button.dataset.fullImage = url;

  const image = document.createElement('img');
  image.src = url;
  image.alt = 'A randomly fetched cat';
  image.loading = 'lazy';
  button.appendChild(image);

  const meta = document.createElement('div');
  meta.className = 'card__meta';
  const timestamp = new Date().toLocaleTimeString();
  meta.innerHTML = `<span class="badge">New</span><span>${timestamp}</span>`;

  card.appendChild(button);
  card.appendChild(meta);

  galleryElement.prepend(card);

  // Trim gallery to the most recent items.
  while (galleryElement.children.length > MAX_CATS) {
    galleryElement.removeChild(galleryElement.lastElementChild);
  }
}

function showStatus(message, isError = false) {
  statusMessage.textContent = message;
  statusMessage.style.color = isError ? '#d1434b' : '';
}

async function handleFetchClick() {
  showStatus('Loading a new cat…');
  fetchButton.disabled = true;

  try {
    const catUrl = await fetchCatImage();
    addCatToGallery(catUrl);
    showStatus('Here is your cat! Want another?');
  } catch (error) {
    console.error('Failed to fetch cat', error);
    showStatus('Oops, something went wrong. Please try again.', true);
  } finally {
    fetchButton.disabled = false;
  }
}

function toggleTheme() {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('cat-theme', isDark ? 'dark' : 'light');
  themeToggle.querySelector('.theme-toggle__icon').textContent = isDark ? '🌙' : '🌞';
}

function restoreThemePreference() {
  const stored = localStorage.getItem('cat-theme');
  if (stored === 'dark') {
    document.body.classList.add('dark');
    themeToggle.querySelector('.theme-toggle__icon').textContent = '🌙';
  }
}

function init() {
  restoreThemePreference();
  fetchButton.addEventListener('click', handleFetchClick);
  themeToggle.addEventListener('click', toggleTheme);
  galleryElement.addEventListener('click', (event) => {
    const trigger = event.target.closest('.card__trigger');
    if (!trigger) return;
    const fullUrl = trigger.dataset.fullImage;
    openLightbox(fullUrl);
  });
  document.addEventListener('click', (event) => {
    if (!lightboxElement || !lightboxElement.classList.contains('is-visible')) return;
    const isBackdrop = event.target.classList.contains('lightbox__backdrop');
    const isCloseButton = event.target.classList.contains('lightbox__close');
    if (isBackdrop || isCloseButton) {
      closeLightbox();
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightboxElement?.classList.contains('is-visible')) {
      closeLightbox();
    }
  });
}

init();
