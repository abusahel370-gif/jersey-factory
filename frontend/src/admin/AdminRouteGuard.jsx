import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import AdminLogin from "./AdminLogin";

export default function AdminRouteGuard({ children }) {
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
        checkAdmin(session.access_token);
      } else {
        setLoading(false);
      }
    });
  }, []);

  async function checkAdmin(token) {
    const res = await fetch("/api/jerseys/teams", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setIsAdmin(true);
    } else {
      const rolesRes = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/user_roles?select=role&user_id=eq.${session?.user?.id}`,
        { headers: { apikey: import.meta.env.VITE_SUPABASE_ANON_KEY } }
      );
      const roles = await rolesRes.json();
      setIsAdmin(roles?.[0]?.role === "admin");
    }
    setLoading(false);
  }

  function handleLogin(user) {
    setSession(user);
    setIsAdmin(true);
  }

  function handleLogout() {
    supabase.auth.signOut();
    setSession(null);
    setIsAdmin(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!session || !isAdmin) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <AdminLayout session={session} onLogout={handleLogout}>
      {children}
    </AdminLayout>
  );
}

function AdminLayout({ session, onLogout, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { name: "Jerseys", path: "/admin/jerseys", icon: "👕" },
    { name: "Orders", path: "/admin/orders", icon: "📦" },
    { name: "Custom Requests", path: "/admin/custom-requests", icon: "✏️" },
  ];

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <aside className={`${sidebarOpen ? "w-64" : "w-16"} bg-gray-800 transition-all duration-200 flex-shrink-0`}>
        <div className="p-4 flex items-center justify-between border-b border-gray-700">
          {sidebarOpen && <h1 className="text-lg font-bold">Admin Panel</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-white">
            {sidebarOpen ? "◀" : "▶"}
          </button>
        </div>
        <nav className="p-2 space-y-1">
          {navItems.map((item) => (
            <a
              key={item.path}
              href={item.path}
              className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-700 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState(null, "", item.path);
                window.dispatchEvent(new Event("popstate"));
              }}
            >
              <span>{item.icon}</span>
              {sidebarOpen && <span>{item.name}</span>}
            </a>
          ))}
        </nav>
        <div className="absolute bottom-0 p-4 border-t border-gray-700 w-full">
          <button onClick={onLogout} className="flex items-center gap-2 text-red-400 hover:text-red-300">
            {sidebarOpen ? "Logout" : "🚪"}
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-6">
        {children}
      </main>
    </div>
  );
}
