"use client";

import { useMutation } from "@tanstack/react-query";
import { useCars } from "../hooks/useCars";
import { useProfile } from "../hooks/useProfile";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "../../components/AuthProvider";
import { baseUrl } from "../../lib/config";

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

  const {
    mutate: sendReset,
    isPending: isResetting,
    isSuccess: resetSent,
    isError: resetFailed,
  } = useMutation({
    mutationFn: async (email: string) => {
      const body = new URLSearchParams({ email });
      const res = await fetch(`${baseUrl}/api/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" }, //Det der sendes afsted fra clienten skal matche det serveren forventer, i dette tilfælde forventer serveren request.form.data
        body,
      });
      if (!res.ok) throw new Error(await res.text());
    },
  });

  const { cars, carBrand, setCarBrand, carPlate, setCarPlate, addCar, isAddingCar, addCarFailed, addCarError, deleteCar } = useCars(token);
  const [carSubmitAttempted, setCarSubmitAttempted] = useState(false);

  const { mutate: deleteAccount, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${baseUrl}/api/users`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(await res.text());
    },
    onSuccess: () => {
      logout();
      router.push("/");
    },
  });

  // Conditional rendering — session expired
  //If sessionExpired = true
  if (sessionExpired) return <p>Sessionen er udløbet. Du bliver sendt til forsiden...</p>;

  // Conditional rendering — loading state
  //The users isnt logged in
  if (!token) return <p>Du er ikke logget ind</p>;

  //Fetch to the backend /api/profile still in progress
  if (isLoading) return <p>Henter profil…</p>;

  // Conditional rendering — error state
  //The fetch failed
  if (isError) return <p>Fejl: {(error as Error).message}</p>;

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
      <button onClick={() => router.push("/logout")}>Log ud</button>
      <button onClick={() => sendReset(user.user_email)} disabled={isResetting || resetSent}>
        {isResetting ? "Sender…" : resetSent ? "Email sendt! Tjek din indbakke" : "Nulstil adgangskode"}
      </button>
      {/* Conditional rendering — reset error */}
      {resetFailed && <p>Kunne ikke sende reset-email. Prøv igen.</p>}
      <button onClick={() => deleteAccount()} disabled={isDeleting}>
        {isDeleting ? "Sletter…" : "Slet konto"}
      </button>

      <h2>Mine biler</h2>
      {/* Conditional rendering — empty state */}
      {cars?.length === 0 && <p>Du har ingen biler tilføjet endnu.</p>}
      <ul>
        {cars?.map((car: { car_pk: string; car_brand: string; car_license_plate: string }) => (
          <li key={car.car_pk}>
            {car.car_brand} {car.car_license_plate}
            <button onClick={() => deleteCar(car.car_pk)}>Slet bil</button>
          </li>
        ))}
      </ul>

      <h3>Tilføj bil</h3>
      <input type="text" placeholder="Mærke (fx Toyota)" value={carBrand} onChange={(e) => setCarBrand(e.target.value)} />
      <input type="text" placeholder="Nummerplade (fx AB 12 345)" value={carPlate} onChange={(e) => setCarPlate(e.target.value)} />
      <button
        onClick={() => {
          setCarSubmitAttempted(true);
          if (carBrand && carPlate) addCar();
        }}
        disabled={isAddingCar}
      >
        {isAddingCar ? "Tilføjer…" : "Tilføj bil"}
      </button>
      {/* Conditional rendering — empty field validation on submit */}
      {carSubmitAttempted && (!carBrand || !carPlate) && <p>Begge felter skal udfyldes</p>}
      {/* Conditional rendering — add car error from backend */}
      {addCarFailed && <p>{(addCarError as Error).message}</p>}
    </div>
  );
}
