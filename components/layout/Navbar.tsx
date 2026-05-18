import Link from "next/link";

const links = [
  { href: "/productos", label: "Motores" },
  { href: "/productos", label: "Faros" },
  { href: "/productos", label: "Parachoques" },
  { href: "/productos", label: "Suspension" },
  { href: "/productos", label: "Frenos" },
];

export function Navbar() {
  return (
    <nav className="hidden items-center gap-5 text-sm font-semibold text-zinc-700 transition-colors duration-300 dark:text-zinc-400 lg:flex">
      {links.map((link) => (
        <Link key={link.label} className="transition-colors duration-300 hover:text-red-600 dark:hover:text-red-500" href={link.href}>
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
