import { Pause, Play } from "lucide-react";

export default function FeaturedCollection({ activeTrack, isPlaying, playTrack }) {
  return (
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
  );
}
