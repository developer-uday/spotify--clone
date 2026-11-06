import {
  AudioLines,
  FileAudio,
  Heart,
  Home,
  Library,
  ListMusic,
  Plus,
} from "lucide-react";

export default function Sidebar({
  view,
  collections,
  tracks,
  importedTrackCount,
  favoriteCount,
  onNavigate,
  onCreateCollection,
  onChooseFiles,
}) {
  return (
    <aside className="fixed inset-[0_auto_94px_0] z-3 flex w-62 flex-col overflow-y-auto border-r border-[#e6e8df] bg-[#f1f3eb] px-4.75 pt-7 pb-4.5 max-[1050px]:w-54.5 max-[1050px]:px-3.25 max-[760px]:fixed max-[760px]:inset-x-0 max-[760px]:inset-y-auto max-[760px]:bottom-23.5 max-[760px]:h-12 max-[760px]:w-auto max-[760px]:flex-row max-[760px]:items-center max-[760px]:justify-around max-[760px]:overflow-visible max-[760px]:border-t max-[760px]:border-r-0 max-[760px]:border-[#e0e4da] max-[760px]:px-2.5 max-[760px]:py-0 dark:border-[#2d3731] dark:bg-[#1b221e]">
      <a
        className="mb-14 ml-1.25 flex w-max items-center gap-2.5 text-[25px] font-extrabold text-ink no-underline max-[760px]:hidden dark:text-[#edf1eb]"
        href="#home"
        onClick={() => onNavigate("all")}
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
          className={`flex min-h-10.75 w-full cursor-pointer items-center gap-3.25 rounded-[5px] border-0 bg-transparent px-2.5 text-left text-[13px] font-semibold text-[#68716a] hover:bg-[#e8ece2] hover:text-ink max-[760px]:min-h-9 max-[760px]:min-w-23 max-[760px]:justify-center max-[760px]:gap-1.75 max-[760px]:px-2 max-[760px]:text-[10px] dark:text-[#b2bdb4] dark:hover:bg-[#29332d] dark:hover:text-[#f1f3ed] ${view === "all" ? "bg-[#e4e9dc] text-ink [&_svg]:text-[#708332] dark:bg-[#303c34] dark:text-[#f1f3ed] dark:[&_svg]:text-lime" : ""}`}
          onClick={() => onNavigate("all")}
        >
          <Home size={18} />
          <span>Discover</span>
        </button>
        <button
          className={`flex min-h-10.75 w-full cursor-pointer items-center gap-3.25 rounded-[5px] border-0 bg-transparent px-2.5 text-left text-[13px] font-semibold text-[#68716a] hover:bg-[#e8ece2] hover:text-ink max-[760px]:min-h-9 max-[760px]:min-w-23 max-[760px]:justify-center max-[760px]:gap-1.75 max-[760px]:px-2 max-[760px]:text-[10px] dark:text-[#b2bdb4] dark:hover:bg-[#29332d] dark:hover:text-[#f1f3ed] ${view === "imports" ? "bg-[#e4e9dc] text-ink [&_svg]:text-[#708332] dark:bg-[#303c34] dark:text-[#f1f3ed] dark:[&_svg]:text-lime" : ""}`}
          onClick={() => onNavigate("imports")}
        >
          <Library size={18} />
          <span>Your files</span>
          {importedTrackCount > 0 && (
            <span className="ml-auto text-[11px] text-[#89918b] max-[760px]:hidden">
              {importedTrackCount}
            </span>
          )}
        </button>
        <button
          className={`flex min-h-10.75 w-full cursor-pointer items-center gap-3.25 rounded-[5px] border-0 bg-transparent px-2.5 text-left text-[13px] font-semibold text-[#68716a] hover:bg-[#e8ece2] hover:text-ink max-[760px]:min-h-9 max-[760px]:min-w-23 max-[760px]:justify-center max-[760px]:gap-1.75 max-[760px]:px-2 max-[760px]:text-[10px] dark:text-[#b2bdb4] dark:hover:bg-[#29332d] dark:hover:text-[#f1f3ed] ${view === "liked" ? "bg-[#e4e9dc] text-ink [&_svg]:text-[#708332] dark:bg-[#303c34] dark:text-[#f1f3ed] dark:[&_svg]:text-lime" : ""}`}
          onClick={() => onNavigate("liked")}
        >
          <Heart size={18} />
          <span>Liked tracks</span>
          <span className="ml-auto text-[11px] text-[#89918b] max-[760px]:hidden">
            {favoriteCount || ""}
          </span>
        </button>
      </nav>
      <div className="mx-0.5 mt-6 mb-5.5 h-px bg-[#e0e4da] max-[760px]:hidden dark:bg-[#303b34]" />
      <div className="mb-1.25 flex items-center justify-between max-[760px]:hidden">
        <p className="m-0 px-2.25 pb-2.5 text-[10px] font-extrabold tracking-[1.4px] text-[#8a928b] dark:text-[#9aa59c]">
          YOUR LIBRARY
        </p>
        <div className="flex items-center gap-1">
          <button
            className="grid size-6.25 flex-none cursor-pointer place-items-center rounded border-0 bg-transparent text-[#8b948b] hover:bg-[#e4e9de] hover:text-[#3d4c40] dark:text-[#a7b2aa] dark:hover:bg-[#303c34] dark:hover:text-[#f1f3ed]"
            aria-label="Create collection"
            title="Create collection"
            onClick={onCreateCollection}
          >
            <Plus size={17} />
          </button>
          <button
            className="grid size-6.25 flex-none cursor-pointer place-items-center rounded border-0 bg-transparent text-[#8b948b] hover:bg-[#e4e9de] hover:text-[#3d4c40] dark:text-[#a7b2aa] dark:hover:bg-[#303c34] dark:hover:text-[#f1f3ed]"
            aria-label="Add music files"
            title="Add music files"
            onClick={onChooseFiles}
          >
            <FileAudio size={16} />
          </button>
        </div>
      </div>
      <div className="max-h-[45vh] overflow-y-auto max-[760px]:hidden">
        {collections.map((collection) => (
          <button
            key={collection.id}
            className={`flex min-h-13.5 w-full cursor-pointer items-center gap-2.5 rounded-[5px] border-0 bg-transparent px-2.5 text-left text-[#68716a] hover:bg-[#e8ece2] hover:text-ink dark:text-[#b2bdb4] dark:hover:bg-[#29332d] dark:hover:text-[#f1f3ed] ${view === `collection:${collection.id}` ? "bg-[#e4e9dc] text-ink dark:bg-[#303c34] dark:text-[#f1f3ed]" : ""}`}
            onClick={() => onNavigate(`collection:${collection.id}`)}
          >
            <span className="grid size-8.5 flex-none place-items-center overflow-hidden rounded bg-[linear-gradient(140deg,#263d39,#53635a)] text-[#d9e28e]">
              <ListMusic size={16} />
            </span>
            <span className="grid min-w-0 gap-0.5">
              <strong className="overflow-hidden text-ellipsis whitespace-nowrap text-[12px] font-semibold text-[#454e48] dark:text-[#e1e7e1]">
                {collection.name}
              </strong>
              <small className="text-[10px] text-[#919991] dark:text-[#9aa59c]">
                Collection ·{" "}
                {
                  tracks.filter((track) =>
                    collection.trackIds.includes(track.id),
                  ).length
                }{" "}
                tracks
              </small>
            </span>
          </button>
        ))}
        {collections.length === 0 && (
          <p className="px-2.5 py-2 text-[10px] text-[#919991] dark:text-[#9aa59c]">
            Your collections will appear here.
          </p>
        )}
      </div>
      <div className="mt-auto flex items-center gap-1.75 px-2 pt-3.5 text-[9px] font-extrabold tracking-[1px] text-[#929b92] max-[760px]:hidden dark:text-[#9aa59c]">
        <span className="size-1.75 rounded-full bg-[#95b64a] shadow-[0_0_0_3px_#e1e9d2]" />
        <span>LOCAL MODE</span>
        <span className="ml-auto text-[9px] tracking-normal">01 / 01</span>
      </div>
    </aside>
  );
}
