"use client";
import { useQuery } from "@tanstack/react-query";

// const token = localStorage.getItem("jwt");

// const { data: user, isLoading } = useQuery({
//   queryKey: ["profile"],
//   queryFn: () =>
//     fetch("api/profile", {
//       headers: { Authorization: `Bearer ${token ?? ""}` },
//     }).then((res) => res.json()),
//   staleTime: 60 * 1000,
// });

export default function Profile() {
  return <h1>Profile</h1>;
}
