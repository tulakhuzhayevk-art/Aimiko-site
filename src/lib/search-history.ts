const KEY = "aimiko-search-history";
const MAX = 5;

export function getSearchHistory(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addToSearchHistory(query: string): string[] {
  if (typeof window === "undefined") return [];
  const q = query.trim();
  if (!q || q.length < 2) return getSearchHistory();
  const current = getSearchHistory();
  const filtered = current.filter((x) => x.toLowerCase() !== q.toLowerCase());
  const next = [q, ...filtered].slice(0, MAX);
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
  return next;
}

export function removeFromSearchHistory(query: string): string[] {
  if (typeof window === "undefined") return [];
  const current = getSearchHistory();
  const next = current.filter((x) => x !== query);
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
  return next;
}

export function clearSearchHistory(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(KEY);
  } catch {}
}
