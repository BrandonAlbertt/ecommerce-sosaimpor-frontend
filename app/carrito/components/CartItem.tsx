type CartItemProps = {
  name: string;
  category: string;
  price: number;
};

export function CartItem({ name, category, price }: CartItemProps) {
  return (
    <article className="flex gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="h-24 w-28 shrink-0 rounded-xl bg-zinc-100 transition-colors duration-300 dark:bg-zinc-800" />
      <div className="flex flex-1 flex-col gap-2">
        <p className="text-xs font-bold uppercase text-red-600 dark:text-red-500">{category}</p>
        <h2 className="font-black text-zinc-950 dark:text-zinc-100">{name}</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Recojo en taller. Producto sujeto a verificacion final.</p>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-lg border border-zinc-200 text-sm transition-colors duration-300 dark:border-zinc-800">
            <button className="px-3 py-1 text-zinc-950 dark:text-zinc-100" type="button">-</button>
            <span className="px-3 py-1 text-zinc-950 dark:text-zinc-100">1</span>
            <button className="px-3 py-1 text-zinc-950 dark:text-zinc-100" type="button">+</button>
          </div>
          <p className="text-lg font-black text-zinc-950 dark:text-zinc-100">S/ {price.toLocaleString("es-PE")}.00</p>
        </div>
      </div>
    </article>
  );
}
