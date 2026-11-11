# Bandung Family Adventure

A premium dark-mode, mobile-first React + Vite travel dashboard for the Bandung family trip, **22–27 November 2026** (2 adults + Melissa, age 4). The visual direction follows the Gemini-inspired mockups: midnight navy surfaces, soft blue-violet gradients, glass-like cards, rounded controls and a dedicated Bandung suitcase app icon.

## Included

- **Overview:** trip summary, countdown, packing progress, spend-to-date, flight and stay snapshots, booking status and next decisions.
- **Itinerary:** six editable days, activities and meal stops, pacing notes, add/remove items and day navigation.
- **Travel:** editable Scoot and Garuda flight details, Whoosh planning notes, both accommodation bookings, driver quote and daily transport notes.
- **Budget:** S$1,200 editable on-ground working budget, cash / YouTrip allocation, SGD–IDR converter, indicative exchange-rate refresh, category budgets and expense log.
- **Packing:** interactive family packing checklist with progress tracking.
- **Bookings:** dedicated reservation and arrangement checklist with editable statuses and custom entries.
- **Saved ideas:** attraction and food bank; add an idea directly to a selected itinerary day.
- **Settings:** dark / light / system appearance, explicit save, local autosave, JSON export/import, share, session undo/redo and reset.
- iPhone safe-area handling, responsive mobile layout, PWA manifest and offline app-shell caching.

## Trip data preloaded

- Scoot outbound: Singapore → Jakarta, 22 Nov 2026, **07:55–08:50**.
- Garuda Indonesia return: Jakarta → Singapore, 27 Nov 2026, **18:45–21:45**.
- Bobocabin Signature Sukawana: **22–24 Nov** (2 nights).
- voco Bandung Setiabudi: **24–27 Nov** (3 nights).
- Whoosh Business Class is intended, but ticket purchase and timings remain subject to availability / confirmation.
- Latest discussed driver quote: **Rp650,000/day**; driver and vehicle are not confirmed.
- Kawah Putih / Ciwidey is deliberately marked as optional, not a fixed commitment.

Unknown flight numbers and booking references are left blank rather than invented. The SGD/IDR rate is an editable planning estimate, not a guaranteed transaction rate.

## Run locally

Requires Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

The production site is generated in `dist/`.

## Deploy to a new GitHub repository

Suggested repository name: **`bandung-family-adventure`**.

1. Create a new empty repository on GitHub with that name.
2. Extract this ZIP and upload the **contents** of the extracted folder to the repository root. Keep `src`, `public`, `assets` and `.github/workflows` intact.
3. In GitHub, open **Settings → Pages** and select **GitHub Actions** as the deployment source.
4. Push / commit the files to the `main` branch. The included workflow installs dependencies, builds the Vite app and deploys `dist/` automatically.
5. Your site URL will be `https://YOUR-USERNAME.github.io/bandung-family-adventure/`.
6. Open it in Safari on iPhone → Share → Add to Home Screen.

The Vite configuration uses relative asset paths, so the project works under a GitHub Pages repository subpath.

## Data and privacy

- Trip edits are stored in local browser storage on the device and browser where the app is used.
- The app does **not** currently sync changes between devices or store them in a cloud database.
- Use **Settings → Export backup** before changing phones or clearing Safari website data. Import the JSON backup to restore.
- The exchange-rate refresh requests an indicative public rate when online. Verify the actual YouTrip / card rate and fees before spending.
- Confirm airline, Whoosh, driver, venue, opening-hour, child-fare and payment details directly with providers before departure.

## Project structure

```text
bandung-family-adventure/
├── .github/workflows/deploy.yml
├── assets/bandung-dark-mode-master.png
├── public/ (PWA icons, manifest, service worker)
├── src/App.jsx
├── src/main.jsx
├── src/styles.css
├── index.html
├── package.json
└── vite.config.js
```
