import Link from "next/link";
import { Grid2X2, Home, Search, ShieldUser, ShoppingCart } from "lucide-react";

const items = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/productos", label: "Categorias", icon: Grid2X2 },
  { href: "/productos", label: "Buscar", icon: Search },
  { href: "/carrito", label: "Carrito", icon: ShoppingCart, badge: "3" },
  { href: "/productos", label: "Admin", icon: ShieldUser },
];

export function MobileBottomNav() {
  return (
    // Seccion movil: navegacion inferior tipo app ecommerce.
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-zinc-200 bg-white/95 px-2 pb-[calc(env(safe-area-inset-bottom)+0.35rem)] pt-2 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95 md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              className="relative flex min-h-12 flex-col items-center justify-center gap-1 rounded-2xl text-[10px] font-bold text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
              href={item.href}
            >
              <span className="relative">
                <Icon size={19} suppressHydrationWarning />
                {item.badge ? (
                  <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-black text-white">
                    {item.badge}
                  </span>
                ) : null}
              </span>
              <span className="max-w-full truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
