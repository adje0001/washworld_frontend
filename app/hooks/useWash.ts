import { useQuery } from "@tanstack/react-query";
import { Location } from "../../components/LocationCard";
import { baseUrl } from "../../lib/config";

// Custom hook — requirement: at least one custom hook
// useLocations fetches all wash hall locations from the API and returns them
// via TanStack Query, giving the locations page loading and error states for free.
export function useLocations() {
  return useQuery<Location[]>({
    queryKey: ["locations"],
    // REST API integration — GET /api/locations
    queryFn: async () => {
      const res = await fetch(`${baseUrl}/api/locations`);
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    staleTime: 10 * 60 * 1000, //Fresh for 10 minutes, locationsdata is basically static
    gcTime: 0,
  });
}
