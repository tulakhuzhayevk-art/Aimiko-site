import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Aimiko — Оптовые цены на электротранспорт",
  description:
    "Электровелосипеды, электросамокаты, аккумуляторы EVE, DMEGC, BMC DALY. Опт и розница. Самовывоз в Москве, доставка по России и СНГ.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}