//Tracks login state. isLoggedIn is boolean
//On mount, a useEffect checks localStorage for a JWT/token
//If one exists, the user is considered logged in
//The 3 values = Loginstate, Login and logout is shared via AuthContext
//Any component that calls useAuthContext gets access to it fx. the navbar
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { baseUrl } from "../lib/config";

interface AuthContextType {
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // useEffect for side effects when the page loads
  // On mount it checks if a jwt exists in localStorage and sets SetisloggedIn accordingly
  //[] means it only runs once
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("jwt"));
  }, []);

  //POSTs email and password to the backend route
  //If the backend returns a token, it saves in localStorage and sets isLoggedIn to true
  // REST API integration — POST /api/login with email and password as JSON
  const login = async (email: string, password: string) => {
    const res = await fetch(`${baseUrl}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    localStorage.setItem("jwt", data.access_token);
    setIsLoggedIn(true);
  };
  //Removes JWT from localStorage and sets isLoggedIn to false
  //SetisloggedIn(false) then renders the black lock in the NavBar
  const logout = () => {
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
  };

  return <AuthContext.Provider value={{ isLoggedIn, login, logout }}>{children}</AuthContext.Provider>;
}
//AuthProvider wraps the app, holds the state and functions
//AuthContext the channel React uses to pass them down
//useAuthContext() what components call to receive them

//Custom hook = requirement at least one custom hook
//Reads what the AuthProvider put into context, isLoggedIn, login and logout
//if (!ctx) check is a safetyguard, if useAuthContext() is called in a component that isn't wrapped, it is null
//It returns ctx so any component that calls useAuthContext() gets the 3 values back
export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used inside AuthProvider");
  return ctx;
}
