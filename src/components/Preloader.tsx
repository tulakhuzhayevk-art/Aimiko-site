"use client";

import { Bike } from "lucide-react";
import { motion } from "framer-motion";

export function Preloader() {
  return (
    <motion.div
      id="aimiko-preloader"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 2, duration: 0.6 }}
      onAnimationComplete={() => {
        const el = document.getElementById("aimiko-preloader");
        if (el) el.style.display = "none";
      }}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      <motion.img
        src="/logo.png"
        alt="Aimiko"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-12 mb-16 h-24 w-auto object-contain"
        onError={(e) => { e.currentTarget.style.display = "none"; }}
      />
      <div className="relative h-20 w-[340px]">
        <motion.div
          initial={{ x: -50 }}
          animate={{ x: 290, y: [0, -3, 0, -2, 0] }}
          transition={{
            x: { duration: 2, ease: "easeInOut" },
            y: { duration: 0.4, repeat: Infinity },
          }}
          className="absolute bottom-4"
          style={{ color: "var(--accent)" }}
        >
          <Bike size={48} strokeWidth={2} />
        </motion.div>
        <div
          className="absolute bottom-0 h-1 w-full rounded-full"
          style={{ background: "var(--surface)" }}
        />
        <div className="absolute bottom-0 h-1 w-full overflow-hidden">
          <motion.div
            className="flex gap-3"
            animate={{ x: [0, -60] }}
            transition={{ duration: 0.4, repeat: Infinity, ease: "linear" }}
          >
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="h-1 w-6 shrink-0 rounded-full"
                style={{ background: "var(--accent)", opacity: 0.5 }}
              />
            ))}
          </motion.div>
        </div>
      </div>
      <div
        className="mt-8 h-1 w-56 overflow-hidden rounded-full"
        style={{ background: "var(--surface)" }}
      >
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="h-full rounded-full"
          style={{ background: "var(--accent)" }}
        />
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-5 text-sm font-medium"
        style={{ color: "var(--text-faint)" }}
      >
        Разгоняемся…
      </motion.p>
    </motion.div>
  );
}
