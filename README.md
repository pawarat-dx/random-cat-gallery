# Random Cat Gallery

A tiny static page that fetches and shows random cats. It is intentionally minimal to demo Atlassian Jira + GitHub + CI/CD with GitHub Pages.

## Quick start

Open `index.html` in a browser or serve the folder locally (e.g., `python -m http.server 8000`). Click **Get a new cat** to fetch a random photo. Toggle the light/dark theme with the 🌗 button.

## Project structure

- `index.html` – Single-page UI with controls and gallery markup.
- `styles.css` – Minimal styling and light/dark theme tokens.
- `app.js` – Vanilla JS for fetching cats, updating the gallery, and toggling themes.
- `.github/workflows/deploy.yml` – GitHub Actions workflow that syntax-checks the JavaScript and deploys to GitHub Pages.

## Using with Jira

Include Jira issue keys in your branches and commits so the GitHub for Jira app can connect activity back to issues:

- Branches: `feature/CAT-3-loading-state` or `bugfix/CAT-7-button-disabled`.
- Commits: `[CAT-3] Add loading indicator to cat gallery`.
- Pull requests: `[CAT-7] Fix button spacing on mobile`.

With this convention, Jira will automatically show related branches, commits, pull requests, and deployments on the issue once the GitHub for Jira app is installed in your site.

## Deployment notes

The provided workflow publishes the static `public` directory to GitHub Pages when you push to `main`. Make sure GitHub Pages is set to use the **GitHub Actions** source in your repository settings.
