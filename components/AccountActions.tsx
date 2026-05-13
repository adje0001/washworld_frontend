"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuthContext } from "./AuthProvider";
import { baseUrl } from "../lib/config";

interface Props {
  token: string | null;
  userEmail: string;
}

// Component-based architecture — account actions extracted from profile page
export function AccountActions({ token, userEmail }: Props) {
  const router = useRouter();
  const { logout } = useAuthContext();

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
      logout();
      router.push("/");
    },
  });

  return (
    <>
      <button onClick={() => router.push("/logout")}>Log ud</button>
      <button onClick={() => sendReset(userEmail)} disabled={isResetting || resetSent}>
        {isResetting ? "Sender…" : resetSent ? "Email sendt! Tjek din indbakke" : "Nulstil adgangskode"}
      </button>
      {/* Conditional rendering — reset error */}
      {resetFailed && <p>Kunne ikke sende reset-email. Prøv igen.</p>}
      <button onClick={() => deleteAccount()} disabled={isDeleting}>
        {isDeleting ? "Sletter…" : "Slet konto"}
      </button>
    </>
  );
}
