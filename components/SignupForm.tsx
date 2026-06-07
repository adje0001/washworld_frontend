"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { baseUrl } from "../lib/config";

// Form validation — requirement: forms with validation
function validateForm(firstName: string, email: string, password: string, confirmPassword: string) {
  if (firstName.trim().length < 2 || firstName.trim().length > 20) return "Fornavn skal være 2-20 tegn";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Ugyldig email";
  if (password.length < 8 || password.length > 50) return "Adgangskode skal være 8-50 tegn";
  if (password !== confirmPassword) return "Adgangskoder matcher ikke";
  return null;
}

export function SignupForm() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  // useMutation for the sign-up POST TanStack Query with loading and error handling
  //Fires when mutate() is called, post request with form data
  const { mutate, isPending, isError, error, isSuccess } = useMutation({
    // REST API integration POST /api/sign-up with form-encoded body
    //URLSearchParams = Browser api that formats the form data
    mutationFn: async () => {
      const body = new URLSearchParams({ user_first_name: firstName, email, password, confirm_password: confirmPassword });
      const res = await fetch(`${baseUrl}/api/sign-up`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" }, //Det der sendes afsted fra clienten skal matche det serveren forventer, i dette tilfælde forventer serveren request.form.data
        body,
      });
      if (!res.ok) throw new Error(await res.text()); //Reads the error the backend sent back so tanstack captures it as the error object and displayed on line 63
      return res.text(); //Reads the success response "Check your email" and triggers the isSuccess on line 49
    },
  });

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const err = validateForm(firstName, email, password, confirmPassword);
    if (err) {
      setValidationError(err);
      return;
    }
    //if validation passes after sign up, mutate() is called which fires the post request
    setValidationError(null);
    mutate();
  };

  // Conditional rendering success state, if the backend returns a 200
  if (isSuccess) return <p className="min-h-screen flex items-center justify-center font-semibold md:text-2xl text-sm text-green-600">Tjek din email for at aktivere din konto.</p>;

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xs shadow-md p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-black mb-6 text-center">Opret konto</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="text" placeholder="Fornavn" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="border border-gray-300 rounded-xs px-2 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500" />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border border-gray-300 rounded-xs px-2 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500" />
          <input type="password" placeholder="Adgangskode" value={password} onChange={(e) => setPassword(e.target.value)} className="border border-gray-300 rounded-xs px-2 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500" />
          <input type="password" placeholder="Bekræft adgangskode" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="border border-gray-300 rounded-xs px-2 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500" />
          {/* Conditional rendering — if the backends returns validation error */}
          {validationError && <p className="text-red-500 text-sm">{validationError}</p>}
          {/* Conditional rendering — server error */}
          {isError && <p className="text-red-500 text-sm">{(error as Error).message}</p>}
          <button type="submit" disabled={isPending} className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold rounded-xs py-2 mt-2 transition-colors cursor-pointer">
            {isPending ? "Opretter…" : "Opret min konto"}
          </button>
        </form>
      </div>
    </div>
  );
}
