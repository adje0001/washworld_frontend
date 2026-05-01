// Go to profile button
"use client";
import { QueryClient } from "@tanstack/react-query";

async function handleGoToProfile() {
  const token = localStorage.getItem("token");

  try {
    //fetchQuery fetches and stores the result in the cache under [profile]
    //If the profile page calls useQuery[profile] within staletime
    //it reads from the cache - no second request
    await queryClient.fetchQuery({
      queryKey: ["profile"],
      queryFn: () =>
        fetch("/api/profile", {
          headers: { Authorization: `Bearer ${token ?? ""}` },
        }).then(async (res) => {
          if (res.status === 401) throw new Error("401");
          return res.json();
        }),
    });

    router.push("/profile"); //Only navigates if the above didnt throw
  } catch {
    router.push("/login");
  }
}
