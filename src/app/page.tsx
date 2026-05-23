"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  BatteryCharging,
  Bike,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Gauge,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Search,
  Send,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Star,
  Truck,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { CartDrawer } from "@/components/CartDrawer";
import { Preloader } from "@/components/Preloader";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { categories, type Category } from "@/data/categories";
import { type Product } from "@/data/products";
import { getProducts } from "@/sanity/queries";
import { useCart } from "@/lib/cart-context";

/* ───── YouTube SVG icon (lucide не экспортирует Youtube в новых версиях) ───── */
function YoutubeIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  );
}

/* ───── Data ───── */
const heroSlides = [
  { title: "Оптовые цены", accent: "электровелосипеды Aimiko", text: "Собственный бренд • прямые поставки • самовывоз в Москве" },
  { title: "Официальный поставщик", accent: "аккумуляторов EVE, DMEGC и BMS", text: "Честный знак • быстрая отправка по России и СНГ" },
  { title: "Для мастерских и магазинов", accent: "опт и мелкий опт", text: "Аккумуляторы • моторы • контроллеры • запчасти" },
];

const advantages = [
  { icon: ShieldCheck, title: "Собственный бренд", text: "Контроль качества на каждом этапе производства Aimiko." },
  { icon: BatteryCharging, title: "Запас хода 60+ км", text: "Надёжные аккумуляторы EVE, DMEGC, BMC DALY с честным знаком." },
  { icon: Zap, title: "Цены ниже рынка", text: "Прямые поставки. Дешевле, чем у Minako и Ninebot." },
  { icon: Truck, title: "Быстрая доставка", text: "По всей России и СНГ. Самовывоз в Москве (м. Локомотив)." },
  { icon: Wrench, title: "Сервис и сборка", text: "Профессиональная предпродажная подготовка каждой единицы." },
  { icon: Star, title: "Рейтинг 4.9", text: "Более 1000 довольных клиентов. Отзывы на Яндекс.Картах." },
];

const reviews = [
  { name: "Алексей М.", role: "Курьер", text: "Заказал M1 Pro для работы. Откатал уже 3000 км — батарея держит как в день покупки.", rating: 5 },
  { name: "Дмитрий К.", role: "Владелец сервиса", text: "Беру у Aimiko опт уже год. Аккумуляторы EVE приходят с честным знаком, всё чётко.", rating: 5 },
  { name: "Игорь С.", role: "Магазин электротранспорта", text: "Перешёл с Minako — у Aimiko и цены лучше, и общение нормальное. Поставки в срок.", rating: 5 },
];

const deliveryItems = [
  { icon: MapPin, title: "Самовывоз", text: "Москва, ул. Вернисажная, 13. Метро Локомотив. Бесплатно." },
  { icon: Truck, title: "Доставка по Москве", text: "От 500 ₽ при заказе от 5000 ₽. Курьер в день обращения." },
  { icon: Send, title: "По России и СНГ", text: "СДЭК, ПЭК, Деловые Линии. Отправка в день оплаты." },
  { icon: CreditCard, title: "Оплата", text: "Наличные, перевод, безнал для юрлиц. Скидка 5% от 200 000 ₽." },
];

/* ───── Animations ───── */
const fadeUp = {
  hidden: { opacity: 0, y: 45 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

/* ───── Category icon map ───── */
const categoryIcons = { Bike, Zap, BatteryCharging, Wrench } as const;

/* ═══════════════════════════════════════════════════════════════════════════════
   CategoryCard
   ═══════════════════════════════════════════════════════════════════════════════ */
   const categoryIconMap: Record<string, typeof Bike> = {
    "vehicles": Bike,
    "batteries": BatteryCharging,
    "parts": Wrench,
    "assembly": Zap,
  };
  
  function CategoryCard({
    category,
    isActive,
    onClick,
  }: {
    category: Category;
    isActive: boolean;
    onClick: () => void;
  }) {
    const Icon = categoryIconMap[category.id] || Zap;
  
    return (
      <motion.button
        variants={fadeUp}
        whileHover={{ y: -6 }}
        onClick={onClick}
        className="group relative flex min-h-[200px] flex-col justify-between overflow-hidden rounded-3xl border p-7 text-left transition"
        style={{
          borderColor: isActive ? "#00FF99" : "var(--border)",
          background: isActive ? "var(--accent-soft)" : "var(--bg-elevated)",
        }}
      >
        <div
          className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: "var(--accent)" }}
        />
        <div className="relative">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl transition group-hover:scale-110"
            style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
          >
            <Icon size={26} />
          </div>
        </div>
        <div className="relative">
          <h3 className="text-2xl font-black">{category.title}</h3>
          <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
            {category.description}
          </p>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm" style={{ color: "var(--text-faint)" }}>
              {category.count} товаров
            </span>
            <ChevronRight
              size={20}
              className="transition group-hover:translate-x-1"
              style={{ color: "var(--accent)" }}
            />
          </div>
        </div>
      </motion.button>
    );
  }

/* ═══════════════════════════════════════════════════════════════════════════════
   ProductCard
   ═══════════════════════════════════════════════════════════════════════════════ */
function ProductCard({ product }: { product: Product }) {
  const [imageIndex, setImageIndex] = useState(0);
  const { addItem } = useCart();
  const hasManyImages = product.images.length > 1;

  const nextImage = () =>
    setImageIndex((c) => (c + 1) % product.images.length);
  const prevImage = () =>
    setImageIndex((c) => (c - 1 + product.images.length) % product.images.length);

  return (
    <Link href={`/catalog/${product.id}`} className="block">
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -8 }}
      className="group flex flex-col overflow-hidden rounded-[28px] border shadow-xl shadow-black/20 transition cursor-pointer"
      style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
    >
      {/* Image area */}
      <div
        className="relative aspect-[4/3] overflow-hidden"
        style={{ background: "var(--bg-deeper)" }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={product.images[imageIndex]}
            src={product.images[imageIndex]}
            alt={product.name}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </AnimatePresence>

        {/* Badges */}
        <div className="absolute left-4 top-4 flex flex-col gap-2">
          {product.oldPrice && (
            <span className="rounded-full bg-[#00FF99] px-3 py-1 text-xs font-bold text-black">
              Скидка
            </span>
          )}
          {product.isNew && (
            <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-black">
              New
            </span>
          )}
        </div>

        {/* Status */}
        <div
          className={`absolute right-4 top-4 rounded-full border px-3 py-1 text-xs font-semibold ${
            product.status === "В наличии"
              ? "border-[#00FF99]/50 bg-black/60 text-[#00FF99] backdrop-blur-sm"
              : "border-orange-400/30 bg-orange-500/15 text-orange-300"
          }`}
        >
          {product.status}
        </div>

        {/* Image nav */}
        {hasManyImages && (
          <>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); e.preventDefault(); prevImage(); }}
              className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/50 opacity-0 backdrop-blur-md transition hover:bg-[#00FF99] hover:text-black group-hover:opacity-100"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); e.preventDefault(); nextImage(); }}
              className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/50 opacity-0 backdrop-blur-md transition hover:bg-[#00FF99] hover:text-black group-hover:opacity-100"
            >
              <ChevronRight size={18} />
            </button>
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2">
              {product.images.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); e.preventDefault(); setImageIndex(index); }}
                  className={`h-2 rounded-full transition ${
                    imageIndex === index
                      ? "w-6 bg-[#00FF99]"
                      : "w-2 bg-white/35 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col p-6">
        <p className="text-sm" style={{ color: "var(--text-faint)" }}>
          {product.category}
        </p>
        <h4 className="mt-1 text-xl font-semibold">{product.name}</h4>
        <p
                    className="mt-3 line-clamp-2 text-sm leading-relaxed"
          style={{ color: "var(--text-muted)" }}
        >
          {product.description}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-2">
          {product.shortSpecs.map((spec) => (
            <div
              key={spec}
              className="rounded-xl border px-3 py-2 text-sm"
              style={{ borderColor: "var(--border)", background: "var(--surface)" }}
            >
              {spec}
            </div>
          ))}
        </div>

        <div className="mt-7">
          <p className="text-sm" style={{ color: "var(--text-faint)" }}>
            Розничная цена
          </p>
          <div className="mt-1 flex items-end gap-3">
            <p className="text-3xl font-black text-[#00FF99]">
              {product.price}
            </p>
            {product.oldPrice && (
              <p
                className="mb-1 text-sm line-through"
                style={{ color: "var(--text-faint)" }}
              >
                {product.oldPrice}
              </p>
            )}
          </div>
          <div className="mt-3 rounded-2xl border border-[#00FF99]/20 bg-[#00FF99]/5 px-4 py-3">
            <p className="text-xs" style={{ color: "var(--text-faint)" }}>
              Оптовая цена
            </p>
            <p className="font-semibold text-[#00FF99]">
              {product.wholesalePrice} • зависит от количества
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
        <button
            onClick={(e) => { e.stopPropagation(); e.preventDefault(); addItem(product); }}
            className="h-12 rounded-xl bg-[#00FF99] font-semibold text-black transition hover:shadow-[0_0_35px_rgba(0,255,153,0.25)]"
          >
            В корзину
          </button>
            <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              window.open(
                `https://wa.me/79882564919?text=${encodeURIComponent(
                  `Здравствуйте! Интересует оптовая цена на ${product.name}.`
                )}`,
                "_blank",
                "noopener,noreferrer"
              );
            }}
            className="flex h-12 items-center justify-center rounded-xl border transition hover:border-[#00FF99]/30"
            style={{
              borderColor: "var(--border)",
              background: "var(--surface)",
            }}
          >
            Запросить опт
          </button>
          </div>
      </div>
    </motion.div>
    </Link>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   HomePage
   ═══════════════════════════════════════════════════════════════════════════════ */
   export default function HomePage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [activeSlide, setActiveSlide] = useState(0);
    const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const { totalItems, openCart } = useCart();
  
    useEffect(() => {
      getProducts().then((data) => {
        if (data && data.length > 0) setProducts(data);
      });
    }, []);
  
    useEffect(() => {
      const interval = setInterval(
        () => setActiveSlide((c) => (c + 1) % heroSlides.length),
        4000
      );
      return () => clearInterval(interval);
    }, []);

  const activeCategory = useMemo(
    () =>
      activeCategoryId
        ? categories.find((c) => c.id === activeCategoryId) ?? null
        : null,
    [activeCategoryId]
  );

  const filteredProducts = useMemo<Product[]>(() => {
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      return products.filter((p) => {
        const specsText = (p.specs || [])
          .map((s) => `${s.label} ${s.value}`)
          .join(" ");
        const shortSpecsText = (p.shortSpecs || []).join(" ");
        return [p.name, p.category, p.description, specsText, shortSpecsText]
          .join(" ")
          .toLowerCase()
          .includes(query);
      });
    }
    if (activeCategoryId) {
      return products.filter((p) => p.categoryId === activeCategoryId);
    }
    return products.filter((p) => p.isPopular === true).slice(0, 3);
  }, [searchQuery, activeCategoryId, products]);

  const handleSelectCategory = (id: string) => {
    setSearchQuery("");
    setActiveCategoryId(id);
    requestAnimationFrame(() =>
      document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" })
    );
  };

  const handleResetCategory = () => {
    setActiveCategoryId(null);
    setSearchQuery("");
  };

  const catalogTitle = searchQuery.trim()
    ? "Результаты поиска"
    : activeCategory
    ? activeCategory.title
    : "Хиты продаж";

  const catalogSubtitle = searchQuery.trim()
    ? `Найдено: ${filteredProducts.length}`
    : activeCategoryId
    ? "Все товары выбранной категории."
    : "Самые популярные модели Aimiko на сегодня.";

  /* ─── Render ─── */
  return (
    <main
      className="min-h-screen overflow-x-hidden"
      style={{ background: "var(--bg)", color: "var(--text)" }}
    >
      <CartDrawer />
      <Preloader />
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#00FF99]/10 blur-[120px]" />
        <div className="absolute bottom-20 right-0 h-[420px] w-[420px] rounded-full bg-[#00FF99]/5 blur-[140px]" />
      </div>

      {/* ════════════ HEADER ════════════ */}
      <header
        className="fixed left-0 top-0 z-50 w-full border-b backdrop-blur-xl"
        style={{
          borderColor: "var(--border)",
          background: "color-mix(in srgb, var(--bg-deeper) 75%, transparent)",
        }}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5">
          {/* Logo + Nav */}
          <div className="flex items-center gap-10">
            <a href="#top" className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="Aimiko"
                className="h-10 w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
          
            </a>
            <nav
              className="hidden items-center gap-6 text-sm xl:flex"
              style={{ color: "var(--text-muted)" }}
            >
             <a className="transition hover:text-[#00FF99]" href="/catalog">Каталог</a>
             <a className="transition hover:text-[#00FF99]" href="/services">Услуги</a>
              <a className="transition hover:text-[#00FF99]" href="#categories">Категории</a>
              <a className="transition hover:text-[#00FF99]" href="#advantages">Преимущества</a>
              <a className="transition hover:text-[#00FF99]" href="#delivery">Доставка</a>
              <a className="transition hover:text-[#00FF99]" href="#contacts">Контакты</a>
            </nav>
          </div>

          {/* Search */}
          <div className="relative hidden max-w-xl flex-1 lg:flex">
            <div
              className="flex h-12 w-full items-center rounded-2xl border px-5 transition focus-within:border-[#00FF99]/50"
              style={{ borderColor: "var(--border)", background: "var(--bg-soft)" }}
            >
              <Search size={18} className="text-[#00FF99]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value.trim() && activeCategoryId) {
                    setActiveCategoryId(null);
                  }
                }}
                placeholder="Поиск товаров, моделей, запчастей..."
                className="w-full bg-transparent px-4 text-sm outline-none"
                style={{ color: "var(--text)" }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  style={{ color: "var(--text-faint)" }}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Search dropdown */}
            {searchQuery && (
              <div
                className="absolute left-0 top-14 max-h-[70vh] w-full overflow-y-auto rounded-2xl border p-4 shadow-2xl shadow-[#00FF99]/10"
                style={{
                  borderColor: "var(--border)",
                  background: "var(--bg-elevated)",
                }}
              >
                {filteredProducts.length > 0 ? (
                  <div className="space-y-2">
                    {filteredProducts.slice(0, 6).map((product) => (
                      <button
                        key={product.id}
                        onClick={() => {
                          setSearchQuery("");
                          setActiveCategoryId(product.categoryId);
                          requestAnimationFrame(() =>
                            document
                              .getElementById("catalog")
                              ?.scrollIntoView({ behavior: "smooth" })
                          );
                        }}
                        className="flex w-full items-center gap-3 rounded-xl border p-3 text-left transition hover:border-[#00FF99]/30"
                        style={{
                          borderColor: "var(--border-soft)",
                          background: "var(--surface)",
                        }}
                      >
                        <div
                          className="h-12 w-12 shrink-0 overflow-hidden rounded-lg"
                          style={{ background: "var(--bg-deeper)" }}
                        >
                          <img
                            src={product.images[0]}
                            alt=""
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{product.name}</p>
                          <p
                            className="text-sm"
                            style={{ color: "var(--text-faint)" }}
                          >
                            {product.category} • {product.price}
                          </p>
                        </div>
                        <ChevronRight className="text-[#00FF99]" size={18} />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div
                    className="py-8 text-center text-sm"
                    style={{ color: "var(--text-faint)" }}
                  >
                    Ничего не найдено
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Header actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle className="hidden md:flex" />
            <a
              href="https://wa.me/79882564919"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden h-11 w-11 items-center justify-center rounded-xl border transition hover:text-[#00FF99] md:flex"
              style={{
                borderColor: "var(--border)",
                background: "var(--surface)",
              }}
              aria-label="WhatsApp"
            >
              <MessageCircle size={18} />
            </a>
            <button
              onClick={openCart}
              className="relative flex h-11 w-11 items-center justify-center rounded-xl border transition hover:text-[#00FF99]"
              style={{
                borderColor: "var(--border)",
                background: "var(--surface)",
              }}
              aria-label="Корзина"
            >
              <ShoppingCart size={18} />
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#00FF99] px-1 text-[11px] font-bold text-black">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#00FF99] text-black xl:hidden"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* ════════════ MOBILE MENU ════════════ */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] backdrop-blur-2xl xl:hidden"
            style={{
              background: "color-mix(in srgb, var(--bg) 95%, transparent)",
            }}
          >
            <div
              className="flex h-20 items-center justify-between border-b px-5"
              style={{ borderColor: "var(--border)" }}
            >
              <span className="text-2xl font-black">AIMIKO</span>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border"
                  style={{ borderColor: "var(--border)" }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            <nav className="flex flex-col gap-2 p-5 text-lg">
            {[
              ["Каталог", "/catalog"],
              ["Услуги", "/services"],
              ["Категории", "#categories"],
              ["Преимущества", "#advantages"],
              ["Доставка", "#delivery"],
              ["Контакты", "#contacts"],
              ].map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl border px-5 py-4 transition hover:border-[#00FF99]/40 hover:text-[#00FF99]"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--surface)",
                  }}
                >
                  {label}
                </a>
              ))}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <a
                  href="https://wa.me/79882564919"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-14 items-center justify-center gap-2 rounded-xl bg-[#00FF99] font-bold text-black"
                >
                  <MessageCircle size={18} /> WhatsApp
                </a>
                <a
                  href="https://t.me/Aimiko_Admin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-14 items-center justify-center gap-2 rounded-xl border"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--surface)",
                  }}
                >
                  <Send size={18} /> Telegram
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════════════ HERO ════════════ */}
      <section id="top" className="relative px-5 pb-24 pt-32 lg:pt-40">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div
              variants={fadeUp}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#00FF99]/30 bg-[#00FF99]/10 px-4 py-2 text-sm text-[#00FF99]"
            >
              <Sparkles size={16} /> Оптовый цифровой прилавок электротранспорта
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.45 }}
              >
                <h1 className="text-4xl font-black leading-[1.05] tracking-tight lg:text-6xl">
                  {heroSlides[activeSlide].title}
                  <span className="mt-2 block text-[#00FF99]">
                    {heroSlides[activeSlide].accent}
                  </span>
                </h1>
                <p
                  className="mt-6 max-w-xl text-lg leading-relaxed"
                  style={{ color: "var(--text-muted)" }}
                >
                  {heroSlides[activeSlide].text}
                </p>
              </motion.div>
            </AnimatePresence>

            <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-4">
              <a
                href="/catalog"
                className="flex h-14 items-center justify-center rounded-2xl bg-[#00FF99] px-8 font-bold text-black transition hover:scale-[1.04]"
              >
                Открыть каталог
              </a>
              <a
                href="https://wa.me/79882564919"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-14 items-center justify-center gap-2 rounded-2xl border px-8 transition"
                style={{
                  borderColor: "var(--border)",
                  background: "var(--surface)",
                }}
              >
                <MessageCircle size={18} /> Стать партнёром
              </a>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="mt-10 flex flex-wrap gap-6 text-sm"
            >
              <div className="flex items-center gap-2">
                <Star className="fill-[#00FF99] text-[#00FF99]" size={18} />
                <span className="font-semibold">4.9</span>
                <span style={{ color: "var(--text-muted)" }}>Яндекс.Карты</span>
              </div>
              <div style={{ color: "var(--text-muted)" }}>
                <span className="font-semibold" style={{ color: "var(--text)" }}>
                  1000+
                </span>{" "}
                клиентов
              </div>
              <div style={{ color: "var(--text-muted)" }}>
                Скидка{" "}
                <span className="font-semibold text-[#00FF99]">5%</span> от
                200 000 ₽
              </div>
            </motion.div>
          </motion.div>

          {/* Hero video card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 45 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="relative"
          >
            <div className="absolute -inset-10 bg-[#00FF99]/20 blur-[120px]" />
            <div
              className="relative overflow-hidden rounded-[32px] border shadow-2xl shadow-black"
              style={{
                borderColor: "var(--border)",
                background: "var(--bg-elevated)",
              }}
            >
              <div
                className="aspect-[4/3] overflow-hidden"
                style={{ background: "var(--bg-deeper)" }}
              >
                <video
                  src="/hero.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-full w-full object-cover"
                />
              </div>
              <div
                className="border-t p-7"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className="text-sm"
                      style={{ color: "var(--text-faint)" }}
                    >
                      Хит продаж
                    </p>
                    <h3 className="mt-1 text-2xl font-bold">Aimiko M1 Pro</h3>
                  </div>
                  <div className="text-right">
                    <p
                      className="text-sm"
                      style={{ color: "var(--text-faint)" }}
                    >
                      от
                    </p>
                    <p className="text-3xl font-black text-[#00FF99]">
                      52 000 ₽
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════ ADVANTAGES ════════════ */}
      <motion.section
        id="advantages"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={stagger}
        className="px-5 pb-24"
      >
        <div className="mx-auto max-w-7xl">
          <motion.div variants={fadeUp} className="mb-10">
            <h2 className="text-3xl font-bold lg:text-4xl">
              Почему выбирают Aimiko
            </h2>
            <p className="mt-2" style={{ color: "var(--text-muted)" }}>
              6 причин работать с нами на постоянной основе.
            </p>
          </motion.div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {advantages.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  whileHover={{ y: -6 }}
                  className="rounded-3xl border p-7 transition hover:border-[#00FF99]/40"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--bg-elevated)",
                  }}
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#00FF99]/10 text-[#00FF99]">
                    <Icon size={26} />
                  </div>
                  <h3 className="mt-5 text-xl font-bold">{item.title}</h3>
                  <p className="mt-2" style={{ color: "var(--text-muted)" }}>
                    {item.text}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* ════════════ CATEGORIES ════════════ */}
      <motion.section
        id="categories"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="px-5 pb-24"
      >
        <div className="mx-auto max-w-7xl">
          <motion.div
            variants={fadeUp}
            className="mb-10 flex items-center justify-between"
          >
            <div>
              <h2 className="text-3xl font-bold lg:text-4xl">Категории</h2>
              <p className="mt-2" style={{ color: "var(--text-muted)" }}>
                Нажмите, чтобы открыть товары.
              </p>
            </div>
            {activeCategoryId && (
              <button
                onClick={handleResetCategory}
                className="text-[#00FF99] transition hover:opacity-70"
              >
                Сбросить
              </button>
            )}
          </motion.div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {categories.map((category) => {
              const count = products.filter((p) => p.categoryId === category.id).length;
              return (
                <CategoryCard
                  key={category.id}
                  category={{ ...category, count }}
                  isActive={activeCategoryId === category.id}
                  onClick={() => router.push(`/catalog?category=${category.id}`)}
                />
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* ════════════ CATALOG ════════════ */}
      <motion.section
        id="catalog"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="px-5 pb-24"
      >
        <div className="mx-auto max-w-7xl">
          <motion.div
            variants={fadeUp}
            className="mb-10 flex flex-wrap items-center justify-between gap-5"
          >
            <div>
              <h2 className="text-3xl font-bold lg:text-4xl">{catalogTitle}</h2>
              <p className="mt-2" style={{ color: "var(--text-muted)" }}>
                {catalogSubtitle}
              </p>
            </div>
            {(activeCategoryId || searchQuery) && (
              <button
                onClick={handleResetCategory}
                className="h-11 rounded-xl border border-[#00FF99]/30 bg-[#00FF99]/10 px-5 text-sm text-[#00FF99] transition hover:bg-[#00FF99] hover:text-black"
              >
                Показать хиты
              </button>
            )}
          </motion.div>

          {filteredProducts.length > 0 ? (
            <motion.div
              key={activeCategoryId || searchQuery || "main"}
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>
          ) : (
            <div
              className="rounded-[28px] border p-10 text-center"
              style={{
                borderColor: "var(--border)",
                background: "var(--surface)",
              }}
            >
              <p className="text-xl font-bold">Товары скоро появятся</p>
              <p className="mt-2" style={{ color: "var(--text-muted)" }}>
                Загляните позже.
              </p>
            </div>
          )}
        </div>
      </motion.section>

      {/* ════════════ REVIEWS ════════════ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="px-5 pb-24"
      >
        <div className="mx-auto max-w-7xl">
          <motion.div variants={fadeUp} className="mb-10">
            <h2 className="text-3xl font-bold lg:text-4xl">Отзывы клиентов</h2>
            <p className="mt-2" style={{ color: "var(--text-muted)" }}>
              Рейтинг 4.9 на Яндекс.Картах.
            </p>
          </motion.div>
          <div className="grid gap-5 md:grid-cols-3">
            {reviews.map((review) => (
              <motion.div
                key={review.name}
                variants={fadeUp}
                className="rounded-3xl border p-7"
                style={{
                  borderColor: "var(--border)",
                  background: "var(--bg-elevated)",
                }}
              >
                <div className="flex gap-1">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className="fill-[#00FF99] text-[#00FF99]"
                    />
                  ))}
                </div>
                <p
                  className="mt-5 leading-relaxed"
                  style={{ color: "var(--text-muted)" }}
                >
                  «{review.text}»
                </p>
                <div
                  className="mt-6 border-t pt-5"
                  style={{ borderColor: "var(--border)" }}
                >
                  <p className="font-semibold">{review.name}</p>
                  <p className="text-sm" style={{ color: "var(--text-faint)" }}>
                    {review.role}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ════════════ ABOUT ════════════ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="px-5 pb-24"
      >
        <div
          className="mx-auto max-w-5xl rounded-[32px] border p-10 lg:p-14"
          style={{
            borderColor: "var(--border)",
            background: "var(--bg-elevated)",
          }}
        >
          <motion.div variants={fadeUp}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#00FF99]/30 bg-[#00FF99]/10 px-4 py-2 text-sm text-[#00FF99]">
              <Award size={16} />О компании
            </div>
            <h2 className="text-3xl font-bold lg:text-5xl">
              Мы не просто продаём —{" "}
              <span className="block text-[#00FF99]">
                мы даём свободу передвижения
              </span>
            </h2>
            <p
              className="mt-6 max-w-3xl text-lg leading-relaxed"
              style={{ color: "var(--text-muted)" }}
            >
              Aimiko — собственный бренд электротранспорта. Прямые поставки,
              контроль качества на каждом этапе, честные цены и сервис, которому
              доверяют курьеры, мастерские и магазины по всей России.
            </p>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {[
                { num: "1000+", label: "довольных клиентов" },
                { num: "4.9", label: "рейтинг на картах" },
                { num: "200+", label: "позиций в каталоге" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border p-5"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--surface)",
                  }}
                >
                  <p className="text-3xl font-black text-[#00FF99]">{s.num}</p>
                  <p className="mt-1" style={{ color: "var(--text-muted)" }}>
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* ════════════ DELIVERY ════════════ */}
      <motion.section
        id="delivery"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="px-5 pb-24"
      >
        <div className="mx-auto max-w-7xl">
          <motion.div variants={fadeUp} className="mb-10">
            <h2 className="text-3xl font-bold lg:text-4xl">
              Доставка и оплата
            </h2>
            <p className="mt-2" style={{ color: "var(--text-muted)" }}>
              Прозрачные условия для розничных и оптовых покупателей.
            </p>
          </motion.div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {deliveryItems.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  className="rounded-3xl border p-6"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--bg-elevated)",
                  }}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#00FF99]/10 text-[#00FF99]">
                    <Icon size={22} />
                  </div>
                  <h3 className="mt-5 text-lg font-bold">{item.title}</h3>
                  <p
                    className="mt-2 text-sm"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {item.text}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* ════════════ CTA ════════════ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="px-5 pb-24"
      >
        <div className="mx-auto max-w-7xl">
          <motion.div
            variants={fadeUp}
            className="relative overflow-hidden rounded-[32px] border border-[#00FF99]/30 p-10 lg:p-16"
            style={{
              background:
                "linear-gradient(135deg, var(--accent-soft), var(--bg))",
            }}
          >
            <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#00FF99]/30 blur-[120px]" />
            <div className="relative">
              <h2 className="max-w-3xl text-3xl font-black leading-[1.1] lg:text-5xl">
                Готов выбрать свой{" "}
                <span className="block text-[#00FF99]">электротранспорт?</span>
              </h2>
              <p
                className="mt-6 max-w-2xl text-lg"
                style={{ color: "var(--text-muted)" }}
              >
                Напишите нам в WhatsApp или Telegram — подберём модель под
                задачу.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href="/catalog"
                  className="flex h-14 items-center justify-center rounded-2xl bg-[#00FF99] px-8 font-bold text-black transition hover:scale-[1.04]"
                >
                  Открыть каталог
                </a>
                <a
                  href="https://wa.me/79882564919"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-14 items-center justify-center gap-2 rounded-2xl border px-8 transition"
                  style={{
                    borderColor: "rgba(0,255,153,0.3)",
                  background: "rgba(0,255,153,0.1)",
                  color: "#00FF99",
                }}
              >
                <MessageCircle size={18} /> WhatsApp
                </a>
                <a
                  href="https://t.me/Aimiko_Admin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-14 items-center justify-center gap-2 rounded-2xl border px-8 transition"
                  style={{
                    borderColor: "rgba(0,255,153,0.3)",
                  background: "rgba(0,255,153,0.1)",
                  color: "#00FF99",
                }}
              >
                <Send size={18} /> Telegram
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* ════════════ FOOTER ════════════ */}
      <footer
        id="contacts"
        className="border-t px-5 py-16"
        style={{
          borderColor: "var(--border)",
          background: "var(--bg-deeper)",
        }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {/* Col 1 */}
            <div>
              <span className="text-2xl font-black">AIMIKO</span>
              <p
                className="mt-4 text-sm"
                style={{ color: "var(--text-muted)" }}
              >
                Цифровой прилавок электротранспорта. Опт и розница.
              </p>
            </div>
            {/* Col 2 */}
            <div>
              <h4 className="font-bold">Контакты</h4>
              <div
                className="mt-4 space-y-3 text-sm"
                style={{ color: "var(--text-muted)" }}
              >
                <a
                  href="tel:+79882564919"
                  className="flex items-center gap-2 transition hover:text-[#00FF99]"
                >
                  <Phone size={16} /> +7 988 256-49-19
                </a>
                <a
                  href="mailto:aimiko.menegment@mail.ru"
                  className="flex items-center gap-2 transition hover:text-[#00FF99]"
                >
                  <Mail size={16} /> aimiko.menegment@mail.ru
                </a>
                <p className="flex items-start gap-2">
                  <MapPin size={16} className="mt-0.5 shrink-0" />
                  Москва, ул. Вернисажная, 13 (м. Локомотив)
                </p>
              </div>
            </div>
            {/* Col 3 */}
            <div>
            <h4 className="font-bold">Навигация</h4>
              <div
                className="mt-4 space-y-2 text-sm"
                style={{ color: "var(--text-muted)" }}
              >
                <a href="/catalog" className="block transition hover:text-[#00FF99]">
                  Каталог
                </a>
                <a href="/services" className="block transition hover:text-[#00FF99]">
                  Услуги
                </a>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleSelectCategory(c.id)}
                    className="block transition hover:text-[#00FF99]"
                  >
                    {c.title}
                  </button>
                ))}
              </div>
            </div>
            {/* Col 4 */}
            <div>
              <h4 className="font-bold">Соцсети</h4>
              <div className="mt-4 flex gap-3">
                <a
                  href="https://wa.me/79882564919"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-xl border transition hover:text-[#00FF99]"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--surface)",
                  }}
                  aria-label="WhatsApp"
                >
                  <MessageCircle size={18} />
                </a>
                <a
                  href="https://t.me/Aimiko_Admin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-xl border transition hover:text-[#00FF99]"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--surface)",
                  }}
                  aria-label="Telegram"
                >
                  <Send size={18} />
                </a>
                <a
                  href="https://youtube.com/@aimiko_ru"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-xl border transition hover:text-[#00FF99]"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--surface)",
                  }}
                  aria-label="YouTube"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
                </a>
                 </div>
            </div>
          </div>
          <div
            className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t pt-8 text-sm"
            style={{
              borderColor: "var(--border)",
              color: "var(--text-faint)",
            }}
          >
            <p>© {new Date().getFullYear()} Aimiko. Все права защищены.</p>
            <div className="flex items-center gap-1">
              Powered by <Gauge size={16} className="text-[#00FF99]" />{" "}
              <span className="text-[#00FF99]">Aimiko Tech</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

