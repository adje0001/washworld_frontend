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

// Component-based architecture  add car form extracted from profile page
//Destructuring all props directly from useCars
export function AddCarForm({ carBrand, setCarBrand, carPlate, setCarPlate, addCar, isAddingCar, addCarFailed, addCarError }: Props) {
  // State management — carSubmitAttempted lives here since it belongs to this form
  const [carSubmitAttempted, setCarSubmitAttempted] = useState(false);

  return (
    <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-3">
      <input type="text" placeholder="Mærke (fx Toyota)" value={carBrand} onChange={(e) => setCarBrand(e.target.value)} className="border border-gray-300 rounded-xs px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 w-full" />
      <input type="text" placeholder="Nummerplade (fx AB 12 345)" value={carPlate} onChange={(e) => setCarPlate(e.target.value)} className="border border-gray-300 rounded-xs px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 w-full" />
      <button
        onClick={() => {
          if (carBrand && carPlate) {
            addCar(); //Calls the mutate in the hook
          } else {
            setCarSubmitAttempted(true);
          }
        }}
        disabled={isAddingCar}
        className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold rounded-xs py-2.5 text-sm transition-colors w-full cursor-pointer"
      >
        {isAddingCar ? "Tilføjer…" : "Tilføj køretøj"}
      </button>
      {/* Conditional rendering — empty field validation on submit */}
      {carSubmitAttempted && (!carBrand || !carPlate) && <p className="text-red-500 text-xs">Begge felter skal udfyldes</p>}
      {/* Conditional rendering — add car error from backend */}
      {addCarFailed && <p className="text-red-500 text-xs">{(addCarError as Error).message}</p>}
    </div>
  );
}
