//QueryProvider wraps children in QueryClientProvider, which makes tanstack cache every useQuery and useMutation call
//Without it, calling useQuery anywhere would throw an error because there is no client to connect to
//

"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "../app/get-query-client";

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  // getQueryClient() returns a browser singleton on the client and a fresh
  // instance on the server — see app/get-query-client.ts for details.
  const queryClient = getQueryClient();

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
