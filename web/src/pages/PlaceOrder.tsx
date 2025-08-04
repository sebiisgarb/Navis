import { useState } from 'react';
import { useLocations } from '../services/locations';
import { useCreateOrder } from '../services/orders';

export default function PlaceOrder() {
  const { data: locs = [] } = useLocations();
  const createOrder = useCreateOrder();

  const [description, setDescription] = useState("");
  const [source, setSource] = useState<number | "">("");
  const [dest, setDest] = useState<number | "">("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!source || !dest) {
      setError("Choose source and destination");
      return;
    }
    try {
      await createOrder.mutateAsync({
        description,
        source_loc: Number(source),
        destination_loc: Number(dest),
      });
      //reset
      setDescription("");
      setSource("");
      setDest("");
      setError(null);
      alert("Order placed!");
    } catch {
      setError("Server error, try again");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow p-6 rounded-xl">
      <h1 className="text-xl font-bold mb-4">Place order</h1>

      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* description */}
        <textarea
          className="w-full border rounded p-2"
          placeholder="What do you need delivered?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        {/* source */}
        <select
          className="w-full border rounded p-2"
          value={source}
          onChange={(e) => setSource(e.target.value as any)}
          required
        >
          <option value="">Choose source location</option>
          {locs.map((l) => (
            <option key={l.id} value={l.id}>
              {l.address} ({l.location_type})
            </option>
          ))}
        </select>

        {/* destination */}
        <select
          className="w-full border rounded p-2"
          value={dest}
          onChange={(e) => setDest(e.target.value as any)}
          required
        >
          <option value="">Choose destination location</option>
          {locs.map((l) => (
            <option key={l.id} value={l.id}>
              {l.address} ({l.location_type})
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={createOrder.isLoading}
        >
          {createOrder.isLoading ? "Saving…" : "Submit"}
        </button>
      </form>
    </div>
  );
}
