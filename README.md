# Cashbook Calculator

A mobile-first, offline-capable Progressive Web App for recording daily cash income and expenses. The calculator is the only functional screen. Transactions are stored locally in the browser using IndexedDB; CSV is the only export path.

## Technology

- React + Vite
- Native IndexedDB (no backend)
- Safe recursive-descent arithmetic parser (no `eval`)
- Service Worker + Web App Manifest
- CSV export using Blob and object URLs

## Local development

Requirements: Node.js 18.18+ (Node 20 LTS recommended) and npm.

```bash
npm install
npm run dev
```

Vite prints a local development URL. The service worker is registered only in production builds, so use the production preview to test PWA behaviour.

## Production build

```bash
npm run build
npm run preview
```

The production files are generated in `dist/`.

## Deploy to Vercel through GitHub

1. Create a new GitHub repository, for example `cashbook-calculator`.
2. Extract this project ZIP and push the project files (the contents of the folder) to the repository root.
3. In Vercel, choose **Add New → Project**, import the GitHub repository and authorize access.
4. Vercel should detect Vite automatically. Use:
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm install`
5. Deploy. Vercel provides HTTPS automatically.
6. Future pushes to the connected production branch trigger deployments.

`vercel.json` includes a root rewrite suitable for this single-screen app. The app uses root-relative asset paths, so deploy it at the domain root rather than a nested path.

## Install on Android

1. Open the deployed HTTPS URL in Chrome.
2. Allow the first load to finish while connected to the internet.
3. Open Chrome's menu and choose **Install app** or **Add to Home screen**.
4. Launch Cashbook from the home-screen icon.

On iPhone/iPad, open the URL in Safari, use Share, then **Add to Home Screen**. PWA installation and background behaviour vary by browser and OS.

## Offline behaviour

The service worker precaches the application shell and caches same-origin static assets as they are requested. After the first successful online load, the app shell and loaded build assets should be available offline. IndexedDB is independent of the service-worker cache and is never cached as a static file.

Each production build stamps a unique build ID into the service worker. When a new deployment is published, the browser detects the changed service worker, installs a new cache, and removes older shell caches on activation. Existing IndexedDB transactions are not changed by app updates. Close and reopen the app if the browser has not yet activated the new version.

## Recording transactions

1. Enter an amount using the keypad.
2. Check the LKR result.
3. Tap **SAVE INCOME** or **SAVE EXPENSE**.
4. The record is stored locally and the calculator clears only after the database confirms the write.

Only positive amounts are accepted. Monetary values are stored as integer cents (minor units).

## CSV export

Tap **EXPORT CSV** in the header. The file includes all transactions ordered by transaction ID, with timestamps and amounts formatted for spreadsheets. A UTF-8 BOM is included for compatibility with spreadsheet applications.

The export is a copy; it does not clear or modify local transaction storage. On some mobile browsers, the file may appear in Downloads or open in the browser's download manager.

## Data persistence and backup warning

Transactions are stored in IndexedDB on the current browser/device. No account, backend, cloud sync, analytics, or transaction transmission is included.

Browser storage is **not a guaranteed permanent backup**. Clearing site/browser data, resetting the device, changing browsers, or uninstalling the PWA may remove transactions. Export CSV regularly and store the exported file somewhere safe. Persistent-storage permission is requested where supported, but it cannot guarantee preservation.

## Privacy and security

- No personal details are requested.
- No tracking or analytics are included.
- No backend or external database is used.
- Transaction records remain in local browser storage.
- HTTPS is required for service workers and is provided by Vercel.

## Important testing note

This repository has been prepared for deployment, but a successful production build, real-device Android installation, offline launch, and CSV download must be verified in your own environment before operational use. Browser download behaviour and storage persistence vary by device and browser.

## Project structure

```text
cashbook-calculator/
├── public/
│   ├── icons/
│   ├── manifest.webmanifest
│   └── service-worker.js
├── src/
│   ├── calculator/
│   ├── components/
│   ├── database/
│   ├── hooks/
│   ├── services/
│   ├── styles/
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── vercel.json
└── vite.config.js
```
