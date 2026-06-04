import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Car {
  car_pk: string;
  car_brand: string;
  car_license_plate: string;
}
import { useState } from "react";
import { baseUrl } from "../../lib/config";

// Custom hook — requirement: at least one custom hook
// useCars fetches the logged-in users cars and provides addCar and deleteCar mutations
// Requires the JWT token to authorize both requests against the backend
// carBrand and carPlate are declared in this useCars function, so everything in here can read their value
// Both carBrand and carPlate is read on line 58 inside the mutationFn
export function useCars(token: string | null, onUnauthorized?: () => void) {
  const queryClient = useQueryClient();
  const [carBrand, setCarBrand] = useState("");
  const [carPlate, setCarPlate] = useState("");

  //Fetch the specific users cars from the backend in an array object
  //Refetch so we can update the list for every change
  //REST API integration  GET /api/cars with correct Authorization header
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
    staleTime: 5 * 60 * 1000,
    gcTime: 0,
    enabled: !!token,
    retry: false,
  });

  // REST API integration — POST /api/cars with car brand and license plate as JSON
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
        //No need to send carBrand and carPlate as arguments, they are already scoped inside the hook
        body: JSON.stringify({ car_brand: carBrand, car_license_plate: carPlate }),
      });
      if (res.status === 401) {
        onUnauthorized?.();
        throw new Error("unauthorized");
      }
      if (!res.ok) throw new Error(await res.text());
    },
    //Add car's onSuccess gets called by tanstack when the mutationFn finishes we call refetchCars()
    onSuccess: () => {
      setCarBrand("");
      setCarPlate("");
      refetchCars();
    },
  });

  // REST API integration — DELETE /api/cars/:car_pk with correct Authorization header
  // Delete car mutation — sends DELETE request with car_pk in the URL to match the backend route after the onMutate
  // Flask reads <car_pk> out of the URL and uses it to find the right car to delete
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
    //Optimistic UI remove car instantly before server responds
    //onMutate makes the ui update
    onMutate: async (car_pk) => {
      await queryClient.cancelQueries({ queryKey: ["cars", token] });
      const previous = queryClient.getQueryData<Car[]>(["cars", token]);
      queryClient.setQueryData<Car[]>(["cars", token], (old = []) => old.filter((car) => car.car_pk !== car_pk));
      return { previous };
    },
    // Roll back to previous state if the request fails
    onError: (_err, _car_pk, context) => {
      queryClient.setQueryData(["cars", token], context?.previous);
    },

    //Always sync with server after mutation settles, runs regardless of succes or failure
    //Runs when the DELETE request finishes
    //Calls invalidateQueries, which tankstack sees and refetches the GET
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cars", token] });
    },
  });
  //The result from the useQuery is stored as cars and returned from the hook here
  //The cars variable is reactive so when refetchcars() runs and gets new data, tankstack updates cars and the profile re-renders
  return { cars, carBrand, setCarBrand, carPlate, setCarPlate, addCar, isAddingCar, addCarFailed, addCarError, deleteCar };
}
