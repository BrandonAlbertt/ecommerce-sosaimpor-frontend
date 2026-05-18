import type { ReactNode } from "react";

import { ThemeProvider } from "@/providers/ThemeProvider";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
