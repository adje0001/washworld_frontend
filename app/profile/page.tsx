"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

export default function Profile() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const jwtToken = localStorage.getItem("jwt");
    setToken(jwtToken);
    console.log("Token from localStorage:", jwtToken);
  }, []);

  const { data: user } = useQuery({
    queryKey: ["profile"],
    queryFn: () =>
      fetch("/api/profile", {
        //Der er noget galt med dette i frontenden, JWT sendes ikke korrekt, så det er udkommenteret i app.py
        headers: { Authorization: `Bearer ${token ?? ""}` },
      }).then((res) => res.json()),
    staleTime: 60 * 1000,
    enabled: !!token, // Only run when token is set
  });
  console.log(token);
  return <h1>Profile page</h1>;
}
