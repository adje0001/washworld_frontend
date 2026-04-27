"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

export default function Profile() {
  const [token, setToken] = useState<string | null>(null);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "";

  useEffect(() => {
    const jwtToken = localStorage.getItem("jwt");
    setToken(jwtToken);
    console.log("Token from localStorage:", jwtToken);
  }, []);

  const { data: user } = useQuery({
    queryKey: ["profile"],
    queryFn: () =>
      fetch(baseUrl + "/api/profile", {
        //Virker nu
        headers: { Authorization: `Bearer ${token ?? ""}` },
      }).then((res) => res.json()),
    staleTime: 60 * 1000,
    enabled: !!token, // Only run when token is set, runs now
  });
  console.log(token);
  return <h1>Profile page</h1>;
}
