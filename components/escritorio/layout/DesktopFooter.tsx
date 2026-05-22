export function DesktopFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mx-auto grid max-w-[1920px] gap-8 px-6 py-8 md:grid-cols-2 lg:grid-cols-5">
        <div>
          <div className="mb-3 flex h-14 w-28 items-center justify-center rounded-xl border border-zinc-200 bg-white text-sm font-black text-zinc-500 transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-400">
            LOGO
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Especialistas en repuestos usados importados. Calidad, confianza y atencion profesional.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase text-zinc-950 dark:text-zinc-100">Contacto</h3>
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">+51 987 654 321</p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">ventas@sosaimport.pe</p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Av. Los Talleres 1234, Lima</p>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase text-zinc-950 dark:text-zinc-100">Horario de atencion</h3>
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">Lunes a viernes: 8:00 am - 6:00 pm</p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Sabados: 8:00 am - 1:00 pm</p>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase text-zinc-950 dark:text-zinc-100">Recojo en taller</h3>
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
            Una vez confirmado tu pedido, coordinamos fecha y horario de recojo.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase text-zinc-950 dark:text-zinc-100">Medios de pago</h3>
          <p className="mt-3 text-sm font-black text-blue-700 dark:text-blue-400">VISA · Mastercard · Yape · BCP</p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Transferencia bancaria · Efectivo</p>
        </div>
      </div>
      <div className="border-t border-zinc-200 px-4 py-4 text-center text-xs text-zinc-500 transition-colors duration-300 dark:border-zinc-800 dark:text-zinc-500">
        2026 SOSA IMPORT. Todos los derechos reservados.
      </div>
    </footer>
  );
}
