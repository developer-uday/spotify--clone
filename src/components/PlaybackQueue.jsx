import { AudioLines } from "lucide-react";

export default function PlaybackQueue({
  tracks,
  activeTrack,
  onSelectTrack,
  onClose,
}) {
  return (
    <section
      className="fixed right-5 bottom-25 z-10 max-h-[60vh] w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-lg border border-[#39453d] bg-[#202a25] text-[#e7e9dd] shadow-2xl max-[760px]:right-3.5 max-[760px]:bottom-36"
      aria-label="Playback queue"
    >
      <div className="flex items-center justify-between border-b border-[#39433d] px-4 py-3">
        <div>
          <strong className="block text-[13px]">Queue</strong>
          <span className="text-[10px] text-[#a4ada4]">
            Available tracks in playback order
          </span>
        </div>
        <button
          className="cursor-pointer border-0 bg-transparent px-2 py-1 text-[11px] text-[#c5d994]"
          onClick={onClose}
          aria-label="Close queue"
        >
          Close
        </button>
      </div>
      <div className="max-h-[45vh] overflow-y-auto p-1.5">
        {tracks.map((track) => (
          <button
            key={track.id}
            className={`flex w-full cursor-pointer items-center gap-2.5 rounded px-2.5 py-2 text-left hover:bg-[#303b34] ${track.id === activeTrack?.id ? "bg-[#303b34]" : ""}`}
            onClick={() => onSelectTrack(track)}
          >
            <span className="min-w-0 flex-1">
              <strong className="block overflow-hidden text-ellipsis whitespace-nowrap text-[11px] font-semibold">
                {track.title}
              </strong>
              <small className="block overflow-hidden text-ellipsis whitespace-nowrap text-[9px] text-[#a4ada4]">
                {track.artist}
              </small>
            </span>
            {track.id === activeTrack?.id && (
              <AudioLines size={15} className="text-lime" />
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
