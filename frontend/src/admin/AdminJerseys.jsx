import { useState, useEffect } from "react";

const API = import.meta.env.VITE_SUPABASE_URL;
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export default function AdminJerseys() {
  const [jerseys, setJerseys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", team: "", price: "", badge: "", image: "" });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchJerseys();
  }, []);

  async function fetchJerseys() {
    const res = await fetch(`${API}/rest/v1/jerseys?select=*`, {
      headers: { apikey: KEY },
    });
    const data = await res.json();
    setJerseys(data);
    setLoading(false);
  }

  async function getToken() {
    const { data: { session } } = await import("../supabase").then(m => m.supabase.auth.getSession());
    return session?.access_token;
  }

  function openCreate() {
    setEditing(null);
    setForm({ name: "", team: "", price: "", badge: "", image: "" });
    setShowForm(true);
  }

  function openEdit(j) {
    setEditing(j);
    setForm({ name: j.name, team: j.team, price: j.price, badge: j.badge || "", image: j.image || "" });
    setShowForm(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    const token = await getToken();
    const body = { ...form, price: Number(form.price) };

    if (editing) {
      await fetch(`${API}/rest/v1/jerseys?id=eq.${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", apikey: KEY, Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
    } else {
      await fetch(`${API}/rest/v1/jerseys`, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: KEY, Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
    }

    setShowForm(false);
    fetchJerseys();
  }

  async function handleDelete(id) {
    if (!confirm("Delete this jersey?")) return;
    const token = await getToken();
    await fetch(`${API}/rest/v1/jerseys?id=eq.${id}`, {
      method: "DELETE",
      headers: { apikey: KEY, Authorization: `Bearer ${token}` },
    });
    fetchJerseys();
  }

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    const token = await getToken();
    const fileName = `${Date.now()}_${file.name}`;
    const formData = new FormData();
    formData.append("file", file);

    const { data, error } = await import("../supabase").then(m =>
      m.supabase.storage.from("jersey-images").upload(fileName, file)
    );

    if (error) {
      alert("Upload failed: " + error.message);
    } else {
      const { data: { publicUrl } } = import("../supabase").then(m =>
        m.supabase.storage.from("jersey-images").getPublicUrl(fileName)
      );
      setForm((prev) => ({ ...prev, image: publicUrl }));
    }
    setUploading(false);
  }

  if (loading) {
    return <div className="text-center py-12 text-gray-400">Loading jerseys...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Jerseys</h2>
        <button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm font-semibold">
          + Add Jersey
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <form onSubmit={handleSave} className="bg-gray-800 p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">{editing ? "Edit Jersey" : "Add Jersey"}</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white" required />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Team</label>
                <input type="text" value={form.team} onChange={(e) => setForm({ ...form, team: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white" required />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Price (₹)</label>
                <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white" required />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Badge (optional)</label>
                <select value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white">
                  <option value="">None</option>
                  <option value="bestseller">Bestseller</option>
                  <option value="new">New</option>
                  <option value="limited">Limited</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Image</label>
                <input type="file" accept="image/*" onChange={handleImageUpload}
                  className="w-full text-gray-400 text-sm" disabled={uploading} />
                {uploading && <p className="text-blue-400 text-sm mt-1">Uploading...</p>}
                {form.image && (
                  <img src={form.image} alt="preview" className="mt-2 h-20 w-20 object-cover rounded" />
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button type="submit" className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm font-semibold">
                {editing ? "Update" : "Create"}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded text-sm">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700 text-gray-400 text-left">
              <th className="pb-3 pr-4">Image</th>
              <th className="pb-3 pr-4">Name</th>
              <th className="pb-3 pr-4">Team</th>
              <th className="pb-3 pr-4">Price</th>
              <th className="pb-3 pr-4">Badge</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jerseys.map((j) => (
              <tr key={j.id} className="border-b border-gray-800">
                <td className="py-3 pr-4">
                  {j.image && <img src={j.image} alt="" className="h-12 w-12 object-cover rounded" />}
                </td>
                <td className="py-3 pr-4">{j.name}</td>
                <td className="py-3 pr-4">{j.team}</td>
                <td className="py-3 pr-4">₹{j.price}</td>
                <td className="py-3 pr-4">
                  {j.badge && <span className="bg-blue-600 text-xs px-2 py-0.5 rounded">{j.badge}</span>}
                </td>
                <td className="py-3 flex gap-2">
                  <button onClick={() => openEdit(j)} className="text-blue-400 hover:text-blue-300">Edit</button>
                  <button onClick={() => handleDelete(j.id)} className="text-red-400 hover:text-red-300">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
