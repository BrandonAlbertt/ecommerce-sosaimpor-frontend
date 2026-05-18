export function ProductGallery() {
  return (
    <section className="space-y-3">
      <div className="flex aspect-square items-center justify-center rounded-2xl border border-zinc-200 bg-white shadow-sm transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex h-48 w-64 items-center justify-center rounded-2xl bg-zinc-100 text-sm font-bold text-zinc-500 transition-colors duration-300 dark:bg-zinc-800 dark:text-zinc-400">
          Imagen principal
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((item) => (
          <button
            key={item}
            className="aspect-square rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-500 transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400"
            type="button"
          >
            Foto {item}
          </button>
        ))}
      </div>
    </section>
  );
}
