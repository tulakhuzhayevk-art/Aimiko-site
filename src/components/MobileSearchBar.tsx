"use client";
import { Search, X } from "lucide-react";

type Props = {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  setSearchFocused: (v: boolean) => void;
  activeCategoryId?: string | null;
  setActiveCategoryId?: (v: string | null) => void;
};

export function MobileSearchBar({
  searchQuery,
  setSearchQuery,
  setSearchFocused,
  activeCategoryId,
  setActiveCategoryId,
}: Props) {
  const inputClass =
    "w-full bg-transparent px-3 text-sm outline-none";
  const wrapClass =
    "flex h-11 w-full items-center rounded-2xl border " +
    "px-4 transition focus-within:border-[#00FF99]/50";
  return (
    <div
      className="md:hidden border-t px-4 py-2.5"
      style={{ borderColor: "var(--border)" }}
    >
      <div
        className={wrapClass}
        style={{
          borderColor: "var(--border)",
          background: "var(--bg-soft)",
        }}
      >
        <Search size={18} className="text-[#00FF99]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (
              e.target.value.trim() &&
              activeCategoryId &&
              setActiveCategoryId
            ) {
              setActiveCategoryId(null);
            }
          }}
          onFocus={() => setSearchFocused(true)}
          onBlur={() =>
            setTimeout(() => setSearchFocused(false), 200)
          }
          placeholder="Поиск товаров, моделей..."
          className={inputClass}
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
    </div>
  );
}
