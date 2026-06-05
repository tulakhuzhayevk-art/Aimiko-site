"use client";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function MobileHeroCard() {
  return (
    <div
      className="relative mt-8 overflow-hidden rounded-3xl border lg:hidden"
      style={{
        borderColor: "rgba(0, 255, 153, 0.25)",
        background: "var(--bg-elevated)",
        boxShadow:
          "0 0 60px rgba(0, 255, 153, 0.18), inset 0 0 1px rgba(0, 255, 153, 0.5)",
      }}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src="/hero-poster.jpg"
          alt="Aimiko M1 Pro"
          fill
          sizes="(max-width: 768px) 100vw, 600px"
          className="object-cover"
          priority
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.35) 55%, transparent 100%)",
          }}
        />
        <div className="absolute left-4 top-4 rounded-full bg-[#00FF99] px-3 py-1.5 text-xs font-bold text-black shadow-lg">
          🔥 Хит продаж
        </div>
      </div>

      <div className="p-5">
        <p
          className="text-xs uppercase tracking-wide"
          style={{ color: "var(--text-faint)" }}
        >
          Электровелосипеды
        </p>
        <h3 className="mt-1 text-2xl font-black">Aimiko M1 Pro</h3>
        <div className="mt-3 flex items-end gap-2">
          <span className="text-3xl font-black text-[#00FF99]">52 000 ₽</span>
          <span
            className="pb-1 text-sm line-through"
            style={{ color: "var(--text-faint)" }}
          >
            55 400 ₽
          </span>
        </div>
        <Link
          href="/catalog"
          className="mt-5 flex h-12 w-full items-center justify-center gap-1.5 rounded-2xl bg-[#00FF99] font-semibold text-black transition active:scale-95"
        >
          Открыть каталог <ChevronRight size={18} />
        </Link>
      </div>
    </div>
  );
}
