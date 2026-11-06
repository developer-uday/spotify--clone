import {
  AudioLines,
  Heart,
  ListMusic,
  Pause,
  Play,
  Repeat2,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
} from "lucide-react";

export default function PlayerBar({
  audioRef,
  artworkStyles,
  activeTrack,
  favorites,
  toggleFavorite,
  isShuffled,
  setIsShuffled,
  moveTrack,
  isPlaying,
  playTrack,
  isRepeating,
  setIsRepeating,
  currentTime,
  duration,
  setCurrentTime,
  volume,
  setVolume,
  isQueueOpen,
  setIsQueueOpen,
  setDuration,
  setIsPlaying,
  formatTime,
}) {
  return (
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
          aria-label={
            favorites.includes(activeTrack?.id)
              ? "Remove current track from liked tracks"
              : "Add current track to liked tracks"
          }
          aria-pressed={favorites.includes(activeTrack?.id)}
          title={favorites.includes(activeTrack?.id) ? "Unlike" : "Like"}
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
            aria-pressed={isShuffled}
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
            aria-pressed={isRepeating}
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
            max={duration || activeTrack?.duration || 24}
            value={Math.min(
              currentTime,
              duration || activeTrack?.duration || 24,
            )}
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
          className="grid cursor-pointer place-items-center border-0 bg-transparent text-[#abb5aa] hover:text-lime"
          aria-label="Queue"
          title="Queue"
          aria-expanded={isQueueOpen}
          onClick={() => setIsQueueOpen((open) => !open)}
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
  );
}
