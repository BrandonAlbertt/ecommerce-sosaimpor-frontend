"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

import { Button } from "./Button";

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
        className="h-10 w-10 px-0"
        type="button"
        variant="secondary"
        disabled
      >
        <Sun className="h-5 w-5" suppressHydrationWarning />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      aria-label="Cambiar tema"
      className="h-10 w-10 shrink-0 px-0 transition-colors duration-300"
      type="button"
      variant="secondary"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? (
        <Sun className="h-5 w-5 transition-transform duration-300" suppressHydrationWarning />
      ) : (
        <Moon className="h-5 w-5 transition-transform duration-300" suppressHydrationWarning />
      )}
      <span className="sr-only">Cambiar tema</span>
    </Button>
  );
}
