"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  // Render safely even if pathname is null at first
  return (
     <Link
      href={href}
      className={`relative inline-block font-semibold tracking-wide
        bg-gradient-to-r from-[#fff8db] to-[#a90a18] bg-clip-text text-transparent
        hover:from-[#a90a18] hover:to-[#fff8db]
        ${isActive ? "after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-gradient-to-r after:from-[#fff8db] after:to-[#a90a18]" : ""}
      `}
    >
      {label}
    </Link>
  );
}
