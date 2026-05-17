"use client";

import { ThemeProvider } from "@/lib/theme-context";
import { CartProvider } from "@/lib/cart-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <CartProvider>{children}</CartProvider>
    </ThemeProvider>
  );
}