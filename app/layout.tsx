import type { Metadata, Viewport } from "next";
import { MobileFilterProvider } from "@/components/movil/layout/MobileFilterContext";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "SOSA IMPORT | Repuestos usados importados",
  description: "Tienda frontend de autopartes usadas importadas.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <body className="min-h-full overflow-x-hidden bg-white pb-20 text-zinc-950 transition-colors duration-300 dark:bg-zinc-950 dark:text-zinc-100 md:pb-0">
        <Providers>
          <MobileFilterProvider>
            {children}
          </MobileFilterProvider>
        </Providers>
      </body>
    </html>
  );
}
