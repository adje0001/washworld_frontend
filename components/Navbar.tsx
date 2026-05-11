"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useAuthContext } from "./AuthProvider";

export function Navbar() {
  const { isLoggedIn } = useAuthContext();
  const [menuOpen, setMenuOpen] = useState(false);

  const blivMedlemBtn = (
    <Link href="/signup" className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-xs transition-colors text-sm font-semibold" onClick={() => setMenuOpen(false)}>
      Bliv medlem
    </Link>
  );

  const links = (
    <>
      <Link href="/" className="hover:text-green-400 transition-colors" onClick={() => setMenuOpen(false)}>
        Home
      </Link>
      <Link href="/locations" className="hover:text-green-400 transition-colors" onClick={() => setMenuOpen(false)}>
        Vaskehaller
      </Link>
      {/* Conditional rendering — show profile when logged in, login when not */}
      {isLoggedIn ? (
        <Link href="/profile" className="border border-white/50 text-white px-4 md:py-1.5 py-2 rounded-xs text-center text-sm font-semibold hover:text-green-400 transition-colors" onClick={() => setMenuOpen(false)}>
          Mit Wash World
        </Link>
      ) : (
        <Link href="/login" className="border border-white/50 text-white px-4 md:py-1.5 py-2 rounded-xs text-center text-sm font-semibold hover:text-green-400 transition-colors" onClick={() => setMenuOpen(false)}>
          Mit Wash World
        </Link>
      )}
    </>
  );

  return (
    <nav className="bg-black text-white fixed top-0 left-0 right-0 z-500">
      <div className="flex items-center justify-between md:px-12 px-4 py-3">
        <a href="/">
          <Image src="/logo.svg" alt="WashWorld" width={0} height={0} className="md:h-8 md:w-auto h-7 w-auto" />
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-semibold">
          {links}
          {blivMedlemBtn}
        </div>

        {/* Mobile: button + hamburger */}
        <div className="md:hidden flex items-center gap-3">
          {blivMedlemBtn}
          <button className="flex flex-col gap-1.5 p-2" onClick={() => setMenuOpen((prev) => !prev)} aria-label="Toggle menu">
            <span className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block w-6 h-0.5 bg-white transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && <div className="md:hidden absolute top-full left-0 right-0 bg-black flex flex-col gap-4 px-6 py-6 text-sm font-semibold z-50">{links}</div>}
    </nav>
  );
}
