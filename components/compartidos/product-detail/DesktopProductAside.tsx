import {
  CircleDollarSign,
  Headphones,
  Lightbulb,
  MapPin,
  MessageCircle,
  PackageCheck,
  ShieldCheck,
  Truck,
} from "lucide-react";
import Image from "next/image";

type DesktopProductAsideProps = {
  onLocationClick?: () => void;
  onSuggestionClick?: () => void;
  supportWhatsappUrl: string;
};

export function DesktopProductAside({
  onLocationClick,
  onSuggestionClick,
  supportWhatsappUrl,
}: DesktopProductAsideProps) {
  const supportItems = [
    { icon: ShieldCheck, label: "Repuestos originales" },
    { icon: Truck, label: "Importaciones directas" },
    { icon: Headphones, label: "Atención personalizada" },
    { icon: PackageCheck, label: "Recojo en taller" },
  ];
  const paymentItems = [
    { imageClassName: "h-8 w-auto", label: "Visa", src: "/visa-imagen.svg" },
    { imageClassName: "max-h-6 w-auto", label: "Plin", src: "/plin-imagen.svg" },
    { imageClassName: "max-h-6 w-auto", label: "Yape", src: "/Yape-imagen.svg" },
  ];

  return (
    <aside className="hidden space-y-4 lg:row-span-3 lg:block lg:self-start">
      <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-center text-base font-bold leading-snug text-zinc-950 dark:text-zinc-100">
          ¿No encuentras tu repuesto?
        </h2>
        <p className="mt-2 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Te ayudamos a encontrarlo
        </p>
        <div className="mt-5 space-y-3.5">
          {supportItems.map((item) => {
            const Icon = item.icon;

            return (
              <div className="flex items-center gap-3 text-sm font-medium text-zinc-700 dark:text-zinc-300" key={item.label}>
                <Icon className="text-zinc-700 dark:text-zinc-300" size={18} suppressHydrationWarning />
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
        <a
          className="mt-6 flex h-11 items-center justify-center gap-2 rounded-xl bg-green-600 text-sm font-bold text-white shadow-sm transition-colors hover:bg-green-700"
          href={supportWhatsappUrl}
          rel="noreferrer"
          target="_blank"
        >
          <MessageCircle size={18} suppressHydrationWarning />
          Consultar por WhatsApp
        </a>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-base font-bold text-zinc-950 dark:text-zinc-100">Medios de pago</h2>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {paymentItems.map((payment) => (
            <div
              className="flex h-10 items-center justify-center rounded-lg border border-zinc-200 bg-white px-2 dark:border-zinc-800 dark:bg-zinc-950"
              key={payment.label}
            >
              <Image alt={payment.label} className={`${payment.imageClassName} object-contain`} height={32} src={payment.src} width={70} />
            </div>
          ))}
        </div>
        <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          <CircleDollarSign size={17} suppressHydrationWarning />
          Efectivo / Transferencia
        </p>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-base font-bold text-zinc-950 dark:text-zinc-100">Ubicación del taller</h2>
        <div className="mt-4 flex gap-3">
          <MapPin className="mt-1 shrink-0 text-red-600 dark:text-red-400" size={22} suppressHydrationWarning />
          <div className="text-sm text-zinc-700 dark:text-zinc-300">
            <p className="font-semibold">Av. Los Proceres 123</p>
            <p className="mt-1 text-zinc-500 dark:text-zinc-400">San Martin de Porres, Lima</p>
            <button
              className="mt-3 inline-flex font-bold text-red-600 dark:text-red-400"
              onClick={onLocationClick}
              type="button"
            >
              Ver en mapa
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-amber-200 bg-amber-50/70 p-5 text-center shadow-sm transition-colors duration-300 dark:border-amber-900 dark:bg-amber-950/20">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400 text-zinc-950 shadow-sm dark:bg-amber-500">
          <Lightbulb size={23} suppressHydrationWarning />
        </span>
        <h2 className="mt-3 text-base font-bold leading-snug text-zinc-950 dark:text-zinc-100">
          Cuéntanos qué quieres mejorar
        </h2>
        <p className="mt-2 text-sm font-semibold text-zinc-600 dark:text-zinc-400">
          Tu sugerencia se guardará para que el equipo la revise
        </p>
        <button
          className="mt-5 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-zinc-950 px-4 py-3 text-center text-sm font-bold leading-tight text-white shadow-sm transition-colors hover:bg-zinc-800 dark:bg-amber-500 dark:text-zinc-950 dark:hover:bg-amber-400"
          onClick={onSuggestionClick}
          type="button"
        >
          <Lightbulb size={17} suppressHydrationWarning />
          Enviar sugerencia
        </button>
      </section>
    </aside>
  );
}
