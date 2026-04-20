"use client";

import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { log } from "console";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();

  const handleSubmitLogin = async (e: any) => {
    e.preventDefault();

    console.log(email, password);
    const response = await login(email, password);

    console.log(response);
    alert("Login successful");
  };

  return (
    <div>
      <form onSubmit={handleSubmitLogin}>
        <input type="text" name="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
