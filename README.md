# Random Cat Gallery

A tiny static page that fetches and shows random cats. It is intentionally minimal to demo Atlassian Jira + GitHub + CI/CD with GitHub Pages.

## Quick start

Open `index.html` directly in a browser. Click **Get a new cat** to fetch a random photo. Toggle the light/dark theme with the 🌗 button.

## Project structure

- `index.html` – Single-page UI with controls and gallery markup.
- `styles.css` – Minimal styling and light/dark theme tokens.
- `app.js` – Vanilla JS for fetching cats, updating the gallery, and toggling themes.
- `.github/workflows/deploy.yml` – GitHub Actions workflow that syntax-checks the JavaScript and deploys to GitHub Pages.

## Cat API Integration

The application fetches random cat photos from **[The Cat API](https://thecatapi.com)** using a smart two-stage approach:

### Two-Stage Fetch Process

**Stage 1: Thumbnail Fetch** (when clicking "Get a new cat")
- Endpoint: `https://api.thecatapi.com/v1/images/search?size=small&limit=1`
- Fetches small/thumbnail versions for fast gallery population
- Returns both image URL and unique cat ID for later use

**Stage 2: Full Resolution Fetch** (when clicking a cat image)
- Endpoint: `https://api.thecatapi.com/v1/images/{id}`
- Uses cat ID to fetch high-resolution version for lightbox viewing
- Progressive loading: shows thumbnail immediately, then replaces with full-res

### Performance Features

- **Smart Caching**: Full-res URLs cached to avoid duplicate API calls
- **Error Handling**: Graceful fallbacks with user-friendly error messages
- **Loading States**: Visual feedback during fetch operations
- **Gallery Limit**: Maximum of 9 cat pictures displayed (oldest automatically removed)
- **No API Key Required**: Uses free tier perfect for demos

## Deployment notes

The provided workflow publishes the static `public` directory to GitHub Pages when you push to `main`. Make sure GitHub Pages is set to use the **GitHub Actions** source in your repository settings.
