"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MessageCircle,
  Minus,
  Plus,
  Share2,
  X,
} from "lucide-react";
import { useState } from "react";
import type { Product } from "@/data/products";
import { useCart } from "@/lib/cart-context";

export function ProductModal({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const [imageIndex, setImageIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const { addItem, isInCart } = useCart();

  if (!product) return null;

  const hasManyImages = product.images.length > 1;
  const inCart = isInCart(product.id);

  const nextImage = () =>
    setImageIndex((c) => (c + 1) % product.images.length);
  const prevImage = () =>
    setImageIndex(
      (c) => (c - 1 + product.images.length) % product.images.length
    );

  const handleAddToCart = () => {
    addItem(product, qty);
    setQty(1);
  };

  const whatsappLink = `https://wa.me/79882564919?text=${encodeURIComponent(
    `Здравствуйте! Интересует оптовая цена на ${product.name}.`
  )}`;

  const shareLink = () => {
    const url = `${window.location.origin}/catalog/${product.id}`;
    if (navigator.share) {
      navigator.share({ title: product.name, url });
    } else {
      navigator.clipboard.writeText(url);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-h-[90vh] w-full max-w-[900px] overflow-y-auto rounded-3xl border"
          style={{
            background: "var(--bg-elevated)",
            borderColor: "var(--border)",
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-xl border backdrop-blur-md transition hover:text-[#00FF99]"
            style={{
              borderColor: "var(--border)",
              background: "var(--surface)",
            }}
          >
            <X size={18} />
          </button>

          <div className="grid md:grid-cols-2">
            {/* Image gallery */}
            <div
              className="relative aspect-square overflow-hidden md:rounded-l-3xl"
              style={{ background: "var(--bg-deeper)" }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={product.images[imageIndex]}
                  src={product.images[imageIndex]}
                  alt={product.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </AnimatePresence>

              {/* Badges */}
              <div className="absolute left-4 top-4 flex flex-col gap-1.5">
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

              {/* Image nav */}
              {hasManyImages && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/50 backdrop-blur-md transition hover:bg-[#00FF99] hover:text-black"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/50 backdrop-blur-md transition hover:bg-[#00FF99] hover:text-black"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}

              {/* Thumbnails */}
              {hasManyImages && (
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={img}
                      onClick={() => setImageIndex(idx)}
                      className={`h-12 w-12 overflow-hidden rounded-lg border-2 transition ${
                        imageIndex === idx
                          ? "border-[#00FF99]"
                          : "border-white/20 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img}
                        alt=""
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product info */}
            <div className="flex flex-col p-6 md:p-8">
              <p className="text-sm" style={{ color: "var(--text-faint)" }}>
                {product.category}
              </p>
              <h2 className="mt-1 text-2xl font-black md:text-3xl">
                {product.name}
              </h2>

              {/* Status */}
              <div className="mt-3">
                <span
                  className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold ${
                    product.status === "В наличии"
                      ? "border-[#00FF99]/30 bg-[#00FF99]/15 text-[#00FF99]"
                      : "border-orange-400/30 bg-orange-500/15 text-orange-300"
                  }`}
                >
                  {product.status}
                </span>
              </div>

              {/* Description */}
              <p
                className="mt-4 text-sm leading-relaxed"
                style={{ color: "var(--text-muted)" }}
              >
                {product.description}
              </p>

              {/* Specs */}
{product.specs && product.specs.length > 0 && (
  <div className="mt-5 grid grid-cols-2 gap-2">
    {product.specs.map((spec, idx) => (
      <div
        key={`${spec.label}-${idx}`}
        className="rounded-xl border px-3 py-2 text-sm"
        style={{
          borderColor: "var(--border)",
          background: "var(--surface)",
        }}
      >
        <span style={{ color: "var(--text-faint)" }}>{spec.label}:</span>{" "}
        <span className="font-medium">{spec.value}</span>
      </div>
    ))}
  </div>
)}

              {/* Price */}
              <div className="mt-6">
                <p
                  className="text-sm"
                  style={{ color: "var(--text-faint)" }}
                >
                  Розничная цена
                </p>
                <div className="mt-1 flex items-end gap-3">
                  <span className="text-3xl font-black text-[#00FF99]">
                    {product.price}
                  </span>
                  {product.oldPrice && (
                    <span
                      className="mb-1 text-sm line-through"
                      style={{ color: "var(--text-faint)" }}
                    >
                      {product.oldPrice}
                    </span>
                  )}
                </div>
                <div className="mt-2 rounded-xl border border-[#00FF99]/20 bg-[#00FF99]/5 px-4 py-2.5">
                  <p
                    className="text-xs"
                    style={{ color: "var(--text-faint)" }}
                  >
                    Оптовая цена
                  </p>
                  <p className="font-semibold text-[#00FF99]">
                    {product.wholesalePrice} • зависит от количества
                  </p>
                </div>
              </div>

              {/* Quantity + Add to cart */}
              <div className="mt-6 flex items-center gap-3">
                <div
                  className="flex items-center rounded-xl border"
                  style={{ borderColor: "var(--border)" }}
                >
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="flex h-11 w-11 items-center justify-center rounded-l-xl transition hover:bg-[#00FF99]/10 hover:text-[#00FF99]"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="flex h-11 w-12 items-center justify-center border-x text-sm font-semibold"
                    style={{ borderColor: "var(--border)" }}
                  >
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="flex h-11 w-11 items-center justify-center rounded-r-xl transition hover:bg-[#00FF99]/10 hover:text-[#00FF99]"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className={`flex h-11 flex-1 items-center justify-center rounded-xl font-semibold transition ${
                    inCart
                      ? "border border-[#00FF99]/30 bg-[#00FF99]/10 text-[#00FF99]"
                      : "bg-[#00FF99] text-black hover:shadow-[0_0_30px_rgba(0,255,153,0.2)]"
                  }`}
                >
                  {inCart ? "✓ В корзине" : `В корзину${qty > 1 ? ` (${qty} шт.)` : ""}`}
                </button>
              </div>

              {/* Action buttons */}
              <div className="mt-4 grid grid-cols-3 gap-2">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 items-center justify-center gap-1.5 rounded-xl border text-sm transition hover:border-[#00FF99]/30 hover:text-[#00FF99]"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--surface)",
                  }}
                >
                  <MessageCircle size={14} />
                  Опт
                </a>
                <a
                  href={`/catalog/${product.id}`}
                  className="flex h-10 items-center justify-center gap-1.5 rounded-xl border text-sm transition hover:border-[#00FF99]/30 hover:text-[#00FF99]"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--surface)",
                  }}
                >
                  <ExternalLink size={14} />
                  Подробнее
                </a>
                <button
                  onClick={shareLink}
                  className="flex h-10 items-center justify-center gap-1.5 rounded-xl border text-sm transition hover:border-[#00FF99]/30 hover:text-[#00FF99]"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--surface)",
                  }}
                >
                  <Share2 size={14} />
                  Поделиться
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
