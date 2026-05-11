import { useQuery } from "@tanstack/react-query";
import { baseUrl } from "../../lib/config";

// Custom hook — requirement: at least one custom hook
//onExpired function gets passed as a parameter into the useProfile
//When the fetch returns, the hook calls onExpired when 401 (unauthorized) hits from the backend
export function useProfile(token: string | null, onExpired: () => void) {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await fetch(`${baseUrl}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        onExpired();
        throw new Error("expired");
      }
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    staleTime: 60 * 1000,
    enabled: !!token,
  });
}
