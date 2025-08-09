import { useNavigate } from 'react-router-dom';
import { useAvailableCars, useStartShift } from '../services/drivers';
import type { Car } from '../services/drivers';

export default function ChooseCar() {
  const { data: cars = [], isLoading } = useAvailableCars();
  const startShift = useStartShift();
  const nav = useNavigate();

  if (isLoading) return <div>Loading cars...</div>;

  return (
    <div className="max-w-xl mx-auto mt-8 space-y-4">
      <h1 className="text-2xl font-bold">Select Your Car</h1>
      {cars.length === 0 && (
        <p>No cars available today.</p>
      )}
      {cars.map((c: Car) => (
        <div
          key={c.id}
          className="flex justify-between items-center p-4 border rounded"
        >
          <span className="font-medium">{c.registration_number}</span>
          <button
            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            onClick={() => {
              startShift.mutate(c.id, {
                onSuccess: () => {
                  nav("/queue");
                },
              });
            }}
            disabled={startShift.isLoading}
          >
            {startShift.isLoading ? "Starting…" : "Start Shift"}
          </button>
        </div>
      ))}
    </div>
  );
}
