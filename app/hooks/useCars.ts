import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "";

// useCars fetches the logged-in user's cars and provides an addCar mutation.
// Requires the JWT token to authorize both requests against the backend.
export function useCars(token: string | null) {
  const [carBrand, setCarBrand] = useState("");
  const [carPlate, setCarPlate] = useState("");

  // Fetch the user's cars from the backend
  const { data: cars, refetch: refetchCars } = useQuery({
    queryKey: ["cars"],
    queryFn: async () => {
      const res = await fetch(`${baseUrl}/api/cars`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    enabled: !!token,
  });

  // Add car mutation — POSTs brand and license plate to the backend
  const { mutate: addCar, isPending: isAddingCar, isError: addCarFailed, error: addCarError } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${baseUrl}/api/cars`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ car_brand: carBrand, car_license_plate: carPlate }),
      });
      if (!res.ok) throw new Error(await res.text());
    },
    onSuccess: () => {
      setCarBrand("");
      setCarPlate("");
      refetchCars();
    },
  });

  // Delete car mutation — sends DELETE request with car_pk in the URL
  const { mutate: deleteCar } = useMutation({
    mutationFn: async (car_pk: string) => {
      const res = await fetch(`${baseUrl}/api/cars/${car_pk}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(await res.text());
    },
    onSuccess: () => refetchCars(),
  });

  return { cars, carBrand, setCarBrand, carPlate, setCarPlate, addCar, isAddingCar, addCarFailed, addCarError, deleteCar };
}
