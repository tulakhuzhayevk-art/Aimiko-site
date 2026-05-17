"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Minus,
  Plus,
  Send,
  ShoppingBag,
  Trash2,
  X,
  MessageCircle,
  Package,
  Truck,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { formatPrice, pluralItems, useCart } from "@/lib/cart-context";

const FREE_DELIVERY_THRESHOLD = 50000;

export function CartDrawer() {
  const {
    items,
    totalItems,
    totalPrice,
    totalSavings,
    isOpen,
    closeCart,
    increment,
    decrement,
    removeItem,
    setQuantity,
    clear,
  } = useCart();

  const [removingId, setRemovingId] = useState<string | null>(null);

  const deliveryProgress = Math.min(
    (totalPrice / FREE_DELIVERY_THRESHOLD) * 100,
    100
  );
  const freeDelivery = totalPrice >= FREE_DELIVERY_THRESHOLD;
  const remainingForFreeDelivery = FREE_DELIVERY_THRESHOLD - totalPrice;

  const orderLines = items
    .map(
      (i, idx) =>
        `${idx + 1}. ${i.product.name} — ${i.quantity} шт. × ${i.product.price}`
    )
    .join("\n");

  const orderText = encodeURIComponent(
    `Здравствуйте! Хочу оформить заказ:\n\n${orderLines}\n\nИтого: ${formatPrice(totalPrice)}${
      totalSavings > 0 ? `\nЭкономия: ${formatPrice(totalSavings)}` : ""
    }`
  );

  const whatsappLink = `https://wa.me/79882564919?text=${orderText}`;
  const telegramLink = `https://t.me/aimiko?text=${orderText}`;

  const handleRemove = (productId: string) => {
    setRemovingId(productId);
    setTimeout(() => {
      removeItem(productId);
      setRemovingId(null);
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 z-[90] flex h-full w-full max-w-[440px] flex-col"
            style={{
              background: "var(--bg-elevated)",
              borderLeft: "1px solid var(--border)",
              color: "var(--text)",
            }}
          >
            <header
              className="flex items-center justify-between p-5"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{
                    background: "var(--accent-soft)",
                    color: "var(--accent)",
                  }}
                >
                  <ShoppingBag size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Корзина</h3>
                  <p className="text-sm" style={{ color: "var(--text-faint)" }}>
                    {totalItems} {pluralItems(totalItems)}
                  </p>
                </div>
              </div>
              <button
                onClick={closeCart}
                className="flex h-11 w-11 items-center justify-center rounded-xl border transition hover:opacity-70"
                style={{ borderColor: "var(--border)" }}
              >
                <X size={18} />
              </button>
            </header>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center p-10 text-center">
                <div
                  className="flex h-24 w-24 items-center justify-center rounded-full"
                  style={{ background: "var(--surface)" }}
                >
                  <ShoppingBag
                    size={40}
                    style={{ color: "var(--text-faint)" }}
                  />
                </div>
                <p className="mt-6 text-xl font-bold">Корзина пуста</p>
                <p
                  className="mt-2 max-w-[250px] text-sm"
                  style={{ color: "var(--text-faint)" }}
                >
                  Добавьте товары из каталога, чтобы оформить заказ.
                </p>
                <button
                  onClick={closeCart}
                  className="mt-8 flex h-12 items-center gap-2 rounded-xl bg-[#00FF99] px-6 font-semibold text-black transition hover:scale-105"
                >
                  <Package size={18} />
                  Перейти в каталог
                </button>
              </div>
            ) : (
              <>
                <div className="px-5 pt-4 pb-2">
                  <div
                    className="rounded-2xl p-4"
                    style={{ background: "var(--surface)" }}
                  >
                    <div className="flex items-center gap-2 text-sm">
                      <Truck
                        size={16}
                        style={{
                          color: freeDelivery
                            ? "#00FF99"
                            : "var(--text-faint)",
                        }}
                      />
                      {freeDelivery ? (
                        <span className="font-semibold text-[#00FF99]">
                          Бесплатная доставка!
                        </span>
                      ) : (
                        <span style={{ color: "var(--text-muted)" }}>
                          До бесплатной доставки ещё{" "}
                          <span
                            className="font-semibold"
                            style={{ color: "var(--text)" }}
                          >
                            {formatPrice(remainingForFreeDelivery)}
                          </span>
                        </span>
                      )}
                    </div>
                    <div
                      className="mt-2 h-1.5 w-full overflow-hidden rounded-full"
                      style={{ background: "var(--border)" }}
                    >
                      <motion.div
                        className="h-full rounded-full bg-[#00FF99]"
                        initial={{ width: 0 }}
                        animate={{ width: `${deliveryProgress}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-3">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div
                        key={item.product.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{
                          opacity: removingId === item.product.id ? 0 : 1,
                          y: 0,
                          scale: removingId === item.product.id ? 0.9 : 1,
                        }}
                        exit={{ opacity: 0, x: 100, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mb-3 flex gap-3 rounded-2xl border p-3"
                        style={{
                          borderColor: "var(--border)",
                          background: "var(--surface)",
                        }}
                      >
                        <div
                          className="h-24 w-24 shrink-0 overflow-hidden rounded-xl"
                          style={{ background: "var(--bg-deeper)" }}
                        >
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        </div>

                        <div className="flex flex-1 flex-col justify-between">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-semibold leading-tight">
                                {item.product.name}
                              </p>
                              <p
                                className="mt-0.5 text-xs"
                                style={{ color: "var(--text-faint)" }}
                              >
                                {item.product.category}
                              </p>
                            </div>
                            <button
                              onClick={() => handleRemove(item.product.id)}
                              className="shrink-0 rounded-lg p-1.5 transition hover:bg-red-500/10 hover:text-red-400"
                              style={{ color: "var(--text-faint)" }}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            <div
                              className="flex items-center rounded-xl border"
                              style={{ borderColor: "var(--border)" }}
                            >
                              <button
                                onClick={() => decrement(item.product.id)}
                                className="flex h-9 w-9 items-center justify-center rounded-l-xl transition hover:bg-[#00FF99]/10 hover:text-[#00FF99]"
                              >
                                <Minus size={14} />
                              </button>
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value);
                                  if (!isNaN(val) && val >= 0) {
                                    setQuantity(item.product.id, val);
                                  }
                                }}
                                className="h-9 w-10 border-x bg-transparent text-center text-sm font-semibold outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                style={{ borderColor: "var(--border)" }}
                                min={1}
                              />
                              <button
                                onClick={() => increment(item.product.id)}
                                className="flex h-9 w-9 items-center justify-center rounded-r-xl transition hover:bg-[#00FF99]/10 hover:text-[#00FF99]"
                              >
                                <Plus size={14} />
                              </button>
                            </div>

                            <div className="text-right">
                              <p className="text-sm font-bold text-[#00FF99]">
                                {item.product.price}
                              </p>
                              {item.product.oldPrice && (
                                <p
                                  className="text-xs line-through"
                                  style={{ color: "var(--text-faint)" }}
                                >
                                  {item.product.oldPrice}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  <button
                    onClick={clear}
                    className="mt-1 flex w-full items-center justify-center gap-1 rounded-xl py-2 text-sm transition hover:text-red-400"
                    style={{ color: "var(--text-faint)" }}
                  >
                    <Trash2 size={14} />
                    Очистить корзину
                  </button>
                </div>

                <footer
                  className="p-5"
                  style={{ borderTop: "1px solid var(--border)" }}
                >
                  {totalSavings > 0 && (
                    <div
                      className="mb-3 flex items-center justify-between rounded-xl px-4 py-2.5 text-sm"
                      style={{ background: "rgba(0,255,153,0.08)" }}
                    >
                      <span style={{ color: "var(--text-muted)" }}>
                        Ваша экономия
                      </span>
                      <span className="font-bold text-[#00FF99]">
                        − {formatPrice(totalSavings)}
                      </span>
                    </div>
                  )}

                  <div className="mb-4 flex items-baseline justify-between">
                    <div>
                      <span
                        className="text-sm"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Итого
                      </span>
                      <span
                        className="ml-2 text-xs"
                        style={{ color: "var(--text-faint)" }}
                      >
                        {totalItems} {pluralItems(totalItems)}
                      </span>
                    </div>
                    <span className="text-2xl font-black text-[#00FF99]">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>

                  <p
                    className="mb-4 text-xs"
                    style={{ color: "var(--text-faint)" }}
                  >
                    Оптовые цены обсуждаются отдельно после оформления.
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#00FF99] font-semibold text-black transition hover:scale-[1.02]"
                    >
                      <MessageCircle size={18} />
                      WhatsApp
                    </a>
                    <a
                      href={telegramLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-12 items-center justify-center gap-2 rounded-xl border font-semibold transition hover:opacity-80"
                      style={{
                        borderColor: "var(--border)",
                        background: "var(--surface)",
                      }}
                    >
                      <Send size={16} />
                      Telegram
                    </a>
                  </div>

                  <button
                    onClick={closeCart}
                    className="mt-3 flex w-full items-center justify-center gap-1 rounded-xl py-3 text-sm transition hover:text-[#00FF99]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Продолжить покупки
                    <ChevronRight size={14} />
                  </button>
                </footer>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
