"use client";

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";

export function useAuth() {
  const queryClient = useQueryClient();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "";

  const login = useCallback(async (username: string, password: string) => {
    const response = await fetch(baseUrl + "/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: username,
        password: password,
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to login");
      return;
    }
    const loginInfo = await response.json();
    console.log(loginInfo);
    localStorage.setItem("jwt", loginInfo.jwt);
  }, []);

  const signup = useCallback(async (username: string, password: string, firstname: string, lastname: string, licensePlate: string) => {
    const response = await fetch(baseUrl + "/api/login", {
      method: "POST",
      body: JSON.stringify({
        username: username,
        password: password,
        firstname: firstname,
        lastname: lastname,
        licensePlate: licensePlate,
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to login");
      return;
    }
  }, []);

  return { login, signup };
}
