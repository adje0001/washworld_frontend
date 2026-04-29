"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "";

// Form validation — requirement: forms with validation
function validateForm(firstName: string, email: string, password: string, confirmPassword: string) {
  if (firstName.trim().length < 2 || firstName.trim().length > 20) return "Fornavn skal være 2-20 tegn";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Ugyldig email";
  if (password.length < 8 || password.length > 50) return "Adgangskode skal være 8-50 tegn";
  if (password !== confirmPassword) return "Adgangskoder matcher ikke";
  return null;
}

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  // useMutation for the sign-up POST — requirement: TanStack Query with loading and error handling
  const { mutate, isPending, isError, error, isSuccess } = useMutation({
    mutationFn: async () => {
      const body = new URLSearchParams({ user_first_name: firstName, email, password, confirm_password: confirmPassword });
      const res = await fetch(`${baseUrl}/api/sign-up`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" }, //Det der sendes afsted fra clienten skal matche det serveren forventer, i dette tilfælde forventer serveren request.form.data
        body,
      });
      if (!res.ok) throw new Error(await res.text());
      return res.text();
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const err = validateForm(firstName, email, password, confirmPassword);
    if (err) {
      setValidationError(err);
      return;
    }
    setValidationError(null);
    mutate();
  };

  // Conditional rendering — success state
  if (isSuccess) return <p>Tjek din email for at aktivere din konto.</p>;

  return (
    <div>
      <h1>Opret konto</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Fornavn" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Adgangskode" value={password} onChange={(e) => setPassword(e.target.value)} />
        <input type="password" placeholder="Bekræft adgangskode" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        {/* Conditional rendering — validation error */}
        {validationError && <p>{validationError}</p>}
        {/* Conditional rendering — server error */}
        {isError && <p>{(error as Error).message}</p>}
        <button type="submit" disabled={isPending}>
          {isPending ? "Opretter…" : "Opret min konto"}
        </button>
      </form>
    </div>
  );
}
