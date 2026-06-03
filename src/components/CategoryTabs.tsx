"use client";
import { type Category } from "@/data/categories";

type Props = {
  categories: Category[];
  activeId: string | null;
  onChange: (id: string | null) => void;
};

export function CategoryTabs({ categories, activeId, onChange }: Props) {
  const baseBtn =
    "whitespace-nowrap rounded-full border px-4 py-2 text-sm transition";
  const activeBtn = "border-transparent bg-[#00FF99] font-semibold text-black";
  const inactiveBtn = "hover:border-[#00FF99]/40";

  return (
    <div
      className="sticky top-[64px] z-30 -mx-5 mb-5 border-b backdrop-blur-xl"
      style={{
        borderColor: "var(--border)",
        background: "color-mix(in srgb, var(--bg) 80%, transparent)",
      }}
    >
      <div className="flex gap-2 overflow-x-auto px-5 py-3 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
        <button
          onClick={() => onChange(null)}
          className={`${baseBtn} ${!activeId ? activeBtn : inactiveBtn}`}
          style={!activeId ? {} : { borderColor: "var(--border)", color: "var(--text)" }}
        >
          Все
        </button>
        {categories.map((cat) => {
          const isActive = activeId === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onChange(cat.id)}
              className={`${baseBtn} ${isActive ? activeBtn : inactiveBtn}`}
              style={isActive ? {} : { borderColor: "var(--border)", color: "var(--text)" }}
            >
              {cat.title}
            </button>
          );
        })}
      </div>
    </div>
  );
}
