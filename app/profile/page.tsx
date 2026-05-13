"use client";

import { useCars } from "../hooks/useCars";
import { useProfile } from "../hooks/useProfile";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "../../components/AuthProvider";
import { AccountActions } from "../../components/profile/AccountActions";
import { CarsList } from "../../components/profile/CarsList";
import { AddCarForm } from "../../components/profile/AddCarForm";

export default function Profile() {
  const [token, setToken] = useState<string | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const router = useRouter();
  const { logout } = useAuthContext();

  // useEffect for side effects — reads JWT from localStorage after mount
  useEffect(() => {
    setToken(localStorage.getItem("jwt"));
  }, []);

  // Redirect to home after showing expiry message
  //Detects that sessionExpired is now true
  //Re-runs once the sessionExpired changes
  useEffect(() => {
    if (!sessionExpired) return;
    const timer = setTimeout(() => router.push("/"), 2000);
    return () => clearTimeout(timer);
  }, [sessionExpired]);

  //When useProfile is called we call the setSessionExpired
  //We set the sessionExpired to true
  //onExpired is a way for the hook to tell the component the token has expired
  const {
    data: user,
    isLoading,
    isError,
    error,
    //useProfile is call, the arrow function is passed as onExpired
  } = useProfile(token, () => {
    logout();
    //Now true, state changes and the component re-renders
    setSessionExpired(true);
  });

  const { cars, carBrand, setCarBrand, carPlate, setCarPlate, addCar, isAddingCar, addCarFailed, addCarError, deleteCar } = useCars(token);

  // Conditional rendering — session expired
  //If sessionExpired = true
  if (sessionExpired) return <p className="pt-14">Sessionen er udløbet. Du bliver sendt til forsiden...</p>;

  // Conditional rendering — loading state
  //The users isnt logged in
  if (!token) return <p className="pt-14">Du er ikke logget ind</p>;

  //Fetch to the backend /api/profile still in progress
  if (isLoading) return <p className="pt-14">Henter profil…</p>;

  // Conditional rendering — error state
  //The fetch failed
  if (isError) return <p className="pt-14">Fejl: {(error as Error).message}</p>;

  return (
    <div className="pt-14">
      <h1>Min profil</h1>
      <p>
        <strong>Hej!</strong> {user.user_name}
      </p>
      <p>
        <strong>Email:</strong> {user.user_email}
      </p>
      <p>
        <strong>Din profil blev verificeret d.</strong> {user.user_verified_at ? new Date(user.user_verified_at * 1000).toLocaleString("da-DK") : "Nej"}
      </p>
      <AccountActions token={token} userEmail={user.user_email} />
      <CarsList cars={cars} deleteCar={deleteCar} />
      <AddCarForm
        carBrand={carBrand}
        setCarBrand={setCarBrand}
        carPlate={carPlate}
        setCarPlate={setCarPlate}
        addCar={addCar}
        isAddingCar={isAddingCar}
        addCarFailed={addCarFailed}
        addCarError={addCarError}
      />
    </div>
  );
}
