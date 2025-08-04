import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/axios";

export interface OrderPayload {
  description: string;
  source_loc: number;
  destination_loc: number;
}

export interface Order extends OrderPayload {
  id: number;
  status: "NEW" | "ASSIGNED" | "ON_ROUTE" | "DONE";
  created_at: string;
}

/* LIST orders */
export const useOrders = () =>
  useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: () => api.get("orders/").then((r) => r.data),
  });

/* CREATE order */
export const useCreateOrder = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: OrderPayload) => api.post("orders/", payload), // ← slash final
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] }); // ← v5 syntax
    },
  });
};
