"use client";

import { useRouter } from "next/navigation";
import { useAuthContext } from "../components/AuthProvider";

export default function Home() {
  const { isLoggedIn } = useAuthContext();
  const router = useRouter();

  return (
    <div>
      <h1>Forside</h1>
      {/* Conditional rendering — routes to profile if logged in, otherwise login */}
      <button onClick={() => router.push(isLoggedIn ? "/profile" : "/login")}>
        Min profil
      </button>
    </div>
  );
}
