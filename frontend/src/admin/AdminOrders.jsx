import { useState, useEffect } from "react";

const API = import.meta.env.VITE_SUPABASE_URL;
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    const { data: { session } } = await import("../supabase").then(m => m.supabase.auth.getSession());
    const token = session?.access_token;

    const res = await fetch(`${API}/rest/v1/orders?select=*`, {
      headers: { apikey: KEY, Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setOrders(data);
    setLoading(false);
  }

  async function updateStatus(id, status) {
    const { data: { session } } = await import("../supabase").then(m => m.supabase.auth.getSession());
    const token = session?.access_token;

    await fetch(`${API}/rest/v1/orders?id=eq.${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        apikey: KEY,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    fetchOrders();
  }

  if (loading) {
    return <div className="text-center py-12 text-gray-400">Loading orders...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Orders</h2>

      {orders.length === 0 ? (
        <p className="text-gray-400">No orders yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700 text-gray-400 text-left">
                <th className="pb-3 pr-4">ID</th>
                <th className="pb-3 pr-4">Customer</th>
                <th className="pb-3 pr-4">Items</th>
                <th className="pb-3 pr-4">Total</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-gray-800">
                  <td className="py-3 pr-4 font-mono text-xs">#{o.id}</td>
                  <td className="py-3 pr-4">{o.customer_name || o.name || "—"}</td>
                  <td className="py-3 pr-4">{o.items?.length || o.item_count || "—"}</td>
                  <td className="py-3 pr-4">₹{o.total || o.amount || "—"}</td>
                  <td className="py-3 pr-4">
                    <select
                      value={o.status || "pending"}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                      className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-3 text-gray-400">
                    {o.created_at ? new Date(o.created_at).toLocaleDateString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
