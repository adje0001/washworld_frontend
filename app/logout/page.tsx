"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "../../components/AuthProvider";

export default function Logout() {
  const { logout } = useAuthContext();
  const router = useRouter();
  const [hasToken, setHasToken] = useState<boolean | null>(null);

  // useEffect for side effects — runs on client only, so localStorage is safe to access
  //If hasToken = false we redirect to login
  //hasToken is called inside useEffect which only runs on the client
  useEffect(() => {
    const token = !!localStorage.getItem("jwt");
    setHasToken(token);

    if (!token) {
      const timer = setTimeout(() => router.push("/login"), 2000);
      return () => clearTimeout(timer);
    }

    //[] means the useEffect only runs once on mount
    //If hasToken = true we call logout() and handle the logic in AuthProvider
    //Sets isLoggedIn to false in the AuthProvider and removes JWT
    //return () => clearTimeout(timer) is a cleanup function
    logout();
    const timer = setTimeout(() => router.push("/"), 2000);
    return () => clearTimeout(timer);
  }, []);

  //Returns null = renders nothing while the effect hasnt run yet
  if (hasToken === null) return null;

  // Conditional rendering not logged in
  if (!hasToken) return <p>Du er ikke logget ind. Du bliver sendt til loginsiden...</p>;

  return <p>Du er nu logget ud og vender retur til forsiden</p>;
}
