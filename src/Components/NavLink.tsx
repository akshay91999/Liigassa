"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function NavLink({
  href,
  label,
  className = "",
}: {
  href: string;
  label: string;
  className?: string;
}) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // ensures component is hydrated
  }, []);

  if (!mounted) return null; // avoid server/client mismatch

  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`relative inline-block font-semibold tracking-wide
        bg-gradient-to-r from-[#fff8db] to-[#a90a18] bg-clip-text text-transparent
        hover:from-[#a90a18] hover:to-[#fff8db]
        ${className}
        ${isActive ? "after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-gradient-to-r after:from-[#fff8db] after:to-[#a90a18]" : ""}
      `}
    >
      {label}
    </Link>
  );
}
