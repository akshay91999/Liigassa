"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { Dancing_Script } from "next/font/google";


const dancing = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default function Aboutpage() {
  return (
    <section id="about" className="relative overflow-hidden py-20 bg-gradient-to-b from-[#0b2040] to-[#1a1a1a] text-white">
      <div className="container mx-auto px-6 md:px-12 lg:px-20 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

        {/* Left: Text coming from left */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: false ,amount: 0.3}}
          className="text-left"
        >
          <p className="uppercase tracking-widest text-sm md:text-base text-[#ff4d6d] mb-3 font-semibold">
            Organized by Red Star Thaliyil
          </p>

          <h2 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 font-serif">
            Welcome to{" "}
            <span className={`${dancing.className} bg-gradient-to-r from-[#fff8db] to-[#a90a18] 
      bg-clip-text text-transparent tracking-wide`}>
              Liigassa
            </span>
          </h2>

          <p className="text-base md:text-lg text-gray-300 leading-relaxed max-w-xl mb-8 font-sans">
            Liigassa is more than just a football tournament — it’s a celebration of
            <span className="font-semibold text-[#fff8db]"> passion, teamwork, and community spirit.</span>  
            After the massive success of our debut, we’re back stronger with{" "}
            <span className="font-bold text-[#a90a18]">Season 2</span>, bringing even more thrilling
            matches and unforgettable moments.
          </p>
        </motion.div>

        {/* Right: Logo coming from right */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: false ,amount: 0.3}}
          className="flex justify-center relative"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#a90a18] to-[#fff8db] blur-3xl opacity-40 animate-pulse"></div>
            <Image
              src="/Ligassalogopng.png"
              alt="Liigassa Logo"
              width={400}
              height={400}
              className="relative z-10 drop-shadow-2xl"
            />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
