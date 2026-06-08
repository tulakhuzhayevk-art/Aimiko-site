"use client";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export function BackButton() {
  const router = useRouter();
  const handleBack = () => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const backCategory = params.get("backCategory");
    if (backCategory) {
      router.push("/catalog?category=" + backCategory);
      return;
    }
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };
  return (
    <button
      onClick={handleBack}
      className="md:hidden mb-4 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm backdrop-blur-md transition hover:bg-[#00FF99] hover:text-black"
      style={{ color: "var(--text)" }}
      aria-label="Назад"
    >
      <ChevronLeft size={18} />
      Назад
    </button>
  );
}
