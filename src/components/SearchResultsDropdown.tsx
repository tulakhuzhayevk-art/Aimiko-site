"use client";
import Image from "next/image";

type SearchProduct = {
  id: string;
  name: string;
  category: string;
  price: string;
  images: string[];
  categoryId: string;
};

type Props = {
  visible: boolean;
  products: SearchProduct[];
  onSelect: (product: SearchProduct) => void;
};

export function SearchResultsDropdown({
  visible,
  products,
  onSelect,
}: Props) {
  if (!visible) return null;
  const wrapCls =
    "fixed left-3 right-3 z-50 overflow-y-auto rounded-2xl " +
    "border p-1.5 shadow-2xl shadow-[#00FF99]/10 " +
    "max-h-[55vh] md:absolute md:left-0 md:right-auto " +
    "md:top-14 md:max-h-[70vh] md:w-full " +
    "md:max-w-[calc(100vw-2rem)] md:p-2";
  const wrapStyle = {
    top: "calc(env(safe-area-inset-top) + 9rem)",
    borderColor: "var(--border)",
    background: "var(--bg-elevated)",
  };
  const itemCls =
    "flex w-full items-center gap-2.5 rounded-xl " +
    "p-2 text-left transition hover:bg-white/5";
  return (
    <div className={wrapCls} style={wrapStyle}>
      {products.length > 0 ? (
        <div className="space-y-0.5">
          {products.map((p) => (
            <button
              key={p.id}
              onClick={() => onSelect(p)}
              className={itemCls}
            >
              <div
                className="h-11 w-11 shrink-0 overflow-hidden rounded-lg"
                style={{ background: "var(--bg-deeper)" }}
              >
                <Image
                  src={p.images[0]}
                  alt=""
                  width={44}
                  height={44}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-sm font-semibold">
                  {p.name}
                </p>
                <p
                  className="line-clamp-1 text-[11px]"
                  style={{ color: "var(--text-faint)" }}
                >
                  {p.category}
                </p>
              </div>
              <p className="shrink-0 text-sm font-bold text-[#00FF99]">
                {p.price}
              </p>
            </button>
          ))}
        </div>
      ) : (
        <div
          className="py-6 text-center text-sm"
          style={{ color: "var(--text-faint)" }}
        >
          Ничего не найдено
        </div>
      )}
    </div>
  );
}
