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
    <div>
      <form onSubmit={handleSubmitLogin}>
        <input type="email" name="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" name="password" placeholder="Adgangskode" value={password} onChange={(e) => setPassword(e.target.value)} />
        {/* Conditional rendering — validation error */}
        {validationError && <p>{validationError}</p>}
        {/* Conditional rendering — server error */}
        {serverError && <p>{serverError}</p>}
        <button type="submit" disabled={isPending}>
          {isPending ? "Logger ind…" : "Log ind"}
        </button>
      </form>
    </div>
  );
}
