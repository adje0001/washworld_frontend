"use client";

// Component-based architecture
export interface Location {
  location_pk: string;
  location_name: string;
  location_address: string;
  location_city: string;
  location_zip: string;
  location_lat: number;
  location_lng: number;
  location_is_open: number;
}

interface Props {
  location: Location;
  isSelected: boolean;
}

export function LocationCard({ location, isSelected }: Props) {
  return (
    <div
      className={`rounded-xl border p-4 cursor-pointer transition-all ${
        isSelected
          ? "border-blue-500 bg-blue-50 shadow-md"
          : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm"
      }`}
    >
      <h2 className="font-semibold text-lg text-gray-900">{location.location_name}</h2>
      <p className="text-sm text-gray-600 mt-1">{location.location_address}</p>
      <p className="text-sm text-gray-600">
        {location.location_zip} {location.location_city}
      </p>
      {/* Conditional rendering — open/closed status */}
      <span
        className={`inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded-full ${
          location.location_is_open
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {location.location_is_open ? "Åben" : "Lukket"}
      </span>
    </div>
  );
}
