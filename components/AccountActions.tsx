//Reset password og delete account requests

"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuthContext } from "./AuthProvider";
import { baseUrl } from "../lib/config";

interface Props {
  token: string | null;
  userEmail: string;
  variant?: "logout" | "actions";
}

// Component-based, account actions extracted from profile page
//Recieves 2 props from the profilepage. Token(JWT) and userEmail.
//In here we call 2 hooks we need. UseRouter for navigation and useAuthContext for the logout
export function AccountActions({ token, userEmail, variant = "logout" }: Props) {
  const router = useRouter();
  const { logout } = useAuthContext();

  //When called it POSTs the users email to the route, and shows "Sender..." and "Email sendt"
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
  //Sends a DELETE request to the route with the JWT in the auth header
  //On success it calls logout() to clear the token from localStorage and redirects
  const { mutate: deleteAccount, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${baseUrl}/api/users`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) throw new Error("unauthorized");
      if (!res.ok) throw new Error(await res.text());
    },
    onSuccess: () => {
      logout();
      router.push("/");
    },
    onError: (error) => {
      if ((error as Error).message === "unauthorized") {
        logout();
        router.push("/");
      }
    },
  });

  //Button logs the user out and redirects to page.tsx logout which handles the logic
  //None of the 3 buttons know anything about cars or the users profile data, then only need token and userEmail
  if (variant === "actions")
    return (
      <div className="flex flex-col gap-1">
        <button onClick={() => sendReset(userEmail)} disabled={isResetting || resetSent} className="text-gray-500 hover:text-gray-700 text-sm py-0.5 transition-colors disabled:opacity-50 cursor-pointer text-left">
          {isResetting ? "Sender…" : resetSent ? "Email sendt!" : "Nulstil adgangskode"}
        </button>
        {/* Conditional rendering — reset error */}
        {resetFailed && <p className="text-red-500 text-xs">Kunne ikke sende reset-email. Prøv igen.</p>}
        <button onClick={() => deleteAccount()} disabled={isDeleting} className="text-red-400 hover:text-red-600 text-sm py-0.5 transition-colors disabled:opacity-50 cursor-pointer text-left">
          {isDeleting ? "Sletter…" : "Slet konto"}
        </button>
      </div>
    );

  return (
    <button onClick={() => router.push("/logout")} className="w-full bg-red-400 hover:bg-red-500 text-white font-semibold rounded-xs py-3 text-sm transition-colors cursor-pointer">
      Log ud
    </button>
  );
}
