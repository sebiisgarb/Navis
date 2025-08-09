import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/axios";

export interface Car {
  id: number;
  registration_numbe: string;
  active: boolean;
}

export interface Delivery {
  id: number;
  order: {
    id: number;
    description: string;
  };
  offered_at: string;
}

// available cars
export function useAvailableCars() {
  return useQuery<Car[]>({
    queryKey: ["cars", "available"],
    queryFn: () => api.get("cars/available/").then((r) => r.data),
  });
}

// start shift on car
export function useStartShift() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (carId: number) => api.post(`shifts/start/${carId}/`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cars", "available"] });
      qc.invalidateQueries({ queryKey: ["deliveries", "queue"] });
    },
  });
}

// get queue of pending deliveries
export function useDeliveryQueue() {
  return useQuery<Delivery[]>({
    queryKey: ["deliveries", "queue"],
    queryFn: () => api.get("deliveries/queue/").then((r) => r.data),
  });
}

// accept delivery
export function useAcceptDelivery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (deliveryId: number) =>
      api.post(`deliveries/${deliveryId}/accept/`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["deliveries", "queue"] });
    },
  });
}
