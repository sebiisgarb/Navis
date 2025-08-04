import { useOrders } from '../services/orders';
import { Link } from 'react-router-dom';


export default function OrdersPage() {
  const { data: orders = [], isLoading } = useOrders();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My orders</h1>
        <Link
          to="/orders/new"
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          + New order
        </Link>
      </header>

      <table className="w-full border rounded">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 text-left">#</th>
            <th className="p-2 text-left">Description</th>
            <th className="p-2">Status</th>
            <th className="p-2">Created</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-t">
              <td className="p-2">{o.id}</td>
              <td className="p-2">{o.description}</td>
              <td className="p-2 text-center">{o.status}</td>
              <td className="p-2 text-center">
                {new Date(o.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
