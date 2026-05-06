//get-query-client creates and manages the TanStack Query QueryClient — the object that holds the cache for all your useQuery calls
//On the server: creates a fresh client for every request so no cached data leaks
//In the browser: creates it once and reuses the same instance so the cache survives across all pages
import { QueryClient } from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we always want staleTime > 0.
        // If staleTime were 0 (the default), the client would immediately
        // refetch the data that was just hydrated from the server — wasting
        // a network request and causing a flicker.
        // 60 seconds means the hydrated data is treated as fresh for 1 minute.
        staleTime: 60 * 1000,
      },
    },
  });
}

// A module-level singleton for the browser. We reuse the same instance across
// renders so the cache survives React suspending during the initial render.
let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always create a fresh client per request so data is never
    // shared between different users' requests.
    return makeQueryClient();
  } else {
    // Browser: create once, then reuse.
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}
