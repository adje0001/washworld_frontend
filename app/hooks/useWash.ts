import { useQuery } from "@tanstack/react-query";
import { Location } from "../../components/LocationCard";
import { baseUrl } from "../../lib/config";

// useLocations fetches all wash hall locations from the API and returns them
// via TanStack Query, giving the locations page loading and error states for free.
export function useLocations() {
  return useQuery<Location[]>({
    queryKey: ["locations"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const res = await fetch(`${baseUrl}/api/locations`);
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    staleTime: 0,
    gcTime: 0,
  });
}
