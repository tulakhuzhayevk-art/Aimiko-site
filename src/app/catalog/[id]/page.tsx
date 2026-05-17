"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Mail,
  MapPin,
  MessageCircle,
  Minus,
  Phone,
  Plus,
  Send,
  Share2,
  ShoppingCart,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { CartDrawer } from "@/components/CartDrawer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { categories } from "@/data/categories";
import { products as localProducts } from "@/data/products";
import { getProducts } from "@/sanity/queries";
import { useCart } from "@/lib/cart-context";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function ProductPage() {
  const params = useParams();
  const productId = params.id as string;
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { addItem, isInCart, totalItems, openCart } = useCart();
  const [imageIndex, setImageIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "specs">("specs");

  const [allProducts, setAllProducts] = useState(localProducts);

  useEffect(() => {
    setIsLoading(true);
    getProducts()
      .then((data) => {
        if (data && data.length > 0) setAllProducts(data);
        const found = data.find((p) => p.id === productId);
        setProduct(found || null);
      })
      .finally(() => setIsLoading(false));
  }, [productId]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return allProducts.filter((p) => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 4);
  }, [product, allProducts]);;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "var(--bg)", color: "var(--text)" }}>
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#00FF99] border-t-transparent" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "var(--bg)", color: "var(--text)" }}>
        <div className="text-center">
          <p className="text-6xl font-black">404</p>
          <p className="mt-4 text-lg" style={{ color: "var(--text-muted)" }}>Товар не найден</p>
          <Link href="/catalog" className="mt-6 inline-flex h-11 items-center rounded-xl bg-[#00FF99] px-6 font-semibold text-black transition hover:scale-105">Вернуться в каталог</Link>
        </div>
      </div>
    );
  }

  const hasManyImages = product.images.length > 1;
  const inCart = isInCart(product.id);
  const category = categories.find((c) => c.id === product.categoryId);
  const nextImage = () => setImageIndex((c) => (c + 1) % product.images.length);
  const prevImage = () => setImageIndex((c) => (c - 1 + product.images.length) % product.images.length);
  const handleAddToCart = () => { addItem(product, qty); setQty(1); };
  const whatsappLink = `https://wa.me/79882564919?text=${encodeURIComponent(`Здравствуйте! Интересует оптовая цена на ${product.name}.`)}`;
  const shareLink = () => { if (typeof window === "undefined") return; if (navigator.share) { navigator.share({ title: product.name, url: window.location.href }); } else { navigator.clipboard.writeText(window.location.href); } };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <CartDrawer />

      <header className="fixed left-0 top-0 z-50 w-full border-b backdrop-blur-xl" style={{ borderColor: "var(--border)", background: "color-mix(in srgb, var(--bg-deeper) 75%, transparent)" }}>
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-4 px-5">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="Aimiko" className="h-9 w-auto object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            </Link>
            <Link href="/catalog" className="hidden text-sm transition hover:text-[#00FF99] md:block" style={{ color: "var(--text-muted)" }}>← Каталог</Link>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle className="hidden md:flex" />
            <button onClick={openCart} className="relative flex h-10 w-10 items-center justify-center rounded-xl border transition hover:text-[#00FF99]" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
              <ShoppingCart size={18} />
              {totalItems > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#00FF99] px-1 text-[11px] font-bold text-black">{totalItems}</span>}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1200px] px-5 pb-16 pt-24">
        <div className="mb-6 flex items-center gap-1.5 text-sm" style={{ color: "var(--text-faint)" }}>
          <Link href="/" className="transition hover:text-[#00FF99]">Главная</Link>
          <ChevronRight size={14} />
          <Link href="/catalog" className="transition hover:text-[#00FF99]">Каталог</Link>
          {category && (<><ChevronRight size={14} /><span>{category.title}</span></>)}
          <ChevronRight size={14} />
          <span style={{ color: "var(--text)" }}>{product.name}</span>
        </div>

        <motion.div initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }} className="grid gap-8 lg:grid-cols-2">
          {/* Gallery */}
          <motion.div variants={fadeUp}>
            <div className="relative aspect-square overflow-hidden rounded-3xl" style={{ background: "var(--bg-deeper)" }}>
              <AnimatePresence mode="wait">
                <motion.img key={product.images[imageIndex]} src={product.images[imageIndex]} alt={product.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="h-full w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              </AnimatePresence>
              <div className="absolute left-4 top-4 flex flex-col gap-1.5">
                {product.oldPrice && <span className="rounded-full bg-[#00FF99] px-3 py-1 text-xs font-bold text-black">Скидка</span>}
                {product.isNew && <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-black">New</span>}
              </div>
              {hasManyImages && (
                <>
                  <button onClick={prevImage} className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/50 backdrop-blur-md transition hover:bg-[#00FF99] hover:text-black"><ChevronLeft size={20} /></button>
                  <button onClick={nextImage} className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/50 backdrop-blur-md transition hover:bg-[#00FF99] hover:text-black"><ChevronRight size={20} /></button>
                </>
              )}
            </div>
            {hasManyImages && (
              <div className="mt-4 flex gap-3">
                {product.images.map((img, idx) => (
                  <button key={img} onClick={() => setImageIndex(idx)} className={`h-20 w-20 overflow-hidden rounded-xl border-2 transition ${imageIndex === idx ? "border-[#00FF99]" : "border-transparent opacity-50 hover:opacity-100"}`} style={{ background: "var(--bg-deeper)" }}>
                    <img src={img} alt="" className="h-full w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div variants={fadeUp} className="flex flex-col">
            <p className="text-sm" style={{ color: "var(--text-faint)" }}>{product.category}</p>
            <h1 className="mt-1 text-3xl font-black lg:text-4xl">{product.name}</h1>
            <div className="mt-3 flex items-center gap-3">
              <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${product.status === "В наличии" ? "border-[#00FF99]/30 bg-[#00FF99]/15 text-[#00FF99]" : "border-orange-400/30 bg-orange-500/15 text-orange-300"}`}>{product.status}</span>
              <button onClick={shareLink} className="flex items-center gap-1 text-sm transition hover:text-[#00FF99]" style={{ color: "var(--text-faint)" }}><Share2 size={14} />Поделиться</button>
            </div>

            {/* Tabs */}
            <div className="mt-6 flex gap-1 rounded-xl border p-1" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
              <button onClick={() => setActiveTab("specs")} className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition ${activeTab === "specs" ? "bg-[#00FF99] text-black" : ""}`} style={activeTab !== "specs" ? { color: "var(--text-muted)" } : {}}>Характеристики</button>
              <button onClick={() => setActiveTab("description")} className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition ${activeTab === "description" ? "bg-[#00FF99] text-black" : ""}`} style={activeTab !== "description" ? { color: "var(--text-muted)" } : {}}>Описание</button>
            </div>

            <div className="mt-4">
              {activeTab === "specs" ? (
                <div className="space-y-1">
                  {product.specs.map((spec, idx) => (
                    <div key={spec.label} className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: idx % 2 === 0 ? "var(--surface)" : "transparent" }}>
                      <span style={{ color: "var(--text-faint)" }}>{spec.label}</span>
                      <span className="font-semibold">{spec.value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="leading-relaxed" style={{ color: "var(--text-muted)" }}>{product.description}</p>
              )}
            </div>

            {/* Price */}
            <div className="mt-6 rounded-2xl border p-5" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm" style={{ color: "var(--text-faint)" }}>Оптовая цена</p>
                <div className="mt-1 flex items-end gap-3">
                  <span className="text-4xl font-black text-[#00FF99]">{product.wholesalePrice}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs" style={{ color: "var(--text-faint)" }}>Розничная цена</p>
                <div className="flex items-end gap-2 justify-end">
                  <span className="font-bold" style={{ color: "var(--text-muted)" }}>{product.price}</span>
                  {product.oldPrice && <span className="text-sm line-through" style={{ color: "var(--text-faint)" }}>{product.oldPrice}</span>}
                </div>
              </div>
            </div>

              <div className="mt-5 flex items-center gap-3">
                <div className="flex items-center rounded-xl border" style={{ borderColor: "var(--border)" }}>
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="flex h-12 w-12 items-center justify-center rounded-l-xl transition hover:bg-[#00FF99]/10 hover:text-[#00FF99]"><Minus size={16} /></button>
                  <input
                    type="number"
                    value={qty}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (!isNaN(val) && val >= 1) setQty(val);
                    }}
                    className="flex h-12 w-16 items-center border-x bg-transparent text-center font-semibold outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    style={{ borderColor: "var(--border)", color: "var(--text)" }}
                    min={1}
                  />
                  <button onClick={() => setQty((q) => q + 1)} className="flex h-12 w-12 items-center justify-center rounded-r-xl transition hover:bg-[#00FF99]/10 hover:text-[#00FF99]"><Plus size={16} /></button>
                </div>
                <button onClick={handleAddToCart} className={`flex h-12 flex-1 items-center justify-center gap-2 rounded-xl font-bold transition ${inCart ? "border border-[#00FF99]/30 bg-[#00FF99]/10 text-[#00FF99]" : "bg-[#00FF99] text-black hover:shadow-[0_0_35px_rgba(0,255,153,0.2)]"}`}>
                  <ShoppingCart size={18} />
                  {inCart ? "✓ В корзине" : `В корзину${qty > 1 ? ` (${qty} шт.)` : ""}`}
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex h-11 items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition hover:border-[#00FF99]/30 hover:text-[#00FF99]" style={{ borderColor: "var(--border)" }}><MessageCircle size={16} />Запросить опт</a>
                <a href="https://t.me/aimiko" target="_blank" rel="noopener noreferrer" className="flex h-11 items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition hover:border-[#00FF99]/30 hover:text-[#00FF99]" style={{ borderColor: "var(--border)" }}><Send size={16} />Telegram</a>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3 rounded-xl border px-4 py-3" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
              <Truck size={18} className="text-[#00FF99]" />
              <div className="text-sm">
                <p className="font-semibold">Доставка по Москве от 500 ₽</p>
                <p style={{ color: "var(--text-faint)" }}>Самовывоз бесплатно • м. Локомотив</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Related */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold">Похожие товары</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((p) => {
                const pInCart = isInCart(p.id);
                return (
                  <div key={p.id} className="group overflow-hidden rounded-2xl border transition hover:border-[#00FF99]/40" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}>
                    <Link href={`/catalog/${p.id}`}>
                      <div className="aspect-[4/3] overflow-hidden" style={{ background: "var(--bg-deeper)" }}>
                        <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      </div>
                    </Link>
                    <div className="p-4">
                      <p className="text-xs" style={{ color: "var(--text-faint)" }}>{p.category}</p>
                      <Link href={`/catalog/${p.id}`} className="mt-1 block font-bold transition hover:text-[#00FF99]">{p.name}</Link>
                      <p className="mt-2 text-lg font-black text-[#00FF99]">{p.price}</p>
                      <button
                        onClick={() => addItem(p)}
                        className={`mt-3 h-9 w-full rounded-lg text-sm font-semibold transition ${pInCart ? "border border-[#00FF99]/30 bg-[#00FF99]/10 text-[#00FF99]" : "bg-[#00FF99] text-black"}`}
                      >
                        {pInCart ? "✓ В корзине" : "В корзину"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t px-5 py-12" style={{ borderColor: "var(--border)", background: "var(--bg-deeper)" }}>
        <div className="mx-auto max-w-[1200px]">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <span className="text-xl font-black">AIMIKO</span>
              <p className="mt-3 text-sm" style={{ color: "var(--text-muted)" }}>Цифровой прилавок электротранспорта. Опт и розница.</p>
            </div>
            <div>
              <h4 className="font-bold">Контакты</h4>
              <div className="mt-3 space-y-2 text-sm" style={{ color: "var(--text-muted)" }}>
                <a href="tel:+79882564919" className="flex items-center gap-2 transition hover:text-[#00FF99]"><Phone size={14} /> +7 988 256-49-19</a>
                <a href="mailto:info@aimiko.ru" className="flex items-center gap-2 transition hover:text-[#00FF99]"><Mail size={14} /> info@aimiko.ru</a>
                <p className="flex items-start gap-2"><MapPin size={14} className="mt-0.5 shrink-0" />Москва, ул. Вернисажная, 13</p>
              </div>
            </div>
            <div>
              <h4 className="font-bold">Навигация</h4>
              <div className="mt-3 space-y-2 text-sm" style={{ color: "var(--text-muted)" }}>
                <Link href="/" className="block transition hover:text-[#00FF99]">Главная</Link>
                <Link href="/catalog" className="block transition hover:text-[#00FF99]">Каталог</Link>
              </div>
            </div>
            <div>
              <h4 className="font-bold">Соцсети</h4>
              <div className="mt-3 flex gap-3">
                <a href="https://wa.me/79882564919" target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-xl border transition hover:text-[#00FF99]" style={{ borderColor: "var(--border)", background: "var(--surface)" }}><MessageCircle size={16} /></a>
                <a href="https://t.me/aimiko" target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-xl border transition hover:text-[#00FF99]" style={{ borderColor: "var(--border)", background: "var(--surface)" }}><Send size={16} /></a>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t pt-6 text-sm" style={{ borderColor: "var(--border)", color: "var(--text-faint)" }}>
            <p>© {new Date().getFullYear()} Aimiko. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
