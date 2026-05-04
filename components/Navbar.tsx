"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthContext } from "./AuthProvider";

export function Navbar() {
  const { isLoggedIn } = useAuthContext();
  const router = useRouter();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <a className="navbar-item" href="/">
          <img src="https://bulma.io/images/bulma-logo.png" alt="Soon wash world" />
        </a>
      </div>
      <div className="navbar__links">
        <Link href="/">Home</Link>
        <Link href="/signup">Bliv medlem</Link>
        {/* Conditional rendering — show logout when logged in, login when not */}
        {isLoggedIn ? (
          <button onClick={() => router.push("/logout")}>Log ud</button>
        ) : (
          <Link href="/login">Log ind</Link>
        )}
      </div>
    </nav>
  );
}
