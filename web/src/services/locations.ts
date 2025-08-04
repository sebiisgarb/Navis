// src/services/locations.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/axios";

export interface Location {
  id: number;
  address: string;
  location_type: "WAREHOUSE" | "SITE" | "SUPPLIER";
}

export function useLocations() {
  return useQuery<Location[]>({
    queryKey: ["locations"],
    queryFn: () => api.get("locations/").then((r) => r.data), //  ←  / la final
  });
}
