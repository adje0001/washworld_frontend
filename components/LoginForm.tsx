"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "./AuthProvider";

// Form validation requirement: forms with validation
//Checks if email matches the regex pattern
//Checks if the password is between 8-50 characters. Returns either errorstring or null if its valid
function validateForm(email: string, password: string) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Ugyldig email";
  if (password.length < 8 || password.length > 50) return "Adgangskode skal være 8-50 tegn";
  return null;
}

//setValidationError updates the validationError in the JSX if the err returns not null
//serverError catches the errors from the backend
export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const { login } = useAuthContext();

  //err is the string returned from validateForm, either "Ugyldig email" or "Adgangskode skal være 8-50 tegn"
  //setValidationError stores the string in validationError(err)
  //If err is not null it sets the errormessage in state to return stops the function
  //If err is null validation has passed, and the login request proceeds
  const handleSubmitLogin = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const err = validateForm(email, password);
    if (err) {
      setValidationError(err);
      return; //Stops here, no request sent if not null
    }
    setValidationError(null);
    setServerError(null);

    //isPending tracks whether the login request is in flight.
    //Set to true just before the fetch and back to false in the finally block (which runs whether the fetch succeeds or fails).
    setIsPending(true);

    //awaits the fetch from the AuthProvider where we handle the logic
    //We do a try if the login is a success
    //And a catch if the login throws an error, we check the backend message and show a specific error
    //If the backend says "verify", the user hasnt verified their email yet
    //Otherwise we show a generic wrong credentials message
    try {
      await login(email, password);
      router.push("/profile");
    } catch (e) {
      const msg = (e as Error).message;
      if (msg.includes("verify")) {
        setServerError("Du skal verificere din email før du kan logge ind.");
      } else {
        setServerError("Forkert email eller adgangskode");
      }
    } finally {
      setIsPending(false);
    }
  };

  //email and password are controlled inputs, updated on every keystroke via onChange
  //They hold what the user has typed in the form fields and get passed into validateForm and then into login
  //setIsPending is used to disable the button and change its text
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xs shadow-md p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-black mb-6 text-center">Log ind</h1>
        <form onSubmit={handleSubmitLogin} className="flex flex-col gap-4">
          <input type="email" name="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border border-gray-300 rounded-xs px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          <input type="password" name="password" placeholder="Adgangskode" value={password} onChange={(e) => setPassword(e.target.value)} className="border border-gray-300 rounded-xs px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          {/* Conditional rendering — validation error */}
          {/* //ValidationError && means the <p> only renders if validationError is not null */}
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
