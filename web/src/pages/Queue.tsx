import { useDeliveryQueue, useAcceptDelivery } from "../services/drivers";
import type { Delivery } from "../services/drivers";
import { formatDistanceToNow } from "date-fns";

export default function Queue() {
  const { data: queue = [], isLoading } = useDeliveryQueue();
  const accept = useAcceptDelivery();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="max-w-xl mx-auto mt-8 space-y-4">
      <h1 className="text-2xl font-bold">Delivery Offers</h1>
      {queue.length === 0 && (
        <p>No pending deliveries right now.</p>
      )}
      {queue.map((d: Delivery) => (
        <div
          key={d.id}
          className="p-4 border rounded flex flex-col sm:flex-row sm:justify-between sm:items-center"
        >
          <div className="mb-2 sm:mb-0">
            <p className="font-medium">#{d.order.id}: {d.order.description}</p>
            <p className="text-sm text-gray-500">
              Offered {formatDistanceToNow(new Date(d.offered_at), { addSuffix: true })}
            </p>
          </div>
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            onClick={() => accept.mutate(d.id)}
            disabled={accept.isLoading}
          >
            {accept.isLoading ? "Accepting…" : "Accept"}
          </button>
        </div>
      ))}
    </div>
  );
}
