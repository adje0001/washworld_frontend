import { useQuery } from "@tanstack/react-query";
import { Location } from "../../components/LocationCard";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "";

// useLocations fetches all wash hall locations from the API and returns them
// via TanStack Query, giving the locations page loading and error states for free.
export function useLocations() {
  return useQuery<Location[]>({
    queryKey: ["locations"],
    queryFn: async () => {
      const res = await fetch(`${baseUrl}/api/locations`);
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
  });
}
