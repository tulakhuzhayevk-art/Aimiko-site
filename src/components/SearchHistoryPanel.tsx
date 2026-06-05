"use client";
import { Clock, X } from "lucide-react";

type Props = {
  visible: boolean;
  items: string[];
  onPick: (q: string) => void;
  onRemove: (q: string) => void;
  onClear: () => void;
};

export function SearchHistoryPanel({
  visible,
  items,
  onPick,
  onRemove,
  onClear,
}: Props) {
  if (!visible) return null;
  const wrapClass =
    "fixed left-4 right-4 top-24 max-h-[60vh] " +
    "md:absolute md:left-0 md:right-auto md:top-14 " +
    "md:max-h-[70vh] md:w-full md:max-w-[calc(100vw-2rem)] " +
    "overflow-y-auto rounded-2xl border p-4 shadow-2xl";
  const wrapStyle = {
    borderColor: "var(--border)",
    background: "var(--bg-elevated)",
  };
  const itemClass =
    "flex items-center gap-2 rounded-xl border p-2.5 " +
    "transition hover:border-[#00FF99]/30";
  const itemStyle = {
    borderColor: "var(--border-soft)",
    background: "var(--surface)",
  };
  return (
    <div className={wrapClass} style={wrapStyle}>
      <div className="mb-3 flex items-center justify-between">
        <p
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--text-muted)" }}
        >
          Недавние запросы
        </p>
        <button
          onClick={onClear}
          className="text-xs hover:text-[#00FF99]"
          style={{ color: "var(--text-faint)" }}
        >
          Очистить
        </button>
      </div>
      <div className="space-y-1">
        {items.map((q) => (
          <div key={q} className={itemClass} style={itemStyle}>
            <Clock size={16} style={{ color: "var(--text-faint)" }} />
            <button
              onClick={() => onPick(q)}
              className="flex-1 truncate text-left text-sm"
            >
              {q}
            </button>
            <button
              onClick={() => onRemove(q)}
              className="shrink-0"
              style={{ color: "var(--text-faint)" }}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
