"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuthContext } from "../components/AuthProvider";

export default function Home() {
  // Conditional rendering — CTA adapts based on auth state
  const { isLoggedIn } = useAuthContext();

  return (
    <div>
      {/* Hero */}
      {/* Mobile hero — portrait image */}
      <section className="relative w-full overflow-hidden h-110 block md:hidden">
        <Image src="/mobile_header_1080X1350_DK.jpg" alt="WashWorld vaskehal" fill className="object-cover object-center" priority />
      </section>

      {/* Desktop hero — landscape image */}
      <section className="relative w-full overflow-hidden hidden md:block md:h-72 lg:h-117.5">
        <Image src="/web_hero_1920x640_DK.jpg" alt="WashWorld vaskehal" fill className="object-cover object-center" priority />
      </section>

      {/* Value proposition strip */}
      <section className="bg-white px-4 py-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-5 md:gap-4">
          {["Bilvask uden at gøre det kompliceret.", "Fokuseret på at give værdi for pengene.", "En grundig vask. Hver gang."].map((text) => (
            <div key={text} className="flex items-center gap-3">
              <svg className="w-12 h-12 shrink-0 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="9 12 11 14 15 10" />
              </svg>
              <p className="font-bold text-gray-900 text-sm md:text-lg leading-snug">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className=" px-4 py-12 md:py-16 text-center">
        <div className="max-w-6xl mx-auto">
          <p className="text-green-600 text-xs md:text-sm font-bold uppercase tracking-widest mb-2">Sådan fungerer det</p>
          <h2 className="text-3xl md:text-6xl font-bold text-gray-900 mb-10 md:mb-14">Så let er det</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
            {/* Step 1 — choose wash */}
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 mb-5 flex items-center justify-center">
                <Image src="/artboard-87-2.svg" alt="Vælg vask" width={128} height={128} className="object-contain" />
              </div>
              <p className="font-bold text-lg md:text-2xl text-gray-900 mb-2">Vælg vask</p>
              <p className="text-gray-800 text-md max-w-xs mx-auto">Vælg abonnement eller enkeltvask, alt efter hvad der passer dig.</p>
            </div>

            {/* Step 2 — easy access */}
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 mb-5 flex items-center justify-center">
                <Image src="/group-4-Copy-300x174.png" alt="Nem adgang" width={128} height={128} className="object-contain" />
              </div>
              <p className="font-bold text-lg md:text-2xl text-gray-900 mb-2">Nem adgang</p>
              <p className="text-gray-800 text-md max-w-xs mx-auto">Med abonnement genkender vi automatisk din nummerplade. Med enkeltvask vælger du bare din vask på skærmen.</p>
            </div>

            {/* Step 3 — stay in car */}
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 mb-5 flex items-center justify-center">
                <Image src="/group-7-300x264.png" alt="Bliv siddende i bilen" width={128} height={128} className="object-contain" />
              </div>
              <p className="font-bold text-lg md:text-2xl text-gray-900 mb-2">Bliv siddende i bilen</p>
              <p className="text-gray-800 text-md max-w-xs mx-auto">Læn dig tilbage. Vi klarer resten.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA banner — conditional rendering based on auth */}
      <div className="px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-black rounded-xs overflow-hidden text-white">
            {/* Green accent bar */}
            <div className="h-1 bg-green-600" />
            <div className="px-8 py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div>
                <p className="text-green-400 text-xs font-bold uppercase tracking-widest mb-3">{isLoggedIn ? "Mit Wash World" : "Kom i gang"}</p>
                <h2 className="text-2xl md:text-4xl font-bold mb-3">{isLoggedIn ? "Se dine registrerede biler" : "Bliv medlem i dag"}</h2>
                <p className="text-gray-400 text-sm max-w-sm leading-relaxed">{isLoggedIn ? "Se dine registrerede biler og administrer din konto i Mit Wash World." : "Som WashWorld-medlem får du eksklusive rabatter og nem oversigt over dine biler."}</p>
              </div>
              <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
                <Link href={isLoggedIn ? "/profile" : "/signup"} className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xs px-6 py-3 transition-colors text-sm text-center flex items-center justify-center gap-2">
                  {isLoggedIn ? "Gå til Mit Wash World" : "Bliv medlem"}
                </Link>
                {!isLoggedIn && (
                  <Link href="/locations" className="border border-white/20 hover:border-white/40 text-white font-semibold rounded-xs px-6 py-3 transition-colors text-sm text-center">
                    Find vaskehal
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
