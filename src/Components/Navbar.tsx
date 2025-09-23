"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { Dancing_Script } from "next/font/google";
import NavLink from "./NavLink";

const dancing = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-transparent opacity-0 shadow-md" : "bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/Ligassalogopng.png"
            alt="Ligassa Logo"
            width={100}
            height={20}
            priority
            className="w-20 h-auto sm:w-24 md:w-20 lg:w-24"
          />
          <h1
            className={`${dancing.className} 
      text-2xl sm:text-3xl md:text-4xl lg:text-5xl 
      font-extrabold 
      bg-gradient-to-r from-[#fff8db] to-[#a90a18] 
      bg-clip-text text-transparent tracking-wide`}
          >
            LIIGASSA
          </h1>
        </Link>


        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 text-gray-700 font-medium">
          <NavLink href="/" label="Home" />
          <NavLink href="/about" label="About" />
          <NavLink href="/teams" label="Teams" />
          <NavLink href="/players" label="Players" />
          <NavLink href="/register" label="Register" />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md flex flex-col justify-center-safe">
          <NavLink href="/" label="Home" />
          <NavLink href="/about" label="About" />
          <NavLink href="/teams" label="Teams" />
          <NavLink href="/players" label="Players" />
          <NavLink href="/register" label="Register" />
        </div>
      )}
    </nav>
  );
}
