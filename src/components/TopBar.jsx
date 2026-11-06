import { Minus, Moon, Search, Sun } from "lucide-react";

export default function TopBar({
  query,
  setQuery,
  moveViewHistory,
  viewHistoryIndex,
  viewHistory,
  isDarkMode,
  setIsDarkMode,
  isProfileMenuOpen,
  setIsProfileMenuOpen,
}) {
  return (
    <header className="sticky top-0 z-2 flex h-18.5 items-center gap-5.5 border-b border-[#e2e4db]/80 bg-[#f7f7f1]/93 px-10.75 backdrop-blur-[14px] max-[1050px]:px-7 max-[760px]:h-15.5 max-[760px]:gap-3 max-[760px]:px-4 dark:border-[#2d3731]/80 dark:bg-[#151a17]/93">
      <div className="flex gap-2.25 font-serif text-[26px] leading-none text-[#abb2aa] max-[760px]:hidden dark:text-[#76837a]">
        <button
          className="grid size-7 cursor-pointer place-items-center rounded-full border border-[#e2e5dc] bg-transparent disabled:cursor-default disabled:opacity-40 dark:border-[#303b34]"
          onClick={() => moveViewHistory(-1)}
          disabled={viewHistoryIndex === 0}
          aria-label="Go to previous view"
        >
          ‹
        </button>
        <button
          className="grid size-7 cursor-pointer place-items-center rounded-full border border-[#e2e5dc] bg-transparent disabled:cursor-default disabled:opacity-40 dark:border-[#303b34]"
          onClick={() => moveViewHistory(1)}
          disabled={
            viewHistoryIndex >= viewHistory.length - 1
          }
          aria-label="Go to next view"
        >
          ›
        </button>
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
      <div className="relative ml-auto">
        <button
          className="size-7.75 cursor-pointer rounded-full border-2 border-white bg-[#e2c6aa] text-[12px] font-extrabold text-[#2e3931] shadow-[0_0_0_1px_#e2e4db] dark:border-[#26312a] dark:shadow-[0_0_0_1px_#39453d]"
          title="Local profile"
          aria-label="Open local profile menu"
          aria-expanded={isProfileMenuOpen}
          onClick={() => setIsProfileMenuOpen((open) => !open)}
        >
          J
        </button>
        {isProfileMenuOpen && (
          <div className="absolute top-full right-0 z-10 mt-2 w-52 rounded-md border border-[#e1e5d9] bg-[#fbfbf7] p-3 text-[#39443c] shadow-lg dark:border-[#39453d] dark:bg-[#202923] dark:text-[#e4e9e3]">
            <strong className="block text-[12px]">Local profile</strong>
            <p className="mt-1 text-[10px] leading-relaxed text-[#7b857d] dark:text-[#a7b2aa]">
              Your library and collections stay in this browser.
            </p>
            <button
              className="mt-2 w-full cursor-pointer rounded border-0 bg-[#e8ecd9] px-2 py-1.5 text-left text-[11px] font-semibold dark:bg-[#303b34] dark:text-[#e4e9e3]"
              onClick={() => {
                setIsDarkMode((darkMode) => !darkMode);
                setIsProfileMenuOpen(false);
              }}
            >
              Switch to {isDarkMode ? "light" : "dark"} theme
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
