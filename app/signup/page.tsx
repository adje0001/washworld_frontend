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
  if (isSuccess) return <p className="text-center mt-10 text-green-600">Tjek din email for at aktivere din konto.</p>;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-xs shadow-md p-8">
        <h1 className="text-2xl font-bold text-black mb-6 text-center">Opret konto</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="text" placeholder="Fornavn" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="border border-gray-300 rounded-xs px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border border-gray-300 rounded-xs px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          <input type="password" placeholder="Adgangskode" value={password} onChange={(e) => setPassword(e.target.value)} className="border border-gray-300 rounded-xs px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          <input type="password" placeholder="Bekræft adgangskode" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="border border-gray-300 rounded-xs px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          {/* Conditional rendering — validation error */}
          {validationError && <p className="text-red-500 text-sm">{validationError}</p>}
          {/* Conditional rendering — server error */}
          {isError && <p className="text-red-500 text-sm">{(error as Error).message}</p>}
          <button type="submit" disabled={isPending} className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold rounded-xs py-2 mt-2 transition-colors">
            {isPending ? "Opretter…" : "Opret min konto"}
          </button>
        </form>
      </div>
    </div>
  );
}
