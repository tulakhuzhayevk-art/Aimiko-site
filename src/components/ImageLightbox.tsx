"use client";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

type Props = {
  images: string[];
  index: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  alt: string;
};

export function ImageLightbox({
  images,
  index,
  onClose,
  onNext,
  onPrev,
  alt,
}: Props) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onNext, onPrev]);

  const btnCls =
    "absolute z-10 flex h-12 w-12 items-center " +
    "justify-center rounded-full bg-white/10 backdrop-blur-md";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{
        background: "rgba(0,0,0,0.95)",
        touchAction: "pinch-zoom",
      }}
      onClick={onClose}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className={btnCls + " right-4"}
        style={{
          top: "calc(env(safe-area-inset-top) + 1rem)",
        }}
      >
        <X size={24} className="text-white" />
      </button>
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className={btnCls + " left-4 top-1/2 -translate-y-1/2"}
          >
            <ChevronLeft size={24} className="text-white" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className={btnCls + " right-4 top-1/2 -translate-y-1/2"}
          >
            <ChevronRight size={24} className="text-white" />
          </button>
        </>
      )}
      <div
        className="relative h-full w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={images[index]}
          alt={alt}
          fill
          sizes="100vw"
          className="object-contain"
          priority
        />
      </div>
      {images.length > 1 && (
        <div
          className="absolute left-1/2 z-10 flex -translate-x-1/2 items-center gap-2"
          style={{
            bottom: "calc(env(safe-area-inset-bottom) + 1.5rem)",
          }}
        >
          {images.map((_, i) => (
            <span
              key={i}
              className={`h-2 rounded-full transition ${
                i === index
                  ? "w-6 bg-[#00FF99]"
                  : "w-2 bg-white/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
