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
    <div className={isSelected ? "location-card location-card--selected" : "location-card"}>
      <h2>{location.location_name}</h2>
      <p>{location.location_address}</p>
      <p>
        {location.location_zip} {location.location_city}
      </p>
      {/* Conditional rendering — open/closed status */}
      <span>{location.location_is_open ? "Åben" : "Lukket"}</span>
    </div>
  );
}
