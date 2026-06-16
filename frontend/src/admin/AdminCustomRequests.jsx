import { useState, useEffect } from "react";

const API = import.meta.env.VITE_SUPABASE_URL;
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export default function AdminCustomRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    const { data: { session } } = await import("../supabase").then(m => m.supabase.auth.getSession());
    const token = session?.access_token;

    const res = await fetch(`${API}/rest/v1/custom_requests?select=*`, {
      headers: { apikey: KEY, Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setRequests(data);
    setLoading(false);
  }

  if (loading) {
    return <div className="text-center py-12 text-gray-400">Loading custom requests...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Custom Requests</h2>

      {requests.length === 0 ? (
        <p className="text-gray-400">No custom requests yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700 text-gray-400 text-left">
                <th className="pb-3 pr-4">ID</th>
                <th className="pb-3 pr-4">Name</th>
                <th className="pb-3 pr-4">Jersey Type</th>
                <th className="pb-3 pr-4">Name/Number</th>
                <th className="pb-3 pr-4">Contact</th>
                <th className="pb-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id} className="border-b border-gray-800">
                  <td className="py-3 pr-4 font-mono text-xs">#{r.id}</td>
                  <td className="py-3 pr-4">{r.customer_name || r.name || "—"}</td>
                  <td className="py-3 pr-4">{r.jersey_type || r.type || "—"}</td>
                  <td className="py-3 pr-4">
                    {r.custom_name || r.player_name || "—"}
                    {r.custom_number || r.player_number ? ` #${r.custom_number || r.player_number}` : ""}
                  </td>
                  <td className="py-3 pr-4">{r.phone || r.email || "—"}</td>
                  <td className="py-3 text-gray-400">
                    {r.created_at ? new Date(r.created_at).toLocaleDateString() : "—"}
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
