"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Product } from "@/data/products";

export type CartItem = {
  product: Product;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  totalOldPrice: number;
  totalSavings: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: Product, qty?: number) => void;
  removeItem: (productId: string) => void;
  increment: (productId: string) => void;
  decrement: (productId: string) => void;
  setQuantity: (productId: string, qty: number) => void;
  clear: () => void;
  isInCart: (productId: string) => boolean;
  getItemQty: (productId: string) => number;
};

const CartContext = createContext<CartContextType | null>(null);

function parsePrice(price: string): number {
  const digits = price.replace(/\D/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

export function formatPrice(price: number): string {
  return price.toLocaleString("ru-RU") + " ₽";
}

export function pluralItems(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "товар";
  if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100))
    return "товара";
  return "товаров";
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("aimiko-cart");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch (e) {
      console.error("Cart load error", e);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem("aimiko-cart", JSON.stringify(items));
    } catch (e) {
      console.error("Cart save error", e);
    }
  }, [items, hydrated]);

  // Блокируем скролл когда корзина открыта
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const addItem = (product: Product, qty: number = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + qty }
            : i
        );
      }
      return [...prev, { product, quantity: qty }];
    });
    setIsOpen(true);
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const increment = (productId: string) => {
    setItems((prev) =>
      prev.map((i) =>
        i.product.id === productId ? { ...i, quantity: i.quantity + 1 } : i
      )
    );
  };

  const decrement = (productId: string) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.product.id === productId
            ? { ...i, quantity: Math.max(0, i.quantity - 1) }
            : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  const setQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.product.id === productId ? { ...i, quantity: qty } : i
      )
    );
  };

  const clear = () => {
    setItems([]);
    setIsOpen(false);
  };

  const isInCart = (productId: string) =>
    items.some((i) => i.product.id === productId);

  const getItemQty = (productId: string) =>
    items.find((i) => i.product.id === productId)?.quantity || 0;

  const totalItems = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const totalPrice = useMemo(
    () =>
      items.reduce(
        (sum, i) => sum + parsePrice(i.product.price) * i.quantity,
        0
      ),
    [items]
  );

  const totalOldPrice = useMemo(
    () =>
      items.reduce((sum, i) => {
        const old = i.product.oldPrice
          ? parsePrice(i.product.oldPrice)
          : parsePrice(i.product.price);
        return sum + old * i.quantity;
      }, 0),
    [items]
  );

  const totalSavings = useMemo(
    () => totalOldPrice - totalPrice,
    [totalOldPrice, totalPrice]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalPrice,
        totalOldPrice,
        totalSavings,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        toggleCart: () => setIsOpen((o) => !o),
        addItem,
        removeItem,
        increment,
        decrement,
        setQuantity,
        clear,
        isInCart,
        getItemQty,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}