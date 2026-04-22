"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmitLogin = async (e: any) => {
    e.preventDefault();

    console.log(email, password);
    // Hardcoded jwt som udskrives når man navigerer sig til profile-siden
    localStorage.setItem("jwt", "Dette har jeg selv skrevet ind");
    alert("Login successful");
    router.push("/profile");
  };

  return (
    <div>
      <form onSubmit={handleSubmitLogin}>
        <input type="text" name="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" onClick={handleSubmitLogin}>
          Login
        </button>
      </form>
    </div>
  );
}
