"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "";

// Custom hook — requirement: at least one custom hook
function useProfile(token: string | null, onExpired: () => void) {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await fetch(`${baseUrl}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 400) {
        onExpired();
        throw new Error("Session udløbet. Log ind igen");
      }
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    staleTime: 60 * 1000,
    enabled: !!token, // Only run when token is available
  });
}

export default function Profile() {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  // useEffect for side effects — reads JWT from localStorage after mount
  useEffect(() => {
    setToken(localStorage.getItem("jwt"));
  }, []);

  const logout = () => {
    localStorage.removeItem("jwt");
    setToken(null);
    router.push("/login");
  };

  const { data: user, isLoading, isError, error } = useProfile(token, logout);

  const {
    mutate: sendReset,
    isPending: isResetting,
    isSuccess: resetSent,
    isError: resetFailed,
  } = useMutation({
    mutationFn: async (email: string) => {
      const body = new URLSearchParams({ email });
      const res = await fetch(`${baseUrl}/api/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" }, //Det der sendes afsted fra clienten skal matche det serveren forventer, i dette tilfælde forventer serveren request.form.data
        body,
      });
      if (!res.ok) throw new Error(await res.text());
    },
  });

  const { mutate: deleteAccount, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${baseUrl}/api/users`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(await res.text());
    },
    onSuccess: () => {
      localStorage.removeItem("jwt");
      router.push("/");
    },
  });

  // Conditional rendering — loading state
  if (!token) return <p>Du er ikke logget ind</p>;
  if (isLoading) return <p>Henter profil…</p>;
  // Conditional rendering — error state
  if (isError) return <p>Fejl: {(error as Error).message}</p>;

  return (
    <div>
      <h1>Min profil</h1>
      <p>
        <strong>Hej!</strong> {user.user_name}
      </p>
      <p>
        <strong>Email:</strong> {user.user_email}
      </p>
      <p>
        <strong>Din profil blev verificeret d.</strong> {user.user_verified_at ? new Date(user.user_verified_at * 1000).toLocaleString("da-DK") : "Nej"}
      </p>
      <button onClick={() => sendReset(user.user_email)} disabled={isResetting || resetSent}>
        {isResetting ? "Sender…" : resetSent ? "Email sendt! Tjek din indbakke" : "Nulstil adgangskode"}
      </button>
      <br />
      <br />
      {/* Conditional rendering — reset error */}
      {resetFailed && <p>Kunne ikke sende reset-email. Prøv igen.</p>}
      <button onClick={() => deleteAccount()} disabled={isDeleting}>
        {isDeleting ? "Sletter…" : "Slet konto"}
      </button>
    </div>
  );
}
