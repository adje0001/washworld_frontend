"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "../../components/AuthProvider";

// Form validation — requirement: forms with validation
function validateForm(email: string, password: string) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Ugyldig email";
  if (password.length < 8 || password.length > 50) return "Adgangskode skal være 8-50 tegn";
  return null;
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const { login } = useAuthContext();

  const handleSubmitLogin = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const err = validateForm(email, password);
    if (err) { setValidationError(err); return; }
    setValidationError(null);
    setServerError(null);
    setIsPending(true);
    try {
      await login(email, password);
      router.push("/profile");
    } catch (e) {
      setServerError("Forkert email eller adgangskode");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-xs shadow-md p-8">
        <h1 className="text-2xl font-bold text-black mb-6 text-center">Log ind</h1>
        <form onSubmit={handleSubmitLogin} className="flex flex-col gap-4">
          <input type="email" name="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border border-gray-300 rounded-xs px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          <input type="password" name="password" placeholder="Adgangskode" value={password} onChange={(e) => setPassword(e.target.value)} className="border border-gray-300 rounded-xs px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          {/* Conditional rendering — validation error */}
          {validationError && <p className="text-red-500 text-sm">{validationError}</p>}
          {/* Conditional rendering — server error */}
          {serverError && <p className="text-red-500 text-sm">{serverError}</p>}
          <button type="submit" disabled={isPending} className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold rounded-xs py-2 mt-2 transition-colors">
            {isPending ? "Logger ind…" : "Log ind"}
          </button>
        </form>
      </div>
    </div>
  );
}
