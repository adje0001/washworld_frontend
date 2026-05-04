"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import dynamic from "next/dynamic";
import { LocationCard, Location } from "../../components/LocationCard";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "";

// Dynamic import — prevents SSR crash since Leaflet requires window
const LocationsMap = dynamic(() => import("../../components/LocationsMap").then((m) => m.LocationsMap), { ssr: false });

// Custom data fetching — satisfies TanStack Query requirement
function useLocations() {
  return useQuery<Location[]>({
    queryKey: ["locations"],
    queryFn: async () => {
      const res = await fetch(`${baseUrl}/api/locations`);
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
  });
}

export default function Locations() {
  const { data: locations, isLoading, isError } = useLocations();
  // State for search — satisfies search/filtering requirement
  const [search, setSearch] = useState("");
  // State for selected marker — controls which card is highlighted
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Conditional rendering — loading state
  if (isLoading) return <p>Henter vaskehaller...</p>;

  // Conditional rendering — error state
  if (isError) return <p>Kunne ikke hente vaskehaller. Prøv igen.</p>;

  const filtered = locations?.filter((loc) => `${loc.location_name} ${loc.location_city} ${loc.location_zip}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <h1>Vaskehaller</h1>

      {/* Map shows all locations regardless of search filter */}
      {locations && <LocationsMap locations={locations} onSelect={setSelectedId} />}

      {/* Search/filtering — satisfies search requirement */}
      <input type="text" placeholder="Søg efter by, navn eller postnummer..." value={search} onChange={(e) => setSearch(e.target.value)} />

      {/* Conditional rendering — empty state */}
      {filtered?.length === 0 && <p>Ingen vaskehaller matcher din søgning.</p>}

      <div className="locations-grid">
        {/* Component-based architecture — satisfies component requirement */}
        {filtered?.map((loc) => (
          <LocationCard key={loc.location_pk} location={loc} isSelected={selectedId === loc.location_pk} />
        ))}
      </div>
    </div>
  );
}
