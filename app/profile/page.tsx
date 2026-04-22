"use client";

import { useQuery } from "@tanstack/react-query";

export default function Profile() {
  const token = localStorage.getItem("jwt");

  const { data: user } = useQuery({
    queryKey: ["profile"],
    queryFn: () =>
      fetch("/api/profile", {
        headers: { Authorization: `Bearer ${token ?? ""}` },
      }).then((res) => res.json()),
    staleTime: 60 * 1000,
  });

  return <h1>Profile page</h1>;
}
