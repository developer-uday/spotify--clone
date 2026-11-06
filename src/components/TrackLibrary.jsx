import {
  AudioLines,
  ChevronDown,
  FileAudio,
  Heart,
  ListMusic,
  MoreHorizontal,
  Play,
  Plus,
  Trash2,
} from "lucide-react";

export default function TrackLibrary({
  view,
  viewTitle,
  selectedCollection,
  filteredTracks,
  sortedTracks,
  sortLabel,
  sortBy,
  setSortBy,
  collections,
  isCollectionsMenuOpen,
  setIsCollectionsMenuOpen,
  isSortMenuOpen,
  setIsSortMenuOpen,
  deleteCollection,
  beginCreateCollection,
  fileInputRef,
  playTrack,
  activeTrack,
  isPlaying,
  favorites,
  toggleFavorite,
  openTrackMenu,
  setOpenTrackMenu,
  addTrackToCollection,
  removeTrackFromCollection,
  formatTime,
  navigateToView,
  artworkStyles,
}) {
  return (
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
        <div className="flex items-center gap-1">
          <button
            className="flex cursor-pointer items-center gap-1.25 border-0 bg-transparent py-2 text-[10px] text-[#758078] max-[430px]:text-[9px] dark:text-[#9aa59c]"
            onClick={() => beginCreateCollection()}
            aria-label="Create collection"
          >
            <Plus size={14} />{" "}
            <span className="max-[430px]:hidden">Create collection</span>
          </button>
          {view === "imports" && (
            <button
              className="flex cursor-pointer items-center gap-1 border-0 bg-transparent py-2 text-[10px] text-[#758078] max-[430px]:text-[9px] dark:text-[#9aa59c]"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Add music files"
            >
              <FileAudio size={14} />
              <span className="max-[430px]:hidden">Add music</span>
            </button>
          )}
          {collections.length > 0 && (
            <div className="relative">
              <button
                className="flex cursor-pointer items-center gap-1 border-0 bg-transparent py-2 text-[10px] text-[#758078] max-[430px]:text-[9px] dark:text-[#9aa59c]"
                onClick={() =>
                  setIsCollectionsMenuOpen((open) => !open)
                }
                aria-expanded={isCollectionsMenuOpen}
                aria-label="Open collections"
              >
                Collections <ChevronDown size={14} />
              </button>
              {isCollectionsMenuOpen && (
                <div className="absolute top-full right-0 z-10 mt-1 grid min-w-36 rounded-md border border-[#e1e5d9] bg-[#fbfbf7] p-1 shadow-lg dark:border-[#39453d] dark:bg-[#202923]">
                  {collections.map((collection) => (
                    <button
                      key={collection.id}
                      className="cursor-pointer rounded border-0 bg-transparent px-2.5 py-2 text-left text-[11px] text-[#68716a] hover:bg-[#edf0e7] dark:text-[#e4e9e3] dark:hover:bg-[#303b34]"
                      onClick={() => {
                        navigateToView(`collection:${collection.id}`);
                        setIsCollectionsMenuOpen(false);
                      }}
                    >
                      {collection.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          <div className="relative">
            <button
              className="flex cursor-pointer items-center gap-1 border-0 bg-transparent py-2 text-[10px] text-[#758078] max-[430px]:text-[9px] dark:text-[#9aa59c]"
              onClick={() => setIsSortMenuOpen((open) => !open)}
              aria-expanded={isSortMenuOpen}
              aria-label={`Sort tracks: ${sortLabel}`}
            >
              {sortLabel} <ChevronDown size={14} />
            </button>
            {isSortMenuOpen && (
              <div className="absolute top-full right-0 z-10 mt-1 grid min-w-32 rounded-md border border-[#e1e5d9] bg-[#fbfbf7] p-1 shadow-lg dark:border-[#39453d] dark:bg-[#202923]">
                {[
                  ["recent", "Recently added"],
                  ["title", "Title A–Z"],
                  ["artist", "Artist A–Z"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    className={`cursor-pointer rounded border-0 bg-transparent px-2.5 py-2 text-left text-[11px] hover:bg-[#edf0e7] dark:text-[#e4e9e3] dark:hover:bg-[#303b34] ${sortBy === value ? "font-bold text-[#617738]" : "text-[#68716a]"}`}
                    onClick={() => {
                      setSortBy(value);
                      setIsSortMenuOpen(false);
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        {selectedCollection && (
          <button
            className="ml-2 grid size-8 cursor-pointer place-items-center rounded border-0 bg-transparent text-[#89928a] hover:bg-[#f1e7e2] hover:text-[#a14d37] dark:hover:bg-[#382a25]"
            onClick={() => deleteCollection(selectedCollection.id)}
            aria-label={`Delete collection ${selectedCollection.name}`}
            title="Delete collection"
          >
            <Trash2 size={15} />
          </button>
        )}
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
        {sortedTracks.map((track, index) => {
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
              <div className="relative flex items-center justify-end gap-2 pr-1.5 max-[1050px]:pr-0 max-[760px]:gap-0 max-[430px]:gap-0">
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
                  className="grid size-7.25 flex-none cursor-pointer place-items-center rounded border-0 bg-transparent text-[#8b948b] hover:bg-[#e4e9de] hover:text-[#3d4c40] max-[760px]:w-6.5 max-[430px]:w-6 dark:text-[#9aa59c] dark:hover:bg-[#303b34] dark:hover:text-[#f1f3ed]"
                  aria-label={`More options for ${track.title}`}
                  title="More options"
                  aria-expanded={openTrackMenu === track.id}
                  onClick={() =>
                    setOpenTrackMenu((current) =>
                      current === track.id ? null : track.id,
                    )
                  }
                >
                  <MoreHorizontal size={18} />
                </button>
                {openTrackMenu === track.id && (
                  <div className="absolute top-full right-0 z-10 mt-1 grid w-48 rounded-md border border-[#e1e5d9] bg-[#fbfbf7] p-1.5 shadow-lg dark:border-[#39453d] dark:bg-[#202923]">
                    <strong className="px-2 py-1 text-[10px] text-[#89928a] dark:text-[#9aa59c]">
                      Add to collection
                    </strong>
                    {collections.length > 0 ? (
                      collections.map((collection) => {
                        const alreadyAdded =
                          collection.trackIds.includes(track.id);
                        return (
                          <button
                            key={collection.id}
                            className="cursor-pointer rounded border-0 bg-transparent px-2 py-1.5 text-left text-[11px] text-[#3d4c40] hover:bg-[#edf0e7] disabled:cursor-default disabled:opacity-50 dark:text-[#e4e9e3] dark:hover:bg-[#303b34]"
                            disabled={alreadyAdded}
                            onClick={() =>
                              addTrackToCollection(
                                collection.id,
                                track.id,
                              )
                            }
                          >
                            {collection.name}
                            {alreadyAdded ? " · Added" : ""}
                          </button>
                        );
                      })
                    ) : (
                      <span className="px-2 py-1 text-[10px] text-[#89928a] dark:text-[#9aa59c]">
                        Create a collection first.
                      </span>
                    )}
                    {selectedCollection?.trackIds.includes(track.id) && (
                      <button
                        className="mt-1 cursor-pointer rounded border-0 bg-transparent px-2 py-1.5 text-left text-[11px] text-[#a14d37] hover:bg-[#f1e7e2] dark:hover:bg-[#382a25]"
                        onClick={() =>
                          removeTrackFromCollection(
                            selectedCollection.id,
                            track.id,
                          )
                        }
                      >
                        Remove from this collection
                      </button>
                    )}
                    <button
                      className="mt-1 cursor-pointer rounded border-0 bg-transparent px-2 py-1.5 text-left text-[11px] font-semibold text-[#617738] hover:bg-[#edf0e7] dark:text-[#c0d98c] dark:hover:bg-[#303b34]"
                      onClick={() => {
                        setOpenTrackMenu(null);
                        beginCreateCollection(track.id);
                      }}
                    >
                      <Plus size={12} className="mr-1 inline" />
                      Create collection
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {filteredTracks.length === 0 && (
          <div className="grid justify-items-center gap-2.25 px-3 py-10.5 text-center text-[#99a196] dark:text-[#89968c]">
            <ListMusic size={25} />
            <strong className="font-serif text-[17px] font-normal text-[#4a544c] dark:text-[#d4ddd5]">
              {selectedCollection
                ? "This collection is empty"
                : view === "liked"
                ? "Nothing liked yet"
                : view === "imports"
                  ? "Your files will appear here"
                  : "No matching tracks"}
            </strong>
            <span className="max-w-72.5 text-[11px] leading-normal">
              {selectedCollection
                ? "Add songs from Discover using the more options menu."
                : view === "imports"
                ? "Add music from your device or bundle files in the repository."
                : "Try another search or add a track to your library."}
            </span>
            {selectedCollection && (
              <button
                className="mt-1.25 inline-flex cursor-pointer items-center gap-1.25 border-0 bg-transparent text-[11px] font-bold text-[#617738] dark:text-[#c0d98c]"
                onClick={() => navigateToView("all")}
              >
                Browse available songs <ChevronDown size={14} />
              </button>
            )}
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
  );
}
