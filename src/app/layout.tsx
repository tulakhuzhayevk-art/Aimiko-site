import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Aimiko — Оптовые цены на электротранспорт",
  description:
    "Электровелосипеды, электросамокаты, аккумуляторы EVE, DMEGC, BMC DALY. Опт и розница. Самовывоз в Москве, доставка по России и СНГ.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/apple-icon.png",
  },
  appleWebApp: {
    capable: true,
    title: "Aimiko",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#00FF99",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
      </head>
      <body>
        <Providers>{children}</Providers>
        <Toaster position="bottom-center" theme="dark" richColors />
      </body>
    </html>
  );
}