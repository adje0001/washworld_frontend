// Go to profile button
"use client";
import { QueryClient } from "@tanstack/react-query";

async function handleGoToProfile() {
  const token = localStorage.getItem("token");

  try {
    await QueryClient.fetchQuery({
      queryKey: ["profile"],
      queryFn: () =>
        fetch("/api/profile", {
          headers: { Authorization: `Bearer ${token ?? ""}` },
        }).then(async (res) => {
          if (res.status === 401) throw new Error("401");
          return res.json();
        }),
    });

    router.push("/profile");
  } catch {
    router.push("/login");
  }
}
