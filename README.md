# room.

A local-first static music player designed for GitHub Pages. It includes a few original generated demo loops, supports audio imports from your device, and can serve licensed music files bundled in the repository. The app makes no runtime requests to third-party domains.

## Local development

```sh
npm install
npm run dev
```

The interface is styled with Tailwind CSS 4 through its Vite plugin.

## Collections

Create collections from the library or track list, then use a track's more-options menu to add it. Collection names and song selections are saved in your browser's local storage and remain available on future visits from the same browser. Imported audio itself remains available only for the current browser session, so collection entries for imported tracks are not playable after the page session ends; bundled songs and demo tracks remain available in saved collections.

The starter collections are defined in the `defaultCollections` export in `src/catalog.js`. Edit their `id`, `name`, and `trackIds` there to customize what first-time users see. They seed the browser when no collections exist yet (including an old empty collection list once); after that, saved collections are kept as-is.

## Add music to the hosted library

Place music you own or are licensed to redistribute in `public/music`, then add its metadata to `bundledTracks` in `src/catalog.js`. See `public/music/README.md` for the entry format. Anything in this folder is publicly downloadable from the Pages site, so do not add commercial music without redistribution rights. Files selected through **Your files** stay in the browser session and are not uploaded.

## Publish on GitHub Pages

Push this repository to GitHub using the `main` or `master` branch. In the repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**. The included workflow builds the app with the correct repository subpath and deploys it after each push.

GitHub Pages is static hosting; it cannot fetch or discover files from a private folder at runtime. Bundled audio must be committed to the repository and listed in `src/catalog.js`.
