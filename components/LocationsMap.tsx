"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Location } from "./LocationCard";

// Fix for missing marker icons in Next.js + Leaflet
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

interface Props {
  locations: Location[];
  onSelect: (id: string) => void;
}

export function LocationsMap({ locations, onSelect }: Props) {
  return (
    <MapContainer
      center={[56.0, 10.5]}
      zoom={6}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {locations.map((loc) => (
        <Marker
          key={loc.location_pk}
          position={[loc.location_lat, loc.location_lng]}
          icon={icon}
          eventHandlers={{ click: () => onSelect(loc.location_pk) }}
        >
          <Popup>
            <strong>{loc.location_name}</strong>
            <br />
            {loc.location_address}
            <br />
            {loc.location_zip} {loc.location_city}
            <br />
            {loc.location_is_open ? "Åben" : "Lukket"}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
