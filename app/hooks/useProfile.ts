import { useQuery } from "@tanstack/react-query";
import { baseUrl } from "../../lib/config";

// Custom hook — requirement: at least one custom hook
//onUnauthorized function gets passed as a parameter into the useProfile
//When the fetch returns, the hook calls onUnauthorized when 401 (unauthorized) hits from the backend
export function useProfile(token: string | null, onUnauthorized: () => void) {
  return useQuery({
    queryKey: ["profile"],
    // REST API integration GET /api/profile with correct Authorization header
    queryFn: async () => {
      const res = await fetch(`${baseUrl}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        onUnauthorized();
        throw new Error("expired");
      }
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    staleTime: 5 * 60 * 1000, //Data is fresh for 5 minutes, profiledata rarely changes
    gcTime: 0,
    retry: false,
    enabled: !!token, //This tells tanstack to only fire the fetch when token has a value, and is not null
  });
}
