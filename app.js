const MAX_CATS = 9;
const galleryElement = document.getElementById('gallery');
const statusMessage = document.getElementById('statusMessage');
const fetchButton = document.getElementById('fetchButton');
const themeToggle = document.getElementById('themeToggle');

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

  const image = document.createElement('img');
  image.src = url;
  image.alt = 'A randomly fetched cat';
  image.loading = 'lazy';

  const meta = document.createElement('div');
  meta.className = 'card__meta';
  const timestamp = new Date().toLocaleTimeString();
  meta.innerHTML = `<span class="badge">New</span><span>${timestamp}</span>`;

  card.appendChild(image);
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
}

init();
