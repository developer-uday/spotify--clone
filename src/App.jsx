import { useEffect, useMemo, useRef, useState } from 'react'
import {
  AudioLines, ChevronDown, Heart, Home, Library, ListMusic, Minus,
  MoreHorizontal, Pause, Play, Plus, Repeat2, Search, Shuffle, SkipBack,
  SkipForward, Volume2,
} from 'lucide-react'
import { bundledTracks, demoTracks } from './catalog.js'
import { createDemoAudio } from './demo-audio.js'
import './App.css'

function App() {
  const [view, setView] = useState('all')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(demoTracks[0].id)
  const [importedTracks, setImportedTracks] = useState([])
  const [demoUrls, setDemoUrls] = useState({})
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('room-favorites') || '[]') } catch { return [] }
  })
  const [isPlaying, setIsPlaying] = useState(false)
  const [isShuffled, setIsShuffled] = useState(false)
  const [isRepeating, setIsRepeating] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.78)
  const audioRef = useRef(null)
  const fileInputRef = useRef(null)
  const importedUrlsRef = useRef([])
  const demoUrlsRef = useRef([])

  const tracks = useMemo(() => [...demoTracks, ...bundledTracks, ...importedTracks], [importedTracks])
  const activeTrack = tracks.find((track) => track.id === selectedId) || tracks[0]
  const activeUrl = activeTrack?.kind === 'demo'
    ? demoUrls[activeTrack.id]
    : activeTrack?.kind === 'import'
      ? activeTrack.url
      : activeTrack?.file
        ? `${import.meta.env.BASE_URL}music/${encodeURIComponent(activeTrack.file)}`
        : ''
  const filteredTracks = tracks.filter((track) => {
    const matchesView = view === 'liked'
      ? favorites.includes(track.id)
      : view === 'imports'
        ? track.kind === 'import'
        : true
    return matchesView && `${track.title} ${track.artist}`.toLowerCase().includes(query.toLowerCase())
  })

  useEffect(() => {
    try { localStorage.setItem('room-favorites', JSON.stringify(favorites)) } catch {
      // Storage can be unavailable in private browsing; playback still works.
    }
  }, [favorites])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !activeUrl) return
    audio.src = activeUrl
    audio.load()
    setCurrentTime(0)
  }, [activeUrl])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !activeUrl) return
    if (isPlaying) audio.play().catch(() => setIsPlaying(false))
    else audio.pause()
  }, [activeUrl, isPlaying])

  useEffect(() => () => {
    importedUrlsRef.current.forEach(URL.revokeObjectURL)
    demoUrlsRef.current.forEach(URL.revokeObjectURL)
  }, [])

  function ensureDemoAudio(track) {
    if (track?.kind !== 'demo' || demoUrls[track.id]) return
    const url = URL.createObjectURL(createDemoAudio(demoTracks.indexOf(track)))
    demoUrlsRef.current.push(url)
    setDemoUrls((current) => ({ ...current, [track.id]: url }))
  }

  function playTrack(track) {
    if (!track) return
    ensureDemoAudio(track)
    if (track.id === selectedId) setIsPlaying((playing) => !playing)
    else { setSelectedId(track.id); setIsPlaying(true) }
  }

  function moveTrack(direction) {
    if (!tracks.length) return
    const currentIndex = tracks.findIndex((track) => track.id === selectedId)
    const nextIndex = isShuffled
      ? Math.floor(Math.random() * tracks.length)
      : (currentIndex + direction + tracks.length) % tracks.length
    ensureDemoAudio(tracks[nextIndex])
    setSelectedId(tracks[nextIndex].id)
    setIsPlaying(true)
  }

  function toggleFavorite(track) {
    setFavorites((current) => current.includes(track.id)
      ? current.filter((id) => id !== track.id)
      : [...current, track.id])
  }

  function importFiles(event) {
    const files = Array.from(event.target.files || []).filter((file) => file.type.startsWith('audio/'))
    const added = files.map((file, index) => ({
      id: `import-${Date.now()}-${index}`,
      title: file.name.replace(/\.[^.]+$/, ''),
      artist: 'Your files', kind: 'import', url: URL.createObjectURL(file), duration: 0,
    }))
    importedUrlsRef.current.push(...added.map((track) => track.url))
    setImportedTracks((current) => [...current, ...added])
    if (added.length) { setView('imports'); setSelectedId(added[0].id); setIsPlaying(true) }
    event.target.value = ''
  }

  function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return '0:00'
    return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`
  }

  const viewTitle = view === 'liked' ? 'Liked tracks' : view === 'imports' ? 'Your files' : 'Your rotation'

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="wordmark" href="#home" onClick={() => setView('all')} aria-label="Room home">
          <span className="wordmark-mark"><AudioLines size={19} strokeWidth={2.2} /></span>
          <span>room<span className="wordmark-period">.</span></span>
          <span>By Uday Singh</span>
        </a>
        <p className="nav-label">LISTEN</p>
        <nav className="primary-nav" aria-label="Main navigation">
          <button className={view === 'all' ? 'nav-item active' : 'nav-item'} onClick={() => setView('all')}><Home size={18} /><span>Discover</span></button>
          <button className={view === 'imports' ? 'nav-item active' : 'nav-item'} onClick={() => setView('imports')}><Library size={18} /><span>Your files</span>{importedTracks.length > 0 && <span className="nav-count">{importedTracks.length}</span>}</button>
          <button className={view === 'liked' ? 'nav-item active' : 'nav-item'} onClick={() => setView('liked')}><Heart size={18} /><span>Liked tracks</span><span className="nav-count">{favorites.length || ''}</span></button>
        </nav>
        <div className="sidebar-divider" />
        <div className="library-heading"><p className="nav-label">YOUR LIBRARY</p><button className="icon-button subdued" aria-label="Add music files" title="Add music files" onClick={() => fileInputRef.current?.click()}><Plus size={17} /></button></div>
        <button className="library-link" onClick={() => setView('all')}><span className="mini-art art-citrus"><AudioLines size={16} /></span><span><strong>Soft focus</strong><small>Playlist · 3 tracks</small></span></button>
        <button className="library-link" onClick={() => setView('imports')}><span className="mini-art art-ink"><Library size={16} /></span><span><strong>Local files</strong><small>On this device</small></span></button>
        <div className="sidebar-bottom"><span className="connection-dot" /><span>LOCAL MODE</span><span className="sidebar-version">01 / 01</span></div>
      </aside>

      <div className="workspace" id="home">
        <header className="topbar">
          <div className="history-controls" aria-hidden="true"><span>‹</span><span>›</span></div>
          <label className="search-box"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search your room" aria-label="Search tracks" />{query && <button className="search-clear" onClick={() => setQuery('')} aria-label="Clear search"><Minus size={14} /></button>}</label>
          <button className="profile-button" title="Local profile">J</button>
        </header>

        <main className="content">
          <section className="feature-band" aria-label="Featured collection">
            <div className="feature-copy">
              <p className="eyebrow"><span className="eyebrow-line" /> YOUR SOUND, UNCUT</p>
              <h1>A room<br />of your <em>own.</em></h1>
              <p className="feature-description">A small, personal space for the music you bring with you.</p>
              <button className="feature-play" onClick={() => playTrack(activeTrack)}>{isPlaying ? <Pause size={17} fill="currentColor" /> : <Play size={17} fill="currentColor" />}<span>{isPlaying ? 'Pause the room' : 'Play the room'}</span></button>
            </div>
            <div className="feature-art" aria-hidden="true"><div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" /><div className="art-sun" /><div className="art-caption"><span>FIELD NOTES</span><strong>VOL. 01</strong></div><div className="art-number">A—01</div></div>
            <div className="feature-index"><span>01</span><span className="index-rule" /><span>03</span></div>
          </section>

          <section className="track-section">
            <div className="section-heading"><div><p className="eyebrow section-eyebrow">A GOOD PLACE TO START</p><h2>{viewTitle}<span className="track-total">{filteredTracks.length.toString().padStart(2, '0')}</span></h2></div><button className="sort-button" onClick={() => setView('all')}>Recently added <ChevronDown size={15} /></button></div>
            <div className="table-head" aria-hidden="true"><span>#</span><span>TITLE</span><span className="album-heading">COLLECTION</span><span>LENGTH</span><span /></div>
            <div className="track-list">
              {filteredTracks.map((track, index) => {
                const isCurrent = track.id === activeTrack?.id
                const liked = favorites.includes(track.id)
                return <div className={isCurrent ? 'track-row current' : 'track-row'} key={track.id}>
                  <button className="row-number" onClick={() => playTrack(track)} aria-label={`${isCurrent && isPlaying ? 'Pause' : 'Play'} ${track.title}`}>
                    {isCurrent && isPlaying ? <AudioLines size={16} className="playing-bars" /> : <><span className="row-index">{String(index + 1).padStart(2, '0')}</span><Play size={15} className="row-play" fill="currentColor" /></>}
                  </button>
                  <button className="track-main" onClick={() => playTrack(track)}><span className={`track-cover ${track.art}`}><AudioLines size={17} /></span><span className="track-titles"><strong>{track.title}</strong><small>{track.artist}</small></span></button>
                  <span className="track-album">{track.collection || (track.kind === 'import' ? 'Your files' : 'Local collection')}</span>
                  <span className="track-duration">{formatTime(track.duration || (track.kind === 'demo' ? 24 : 0))}</span>
                  <div className="track-actions"><button className={liked ? 'icon-button liked' : 'icon-button'} onClick={() => toggleFavorite(track)} aria-label={liked ? 'Remove from liked tracks' : 'Add to liked tracks'} title={liked ? 'Unlike' : 'Like'}><Heart size={16} fill={liked ? 'currentColor' : 'none'} /></button><button className="icon-button more-button" aria-label={`More options for ${track.title}`} title="More options"><MoreHorizontal size={18} /></button></div>
                </div>
              })}
              {filteredTracks.length === 0 && <div className="empty-state"><ListMusic size={25} /><strong>{view === 'liked' ? 'Nothing liked yet' : view === 'imports' ? 'Your files will appear here' : 'No matching tracks'}</strong><span>{view === 'imports' ? 'Add music from your device or bundle files in the repository.' : 'Try another search or add a track to your library.'}</span>{view === 'imports' && <button className="text-action" onClick={() => fileInputRef.current?.click()}>Choose audio files <Plus size={14} /></button>}</div>}
            </div>
            <div className="local-note"><span className="note-mark">i</span><span>Your music stays on this device unless you add licensed audio files to the repository.</span></div>
          </section>
        </main>
      </div>

      <footer className="player-bar">
        <div className="now-playing"><span className={`player-cover ${activeTrack?.art || ''}`}><AudioLines size={18} /></span><span className="now-playing-text"><strong>{activeTrack?.title || 'Nothing playing'}</strong><small>{activeTrack?.artist || 'Choose a track'}</small></span><button className={favorites.includes(activeTrack?.id) ? 'icon-button liked' : 'icon-button'} onClick={() => activeTrack && toggleFavorite(activeTrack)} aria-label="Like current track" title="Like"><Heart size={16} fill={favorites.includes(activeTrack?.id) ? 'currentColor' : 'none'} /></button></div>
        <div className="playback"><div className="playback-controls"><button className={isShuffled ? 'control-button selected' : 'control-button'} onClick={() => setIsShuffled((value) => !value)} aria-label="Toggle shuffle" title="Shuffle"><Shuffle size={16} /></button><button className="control-button" onClick={() => moveTrack(-1)} aria-label="Previous track" title="Previous"><SkipBack size={18} fill="currentColor" /></button><button className="main-play" onClick={() => activeTrack && playTrack(activeTrack)} aria-label={isPlaying ? 'Pause' : 'Play'} title={isPlaying ? 'Pause' : 'Play'}>{isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}</button><button className="control-button" onClick={() => moveTrack(1)} aria-label="Next track" title="Next"><SkipForward size={18} fill="currentColor" /></button><button className={isRepeating ? 'control-button selected' : 'control-button'} onClick={() => setIsRepeating((value) => !value)} aria-label="Toggle repeat" title="Repeat"><Repeat2 size={16} /></button></div><div className="seek-row"><span>{formatTime(currentTime)}</span><input className="seek-slider" type="range" min="0" max={duration || 24} value={Math.min(currentTime, duration || 24)} onChange={(event) => { if (audioRef.current) audioRef.current.currentTime = Number(event.target.value) }} aria-label="Track position" /><span>{formatTime(duration)}</span></div></div>
        <div className="player-tools"><button className="control-button queue-button" aria-label="Queue" title="Queue"><ListMusic size={17} /></button><Volume2 size={17} className="volume-icon" /><input className="volume-slider" type="range" min="0" max="1" step="0.01" value={volume} onChange={(event) => { const nextVolume = Number(event.target.value); setVolume(nextVolume); if (audioRef.current) audioRef.current.volume = nextVolume }} aria-label="Volume" /></div>
        <audio ref={audioRef} onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || activeTrack?.duration || 0)} onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)} onEnded={() => { if (isRepeating) { audioRef.current.currentTime = 0; audioRef.current.play() } else moveTrack(1) }} onError={() => setIsPlaying(false)} />
      </footer>
      <input ref={fileInputRef} className="file-input" type="file" accept="audio/*" multiple onChange={importFiles} aria-label="Choose audio files" />
    </div>
  )
}

export default App
