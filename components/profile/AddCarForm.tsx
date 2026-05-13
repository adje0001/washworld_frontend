"use client";

import { useState } from "react";

interface Props {
  carBrand: string;
  setCarBrand: (v: string) => void;
  carPlate: string;
  setCarPlate: (v: string) => void;
  addCar: () => void;
  isAddingCar: boolean;
  addCarFailed: boolean;
  addCarError: unknown;
}

// Component-based architecture — add car form extracted from profile page
export function AddCarForm({ carBrand, setCarBrand, carPlate, setCarPlate, addCar, isAddingCar, addCarFailed, addCarError }: Props) {
  // State management — carSubmitAttempted lives here since it belongs to this form
  const [carSubmitAttempted, setCarSubmitAttempted] = useState(false);

  return (
    <>
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
    </>
  );
}
