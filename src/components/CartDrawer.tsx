"use client";
import Image from "next/image";

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
  const [showCheckoutOptions, setShowCheckoutOptions] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerCity, setCustomerCity] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Наличные");
  const [customerComment, setCustomerComment] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);

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

  const orderMessage = decodeURIComponent(orderText);
  const whatsappLink = `https://wa.me/79895772177?text=${orderText}`;
  const telegramLink = `https://t.me/aimikoorders_bot`;

  const sendOrderToTelegram = async () => {
    if (!customerPhone.trim()) {
      alert("Укажите номер телефона для связи");
      return;
    }

    const res = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: `🛒 Новый заказ Aimiko

👤 Клиент: ${customerName || "Не указано"}
📞 Телефон: ${customerPhone || "Не указано"}
🏙 Город: ${customerCity || "Не указано"}
📍 Адрес: ${customerAddress || "Не указано"}
💳 Оплата: ${paymentMethod}
💬 Комментарий: ${customerComment || "Нет"}

${orderMessage}`,
        name: customerName,
        phone: customerPhone,
        city: customerCity,
        address: customerAddress,
        payment: paymentMethod,
        comment: customerComment,
        items: orderLines,
        total: formatPrice(totalPrice),
      }),
    });

    if (!res.ok) {
      alert("Не получилось отправить заказ. Попробуйте WhatsApp.");
      return;
    }

    setOrderSuccess(true);
    setShowCheckoutOptions(false);
    clear();
    closeCart();
  };

  const handleRemove = (productId: string) => {
    setRemovingId(productId);
    setTimeout(() => {
      removeItem(productId);
      setRemovingId(null);
    }, 300);
  };

  return (
    <AnimatePresence>
      {orderSuccess && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 px-5 md:backdrop-blur-xl"
        >
          <motion.div
            initial={{ scale: 0.94, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.94, y: 20 }}
            className="w-full max-w-md rounded-3xl border p-6 text-center shadow-2xl"
            style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
          >
            <div className="relative mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#00FF99]/15 text-4xl shadow-[0_0_35px_rgba(0,255,153,0.25)]">
              🛵
              <span className="absolute -right-2 -top-1 rounded-full bg-[#00FF99] px-2 py-1 text-xs font-black text-black">
                OK
              </span>
            </div>

            <h2 className="mb-3 text-2xl font-black text-[#00FF99]">
              Мы получили вашу заявку
            </h2>

            <p className="mb-4 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
              Менеджер AIMIKO уже получил заказ и скоро свяжется с вами для подтверждения деталей.
            </p>

            <div className="mb-5 rounded-2xl border p-3 text-left text-xs leading-relaxed" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
              <div className="mb-1 font-bold text-[#00FF99]">Хотите быстрее?</div>
              <div style={{ color: "var(--text-muted)" }}>
                Напишите нам в WhatsApp или Telegram — менеджер сразу увидит ваш диалог и быстрее подтвердит наличие, оплату и доставку.
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 items-center justify-center rounded-xl bg-[#00FF99] font-semibold text-black"
              >
                WhatsApp
              </a>

              <a
                href="https://t.me/Aimiko_Admin"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 items-center justify-center rounded-xl border font-semibold"
                style={{ borderColor: "var(--border)" }}
              >
                Telegram
              </a>
            </div>

            <button
              type="button"
              onClick={() => setOrderSuccess(false)}
              className="mt-4 text-sm transition hover:text-[#00FF99]"
              style={{ color: "var(--text-muted)" }}
            >
              Закрыть
            </button>
          </motion.div>
        </motion.div>
      )}
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
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            width={96}
                            height={96}
                            className="h-full w-full object-cover"
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
                  className="overflow-y-auto p-5"
                  style={{
                    borderTop: "1px solid var(--border)",
                    maxHeight: "75vh",
                    paddingBottom: "calc(1.25rem + env(safe-area-inset-bottom))",
                  }}
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

                  {orderSuccess && (
                    <div className="mb-4 rounded-2xl border border-[#00FF99]/40 bg-[#00FF99]/10 p-5 text-center">
                      <div className="mb-2 text-3xl">🎉</div>
                      <div className="mb-2 text-lg font-black text-[#00FF99]">
                        Заявка принята
                      </div>
                      <p className="mb-4 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                        Менеджер AIMIKO уже получил ваш заказ и скоро свяжется с вами для подтверждения.
                      </p>

                      <div className="grid grid-cols-2 gap-3">
                        <a
                          href={whatsappLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-11 items-center justify-center rounded-xl bg-[#00FF99] font-semibold text-black"
                        >
                          WhatsApp
                        </a>

                        <a
                          href="https://t.me/Aimiko_Admin"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-11 items-center justify-center rounded-xl border font-semibold"
                          style={{ borderColor: "var(--border)" }}
                        >
                          Telegram
                        </a>
                      </div>
                    </div>
                  )}

                  {!orderSuccess && (
                    <button
                      type="button"
                      onClick={() => setShowCheckoutOptions((value) => !value)}
                      className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#00FF99] font-semibold text-black transition hover:scale-[1.02]"
                    >
                      <ShoppingBag size={18} />
                      Оформить заказ
                    </button>
                  )}

                  {!orderSuccess && showCheckoutOptions && (
                    <div className="mt-3 rounded-2xl border p-3" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
                      <div className="mb-4 grid gap-3">
                        <input
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="Ваше имя"
                          className="h-11 rounded-xl border px-3 text-sm outline-none"
                          style={{ borderColor: "var(--border)", background: "var(--bg)", color: "var(--text)" }}
                        />
                        <input
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="Телефон для связи"
                          className="h-11 rounded-xl border px-3 text-sm outline-none"
                          style={{ borderColor: "var(--border)", background: "var(--bg)", color: "var(--text)" }}
                        />
                        <input
                          value={customerCity}
                          onChange={(e) => setCustomerCity(e.target.value)}
                          placeholder="Город"
                          className="h-11 rounded-xl border px-3 text-sm outline-none"
                          style={{ borderColor: "var(--border)", background: "var(--bg)", color: "var(--text)" }}
                        />
                        <input
                          value={customerAddress}
                          onChange={(e) => setCustomerAddress(e.target.value)}
                          placeholder="Адрес доставки"
                          className="h-11 rounded-xl border px-3 text-sm outline-none"
                          style={{ borderColor: "var(--border)", background: "var(--bg)", color: "var(--text)" }}
                        />
                        <select
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="h-11 rounded-xl border px-3 text-sm outline-none"
                          style={{ borderColor: "var(--border)", background: "var(--bg)", color: "var(--text)" }}
                        >
                          <option>Наличные</option>
                          <option>Перевод на карту</option>
                        </select>
                        <textarea
                          value={customerComment}
                          onChange={(e) => setCustomerComment(e.target.value)}
                          placeholder="Комментарий к заказу"
                          className="min-h-20 rounded-xl border px-3 py-2 text-sm outline-none"
                          style={{ borderColor: "var(--border)", background: "var(--bg)", color: "var(--text)" }}
                        />
                      </div>

                      <button
                        type="button"
                        onClick={sendOrderToTelegram}
                        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#00FF99] font-semibold text-black transition hover:scale-[1.02]"
                      >
                        <Send size={16} />
                        Отправить заявку
                      </button>
                    </div>
                  )}

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
