"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/compartidos/ui/Button";

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function ThemeToggle() {
  const mounted = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
  const { resolvedTheme, setTheme } = useTheme();

  if (!mounted) {
    return (
      <Button
        aria-label="Cambiar tema"
        className="h-12 w-12 px-0"
        type="button"
        variant="secondary"
        disabled
      >
        <Sun style={{ height: 32, width: 32 }} strokeWidth={2.8} suppressHydrationWarning />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      aria-label="Cambiar tema"
      className="h-12 w-12 shrink-0 px-0 transition-colors duration-300"
      type="button"
      variant="secondary"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? (
        <Sun style={{ height: 32, width: 32 }} strokeWidth={2.8} suppressHydrationWarning />
      ) : (
        <Moon style={{ height: 32, width: 32 }} strokeWidth={2.8} suppressHydrationWarning />
      )}
      <span className="sr-only">Cambiar tema</span>
    </Button>
  );
}
