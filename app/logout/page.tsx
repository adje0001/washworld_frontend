"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "../../components/AuthProvider";

export default function Logout() {
  const { logout } = useAuthContext();
  const router = useRouter();

  // useEffect for side effects — logs out and redirects after 2 seconds
  useEffect(() => {
    logout();
    const timer = setTimeout(() => router.push("/"), 2000);
    return () => clearTimeout(timer);
  }, []);

  return <p>Du er nu logget ud og vender retur til forsiden</p>;
}
