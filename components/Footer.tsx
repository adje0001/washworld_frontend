"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuthContext } from "./AuthProvider";

export function Footer() {
  const { isLoggedIn } = useAuthContext();

  return (
    <footer>
      {/* Footer bottom bar */}
      <div className="bg-black text-white">
        <div className="px-4 md:px-12 py-10 flex flex-col items-start md:flex-row md:items-start justify-between gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-3 max-w-xs">
            <Image src="/logo.svg" alt="WashWorld" width={0} height={0} className="h-auto w-22" />
            <p className="text-gray-500 text-sm leading-relaxed">Hurtig, skånsom og miljøvenlig bilvask, døgnet rundt, overalt i Danmark.</p>
          </div>

          {/* Nav links */}
          <div className="flex flex-col gap-2">
            <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold mb-2">Navigation</p>
            <Link href="/" className="text-gray-300 hover:text-green-400 transition-colors text-base">
              Forside
            </Link>
            <Link href="/locations" className="text-gray-300 hover:text-green-400 transition-colors text-base">
              Vaskehaller
            </Link>
          </div>

          {/* Account links */}
          <div className="flex flex-col gap-2">
            <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold mb-2">Konto</p>
            {isLoggedIn ? (
              <>
                <Link href="/profile" className="text-gray-300 hover:text-green-400 transition-colors text-base flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 shrink-0 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0V3" />
                  </svg>
                  Mit Wash World
                </Link>
                <Link href="/logout" className="text-gray-300 hover:text-green-400 transition-colors text-base">
                  Log ud
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-300 hover:text-green-400 transition-colors text-base flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  Mit Wash World
                </Link>
                <Link href="/signup" className="text-gray-300 hover:text-green-400 transition-colors text-base">
                  Bliv medlem
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Copyright bar */}
        <div className="border-t border-white/10 md:px-12 py-4">
          <div className="mx-auto">
            <p className="text-gray-600 text-sm">© {new Date().getFullYear()} WashWorld. Alle rettigheder forbeholdes.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
