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
      <h2 className="text-lg font-bold text-gray-900 mb-3">Mine køretøjer</h2>
      <div className="divide-y divide-gray-100">
        {/* Conditional rendering — empty state */}
        {cars?.length === 0 && <p className="text-gray-400 text-sm py-2">Du har ingen køretøjer tilføjet endnu.</p>}
        {cars?.map((car) => (
          <div key={car.car_pk} className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-sm uppercase text-gray-900">{car.car_license_plate}</p>
                <p className="text-gray-400 text-xs">{car.car_brand}</p>
              </div>
            </div>
            <button onClick={() => deleteCar(car.car_pk)} className="text-red-400 hover:text-red-600 text-sm transition-colors cursor-pointer">
              Slet
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
