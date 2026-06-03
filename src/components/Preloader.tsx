"use client";

import { Zap } from "lucide-react";
import { motion } from "framer-motion";

const SPEED_LINES = Array.from({ length: 24 });
const GRID_LINES = Array.from({ length: 18 });

export function Preloader() {
  return (
    <motion.div
      id="aimiko-preloader"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 3, duration: 0.65, ease: "easeInOut" }}
      onAnimationComplete={() => {
        const el = document.getElementById("aimiko-preloader");
        if (el) el.style.display = "none";
      }}
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-[#010302]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,153,.24),transparent_30%),linear-gradient(180deg,rgba(0,255,153,.08),transparent_45%,rgba(0,0,0,.92))]" />

      {GRID_LINES.map((_, i) => (
        <motion.div
          key={`v-${i}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.05, 0.28, 0.05] }}
          transition={{ delay: i * 0.03, duration: 1.4, repeat: Infinity }}
          className="absolute bottom-0 h-[50vh] w-px origin-bottom bg-[#00FF99]/30"
          style={{ left: `${8 + i * 5}%`, transform: `perspective(700px) rotateX(68deg)` }}
        />
      ))}

      {SPEED_LINES.map((_, i) => (
        <motion.div
          key={i}
          initial={{ x: "-120vw", opacity: 0 }}
          animate={{ x: "120vw", opacity: [0, 0.9, 0] }}
          transition={{
            delay: 0.2 + i * 0.035,
            duration: 0.85,
            repeat: Infinity,
            repeatDelay: 1.6,
            ease: "easeInOut",
          }}
          className="absolute h-px w-48 bg-gradient-to-r from-transparent via-[#00FF99] to-transparent"
          style={{
            top: `${10 + i * 3.6}%`,
            transform: `rotate(${-10 + (i % 5)}deg)`,
          }}
        />
      ))}

      <motion.div
        initial={{ scale: 0.86, opacity: 0, filter: "blur(18px)" }}
        animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="relative flex w-full max-w-[560px] flex-col items-center px-6"
      >
        <motion.div
          initial={{ scale: 0.45, opacity: 0 }}
          animate={{ scale: [0.45, 1.12, 1], opacity: 1 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="relative mb-8 flex h-56 w-56 items-center justify-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border border-dashed border-[#00FF99]/35"
          />
          <motion.div
            animate={{ rotate: -360, scale: [1, 1.06, 1] }}
            transition={{ rotate: { duration: 8, repeat: Infinity, ease: "linear" }, scale: { duration: 1.6, repeat: Infinity } }}
            className="absolute inset-5 rounded-full border border-[#00FF99]/20"
          />
          <motion.div
            animate={{ scale: [1, 1.18, 1], opacity: [0.35, 0.75, 0.35] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            className="absolute inset-10 rounded-full bg-[#00FF99]/10 blur-xl"
          />

          <div className="relative flex h-36 w-36 items-center justify-center rounded-[2rem] border border-[#00FF99]/30 shadow-[0_0_100px_rgba(0,255,153,.28)] backdrop-blur-xl"
            >
            <motion.img
              src="/logo.png"
              alt="Aimiko"
              initial={{ opacity: 0, y: 16, scale: 0.76 }}
              animate={{ opacity: 1, y: 0, scale: [0.76, 1.08, 1] }}
              transition={{ delay: 0.28, duration: 0.75, ease: "easeOut" }}
              className="h-14 w-auto object-contain drop-shadow-[0_0_26px_rgba(0,255,153,.55)]"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />

            <motion.div
              initial={{ x: "-180%" }}
              animate={{ x: "180%" }}
              transition={{ delay: 0.75, duration: 0.9, ease: "easeInOut" }}
              className="absolute inset-y-0 w-12 rotate-12 bg-white/55 blur-md"
            />

            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: [0, 1.18, 1], rotate: [ -30, 10, 0] }}
              transition={{ delay: 0.9, duration: 0.42 }}
              className="absolute -right-4 -top-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00FF99] text-black shadow-[0_0_50px_rgba(0,255,153,.75)]"
            >
              <Zap size={24} fill="black" />
            </motion.div>
          </div>
        </motion.div>

        <div className="relative mb-7 h-28 w-full overflow-hidden rounded-[2rem] border border-[#00FF99]/20 shadow-[inset_0_0_40px_rgba(0,255,153,.06)]"
          >
          <motion.div
            initial={{ x: -120, scale: 0.8, opacity: 0 }}
            animate={{ x: 455, scale: [0.8, 1.1, 1], opacity: [0, 1, 1] }}
            transition={{ duration: 2.05, ease: [0.65, 0, 0.35, 1] }}
            className="absolute bottom-8 left-0 z-10"
          >
            <div className="relative h-12 w-28">
              <div className="absolute bottom-0 left-0 h-10 w-10 rounded-full border-4 border-[#00FF99] shadow-[0_0_28px_rgba(0,255,153,.8)]" />
              <div className="absolute bottom-0 right-0 h-10 w-10 rounded-full border-4 border-[#00FF99] shadow-[0_0_28px_rgba(0,255,153,.8)]" />
              <div className="absolute bottom-6 left-7 h-1.5 w-14 -rotate-12 rounded-full bg-[#00FF99]" />
              <div className="absolute bottom-6 left-10 h-1.5 w-12 rotate-12 rounded-full bg-[#00FF99]" />
              <div className="absolute bottom-10 left-16 h-1.5 w-10 rounded-full bg-[#00FF99]" />
              <div className="absolute bottom-11 left-9 h-2.5 w-11 rounded-full bg-white shadow-[0_0_18px_rgba(255,255,255,.65)]" />
              <div className="absolute bottom-7 -left-14 h-1 w-16 rounded-full bg-gradient-to-l from-[#00FF99] to-transparent" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.15, 0.55, 0.15] }}
            transition={{ duration: 0.55, repeat: Infinity }}
            className="absolute left-5 right-5 top-5 h-px bg-[#00FF99]/40"
          />

          <div className="absolute bottom-5 left-5 right-5 h-1 overflow-hidden rounded-full bg-white/10">
            <motion.div
              animate={{ x: [0, -96] }}
              transition={{ duration: 0.32, repeat: Infinity, ease: "linear" }}
              className="flex gap-4"
            >
              {Array.from({ length: 26 }).map((_, i) => (
                <div key={i} className="h-1 w-14 shrink-0 rounded-full bg-[#00FF99]/75" />
              ))}
            </motion.div>
          </div>
        </div>

        <div className="relative mb-5 h-2 w-full overflow-hidden rounded-full bg-white/10">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.38, ease: [0.65, 0, 0.35, 1] }}
            className="h-full rounded-full bg-[#00FF99] shadow-[0_0_38px_rgba(0,255,153,.95)]"
          />
          <motion.div
            animate={{ x: ["-40%", "135%"] }}
            transition={{ duration: 0.78, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-y-0 w-1/3 bg-white/40 blur-sm"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="text-center"
        >
          <p className="text-sm font-black tracking-[0.38em] text-[#00FF99]">
            AIMIKO LAUNCH
          </p>
          <p className="mt-2 text-xs" style={{ color: "var(--text-faint)" }}>
            Электротранспорт • каталог • наличие • цены
          </p>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 2.2, 4], opacity: [0, 0.32, 0] }}
        transition={{ delay: 2.45, duration: 0.65, ease: "easeOut" }}
        className="absolute h-96 w-96 rounded-full bg-[#00FF99]"
      />
    </motion.div>
  );
}
