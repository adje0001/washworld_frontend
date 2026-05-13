interface Car {
  car_pk: string;
  car_brand: string;
  car_license_plate: string;
}

interface Props {
  cars: Car[] | undefined;
  deleteCar: (car_pk: string) => void;
}

// Component-based architecture — cars list extracted from profile page
export function CarsList({ cars, deleteCar }: Props) {
  return (
    <>
      <h2>Mine biler</h2>
      {/* Conditional rendering — empty state */}
      {cars?.length === 0 && <p>Du har ingen biler tilføjet endnu.</p>}
      <ul>
        {cars?.map((car) => (
          <li key={car.car_pk}>
            {car.car_brand} {car.car_license_plate}
            <button onClick={() => deleteCar(car.car_pk)}>Slet bil</button>
          </li>
        ))}
      </ul>
    </>
  );
}
