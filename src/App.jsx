import { useEffect, useMemo, useRef, useState } from "react";
import {
  AudioLines,
  ChevronDown,
  Heart,
  Home,
  Library,
  ListMusic,
  Minus,
  Moon,
  MoreHorizontal,
  Pause,
  Play,
  Plus,
  Repeat2,
  Search,
  Shuffle,
  SkipBack,
  SkipForward,
  Sun,
  Volume2,
} from "lucide-react";
import { bundledTracks, demoTracks } from "./catalog.js";
import { createDemoAudio } from "./demo-audio.js";
import "./App.css";

const artworkStyles = {
  "art-citrus": "bg-[linear-gradient(140deg,#d5e77b,#b6c765)] text-[#354136]",
  "art-blue": "bg-[linear-gradient(140deg,#587277,#a5b9a7)] text-[#e8e5cb]",
  "art-rose": "bg-[linear-gradient(140deg,#edb79e,#d8d492)] text-[#713e36]",
  "art-ink": "bg-[linear-gradient(140deg,#263d39,#53635a)] text-[#d9e28e]",
};

function App() {
  const [view, setView] = useState("all");
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
  const filteredTracks = tracks.filter((track) => {
    const matchesView =
      view === "liked"
        ? favorites.includes(track.id)
        : view === "imports"
          ? track.kind === "import"
          : true;
    return (
      matchesView &&
      `${track.title} ${track.artist}`
        .toLowerCase()
        .includes(query.toLowerCase())
    );
  });

  useEffect(() => {
    try {
      localStorage.setItem("room-favorites", JSON.stringify(favorites));
    } catch {
      // Storage can be unavailable in private browsing; playback still works.
    }
  }, [favorites]);

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
  }, [activeUrl]);

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
      setView("imports");
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
    view === "liked"
      ? "Liked tracks"
      : view === "imports"
        ? "Your files"
        : "Your rotation";

  return (
    <div className="grid min-h-screen grid-cols-[248px_minmax(0,1fr)] bg-[#f7f7f1] pb-23.5 text-left text-ink max-[1050px]:grid-cols-[218px_minmax(0,1fr)] max-[760px]:block max-[760px]:pb-35.5 dark:bg-[#151a17]">
      <aside className="fixed inset-[0_auto_94px_0] z-3 flex w-62 flex-col border-r border-[#e6e8df] bg-[#f1f3eb] px-4.75 pt-7 pb-4.5 max-[1050px]:w-54.5 max-[1050px]:px-3.25 max-[760px]:fixed max-[760px]:inset-x-0 max-[760px]:inset-y-auto max-[760px]:bottom-23.5 max-[760px]:h-12 max-[760px]:w-auto max-[760px]:flex-row max-[760px]:items-center max-[760px]:justify-around max-[760px]:border-t max-[760px]:border-r-0 max-[760px]:border-[#e0e4da] max-[760px]:px-2.5 max-[760px]:py-0 dark:border-[#2d3731] dark:bg-[#1b221e]">
        <a
          className="mb-14 ml-1.25 flex w-max items-center gap-2.5 text-[25px] font-extrabold text-ink no-underline max-[760px]:hidden dark:text-[#edf1eb]"
          href="#home"
          onClick={() => setView("all")}
          aria-label="Room home"
        >
          <span className="grid size-8 place-items-center rounded-full bg-lime text-[#26332b]">
            <AudioLines size={19} strokeWidth={2.2} />
          </span>
          <span>
            room<span className="text-orange">.</span>
          </span>
        </a>
        <p className="m-0 px-2.25 pb-3.25 text-[10px] font-extrabold tracking-[1.4px] text-[#8a928b] max-[760px]:hidden dark:text-[#9aa59c]">
          LISTEN
        </p>
        <nav
          className="grid gap-1 max-[760px]:flex max-[760px]:w-full max-[760px]:justify-around"
          aria-label="Main navigation"
        >
          <button
            className={`flex min-h-10.75 w-full cursor-pointer items-center gap-3.25 rounded-[5px] border-0 bg-transparent px-2.5 text-left text-[13px] font-semibold text-[#68716a] hover:bg-[#e8ece2] hover:text-ink max-[760px]:min-h-9 max-[760px]:min-w-23 max-[760px]:justify-center max-[760px]:gap-1.75 max-[760px]:px-2 max-[760px]:text-[10px] dark:text-[#b2bdb4] dark:hover:bg-[#29332d] dark:hover:text-[#f1f3ed] ${view === "all" ? "bg-[#e4e9dc] text-ink [&_svg]:text-[#708332] dark:bg-[#303c34] dark:text-[#f1f3ed] dark:[&_svg]:text-[#d3ef67]" : ""}`}
            onClick={() => setView("all")}
          >
            <Home size={18} />
            <span>Discover</span>
          </button>
          <button
            className={`flex min-h-10.75 w-full cursor-pointer items-center gap-3.25 rounded-[5px] border-0 bg-transparent px-2.5 text-left text-[13px] font-semibold text-[#68716a] hover:bg-[#e8ece2] hover:text-ink max-[760px]:min-h-9 max-[760px]:min-w-23 max-[760px]:justify-center max-[760px]:gap-1.75 max-[760px]:px-2 max-[760px]:text-[10px] dark:text-[#b2bdb4] dark:hover:bg-[#29332d] dark:hover:text-[#f1f3ed] ${view === "imports" ? "bg-[#e4e9dc] text-ink [&_svg]:text-[#708332] dark:bg-[#303c34] dark:text-[#f1f3ed] dark:[&_svg]:text-[#d3ef67]" : ""}`}
            onClick={() => setView("imports")}
          >
            <Library size={18} />
            <span>Your files</span>
            {importedTracks.length > 0 && (
              <span className="ml-auto text-[11px] text-[#89918b] max-[760px]:hidden">
                {importedTracks.length}
              </span>
            )}
          </button>
          <button
            className={`flex min-h-10.75 w-full cursor-pointer items-center gap-3.25 rounded-[5px] border-0 bg-transparent px-2.5 text-left text-[13px] font-semibold text-[#68716a] hover:bg-[#e8ece2] hover:text-ink max-[760px]:min-h-9 max-[760px]:min-w-23 max-[760px]:justify-center max-[760px]:gap-1.75 max-[760px]:px-2 max-[760px]:text-[10px] dark:text-[#b2bdb4] dark:hover:bg-[#29332d] dark:hover:text-[#f1f3ed] ${view === "liked" ? "bg-[#e4e9dc] text-ink [&_svg]:text-[#708332] dark:bg-[#303c34] dark:text-[#f1f3ed] dark:[&_svg]:text-[#d3ef67]" : ""}`}
            onClick={() => setView("liked")}
          >
            <Heart size={18} />
            <span>Liked tracks</span>
            <span className="ml-auto text-[11px] text-[#89918b] max-[760px]:hidden">
              {favorites.length || ""}
            </span>
          </button>
        </nav>
        <div className="mx-0.5 mt-6 mb-5.5 h-px bg-[#e0e4da] max-[760px]:hidden dark:bg-[#303b34]" />
        <div className="mb-1.25 flex items-center justify-between max-[760px]:hidden">
          <p className="m-0 px-2.25 pb-2.5 text-[10px] font-extrabold tracking-[1.4px] text-[#8a928b] dark:text-[#9aa59c]">
            YOUR LIBRARY
          </p>
          <button
            className="grid size-6.25 flex-none cursor-pointer place-items-center rounded border-0 bg-transparent text-[#8b948b] hover:bg-[#e4e9de] hover:text-[#3d4c40] dark:text-[#a7b2aa] dark:hover:bg-[#303c34] dark:hover:text-[#f1f3ed]"
            aria-label="Add music files"
            title="Add music files"
            onClick={() => fileInputRef.current?.click()}
          >
            <Plus size={17} />
          </button>
        </div>
        <button
          className="flex min-h-13.5 w-full cursor-pointer items-center gap-2.5 rounded-[5px] border-0 bg-transparent px-2.5 text-left text-[#68716a] hover:bg-[#e8ece2] hover:text-ink max-[760px]:hidden dark:text-[#b2bdb4] dark:hover:bg-[#29332d] dark:hover:text-[#f1f3ed]"
          onClick={() => setView("all")}
        >
          <span className="grid size-8.5 flex-none place-items-center overflow-hidden rounded bg-[linear-gradient(140deg,#d5e77b,#b6c765)] text-[#354136]">
            <AudioLines size={16} />
          </span>
          <span className="grid min-w-0 gap-0.5">
            <strong className="overflow-hidden text-ellipsis whitespace-nowrap text-[12px] font-semibold text-[#454e48] dark:text-[#e1e7e1]">
              Soft focus
            </strong>
            <small className="text-[10px] text-[#919991] dark:text-[#9aa59c]">
              Playlist · 3 tracks
            </small>
          </span>
        </button>
        <button
          className="flex min-h-13.5 w-full cursor-pointer items-center gap-2.5 rounded-[5px] border-0 bg-transparent px-2.5 text-left text-[#68716a] hover:bg-[#e8ece2] hover:text-ink max-[760px]:hidden dark:text-[#b2bdb4] dark:hover:bg-[#29332d] dark:hover:text-[#f1f3ed]"
          onClick={() => setView("imports")}
        >
          <span className="grid size-8.5 flex-none place-items-center overflow-hidden rounded bg-[linear-gradient(140deg,#263d39,#53635a)] text-[#d9e28e]">
            <Library size={16} />
          </span>
          <span className="grid min-w-0 gap-0.5">
            <strong className="overflow-hidden text-ellipsis whitespace-nowrap text-[12px] font-semibold text-[#454e48] dark:text-[#e1e7e1]">
              Local files
            </strong>
            <small className="text-[10px] text-[#919991] dark:text-[#9aa59c]">On this device</small>
          </span>
        </button>
        <div className="mt-auto flex items-center gap-1.75 px-2 pt-3.5 text-[9px] font-extrabold tracking-[1px] text-[#929b92] max-[760px]:hidden dark:text-[#9aa59c]">
          <span className="size-1.75 rounded-full bg-[#95b64a] shadow-[0_0_0_3px_#e1e9d2]" />
          <span>LOCAL MODE</span>
          <span className="ml-auto text-[9px] tracking-normal">01 / 01</span>
        </div>
      </aside>

      <div
        className="col-2 min-w-0 max-[760px]:min-h-[calc(100vh-142px)]"
        id="home"
      >
        <header className="sticky top-0 z-2 flex h-18.5 items-center gap-5.5 border-b border-[#e2e4db]/80 bg-[#f7f7f1]/93 px-10.75 backdrop-blur-[14px] max-[1050px]:px-7 max-[760px]:h-15.5 max-[760px]:gap-3 max-[760px]:px-4 dark:border-[#2d3731]/80 dark:bg-[#151a17]/93">
          <div
            className="flex gap-2.25 font-serif text-[26px] leading-none text-[#abb2aa] max-[760px]:hidden dark:text-[#76837a]"
            aria-hidden="true"
          >
            <span className="grid size-7 place-items-center rounded-full border border-[#e2e5dc] dark:border-[#303b34]">
              ‹
            </span>
            <span className="grid size-7 place-items-center rounded-full border border-[#e2e5dc] dark:border-[#303b34]">
              ›
            </span>
          </div>
          <label className="flex h-9.5 w-[min(390px,55vw)] items-center gap-2.5 rounded-[5px] border border-[#e3e5dc] bg-[#fbfbf7] px-3 text-[#858e86] focus-within:border-[#9faf78] focus-within:shadow-[0_0_0_3px_rgba(177,196,128,0.15)] max-[760px]:w-auto max-[760px]:flex-1 dark:border-[#354139] dark:bg-[#202923] dark:text-[#a7b2aa] dark:focus-within:border-[#778e62]">
            <Search size={17} />
            <input
              className="w-full border-0 bg-transparent text-[12px] text-ink outline-none placeholder:text-[#9da49d] dark:text-[#edf1eb] dark:placeholder:text-[#78857b]"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search your room"
              aria-label="Search tracks"
            />
            {query && (
              <button
                className="grid size-5.5 cursor-pointer place-items-center border-0 bg-transparent text-[#7e877f]"
                onClick={() => setQuery("")}
                aria-label="Clear search"
              >
                <Minus size={14} />
              </button>
            )}
          </label>
          <button
            className="grid size-8 cursor-pointer place-items-center rounded-full border-0 bg-transparent text-[#68716a] hover:bg-[#e8ece2] hover:text-ink dark:text-[#c0c9c1] dark:hover:bg-[#29332d] dark:hover:text-[#f1f3ed]"
            onClick={() => setIsDarkMode((darkMode) => !darkMode)}
            aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
            aria-pressed={isDarkMode}
            title={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
          >
            {isDarkMode ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <button
            className="ml-auto size-7.75 cursor-pointer rounded-full border-2 border-white bg-[#e2c6aa] text-[12px] font-extrabold text-[#2e3931] shadow-[0_0_0_1px_#e2e4db] dark:border-[#26312a] dark:shadow-[0_0_0_1px_#39453d]"
            title="Local profile"
          >
            J
          </button>
        </header>

        <main className="mx-auto w-full max-w-292.5 px-10.75 pt-7 pb-11.25 max-[1050px]:px-7 max-[760px]:px-4 max-[760px]:pt-4 max-[760px]:pb-7.25 min-[1450px]:pt-9.25">
          <section
            className="relative grid min-h-71.5 grid-cols-[minmax(0,1fr)_minmax(220px,40%)] overflow-hidden rounded-md bg-[#25352e] text-[#f5f4e9] max-[760px]:min-h-65 max-[760px]:grid-cols-[minmax(0,1fr)_35%] max-[430px]:min-h-60.75 max-[430px]:grid-cols-[1fr_30%] min-[1450px]:min-h-77.5"
            aria-label="Featured collection"
          >
            <div className="relative z-1 px-10 py-8.5 max-[760px]:px-5.5 max-[760px]:py-7 max-[430px]:px-4.25 max-[430px]:py-6.25">
              <p className="m-0 flex items-center gap-2.25 text-[10px] font-extrabold tracking-[1.4px] text-[#c4cfb9] max-[430px]:text-[8px]">
                <span className="inline-block h-px w-4.75 bg-lime" /> YOUR
                SOUND, UNCUT
              </p>
              <h1 className="my-4.5 mb-2.5 text-[clamp(36px,4vw,53px)] font-normal leading-[0.96] text-[#f6f6eb] font-[Georgia,'Times_New_Roman',serif] max-[760px]:text-[40px] max-[430px]:text-4xl">
                A room
                <br />
                of your <em className="font-normal text-lime">own.</em>
              </h1>
              <p className="max-w-72.5 text-[12px] leading-[1.6] text-[#b6c0b6] max-[760px]:max-w-57.5 max-[760px]:text-[11px] max-[430px]:max-w-47.5">
                A small, personal space for the music you bring with you.
              </p>
              <button
                className="mt-5 inline-flex h-9.25 cursor-pointer items-center gap-2.25 rounded-[3px] border-0 bg-lime px-3.75 text-[11px] font-extrabold text-[#26332b] transition duration-180 ease-in-out hover:-translate-y-0.5 hover:bg-[#e0f88a]"
                onClick={() => playTrack(activeTrack)}
              >
                {isPlaying ? (
                  <Pause size={17} fill="currentColor" />
                ) : (
                  <Play size={17} fill="currentColor" />
                )}
                <span>{isPlaying ? "Pause the room" : "Play the room"}</span>
              </button>
            </div>
            <div
              className="absolute inset-y-0 right-0 w-[43%] overflow-hidden bg-[linear-gradient(122deg,#25352e_0%,#475c46_37%,#9da768_100%)] max-[760px]:w-[40%] max-[430px]:w-[33%]"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-[repeating-linear-gradient(128deg,transparent_0_19px,rgba(247,243,211,0.08)_20px,transparent_21px_42px)]" />
              <div className="absolute top-1/2 left-[52%] h-38.75 w-73.75 rounded-full border border-[#f3f2db]/[0.55] transform-[translate(-50%,-50%)_rotate(-24deg)] max-[760px]:h-26.25 max-[760px]:w-47.5" />
              <div className="absolute top-1/2 left-[52%] h-72.5 w-57.5 rounded-full border border-[#f3f2db]/[0.55] transform-[translate(-50%,-50%)_rotate(31deg)] max-[760px]:h-51.25 max-[760px]:w-37.5" />
              <div className="absolute top-1/2 left-[52%] size-25.75 rounded-full bg-[#d6e47b] shadow-[0_0_50px_rgba(218,228,131,0.25)] transform-[translate(-50%,-50%)] max-[760px]:size-17.5" />
              <div className="absolute right-6 bottom-5.75 grid gap-1 text-right max-[760px]:right-3.25 max-[760px]:bottom-3.75 max-[430px]:hidden">
                <span className="text-[8px] font-extrabold tracking-[1.6px] text-[#eff3d4]">
                  FIELD NOTES
                </span>
                <strong className="font-serif text-[17px] font-normal text-[#eff3d4]">
                  VOL. 01
                </strong>
              </div>
              <div className="absolute top-6 right-6 text-[8px] font-extrabold tracking-[1.6px] text-[#eff3d4] max-[760px]:top-3.75 max-[760px]:right-3">
                A—01
              </div>
            </div>
            <div className="absolute right-3.75 bottom-5 z-1 grid justify-items-center gap-1.75 text-[8px] text-[#d2dacf] max-[760px]:hidden">
              <span>01</span>
              <span className="h-5.25 w-px bg-[#bcc9b1]" />
              <span>03</span>
            </div>
          </section>

          <section className="mt-9.25 max-[760px]:mt-7.25">
            <div className="mb-4.75 flex items-end justify-between">
              <div>
                <p className="mb-1.75 text-[9px] font-extrabold tracking-[1.4px] text-[#8a928b] dark:text-[#9aa59c]">
                  A GOOD PLACE TO START
                </p>
                <h2 className="m-0 flex items-center gap-2.75 font-serif text-[28px] font-normal text-ink max-[430px]:text-2xl dark:text-[#edf1eb]">
                  {viewTitle}
                  <span className="grid h-5 w-5.75 place-items-center rounded-[3px] bg-[#e8ecd9] text-[9px] font-extrabold text-[#74805c] dark:bg-[#303b2e] dark:text-[#c7d998]">
                    {filteredTracks.length.toString().padStart(2, "0")}
                  </span>
                </h2>
              </div>
              <button
                className="flex cursor-pointer items-center gap-1.75 border-0 bg-transparent py-2 text-[10px] text-[#758078] max-[430px]:text-[9px] dark:text-[#9aa59c]"
                onClick={() => setView("all")}
              >
                Recently added <ChevronDown size={15} />
              </button>
            </div>
            <div
              className="grid min-h-8 grid-cols-[40px_minmax(200px,1.6fr)_minmax(130px,1fr)_64px_65px] items-center border-b border-[#e4e6dc] text-[8px] font-extrabold tracking-[1.1px] text-[#9aa198] max-[1050px]:grid-cols-[36px_minmax(180px,1.5fr)_minmax(100px,1fr)_57px_58px] max-[760px]:grid-cols-[30px_minmax(150px,1fr)_57px_36px] max-[430px]:grid-cols-[27px_minmax(130px,1fr)_45px_31px] dark:border-[#303b34] dark:text-[#849188]"
              aria-hidden="true"
            >
              <span className="pl-2.25">#</span>
              <span>TITLE</span>
              <span className="max-[760px]:hidden">COLLECTION</span>
              <span>LENGTH</span>
              <span />
            </div>
            <div className="grid">
              {filteredTracks.map((track, index) => {
                const isCurrent = track.id === activeTrack?.id;
                const liked = favorites.includes(track.id);
                return (
                  <div
                    className={`group/track grid min-h-16 grid-cols-[40px_minmax(200px,1.6fr)_minmax(130px,1fr)_64px_65px] items-center border-b border-[#edeee7] transition-colors duration-160 hover:bg-[#f0f2e9] max-[1050px]:grid-cols-[36px_minmax(180px,1.5fr)_minmax(100px,1fr)_57px_58px] max-[760px]:min-h-15.25 max-[760px]:grid-cols-[30px_minmax(150px,1fr)_57px_36px] max-[430px]:grid-cols-[27px_minmax(130px,1fr)_45px_31px] dark:border-[#29332d] dark:hover:bg-[#202923] ${isCurrent ? "bg-[#f0f2e9] dark:bg-[#202923]" : ""}`}
                    key={track.id}
                  >
                    <button
                      className="grid size-8 cursor-pointer place-items-center border-0 bg-transparent text-[#929b92] dark:text-[#9aa59c]"
                      onClick={() => playTrack(track)}
                      aria-label={`${isCurrent && isPlaying ? "Pause" : "Play"} ${track.title}`}
                    >
                      {isCurrent && isPlaying ? (
                        <AudioLines size={16} className="text-[#7a922c]" />
                      ) : (
                        <>
                          <span
                            className={
                              isCurrent ? "hidden" : "group-hover/track:hidden"
                            }
                          >
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <Play
                            size={15}
                            className={`${isCurrent ? "block" : "hidden group-hover/track:block"} text-ink dark:text-[#edf1eb]`}
                            fill="currentColor"
                          />
                        </>
                      )}
                    </button>
                    <button
                      className="flex min-w-0 cursor-pointer items-center gap-3 border-0 bg-transparent py-1.5 text-left text-inherit max-[760px]:gap-2.25"
                      onClick={() => playTrack(track)}
                    >
                      <span
                        className={`grid size-10.25 flex-none place-items-center overflow-hidden rounded-[3px] ${artworkStyles[track.art] || ""} max-[760px]:size-9.5 max-[430px]:size-8.5`}
                      >
                        <AudioLines size={17} />
                      </span>
                      <span className="grid min-w-0 gap-0.75">
                        <strong className="overflow-hidden text-ellipsis whitespace-nowrap text-[12px] font-bold text-[#303a33] max-[760px]:text-[11px] dark:text-[#e4e9e3]">
                          {track.title}
                        </strong>
                        <small className="overflow-hidden text-ellipsis whitespace-nowrap text-[10px] text-[#89928a] max-[760px]:text-[9px] dark:text-[#9aa59c]">
                          {track.artist}
                        </small>
                      </span>
                    </button>
                    <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[10px] text-[#879088] max-[760px]:hidden dark:text-[#9aa59c]">
                      {track.collection ||
                        (track.kind === "import"
                          ? "Your files"
                          : "Local collection")}
                    </span>
                    <span className="text-[10px] tabular-nums text-[#879088] dark:text-[#9aa59c]">
                      {formatTime(
                        track.duration || (track.kind === "demo" ? 24 : 0),
                      )}
                    </span>
                    <div className="flex items-center justify-end gap-2 pr-1.5 max-[1050px]:pr-0 max-[760px]:gap-0 max-[430px]:gap-0">
                      <button
                        className={`grid size-7.25 flex-none cursor-pointer place-items-center rounded border-0 bg-transparent text-[#8b948b] hover:bg-[#e4e9de] hover:text-[#3d4c40] max-[760px]:w-6.5 max-[430px]:w-6 dark:text-[#9aa59c] dark:hover:bg-[#303b34] dark:hover:text-[#f1f3ed] ${liked ? "text-orange" : ""}`}
                        onClick={() => toggleFavorite(track)}
                        aria-label={
                          liked
                            ? "Remove from liked tracks"
                            : "Add to liked tracks"
                        }
                        title={liked ? "Unlike" : "Like"}
                      >
                        <Heart
                          size={16}
                          fill={liked ? "currentColor" : "none"}
                        />
                      </button>
                      <button
                        className="invisible grid size-7.25 flex-none cursor-pointer place-items-center rounded border-0 bg-transparent text-[#8b948b] hover:bg-[#e4e9de] hover:text-[#3d4c40] group-hover/track:visible max-[1050px]:hidden dark:text-[#9aa59c] dark:hover:bg-[#303b34] dark:hover:text-[#f1f3ed]"
                        aria-label={`More options for ${track.title}`}
                        title="More options"
                      >
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}
              {filteredTracks.length === 0 && (
                <div className="grid justify-items-center gap-2.25 px-3 py-10.5 text-center text-[#99a196] dark:text-[#89968c]">
                  <ListMusic size={25} />
                  <strong className="font-serif text-[17px] font-normal text-[#4a544c] dark:text-[#d4ddd5]">
                    {view === "liked"
                      ? "Nothing liked yet"
                      : view === "imports"
                        ? "Your files will appear here"
                        : "No matching tracks"}
                  </strong>
                  <span className="max-w-72.5 text-[11px] leading-normal">
                    {view === "imports"
                      ? "Add music from your device or bundle files in the repository."
                      : "Try another search or add a track to your library."}
                  </span>
                  {view === "imports" && (
                    <button
                      className="mt-1.25 inline-flex cursor-pointer items-center gap-1.25 border-0 bg-transparent text-[11px] font-bold text-[#617738] dark:text-[#c0d98c]"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Choose audio files <Plus size={14} />
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className="mt-4.5 flex items-center gap-2 text-[9px] text-[#969e94] max-[430px]:items-start max-[430px]:leading-normal dark:text-[#89968c]">
              <span className="grid size-3.5 place-items-center rounded-full border border-[#b9c1b2] font-serif text-[9px] dark:border-[#536158]">
                i
              </span>
              <span>
                Your music stays on this device unless you add licensed audio
                files to the repository.
              </span>
            </div>
          </section>
        </main>
      </div>

      <footer className="fixed inset-x-0 bottom-0 z-5 grid min-h-23.5 grid-cols-[minmax(190px,1fr)_minmax(260px,1.2fr)_minmax(160px,1fr)] items-center gap-6 border-t border-[#39433d] bg-[#202a25] px-6.75 py-3.25 text-[#e7e9dd] max-[1050px]:gap-3.5 max-[1050px]:px-4.5 max-[760px]:grid-cols-[minmax(0,1fr)_auto] max-[760px]:grid-rows-[44px_39px] max-[760px]:gap-[3px_12px] max-[760px]:px-3.5 max-[760px]:py-1.75 dark:border-[#2d3731] dark:bg-[#111714]">
        <div className="flex min-w-0 items-center gap-2.75 max-[760px]:col-1 max-[760px]:row-1">
          <span
            className={`grid size-12 flex-none place-items-center overflow-hidden rounded-[3px] ${artworkStyles[activeTrack?.art] || ""} max-[760px]:size-9`}
          >
            <AudioLines size={18} />
          </span>
          <span className="grid min-w-0 gap-1">
            <strong className="overflow-hidden text-ellipsis whitespace-nowrap text-[11px] font-bold text-[#f1f2e9]">
              {activeTrack?.title || "Nothing playing"}
            </strong>
            <small className="overflow-hidden text-ellipsis whitespace-nowrap text-[9px] text-[#a4ada4]">
              {activeTrack?.artist || "Choose a track"}
            </small>
          </span>
          <button
            className={`ml-0.5 grid size-7.25 flex-none cursor-pointer place-items-center rounded border-0 bg-transparent text-[#8b948b] hover:bg-[#e4e9de] hover:text-[#3d4c40] max-[760px]:ml-auto dark:text-[#a7b2aa] dark:hover:bg-[#29332d] dark:hover:text-[#f1f3ed] ${favorites.includes(activeTrack?.id) ? "text-orange" : ""}`}
            onClick={() => activeTrack && toggleFavorite(activeTrack)}
            aria-label="Like current track"
            title="Like"
          >
            <Heart
              size={16}
              fill={
                favorites.includes(activeTrack?.id) ? "currentColor" : "none"
              }
            />
          </button>
        </div>
        <div className="grid justify-items-center gap-2 max-[760px]:col-span-full max-[760px]:row-2 max-[760px]:flex max-[760px]:w-full max-[760px]:gap-0">
          <div className="flex items-center gap-4 max-[760px]:gap-5.25">
            <button
              className={`grid size-6.75 cursor-pointer place-items-center border-0 bg-transparent text-[#abb5aa] hover:text-lime max-[760px]:size-5.75 ${isShuffled ? "text-lime" : ""}`}
              onClick={() => setIsShuffled((value) => !value)}
              aria-label="Toggle shuffle"
              title="Shuffle"
            >
              <Shuffle size={16} />
            </button>
            <button
              className="grid size-6.75 cursor-pointer place-items-center border-0 bg-transparent text-[#abb5aa] hover:text-lime max-[760px]:size-5.75"
              onClick={() => moveTrack(-1)}
              aria-label="Previous track"
              title="Previous"
            >
              <SkipBack size={18} fill="currentColor" />
            </button>
            <button
              className="grid size-8.5 cursor-pointer place-items-center rounded-full border-0 bg-[#e3edc3] text-[#25312a] transition-transform hover:scale-[1.07] max-[760px]:size-7.25"
              onClick={() => activeTrack && playTrack(activeTrack)}
              aria-label={isPlaying ? "Pause" : "Play"}
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause size={18} fill="currentColor" />
              ) : (
                <Play size={18} fill="currentColor" />
              )}
            </button>
            <button
              className="grid size-6.75 cursor-pointer place-items-center border-0 bg-transparent text-[#abb5aa] hover:text-lime max-[760px]:size-5.75"
              onClick={() => moveTrack(1)}
              aria-label="Next track"
              title="Next"
            >
              <SkipForward size={18} fill="currentColor" />
            </button>
            <button
              className={`grid size-6.75 cursor-pointer place-items-center border-0 bg-transparent text-[#abb5aa] hover:text-lime max-[760px]:size-5.75 ${isRepeating ? "text-lime" : ""}`}
              onClick={() => setIsRepeating((value) => !value)}
              aria-label="Toggle repeat"
              title="Repeat"
            >
              <Repeat2 size={16} />
            </button>
          </div>{" "}
          <div className="flex w-[min(100%,420px)] items-center gap-2.5 text-[9px] tabular-nums text-[#a5aea4] max-[760px]:absolute max-[760px]:right-3.5 max-[760px]:bottom-1 max-[760px]:left-3.5 max-[760px]:w-auto max-[760px]:gap-1.75 max-[760px]:text-[8px]">
            <span>{formatTime(currentTime)}</span>
            <input
              className="range-slider m-0 h-0.75 w-full cursor-pointer appearance-none rounded-full bg-[#59645b] max-[760px]:h-0.5"
              type="range"
              min="0"
              max={duration || 24}
              value={Math.min(currentTime, duration || 24)}
              onChange={(event) => {
                if (audioRef.current)
                  audioRef.current.currentTime = Number(event.target.value);
              }}
              aria-label="Track position"
            />
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2.75 max-[760px]:col-2 max-[760px]:row-1 max-[760px]:gap-0">
          <button
            className="hidden cursor-pointer border-0 bg-transparent text-[#abb5aa] max-[760px]:grid"
            aria-label="Queue"
            title="Queue"
          >
            <ListMusic size={17} />
          </button>
          <Volume2 size={17} className="text-[#aab4aa] max-[760px]:hidden" />
          <input
            className="range-slider m-0 h-0.75 w-full max-w-23 cursor-pointer appearance-none rounded-full bg-[#59645b] max-[760px]:hidden"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(event) => {
              const nextVolume = Number(event.target.value);
              setVolume(nextVolume);
              if (audioRef.current) audioRef.current.volume = nextVolume;
            }}
            aria-label="Volume"
          />
        </div>
        <audio
          ref={audioRef}
          className="hidden"
          onLoadedMetadata={(event) =>
            setDuration(
              event.currentTarget.duration || activeTrack?.duration || 0,
            )
          }
          onTimeUpdate={(event) =>
            setCurrentTime(event.currentTarget.currentTime)
          }
          onEnded={() => {
            if (isRepeating) {
              audioRef.current.currentTime = 0;
              audioRef.current.play();
            } else moveTrack(1);
          }}
          onError={() => setIsPlaying(false)}
        />
      </footer>
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
