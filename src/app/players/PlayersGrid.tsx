"use client";
import { motion, Variants } from "framer-motion";
import Image from "next/image";

type Player = {
  _id: string;
  fullname: string;
  dob: string;
  email: string;
  phone: string;
  position: string;
  place: string;
  image: string;
};

function calculateAge(dateString: string): number | null {
  if (!dateString) return null;
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return null;
  const diff = Date.now() - d.getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export default function PlayersGrid({ players }: { players: Player[] }) {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 250, damping: 20 } as const },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto max-w-7xl grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {players.map((player) => (
        <motion.article
          key={player._id}
          variants={item}
          whileHover={{ y: -6 }}
          onMouseMove={(e) => {
            const el = e.currentTarget as HTMLElement;
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            el.style.setProperty("--mx", `${x}px`);
            el.style.setProperty("--my", `${y}px`);
          }}
          className="group relative overflow-hidden rounded-3xl border border-white/20 shadow-2xl bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl"
        >
          <div className="absolute inset-px rounded-[22px] bg-gradient-to-r from-[#a90a18]/40 via-transparent to-[#0b2040]/40 opacity-50" />

          {/* Hover-follow glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{
              background:
                "radial-gradient(300px circle at var(--mx, 0px) var(--my, 0px), rgba(255,248,219,0.12), transparent 40%)",
            }}
          />

          {/* Animated background accents behind the card */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -z-10 -top-16 -right-16 h-40 w-40 rounded-full blur-3xl"
            style={{ background: "radial-gradient(closest-side, rgba(169,10,24,0.35), transparent)" }}
            animate={{ rotate: [0, 180, 360] }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -z-10 -bottom-20 -left-24 h-48 w-48 rounded-full blur-3xl"
            style={{ background: "radial-gradient(closest-side, rgba(11,32,64,0.35), transparent)" }}
            animate={{ x: [0, 10, -10, 0], y: [0, -8, 8, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative px-6 pt-8">
            <div className="flex items-center justify-between">
              <span className="text-[10px] tracking-widest uppercase text-gray-300">Liigassa</span>
              <span className="text-[10px] px-2 py-1 rounded-full bg-gradient-to-r from-[#a90a18] to-[#0b2040] text-white">
                {player.position}
              </span>
            </div>

            <div className="relative mt-4 flex justify-center">
              <div className="relative h-40 w-40">
                <Image
                  src={player.image || "/Ligassalogopng.png"}
                  alt={player.fullname}
                  width={160}
                  height={160}
                  className="h-40 w-40 object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)] transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 -z-10 rounded-full blur-2xl bg-[#a90a18]/20" />
              </div>
            </div>

            <div className="mt-5 text-center px-2">
              <h2 className="text-lg md:text-xl font-extrabold tracking-wide text-white line-clamp-1">{player.fullname}</h2>
              <div className="mt-1 text-xs md:text-sm text-gray-300 flex items-center justify-center gap-2">
                <span className="uppercase tracking-wider">{player.position}</span>
                <span className="w-1 h-1 rounded-full bg-gray-500" />
                <span>{calculateAge(player.dob) ?? "-"} yrs</span>
                <span className="w-1 h-1 rounded-full bg-gray-500" />
                <span className="line-clamp-1">{player.place}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-white/10 p-4">
            <div className="relative h-1 w-full overflow-hidden rounded-full bg-white/10">
              <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-[#a90a18] to-[#0b2040] animate-[shimmer_2.4s_ease_infinite]" />
            </div>
          </div>
        </motion.article>
      ))}
      <style suppressHydrationWarning>{`@keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(300%)}}`}</style>
    </motion.div>
  );
}


