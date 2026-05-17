"use client";

import {
  Check,
  ChevronLeft,
  Clock,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Shield,
  ShoppingCart,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { CartDrawer } from "@/components/CartDrawer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getService, type Service } from "@/sanity/queries";
import { useCart } from "@/lib/cart-context";

const WHATSAPP = "https://wa.me/79882564919";
const TELEGRAM = "https://t.me/Aimiko_Admin";

export default function ServicePage() {
  const params = useParams();
  const id = params?.id as string;
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { totalItems, openCart } = useCart();

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    getService(id)
      .then((data) => setService(data))
      .finally(() => setIsLoading(false));
  }, [id]);

  const buildWhatsappLink = (name: string) =>
    `${WHATSAPP}?text=${encodeURIComponent(`Здравствуйте! Интересует услуга: ${name}`)}`;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <CartDrawer />

      {/* Header */}
      <header
        className="fixed left-0 top-0 z-50 w-full border-b backdrop-blur-xl"
        style={{ borderColor: "var(--border)", background: "color-mix(in srgb, var(--bg-deeper) 75%, transparent)" }}
      >
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-5">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Aimiko" className="h-9 w-auto object-contain" />
          </Link>
          <nav className="hidden items-center gap-6 text-sm md:flex" style={{ color: "var(--text-muted)" }}>
            <Link href="/catalog" className="transition hover:text-[#00FF99]">Каталог</Link>
            <Link href="/services" className="text-[#00FF99]">Услуги</Link>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle className="hidden md:flex" />
            <Link href="/" className="hidden text-sm transition hover:text-[#00FF99] md:block" style={{ color: "var(--text-muted)" }}>
              ← На главную
            </Link>
            <button
              onClick={openCart}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border transition hover:text-[#00FF99]"
              style={{ borderColor: "var(--border)", background: "var(--surface)" }}
            >
              <ShoppingCart size={18} />
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#00FF99] px-1 text-[11px] font-bold text-black">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-5 pt-24 pb-16">
        {/* Назад к услугам */}
        <Link href="/services" className="mb-6 inline-flex items-center gap-1 text-sm transition hover:text-[#00FF99]" style={{ color: "var(--text-muted)" }}>
          <ChevronLeft size={16} /> Все услуги
        </Link>

        {isLoading ? (
          <div className="animate-pulse rounded-3xl border h-96" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }} />
        ) : service ? (
          <div className="grid gap-10 lg:grid-cols-2">
            {/* Фото слева */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border" style={{ borderColor: "var(--border)", background: "var(--bg-deeper)" }}>
              {service.images[0] ? (
                <img src={service.images[0]} alt={service.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Wrench size={64} style={{ color: "var(--text-faint)" }} />
                </div>
              )}
            </div>

            {/* Контент справа */}
            <div>
              <h1 className="text-3xl font-black leading-tight lg:text-5xl">{service.name}</h1>

              <p className="mt-5 text-base leading-relaxed lg:text-lg" style={{ color: "var(--text-muted)" }}>
                {service.description}
              </p>

              {/* Мета-чипы */}
              <div className="mt-6 flex flex-wrap gap-2">
                {service.duration && (
                  <span className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
                    <Clock size={13} className="text-[#00FF99]" /> {service.duration}
                  </span>
                )}
                {service.warranty && (
                  <span className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
                    <Shield size={13} className="text-[#00FF99]" /> Гарантия {service.warranty}
                  </span>
                )}
                {service.location && (
                  <span className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
                    <MapPin size={13} className="text-[#00FF99]" /> {service.location}
                  </span>
                )}
              </div>
              {/* Что входит */}
              {service.includes && service.includes.length > 0 && (
                <div className="mt-7 rounded-2xl border p-5" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
                  <p className="text-base font-bold mb-4">Что входит в услугу:</p>
                  <ul className="space-y-3">
                    {service.includes.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm" style={{ color: "var(--text-muted)" }}>
                        <Check size={18} className="mt-0.5 text-[#00FF99] shrink-0" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Цена + CTA */}
              <div className="mt-7 rounded-2xl border p-5" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-xs" style={{ color: "var(--text-faint)" }}>Стоимость</p>
                    <p className="mt-1 text-3xl font-black text-[#00FF99]">{service.price}</p>
                  </div>
                  <div className="flex gap-2">
                    <a href={buildWhatsappLink(service.name)} target="_blank" rel="noopener noreferrer" className="flex h-11 items-center gap-2 rounded-xl bg-[#00FF99] px-5 text-sm font-bold text-black transition hover:scale-105">
                      <MessageCircle size={16} /> WhatsApp
                    </a>
                    <a href={TELEGRAM} target="_blank" rel="noopener noreferrer" className="flex h-11 items-center gap-2 rounded-xl border px-5 text-sm font-bold transition hover:text-[#00FF99]" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}>
                      <Send size={16} /> Telegram
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border py-20 text-center" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
            <Shield size={48} style={{ color: "var(--text-faint)" }} />
            <p className="mt-4 text-xl font-bold">Услуга не найдена</p>
            <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
              Возможно, она была удалена.
            </p>
            <Link href="/services" className="mt-6 flex h-11 items-center gap-2 rounded-xl bg-[#00FF99] px-5 text-sm font-bold text-black">
              К списку услуг
            </Link>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t px-5 py-12" style={{ borderColor: "var(--border)", background: "var(--bg-deeper)" }}>
        <div className="mx-auto max-w-[1400px] text-center text-sm" style={{ color: "var(--text-faint)" }}>
          <p>© {new Date().getFullYear()} Aimiko. Москва, ул. Вернисажная, 13 (м. Локомотив)</p>
          <p className="mt-2">
            <a href="tel:+79882564919" className="transition hover:text-[#00FF99]">
              <Phone size={12} className="inline mr-1" /> +7 988 256-49-19
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}