"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmitLogin = async (e: any) => {
    e.preventDefault();
    try {
      await login(email, password);
      alert("Login successful");
    } catch (e) {
      console.log(e);
      alert("Something went wrong loggin in, try again");
    }
    console.log(email, password);

    // router.push("/profile");
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
