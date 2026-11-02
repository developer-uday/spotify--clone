# Bundled Music

Place audio files you own or are licensed to redistribute in this folder. They will be publicly downloadable from your GitHub Pages site, so do not add commercial tracks without permission.

Then add an entry to `src/catalog.js` in `bundledTracks`:

```js
{
  id: 'track-id',
  title: 'Track title',
  artist: 'Artist name',
  kind: 'bundled',
  collection: 'Local collection',
  file: 'track-file.mp3',
  duration: 184,
  art: 'art-blue',
},
```

Use the exact filename, including its extension. Keep audio files reasonably sized because they are part of the repository and every visitor downloads them when playing.