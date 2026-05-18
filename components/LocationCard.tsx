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
  onSelect?: (id: string) => void;
}

export function LocationCard({ location, isSelected, onSelect }: Props) {
  return (
    <div
      onClick={() => onSelect?.(location.location_pk)}
      className={`bg-white rounded-xs shadow-sm overflow-hidden cursor-pointer transition-all ${
        isSelected ? "ring-2 ring-green-600 shadow-md" : "hover:shadow-md"
      }`}
    >
      {/* Colour bar — green when open, red when closed */}
      <div className={`h-1 ${location.location_is_open ? "bg-green-600" : "bg-red-400"}`} />

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h2 className="font-bold text-gray-900 text-base leading-snug">{location.location_name}</h2>
          {/* Conditional rendering — open/closed status */}
          <span className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded-xs ${location.location_is_open ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
            {location.location_is_open ? "Åben" : "Lukket"}
          </span>
        </div>

        <p className="text-sm text-gray-500">{location.location_address}</p>
        <p className="text-sm text-gray-500">{location.location_zip} {location.location_city}</p>
      </div>
    </div>
  );
}
