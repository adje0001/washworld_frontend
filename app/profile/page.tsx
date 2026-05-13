"use client";

import { useCars } from "../hooks/useCars";
import { useProfile } from "../hooks/useProfile";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "../../components/AuthProvider";
import { AccountActions } from "../../components/AccountActions";
import { CarsList } from "../../components/CarsList";
import { AddCarForm } from "../../components/AddCarForm";

export default function Profile() {
  const [token, setToken] = useState<string | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const router = useRouter();
  const { logout } = useAuthContext();

  // useEffect for side effects — reads JWT from localStorage after mount
  useEffect(() => {
    setToken(localStorage.getItem("jwt"));
  }, []);

  //Redirect to home after showing expiry message
  //Detects that sessionExpired is now true
  //Re-runs once the sessionExpired changes
  useEffect(() => {
    if (!sessionExpired) return;
    const timer = setTimeout(() => router.push("/"), 2000);
    return () => clearTimeout(timer);
  }, [sessionExpired]);

  //When useProfile is called we call the setSessionExpired
  //We set the sessionExpired to true
  const {
    data: user,
    isLoading,
    isError,
    error,
    //useProfile is called, the arrow function is passed as onUnauthorized
  } = useProfile(token, () => {
    logout();
    //Now true, state changes and the component re-renders
    //onUnauthorized is a way for the hook to tell the component the token has expired
    setSessionExpired(true);
  });

  //Calls the hook from useCars
  const { cars, carBrand, setCarBrand, carPlate, setCarPlate, addCar, isAddingCar, addCarFailed, addCarError, deleteCar } = useCars(token, () => {
    logout();
    setSessionExpired(true);
  });

  // Conditional rendering — session expired
  //If sessionExpired = true
  if (sessionExpired)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-sm">Sessionen er udløbet. Du bliver sendt til forsiden...</p>
      </div>
    );

  // Conditional rendering — loading state
  //The users isnt logged in
  if (!token)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-sm">Du er ikke logget ind</p>
      </div>
    );

  //Fetch to the backend /api/profile still in progress
  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-sm">Henter profil…</p>
      </div>
    );

  // Conditional rendering — error state
  //The fetch failed
  if (isError)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-sm">Fejl: {(error as Error).message}</p>
      </div>
    );

  const initials = user.user_name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="max-w-sm mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Mit Wash World</h1>

      {/* User info card */}
      <div className="bg-white rounded-xs shadow-sm p-5 mb-4">
        <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
          <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-lg shrink-0">{initials}</div>
          <div>
            <p className="font-bold text-gray-900">{user.user_name}</p>
            <p className="text-gray-500 text-sm">{user.user_email}</p>
          </div>
        </div>
        <div className="pt-4 flex items-start justify-between">
          <AccountActions token={token} userEmail={user.user_email} variant="actions" />
          <div>
            <p className="text-gray-500 text-xs">Medlem siden</p>
            <p className="font-semibold text-sm text-gray-800">{user.user_verified_at ? new Date(user.user_verified_at * 1000).toLocaleDateString("da-DK") : "Ikke verificeret"}</p>
          </div>
        </div>
      </div>

      {/* Cars card */}
      <div className="bg-white rounded-xs shadow-sm p-5 mb-4">
        <CarsList cars={cars} deleteCar={deleteCar} />
        <AddCarForm carBrand={carBrand} setCarBrand={setCarBrand} carPlate={carPlate} setCarPlate={setCarPlate} addCar={addCar} isAddingCar={isAddingCar} addCarFailed={addCarFailed} addCarError={addCarError} />
      </div>

      <AccountActions token={token} userEmail={user.user_email} />
    </div>
  );
}
