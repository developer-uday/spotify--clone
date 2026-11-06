export default function CollectionDialog({
  collectionName,
  onCollectionNameChange,
  onSubmit,
  onClose,
}) {
  return (
    <div
      className="fixed inset-0 z-20 grid place-items-center bg-[#101713]/55 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <form
        className="w-full max-w-sm rounded-lg border border-[#dfe4d8] bg-[#fbfbf7] p-5 text-[#303a33] shadow-2xl dark:border-[#39453d] dark:bg-[#202923] dark:text-[#e4e9e3]"
        onSubmit={onSubmit}
        onKeyDown={(event) => {
          if (event.key === "Escape") onClose();
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-collection-title"
      >
        <h2
          id="create-collection-title"
          className="m-0 font-serif text-2xl font-normal"
        >
          Create a collection
        </h2>
        <p className="mt-1.5 text-[11px] text-[#78837a] dark:text-[#a7b2aa]">
          Collections are saved in this browser.
        </p>
        <label className="mt-4 grid gap-1.5 text-[11px] font-semibold">
          Collection name
          <input
            autoFocus
            className="h-10 rounded border border-[#dce2d7] bg-white px-3 text-[13px] text-[#303a33] dark:border-[#425047] dark:bg-[#151a17] dark:text-[#e4e9e3]"
            value={collectionName}
            onChange={(event) => onCollectionNameChange(event.target.value)}
            placeholder="e.g. Late night songs"
            maxLength={60}
            required
          />
        </label>
        <div className="mt-5 flex justify-end gap-2">
          <button
            className="cursor-pointer rounded border border-[#dce2d7] bg-transparent px-3 py-2 text-[11px] font-semibold dark:border-[#425047] dark:text-[#e4e9e3]"
            type="button"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="cursor-pointer rounded border-0 bg-lime px-3 py-2 text-[11px] font-extrabold text-[#26332b] disabled:cursor-not-allowed disabled:opacity-50"
            type="submit"
            disabled={!collectionName.trim()}
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}
