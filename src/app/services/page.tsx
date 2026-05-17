"use client";

import { Check, ChevronRight, Clock, MapPin, MessageCircle, Phone, Send, Shield, ShoppingCart, Sparkles, Wrench } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { CartDrawer } from "@/components/CartDrawer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getServices, type Service } from "@/sanity/queries";
import { useCart } from "@/lib/cart-context";
const WHATSAPP = "https://wa.me/79882564919";
const TELEGRAM = "https://t.me/Aimiko_Admin"
export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { totalItems, openCart } = useCart();

  useEffect(() => {
    setIsLoading(true);
    getServices()
      .then((data) => setServices(data))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <CartDrawer />

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
        <div className="mb-6 flex items-center gap-1.5 text-sm" style={{ color: "var(--text-faint)" }}>
          <Link href="/" className="transition hover:text-[#00FF99]">Главная</Link>
          <ChevronRight size={14} />
          <span style={{ color: "var(--text)" }}>Услуги</span>
        </div>

        <div className="mb-12 max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold" style={{ borderColor: "rgba(0,255,153,0.3)", background: "rgba(0,255,153,0.08)", color: "#00FF99" }}>
            <Sparkles size={12} /> Сервис Aimiko
          </div>
          <h1 className="text-4xl font-black leading-tight lg:text-6xl">
            Соберём, отремонтируем, <span className="text-[#00FF99]">оживим.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Делаем то, что не получается у других. Аккумуляторы под заказ, ремонт электровелосипедов любых брендов, диагностика с письменным отчётом.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="flex h-12 items-center gap-2 rounded-xl bg-[#00FF99] px-6 text-sm font-bold text-black transition hover:scale-105">
              <MessageCircle size={18} /> Обсудить в WhatsApp
            </a>
            <a href={TELEGRAM} target="_blank" rel="noopener noreferrer" className="flex h-12 items-center gap-2 rounded-xl border px-6 text-sm font-bold transition hover:text-[#00FF99]" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
              <Send size={18} /> Telegram
            </a>
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl border h-96" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }} />
            ))}
          </div>
        ) : services.length > 0 ? (
          <div className="space-y-12 lg:space-y-20">
            {services.map((service) => (
              <Link
                key={service.id}
                href={`/services/${service.id}`}
                className="group grid gap-8 lg:gap-12 lg:grid-cols-2 items-center overflow-hidden rounded-2xl border p-4 lg:p-6 transition hover:border-[#00FF99]/40"
                style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
              >
               <div className="relative aspect-[4/3] overflow-hidden rounded-2xl" style={{ background: "var(--bg-deeper)" }}>
                  {service.images[0] ? (
                    <img src={service.images[0]} alt={service.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Shield size={48} style={{ color: "var(--text-faint)" }} />
                    </div>
                  )}
                  {service.isPopular && (
                    <span className="absolute left-3 top-3 rounded-full bg-[#00FF99] px-2.5 py-0.5 text-[11px] font-bold text-black">
                      Популярно
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-5">
                <h3 className="text-2xl lg:text-3xl font-black leading-tight group-hover:text-[#00FF99]">{service.name}</h3>
                <p className="mt-4 text-base lg:text-lg leading-relaxed" style={{ color: "var(--text-muted)" }}>
                      {service.shortDescription}
                    </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {service.duration && (
                      <span className="flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px]" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
                        <Clock size={11} /> {service.duration}
                      </span>
                    )}
                    {service.warranty && (
                      <span className="flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px]" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
                        <Shield size={11} /> {service.warranty}
                      </span>
                    )}
                  </div>
                  {service.includes && service.includes.length > 0 && (
                      <div className="mt-6">
                        <p className="text-sm font-semibold mb-3">Что входит:</p>
                        <ul className="space-y-2">
                          {service.includes.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "var(--text-muted)" }}>
                              <Check size={16} className="mt-0.5 text-[#00FF99] shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  <div className="mt-7 rounded-2xl border p-5" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
                      <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                          <p className="text-xs" style={{ color: "var(--text-faint)" }}>Стоимость</p>
                          <p className="mt-1 text-3xl font-black text-[#00FF99]">{service.price}</p>
                        </div>
                        <div className="flex h-11 items-center gap-2 rounded-xl bg-[#00FF99] px-5 text-sm font-bold text-black transition group-hover:scale-105">
                          <MessageCircle size={16} /> Подробнее
                        </div>
                      </div>
                    </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border py-20 text-center" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
            <Shield size={48} style={{ color: "var(--text-faint)" }} />
            <p className="mt-4 text-xl font-bold">Услуги скоро появятся</p>
            <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>Загляните позже.</p>
          </div>
        )}

        <div className="mt-12 rounded-2xl border border-[#00FF99]/20 p-6 text-center lg:p-8" style={{ background: "var(--accent-soft)" }}>
          <p className="text-xl font-bold">Не нашли нужную услугу?</p>
          <p className="mt-2 max-w-xl mx-auto text-sm" style={{ color: "var(--text-muted)" }}>
            Напишите нам — обсудим вашу задачу.
          </p>
          <div className="mt-5 flex justify-center gap-3 flex-wrap">
            <a href="https://wa.me/79882564919" target="_blank" rel="noopener noreferrer" className="flex h-10 items-center gap-2 rounded-xl bg-[#00FF99] px-5 text-sm font-semibold text-black transition hover:scale-105">
              <MessageCircle size={16} /> WhatsApp
            </a>
            <a href="https://t.me/Aimiko_Admin" target="_blank" rel="noopener noreferrer" className="flex h-10 items-center gap-2 rounded-xl border px-5 text-sm font-semibold transition hover:text-[#00FF99]" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
              <Send size={16} /> Telegram
            </a>
          </div>
        </div>
      </div>

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