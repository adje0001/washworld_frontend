"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "../../components/AuthProvider";

export default function Logout() {
  const { logout, isLoggedIn } = useAuthContext();
  const router = useRouter();

  // useEffect for side effects logs out and redirects after 2 seconds
  useEffect(() => {
    if (!isLoggedIn) {
      const timer = setTimeout(() => router.push("/login"), 2000);
      return () => clearTimeout(timer);
    }
    logout();
    const timer = setTimeout(() => router.push("/"), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Conditional rendering not logged in
  if (!isLoggedIn) return <p>Du er ikke logget ind. Du bliver sendt til loginsiden</p>;

  return <p>Du er nu logget ud og vender retur til forsiden</p>;
}
