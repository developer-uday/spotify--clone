import { useEffect, useMemo, useRef, useState } from "react";
import FeaturedCollection from "./components/FeaturedCollection.jsx";
import {
  bundledTracks,
  defaultCollections,
  demoTracks,
} from "./catalog.js";
import { createDemoAudio } from "./demo-audio.js";
import Sidebar from "./components/Sidebar.jsx";
import TrackLibrary from "./components/TrackLibrary.jsx";
import TopBar from "./components/TopBar.jsx";
import CollectionDialog from "./components/CollectionDialog.jsx";
import PlaybackQueue from "./components/PlaybackQueue.jsx";
import PlayerBar from "./components/PlayerBar.jsx";
import "./App.css";

const artworkStyles = {
  "art-citrus": "bg-[linear-gradient(140deg,#d5e77b,#b6c765)] text-[#354136]",
  "art-blue": "bg-[linear-gradient(140deg,#587277,#a5b9a7)] text-[#e8e5cb]",
  "art-rose": "bg-[linear-gradient(140deg,#edb79e,#d8d492)] text-[#713e36]",
  "art-ink": "bg-[linear-gradient(140deg,#263d39,#53635a)] text-[#d9e28e]",
};

function readCollections() {
  try {
    const savedCollections = localStorage.getItem("room-collections");
    const defaultsSeeded =
      localStorage.getItem("room-default-collections-seeded") === "true";
    if (savedCollections === null) {
      localStorage.setItem("room-default-collections-seeded", "true");
      return defaultCollections;
    }
    const stored = JSON.parse(savedCollections);
    if (!Array.isArray(stored)) return [];
    if (stored.length === 0 && !defaultsSeeded) {
      localStorage.setItem("room-default-collections-seeded", "true");
      return defaultCollections;
    }
    return stored.filter(
      (collection) =>
        collection &&
        typeof collection.id === "string" &&
        typeof collection.name === "string" &&
        Array.isArray(collection.trackIds),
    );
  } catch {
    return [];
  }
}

function App() {
  const [view, setView] = useState("all");
  const [collections, setCollections] = useState(readCollections);
  const [collectionName, setCollectionName] = useState("");
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);
  const [creatingForTrack, setCreatingForTrack] = useState(null);
  const [openTrackMenu, setOpenTrackMenu] = useState(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isCollectionsMenuOpen, setIsCollectionsMenuOpen] = useState(false);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [sortBy, setSortBy] = useState("recent");
  const [query, setQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      return localStorage.getItem("room-theme") === "dark";
    } catch {
      return false;
    }
  });
  const [selectedId, setSelectedId] = useState(demoTracks[0].id);
  const [importedTracks, setImportedTracks] = useState([]);
  const [demoUrls, setDemoUrls] = useState({});
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("room-favorites") || "[]");
    } catch {
      return [];
    }
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.78);
  const audioRef = useRef(null);
  const fileInputRef = useRef(null);
  const [viewHistory, setViewHistory] = useState(["all"]);
  const [viewHistoryIndex, setViewHistoryIndex] = useState(0);
  const importedUrlsRef = useRef([]);
  const demoUrlsRef = useRef([]);

  const tracks = useMemo(
    () => [...demoTracks, ...bundledTracks, ...importedTracks],
    [importedTracks],
  );
  const activeTrack =
    tracks.find((track) => track.id === selectedId) || tracks[0];
  const activeUrl =
    activeTrack?.kind === "demo"
      ? demoUrls[activeTrack.id]
      : activeTrack?.kind === "import"
        ? activeTrack.url
        : activeTrack?.file
          ? `${import.meta.env.BASE_URL}music/${encodeURIComponent(activeTrack.file)}`
          : "";
  const selectedCollection = collections.find(
    (collection) => view === `collection:${collection.id}`,
  );
  const filteredTracks = tracks.filter((track) => {
    const matchesView =
      view === "liked"
        ? favorites.includes(track.id)
        : view === "imports"
          ? track.kind === "import"
          : selectedCollection
            ? selectedCollection.trackIds.includes(track.id)
            : true;
    return (
      matchesView &&
      `${track.title} ${track.artist}`
        .toLowerCase()
        .includes(query.toLowerCase())
    );
  });
  const sortedTracks = [...filteredTracks].sort((first, second) => {
    if (sortBy === "title") return first.title.localeCompare(second.title);
    if (sortBy === "artist") return first.artist.localeCompare(second.artist);
    return tracks.indexOf(second) - tracks.indexOf(first);
  });

  useEffect(() => {
    try {
      localStorage.setItem("room-favorites", JSON.stringify(favorites));
    } catch {
      // Storage can be unavailable in private browsing; playback still works.
    }
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem("room-collections", JSON.stringify(collections));
    } catch {
      // Collections remain available until the page is closed if storage is unavailable.
    }
  }, [collections]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    try {
      localStorage.setItem("room-theme", isDarkMode ? "dark" : "light");
    } catch {
      // Theme selection still works when storage is unavailable.
    }
  }, [isDarkMode]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !activeUrl) return;
    audio.src = activeUrl;
    audio.load();
    setCurrentTime(0);
    setDuration(activeTrack?.duration || 0);
  }, [activeUrl, activeTrack?.duration]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !activeUrl) return;
    if (isPlaying) audio.play().catch(() => setIsPlaying(false));
    else audio.pause();
  }, [activeUrl, isPlaying]);

  useEffect(
    () => () => {
      importedUrlsRef.current.forEach(URL.revokeObjectURL);
      demoUrlsRef.current.forEach(URL.revokeObjectURL);
    },
    [],
  );

  function ensureDemoAudio(track) {
    if (track?.kind !== "demo" || demoUrls[track.id]) return;
    const url = URL.createObjectURL(createDemoAudio(demoTracks.indexOf(track)));
    demoUrlsRef.current.push(url);
    setDemoUrls((current) => ({ ...current, [track.id]: url }));
  }

  function navigateToView(nextView) {
    if (viewHistory[viewHistoryIndex] !== nextView) {
      setViewHistory([
        ...viewHistory.slice(0, viewHistoryIndex + 1),
        nextView,
      ]);
      setViewHistoryIndex(viewHistoryIndex + 1);
    }
    setView(nextView);
  }

  function moveViewHistory(direction) {
    const nextIndex = viewHistoryIndex + direction;
    if (nextIndex < 0 || nextIndex >= viewHistory.length) return;
    setViewHistoryIndex(nextIndex);
    setView(viewHistory[nextIndex]);
  }

  function beginCreateCollection(trackId = null) {
    setCreatingForTrack(trackId);
    setIsCreatingCollection(true);
    setCollectionName("");
  }

  function createCollection(event) {
    event.preventDefault();
    const name = collectionName.trim();
    if (!name) return;
    const collection = {
      id: `collection-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name,
      trackIds: creatingForTrack ? [creatingForTrack] : [],
    };
    setCollections((current) => [...current, collection]);
    setCollectionName("");
    setIsCreatingCollection(false);
    setCreatingForTrack(null);
    navigateToView(`collection:${collection.id}`);
  }

  function addTrackToCollection(collectionId, trackId) {
    setCollections((current) =>
      current.map((collection) =>
        collection.id === collectionId &&
        !collection.trackIds.includes(trackId)
          ? { ...collection, trackIds: [...collection.trackIds, trackId] }
          : collection,
      ),
    );
    setOpenTrackMenu(null);
  }

  function removeTrackFromCollection(collectionId, trackId) {
    setCollections((current) =>
      current.map((collection) =>
        collection.id === collectionId
          ? {
              ...collection,
              trackIds: collection.trackIds.filter((id) => id !== trackId),
            }
          : collection,
      ),
    );
    setOpenTrackMenu(null);
  }

  function deleteCollection(collectionId) {
    setCollections((current) =>
      current.filter((collection) => collection.id !== collectionId),
    );
    navigateToView("all");
  }

  function playTrack(track) {
    if (!track) return;
    ensureDemoAudio(track);
    if (track.id === selectedId) setIsPlaying((playing) => !playing);
    else {
      setSelectedId(track.id);
      setIsPlaying(true);
    }
  }

  function moveTrack(direction) {
    if (!tracks.length) return;
    const currentIndex = tracks.findIndex((track) => track.id === selectedId);
    const nextIndex = isShuffled
      ? Math.floor(Math.random() * tracks.length)
      : (currentIndex + direction + tracks.length) % tracks.length;
    ensureDemoAudio(tracks[nextIndex]);
    setSelectedId(tracks[nextIndex].id);
    setIsPlaying(true);
  }

  function toggleFavorite(track) {
    setFavorites((current) =>
      current.includes(track.id)
        ? current.filter((id) => id !== track.id)
        : [...current, track.id],
    );
  }

  function importFiles(event) {
    const files = Array.from(event.target.files || []).filter((file) =>
      file.type.startsWith("audio/"),
    );
    const added = files.map((file, index) => ({
      id: `import-${Date.now()}-${index}`,
      title: file.name.replace(/\.[^.]+$/, ""),
      artist: "Your files",
      kind: "import",
      url: URL.createObjectURL(file),
      duration: 0,
    }));
    importedUrlsRef.current.push(...added.map((track) => track.url));
    setImportedTracks((current) => [...current, ...added]);
    if (added.length) {
      navigateToView("imports");
      setSelectedId(added[0].id);
      setIsPlaying(true);
    }
    event.target.value = "";
  }

  function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "0:00";
    return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
  }

  const viewTitle =
    selectedCollection
      ? selectedCollection.name
      : view === "liked"
      ? "Liked tracks"
      : view === "imports"
        ? "Your files"
        : "Your rotation";
  const sortLabel =
    sortBy === "title"
      ? "Title A–Z"
      : sortBy === "artist"
        ? "Artist A–Z"
        : "Recently added";

  return (
    <div className="grid min-h-screen grid-cols-[248px_minmax(0,1fr)] bg-[#f7f7f1] pb-23.5 text-left text-ink max-[1050px]:grid-cols-[218px_minmax(0,1fr)] max-[760px]:block max-[760px]:pb-35.5 dark:bg-[#151a17]">
      <Sidebar
        view={view}
        collections={collections}
        tracks={tracks}
        importedTrackCount={importedTracks.length}
        favoriteCount={favorites.length}
        onNavigate={navigateToView}
        onCreateCollection={() => beginCreateCollection()}
        onChooseFiles={() => fileInputRef.current?.click()}
      />

      <div
        className="col-2 min-w-0 max-[760px]:min-h-[calc(100vh-142px)]"
        id="home"
      >
        <TopBar
          query={query}
          setQuery={setQuery}
          moveViewHistory={moveViewHistory}
          viewHistoryIndex={viewHistoryIndex}
          viewHistory={viewHistory}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          isProfileMenuOpen={isProfileMenuOpen}
          setIsProfileMenuOpen={setIsProfileMenuOpen}
        />

        <main className="mx-auto w-full max-w-292.5 px-10.75 pt-7 pb-11.25 max-[1050px]:px-7 max-[760px]:px-4 max-[760px]:pt-4 max-[760px]:pb-7.25 min-[1450px]:pt-9.25">
          <FeaturedCollection
            activeTrack={activeTrack}
            isPlaying={isPlaying}
            playTrack={playTrack}
          />

          <TrackLibrary
            view={view}
            viewTitle={viewTitle}
            selectedCollection={selectedCollection}
            filteredTracks={filteredTracks}
            sortedTracks={sortedTracks}
            sortLabel={sortLabel}
            sortBy={sortBy}
            setSortBy={setSortBy}
            collections={collections}
            isCollectionsMenuOpen={isCollectionsMenuOpen}
            setIsCollectionsMenuOpen={setIsCollectionsMenuOpen}
            isSortMenuOpen={isSortMenuOpen}
            setIsSortMenuOpen={setIsSortMenuOpen}
            deleteCollection={deleteCollection}
            beginCreateCollection={beginCreateCollection}
            fileInputRef={fileInputRef}
            playTrack={playTrack}
            activeTrack={activeTrack}
            isPlaying={isPlaying}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            openTrackMenu={openTrackMenu}
            setOpenTrackMenu={setOpenTrackMenu}
            addTrackToCollection={addTrackToCollection}
            removeTrackFromCollection={removeTrackFromCollection}
            formatTime={formatTime}
            navigateToView={navigateToView}
            artworkStyles={artworkStyles}
          />
        </main>
      </div>

      {isCreatingCollection && (
        <CollectionDialog
          collectionName={collectionName}
          onCollectionNameChange={setCollectionName}
          onSubmit={createCollection}
          onClose={() => {
            setIsCreatingCollection(false);
            setCreatingForTrack(null);
          }}
        />
      )}

      {isQueueOpen && (
        <PlaybackQueue
          tracks={tracks}
          activeTrack={activeTrack}
          onSelectTrack={(track) => {
            ensureDemoAudio(track);
            setSelectedId(track.id);
            setIsPlaying(true);
            setIsQueueOpen(false);
          }}
          onClose={() => setIsQueueOpen(false)}
        />
      )}

      <PlayerBar
        audioRef={audioRef}
        artworkStyles={artworkStyles}
        activeTrack={activeTrack}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
        isShuffled={isShuffled}
        setIsShuffled={setIsShuffled}
        moveTrack={moveTrack}
        isPlaying={isPlaying}
        playTrack={playTrack}
        isRepeating={isRepeating}
        setIsRepeating={setIsRepeating}
        currentTime={currentTime}
        duration={duration}
        setCurrentTime={setCurrentTime}
        volume={volume}
        setVolume={setVolume}
        isQueueOpen={isQueueOpen}
        setIsQueueOpen={setIsQueueOpen}
        setDuration={setDuration}
        setIsPlaying={setIsPlaying}
        formatTime={formatTime}
      />
      <input
        ref={fileInputRef}
        className="hidden"
        type="file"
        accept="audio/*"
        multiple
        onChange={importFiles}
        aria-label="Choose audio files"
      />
    </div>
  );
}

export default App;
