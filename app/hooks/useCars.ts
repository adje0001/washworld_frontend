import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { baseUrl } from "../../lib/config";

// useCars fetches the logged-in users cars and provides addCar and deleteCar mutations
// Requires the JWT token to authorize both requests against the backend
export function useCars(token: string | null, onUnauthorized?: () => void) {
  const [carBrand, setCarBrand] = useState("");
  const [carPlate, setCarPlate] = useState("");

  // Fetch the specific users cars from the backend in an array object
  const { data: cars, refetch: refetchCars } = useQuery({
    queryKey: ["cars", token],
    queryFn: async () => {
      const res = await fetch(`${baseUrl}/api/cars`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        onUnauthorized?.();
        throw new Error("unauthorized");
      }
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    enabled: !!token,
    retry: false,
  });

  // Add car mutation, POSTs brand and license plate to the backend
  const {
    mutate: addCar,
    isPending: isAddingCar,
    isError: addCarFailed,
    error: addCarError,
  } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${baseUrl}/api/cars`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ car_brand: carBrand, car_license_plate: carPlate }),
      });
      if (res.status === 401) {
        onUnauthorized?.();
        throw new Error("unauthorized");
      }
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
      if (res.status === 401) {
        onUnauthorized?.();
        throw new Error("unauthorized");
      }
      if (!res.ok) throw new Error(await res.text());
    },
    onSuccess: () => refetchCars(),
  });
  //The result from the useQuery is stored as cars and returned from the hook here
  return { cars, carBrand, setCarBrand, carPlate, setCarPlate, addCar, isAddingCar, addCarFailed, addCarError, deleteCar };
}
