"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  Grid3X3,
  List,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Search,
  Send,
  ShoppingCart,
  SlidersHorizontal,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { CartDrawer } from "@/components/CartDrawer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { categories, subcategories } from "@/data/categories";
import { type Product } from "@/data/products";
import { products as localProducts } from "@/data/products";
import { getProducts } from "@/sanity/queries";
import { useCart } from "@/lib/cart-context";

const PRODUCTS_PER_PAGE = 12;
const sortOptions = [
  { id: "popular", label: "По популярности" },
  { id: "price-asc", label: "Сначала дешёвые" },
  { id: "price-desc", label: "Сначала дорогие" },
  { id: "new", label: "Новинки" },
  { id: "name", label: "По названию" },
];

function parsePrice(price: string): number {
  const digits = price.replace(/\D/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };

function CatalogProductCard({ product, view }: { product: Product; view: "grid" | "list" }) {
  const { addItem, isInCart } = useCart();
  const inCart = isInCart(product.id);
  const handleAddToCart = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); addItem(product); };

  if (view === "list") {
    return (
      <motion.div variants={fadeUp}>
        <Link href={`/catalog/${product.id}`} className="flex gap-5 rounded-2xl border p-4 transition hover:border-[#00FF99]/40" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}>
          <div className="h-32 w-32 shrink-0 overflow-hidden rounded-xl" style={{ background: "var(--bg-deeper)" }}>
            <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          </div>
          <div className="flex flex-1 flex-col justify-between">
            <div>
              <p className="text-xs" style={{ color: "var(--text-faint)" }}>{product.category}</p>
              <h3 className="mt-1 text-lg font-bold">{product.name}</h3>
              <p className="mt-1 line-clamp-2 text-sm" style={{ color: "var(--text-muted)" }}>{product.description}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {product.shortSpecs.slice(0, 4).map((s) => (
                  <span key={s} className="rounded-lg border px-2 py-0.5 text-xs" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>{s}</span>
                ))}
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-end gap-2">
                <span className="text-2xl font-black text-[#00FF99]">{product.price}</span>
                {product.oldPrice && <span className="text-sm line-through" style={{ color: "var(--text-faint)" }}>{product.oldPrice}</span>}
              </div>
              <button onClick={handleAddToCart} className={`h-10 rounded-xl px-5 text-sm font-semibold transition ${inCart ? "border border-[#00FF99]/30 bg-[#00FF99]/10 text-[#00FF99]" : "bg-[#00FF99] text-black hover:shadow-[0_0_25px_rgba(0,255,153,0.2)]"}`}>
                {inCart ? "✓ В корзине" : "В корзину"}
              </button>
            </div>
          </div>
          <div className="hidden flex-col items-end justify-between md:flex">
            <div className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${product.status === "В наличии" ? "border-[#00FF99]/30 bg-[#00FF99]/15 text-[#00FF99]" : "border-orange-400/30 bg-orange-500/15 text-orange-300"}`}>{product.status}</div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div variants={fadeUp} whileHover={{ y: -6 }}>
      <Link href={`/catalog/${product.id}`} className="group flex flex-col overflow-hidden rounded-2xl border transition hover:border-[#00FF99]/40" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}>
        <div className="relative aspect-[4/3] overflow-hidden" style={{ background: "var(--bg-deeper)" }}>
          <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {product.oldPrice && <span className="rounded-full bg-[#00FF99] px-2.5 py-0.5 text-[11px] font-bold text-black">Скидка</span>}
            {product.isNew && <span className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-bold text-black">New</span>}
          </div>
          <div className={`absolute right-3 top-3 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${product.status === "В наличии" ? "border-[#00FF99]/30 bg-[#00FF99]/15 text-[#00FF99]" : "border-orange-400/30 bg-orange-500/15 text-orange-300"}`}>{product.status}</div>
        </div>
        <div className="flex flex-1 flex-col p-4">
          <p className="text-xs" style={{ color: "var(--text-faint)" }}>{product.category}</p>
          <h3 className="mt-1 font-bold leading-tight">{product.name}</h3>
          <div className="mt-2 flex flex-wrap gap-1">
            {product.shortSpecs.slice(0, 3).map((s) => (
              <span key={s} className="rounded-lg border px-2 py-0.5 text-[11px]" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>{s}</span>
            ))}
          </div>
          <div className="mt-auto pt-4">
            <div className="flex items-end gap-2">
              <span className="text-xl font-black text-[#00FF99]">{product.price}</span>
              {product.oldPrice && <span className="text-xs line-through" style={{ color: "var(--text-faint)" }}>{product.oldPrice}</span>}
            </div>
          </div>
          <button onClick={handleAddToCart} className={`mt-3 h-10 w-full rounded-xl text-sm font-semibold transition ${inCart ? "border border-[#00FF99]/30 bg-[#00FF99]/10 text-[#00FF99]" : "bg-[#00FF99] text-black hover:shadow-[0_0_25px_rgba(0,255,153,0.2)]"}`}>
            {inCart ? "✓ В корзине" : "В корзину"}
          </button>
        </div>
      </Link>
    </motion.div>
  );
}

export default function CatalogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [activeSubcategoryId, setActiveSubcategoryId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("popular");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 999999]);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const { totalItems, openCart } = useCart();
  const [allProducts, setAllProducts] = useState<Product[]>(localProducts);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    getProducts()
      .then((data) => {
        if (data && data.length > 0) {
          setAllProducts(data);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => { setCurrentPage(1); }, [searchQuery, activeCategoryId, activeSubcategoryId, sortBy, statusFilter]);

  // При смене категории сбрасываем подкатегорию (чтобы не остался "осиротевший" фильтр)
  useEffect(() => { setActiveSubcategoryId(null); }, [activeCategoryId]);

  const filteredProducts = useMemo<Product[]>(() => {
    let result = [...allProducts];
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      result = result.filter((p) => {
        const specsText = (p.specs || []).map((s) => `${s.label} ${s.value}`).join(" ");
        const shortSpecsText = (p.shortSpecs || []).join(" ");
        return [p.name, p.category, p.description, specsText, shortSpecsText]
          .join(" ")
          .toLowerCase()
          .includes(query);
      });
    }
    if (activeCategoryId) result = result.filter((p) => p.categoryId === activeCategoryId);
    if (activeSubcategoryId) result = result.filter((p) => p.subcategoryId === activeSubcategoryId);
    if (statusFilter) result = result.filter((p) => p.status === statusFilter);
    switch (sortBy) {
      case "price-asc": result.sort((a, b) => parsePrice(a.price) - parsePrice(b.price)); break;
      case "price-desc": result.sort((a, b) => parsePrice(b.price) - parsePrice(a.price)); break;
      case "new": result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
      case "name": result.sort((a, b) => a.name.localeCompare(b.name, "ru")); break;
      default: result.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
    }
    return result;
  }, [searchQuery, activeCategoryId, activeSubcategoryId, sortBy, statusFilter, allProducts]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE);
  const activeCategory = activeCategoryId ? categories.find((c) => c.id === activeCategoryId) : null;
  const clearAllFilters = () => { setSearchQuery(""); setActiveCategoryId(null); setActiveSubcategoryId(null); setStatusFilter(null); setSortBy("popular"); };
  const hasActiveFilters = !!activeCategoryId || !!activeSubcategoryId || !!statusFilter;

  const filtersContent = (
    <div className="space-y-6">
      <div>
        <label className="mb-2 block text-sm font-semibold">Поиск</label>
        <div className="flex h-10 items-center rounded-xl border px-3" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
          <Search size={16} className="text-[#00FF99]" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Название, модель..." className="w-full bg-transparent px-2 text-sm outline-none" style={{ color: "var(--text)" }} />
          {searchQuery && <button onClick={() => setSearchQuery("")} style={{ color: "var(--text-faint)" }}><X size={14} /></button>}
        </div>
      </div>
      <div>
        <label className="mb-2 block text-sm font-semibold">Категория</label>
        <div className="space-y-1">
          <button onClick={() => setActiveCategoryId(null)} className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition ${!activeCategoryId ? "bg-[#00FF99]/10 font-semibold text-[#00FF99]" : ""}`} style={activeCategoryId ? { color: "var(--text-muted)" } : {}}>
            <span>Все товары</span><span className="text-xs" style={{ color: "var(--text-faint)" }}>{allProducts.length}</span>
          </button>
          {categories.map((cat) => {
            const count = allProducts.filter((p) => p.categoryId === cat.id).length;
            const isActive = activeCategoryId === cat.id;
            return (
              <button key={cat.id} onClick={() => setActiveCategoryId(isActive ? null : cat.id)} className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition ${isActive ? "bg-[#00FF99]/10 font-semibold text-[#00FF99]" : ""}`} style={!isActive ? { color: "var(--text-muted)" } : {}}>
                <span>{cat.title}</span><span className="text-xs" style={{ color: "var(--text-faint)" }}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>
      {activeCategoryId && (
        <div>
          <label className="mb-2 block text-sm font-semibold">Подкатегория</label>
          <div className="space-y-1">
            <button
              onClick={() => setActiveSubcategoryId(null)}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition ${!activeSubcategoryId ? "bg-[#00FF99]/10 font-semibold text-[#00FF99]" : ""}`}
              style={activeSubcategoryId ? { color: "var(--text-muted)" } : {}}
            >
              <span>Все подкатегории</span>
              <span className="text-xs" style={{ color: "var(--text-faint)" }}>
                {allProducts.filter((p) => p.categoryId === activeCategoryId).length}
              </span>
            </button>
            {subcategories
              .filter((sub) => sub.categoryId === activeCategoryId)
              .map((sub) => {
                const count = allProducts.filter((p) => p.subcategoryId === sub.id).length;
                const isActive = activeSubcategoryId === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setActiveSubcategoryId(isActive ? null : sub.id)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition ${isActive ? "bg-[#00FF99]/10 font-semibold text-[#00FF99]" : ""}`}
                    style={!isActive ? { color: "var(--text-muted)" } : {}}
                  >
                    <span className="text-left">{sub.title}</span>
                    <span className="text-xs shrink-0 ml-2" style={{ color: "var(--text-faint)" }}>
                      {count}
                    </span>
                  </button>
                );
              })}
          </div>
        </div>
      )}
      <div>
        <label className="mb-2 block text-sm font-semibold">Наличие</label>
        <div className="space-y-1">
          {[null, "В наличии", "Под заказ"].map((status) => (
            <button key={status || "all"} onClick={() => setStatusFilter(status)} className={`flex w-full items-center rounded-xl px-3 py-2.5 text-sm transition ${statusFilter === status ? "bg-[#00FF99]/10 font-semibold text-[#00FF99]" : ""}`} style={statusFilter !== status ? { color: "var(--text-muted)" } : {}}>{status || "Все"}</button>
          ))}
        </div>
      </div>
      {hasActiveFilters && <button onClick={clearAllFilters} className="flex w-full items-center justify-center gap-1 rounded-xl border py-2.5 text-sm transition hover:text-[#00FF99]" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}><X size={14} />Сбросить фильтры</button>}
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <CartDrawer />

      <header className="fixed left-0 top-0 z-50 w-full border-b backdrop-blur-xl" style={{ borderColor: "var(--border)", background: "color-mix(in srgb, var(--bg-deeper) 75%, transparent)" }}>
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-5">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Aimiko" className="h-9 w-auto object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          </Link>
          <div className="relative hidden max-w-lg flex-1 lg:flex">
            <div className="flex h-10 w-full items-center rounded-xl border px-4 transition focus-within:border-[#00FF99]/50" style={{ borderColor: "var(--border)", background: "var(--bg-soft)" }}>
              <Search size={16} className="text-[#00FF99]" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Поиск по каталогу..." className="w-full bg-transparent px-3 text-sm outline-none" style={{ color: "var(--text)" }} />
              {searchQuery && <button onClick={() => setSearchQuery("")} style={{ color: "var(--text-faint)" }}><X size={14} /></button>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle className="hidden md:flex" />
            <Link href="/" className="hidden text-sm transition hover:text-[#00FF99] md:block" style={{ color: "var(--text-muted)" }}>← На главную</Link>
            <button onClick={openCart} className="relative flex h-10 w-10 items-center justify-center rounded-xl border transition hover:text-[#00FF99]" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
              <ShoppingCart size={18} />
              {totalItems > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#00FF99] px-1 text-[11px] font-bold text-black">{totalItems}</span>}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-5 pt-24 pb-16">
        <div className="mb-6">
          <div className="flex items-center gap-1.5 text-sm" style={{ color: "var(--text-faint)" }}>
            <Link href="/" className="transition hover:text-[#00FF99]">Главная</Link>
            <ChevronRight size={14} />
            <span style={{ color: "var(--text)" }}>Каталог</span>
            {activeCategory && (<><ChevronRight size={14} /><span style={{ color: "var(--text)" }}>{activeCategory.title}</span></>)}
          </div>
          <h1 className="mt-3 text-3xl font-black lg:text-4xl">{activeCategory ? activeCategory.title : "Каталог"}</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
            {isLoading ? (
              "Загрузка..."
            ) : (
              <>
                {filteredProducts.length} {filteredProducts.length === 1 ? "товар" : filteredProducts.length < 5 ? "товара" : "товаров"}
                {searchQuery && ` по запросу «${searchQuery}»`}
              </>
            )}
          </p>
        </div>

        <div className="flex gap-6">
          <aside className="hidden w-[260px] shrink-0 lg:block">
            <div className="sticky top-24 rounded-2xl border p-5" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}>
              <div className="mb-4 flex items-center gap-2"><SlidersHorizontal size={18} className="text-[#00FF99]" /><span className="font-bold">Фильтры</span></div>
              {filtersContent}
            </div>
          </aside>

          <div className="flex-1">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-3" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}>
              <button onClick={() => setShowMobileFilters(true)} className="flex h-10 items-center gap-2 rounded-xl border px-4 text-sm lg:hidden" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
                <Filter size={16} />Фильтры{hasActiveFilters && <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#00FF99] text-[11px] font-bold text-black">!</span>}
              </button>
              <div className="relative">
                <button onClick={() => setSortDropdownOpen(!sortDropdownOpen)} className="flex h-10 items-center gap-2 rounded-xl border px-4 text-sm" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>{sortOptions.find((o) => o.id === sortBy)?.label}<ChevronDown size={14} /></button>
                {sortDropdownOpen && (<><div className="fixed inset-0 z-10" onClick={() => setSortDropdownOpen(false)} /><div className="absolute left-0 top-12 z-20 w-52 rounded-xl border p-1.5 shadow-xl" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}>{sortOptions.map((opt) => (<button key={opt.id} onClick={() => { setSortBy(opt.id); setSortDropdownOpen(false); }} className={`flex w-full items-center rounded-lg px-3 py-2 text-sm transition ${sortBy === opt.id ? "bg-[#00FF99]/10 font-semibold text-[#00FF99]" : ""}`} style={sortBy !== opt.id ? { color: "var(--text-muted)" } : {}}>{opt.label}</button>))}</div></>)}
              </div>
              <div className="hidden items-center gap-1 md:flex">
                <button onClick={() => setView("grid")} className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${view === "grid" ? "bg-[#00FF99]/10 text-[#00FF99]" : ""}`} style={view !== "grid" ? { color: "var(--text-faint)" } : {}}><Grid3X3 size={18} /></button>
                <button onClick={() => setView("list")} className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${view === "list" ? "bg-[#00FF99]/10 text-[#00FF99]" : ""}`} style={view !== "list" ? { color: "var(--text-faint)" } : {}}><List size={18} /></button>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="mb-4 flex flex-wrap gap-2">
                {activeCategoryId && (
                  <button
                    onClick={() => setActiveCategoryId(null)}
                    className="flex items-center gap-1 rounded-full border border-[#00FF99]/30 bg-[#00FF99]/10 px-3 py-1 text-xs font-semibold text-[#00FF99]"
                  >
                    {activeCategory?.title} <X size={12} />
                  </button>
                )}
                {activeSubcategoryId && (
                  <button
                    onClick={() => setActiveSubcategoryId(null)}
                    className="flex items-center gap-1 rounded-full border border-[#00FF99]/30 bg-[#00FF99]/10 px-3 py-1 text-xs font-semibold text-[#00FF99]"
                  >
                    {subcategories.find((s) => s.id === activeSubcategoryId)?.title} <X size={12} />
                  </button>
                )}
                {statusFilter && (
                  <button
                    onClick={() => setStatusFilter(null)}
                    className="flex items-center gap-1 rounded-full border border-[#00FF99]/30 bg-[#00FF99]/10 px-3 py-1 text-xs font-semibold text-[#00FF99]"
                  >
                    {statusFilter} <X size={12} />
                  </button>
                )}
                <button onClick={clearAllFilters} className="flex items-center gap-1 rounded-full px-3 py-1 text-xs transition hover:text-[#00FF99]" style={{ color: "var(--text-faint)" }}>
                  Сбросить все
                </button>
              </div>
            )}

{isLoading ? (
              <div className={view === "grid" ? "grid gap-5 sm:grid-cols-2 xl:grid-cols-3" : "space-y-4"}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse rounded-2xl border"
                    style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
                  >
                    <div className="aspect-[4/3] rounded-t-2xl" style={{ background: "var(--bg-deeper)" }} />
                    <div className="space-y-3 p-4">
                      <div className="h-3 w-1/3 rounded" style={{ background: "var(--bg-deeper)" }} />
                      <div className="h-4 w-2/3 rounded" style={{ background: "var(--bg-deeper)" }} />
                      <div className="h-6 w-1/2 rounded" style={{ background: "var(--bg-deeper)" }} />
                      <div className="h-10 w-full rounded-xl" style={{ background: "var(--bg-deeper)" }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : paginatedProducts.length > 0 ? (
              <motion.div key={`${activeCategoryId}-${sortBy}-${currentPage}-${view}`} initial="hidden" animate="visible" variants={stagger} className={view === "grid" ? "grid gap-5 sm:grid-cols-2 xl:grid-cols-3" : "space-y-4"}>
                {paginatedProducts.map((product) => <CatalogProductCard key={product.id} product={product} view={view} />)}
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border py-20 text-center" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
                <Search size={48} style={{ color: "var(--text-faint)" }} />
                <p className="mt-4 text-xl font-bold">Ничего не найдено</p>
                <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>Попробуйте изменить фильтры.</p>
                <button onClick={clearAllFilters} className="mt-6 h-10 rounded-xl bg-[#00FF99] px-6 text-sm font-semibold text-black transition hover:scale-105">Сбросить фильтры</button>
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="flex h-10 w-10 items-center justify-center rounded-xl border transition hover:text-[#00FF99] disabled:opacity-30" style={{ borderColor: "var(--border)" }}><ChevronLeft size={18} /></button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).filter((page) => { if (totalPages <= 7) return true; if (page === 1 || page === totalPages) return true; return Math.abs(page - currentPage) <= 1; }).map((page, idx, arr) => {
                  const prev = arr[idx - 1];
                  const showDots = prev && page - prev > 1;
                  return (<span key={page} className="flex items-center gap-2">{showDots && <span style={{ color: "var(--text-faint)" }}>...</span>}<button onClick={() => setCurrentPage(page)} className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold transition ${currentPage === page ? "bg-[#00FF99] text-black" : "border hover:text-[#00FF99]"}`} style={currentPage !== page ? { borderColor: "var(--border)" } : {}}>{page}</button></span>);
                })}
                <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="flex h-10 w-10 items-center justify-center rounded-xl border transition hover:text-[#00FF99] disabled:opacity-30" style={{ borderColor: "var(--border)" }}><ChevronRight size={18} /></button>
              </div>
            )}

            <div className="mt-10 rounded-2xl border border-[#00FF99]/20 p-6 text-center" style={{ background: "var(--accent-soft)" }}>
              <p className="text-lg font-bold">Нужен опт?</p>
              <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>Напишите нам для расчёта оптовой цены на партию от 10 единиц.</p>
              <div className="mt-4 flex justify-center gap-3">
                <a href="https://wa.me/79882564919" target="_blank" rel="noopener noreferrer" className="flex h-10 items-center gap-2 rounded-xl bg-[#00FF99] px-5 text-sm font-semibold text-black transition hover:scale-105"><MessageCircle size={16} /> WhatsApp</a>
                <a href="https://t.me/aimiko" target="_blank" rel="noopener noreferrer" className="flex h-10 items-center gap-2 rounded-xl border px-5 text-sm font-semibold transition hover:text-[#00FF99]" style={{ borderColor: "var(--border)", background: "var(--surface)" }}><Send size={16} /> Telegram</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t px-5 py-12" style={{ borderColor: "var(--border)", background: "var(--bg-deeper)" }}>
        <div className="mx-auto max-w-[1400px]">
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
              <h4 className="font-bold">Каталог</h4>
              <div className="mt-3 space-y-2 text-sm" style={{ color: "var(--text-muted)" }}>
                {categories.map((c) => (<button key={c.id} onClick={() => { setActiveCategoryId(c.id); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="block transition hover:text-[#00FF99]">{c.title}</button>))}
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

      <AnimatePresence>
        {showMobileFilters && (<><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowMobileFilters(false)} className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm lg:hidden" /><motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 28, stiffness: 280 }} className="fixed left-0 top-0 z-[80] h-full w-[320px] overflow-y-auto border-r p-5 lg:hidden" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}><div className="mb-5 flex items-center justify-between"><div className="flex items-center gap-2"><SlidersHorizontal size={18} className="text-[#00FF99]" /><span className="text-lg font-bold">Фильтры</span></div><button onClick={() => setShowMobileFilters(false)} className="flex h-10 w-10 items-center justify-center rounded-xl border" style={{ borderColor: "var(--border)" }}><X size={18} /></button></div>{filtersContent}<button onClick={() => setShowMobileFilters(false)} className="mt-6 h-12 w-full rounded-xl bg-[#00FF99] font-semibold text-black">Показать {filteredProducts.length} товаров</button></motion.div></>)}
      </AnimatePresence>
    </div>
  );
}
