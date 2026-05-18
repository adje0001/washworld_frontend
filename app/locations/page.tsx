"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { LocationCard } from "../../components/LocationCard";
import { useLocations } from "../hooks/useWash";

// Dynamic import — prevents SSR crash since Leaflet requires window
const LocationsMap = dynamic(() => import("../../components/LocationsMap").then((m) => m.LocationsMap), { ssr: false });

export default function Locations() {
  const { data: locations, isPending, isError } = useLocations(); //Fetches data from the hook
  // State for search search/filtering requirement
  const [search, setSearch] = useState("");
  // State for selected marker which controls which card is highlighted
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // State management to toggle between showing 4 cards and all cards
  const [isExpanded, setIsExpanded] = useState(false);

  // Conditional rendering — loading state
  if (isPending)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-md">Henter vaskehaller...</p>
      </div>
    );

  // Conditional rendering — error state
  if (isError)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-md">Kunne ikke hente vaskehaller. Prøv igen.</p>
      </div>
    );
  //Filters locations based on search input
  const filtered = locations?.filter((loc) => `${loc.location_name} ${loc.location_city} ${loc.location_zip}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      {/* Page header */}
      <section className="px-4 pt-10 pb-8 text-center">
        <p className="text-green-600 text-xs font-bold uppercase tracking-widest mb-3">Over 140 vaskehaller i Danmark</p>
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">Find vaskehal nær dig</h1>
        <p className="text-green-600 text-xs font-bold uppercase tracking-widest mb-3">Åbent 7–22 alle dage</p>
        <p className="text-gray-800 text-md">
          Få ubegrænset adgang til <span className="font-bold text-gray-800">alle vaskehaller</span> for +10 kr./md.
        </p>
      </section>

      {/* Search/filtering */}
      <div className="bg-background px-4 pt-6 pb-4">
        <div className="max-w-6xl mx-auto">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Søg efter by, navn eller postnummer..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setIsExpanded(false);
              }}
              className="w-full border border-gray-300 rounded-xs pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
            />
          </div>
        </div>
      </div>

      {/* Location cards grid */}
      <div className="px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          {/* Conditional rendering — empty state */}
          {filtered?.length === 0 && <p className="text-gray-500 text-sm py-8 text-center">Ingen vaskehaller matcher din søgning.</p>}
          {/* Component-based architecture */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered?.slice(0, isExpanded ? undefined : 4).map((loc) => (
              <LocationCard key={loc.location_pk} location={loc} isSelected={selectedId === loc.location_pk} onSelect={setSelectedId} />
            ))}
          </div>
          {/* Conditional rendering — toggle between showing 4 and all cards */}
          {filtered && filtered.length > 4 && (
            <div className="flex justify-center mt-6">
              <button onClick={() => setIsExpanded((v) => !v)} className="px-6 py-2.5 border border-green-300 rounded-xs text-sm font-medium text-gray-700 hover:bg-green-100 transition-colors cursor-pointer">
                {isExpanded ? "Vis mindre" : "Vis mere"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Map — shows all locations regardless of search filter */}
      {locations && (
        <div className="px-4 pb-12">
          <div className="max-w-6xl mx-auto">
            <LocationsMap locations={locations} onSelect={setSelectedId} />
          </div>
        </div>
      )}
    </div>
  );
}
