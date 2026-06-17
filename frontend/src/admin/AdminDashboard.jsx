import { useState, useEffect } from "react";
import { supabase } from "../supabase";

export default function AdminDashboard() {
  const [tab, setTab] = useState("jerseys");
  const [jerseys, setJerseys] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customReqs, setCustomReqs] = useState([]);
  const [newJersey, setNewJersey] = useState({ name:"", team:"", price:"", image:"", category:"", in_stock:true });
  const [addMsg, setAddMsg] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserEmail(session?.user?.email || "");
    });
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const [j, o, c] = await Promise.all([
      supabase.from("jerseys").select("*").order("id"),
      supabase.from("orders").select("*"),
      supabase.from("custom_requests").select("*"),
    ]);
    if (j.data) setJerseys(j.data);
    if (o.data) setOrders(o.data);
    if (c.data) setCustomReqs(c.data);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const handleAddJersey = async () => {
    if (!newJersey.name || !newJersey.team || !newJersey.price) {
      setAddMsg("Name, team and price are required."); return;
    }
    const { error } = await supabase.from("jerseys").insert([{ ...newJersey, price: Number(newJersey.price) }]);
    if (error) { setAddMsg("Error: " + error.message); return; }
    setAddMsg("✓ Jersey added!");
    setNewJersey({ name:"", team:"", price:"", image:"", category:"", in_stock:true });
    fetchAll();
    setTimeout(() => setAddMsg(""), 3000);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this jersey?")) return;
    await supabase.from("jerseys").delete().eq("id", id);
    fetchAll();
  };

  const toggleStock = async (id, current) => {
    await supabase.from("jerseys").update({ in_stock: !current }).eq("id", id);
    fetchAll();
  };

  const s = {
    page:   { display:"flex", minHeight:"100vh", background:"#f5f5f5", fontFamily:"'Inter',sans-serif" },
    sidebar:{ width:220, background:"#111", display:"flex", flexDirection:"column", flexShrink:0 },
    main:   { flex:1, display:"flex", flexDirection:"column", overflow:"hidden" },
    header: { background:"#fff", borderBottom:"1px solid #eee", padding:"0 32px", height:60, display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 },
    content:{ flex:1, overflowY:"auto", padding:32 },
    card:   { background:"#fff", border:"1.5px solid #eee", padding:"24px", marginBottom:12, borderRadius:2 },
    input:  { width:"100%", padding:"10px 14px", border:"1.5px solid #ddd", outline:"none", fontSize:14, fontFamily:"'Inter',sans-serif", marginBottom:10, borderRadius:2, boxSizing:"border-box" },
    btn:    { background:"#111", color:"#fff", border:"none", padding:"10px 20px", fontWeight:700, fontSize:13, cursor:"pointer", letterSpacing:.5, textTransform:"uppercase", borderRadius:2 },
    badge:  (v) => ({ background: v?"#d1fae5":"#f3f4f6", color: v?"#065f46":"#6b7280", padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700 }),
    danger: { background:"transparent", color:"#dc2626", border:"1.5px solid #fecaca", padding:"6px 14px", cursor:"pointer", fontWeight:700, fontSize:12, borderRadius:2 },
  };

  const navItems = [
    { key:"jerseys", icon:"👕", label:"Jerseys" },
    { key:"orders",  icon:"📦", label:"Orders" },
    { key:"custom",  icon:"✏️", label:"Custom Requests" },
    { key:"add",     icon:"➕", label:"Add Jersey" },
  ];

  return (
    <div style={s.page}>
      {/* Sidebar */}
      <div style={s.sidebar}>
        <div style={{ padding:"24px 20px", borderBottom:"1px solid #222" }}>
          <div style={{ color:"#e84747", fontWeight:900, fontSize:18, letterSpacing:2, fontFamily:"'Barlow Condensed',sans-serif" }}>JERSEY FACTORY</div>
          <div style={{ color:"#555", fontSize:11, marginTop:2, letterSpacing:1 }}>ADMIN PANEL</div>
        </div>
        <nav style={{ flex:1, padding:"16px 8px" }}>
          {navItems.map(item => (
            <button key={item.key} onClick={() => setTab(item.key)} style={{
              width:"100%", display:"flex", alignItems:"center", gap:12,
              padding:"12px 16px", borderRadius:4, border:"none", cursor:"pointer",
              background: tab===item.key ? "#222" : "transparent",
              color: tab===item.key ? "#fff" : "#666",
              fontSize:14, fontWeight:600, textAlign:"left", marginBottom:2,
              transition:"background .15s, color .15s",
            }}>
              <span style={{fontSize:16}}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div style={{ padding:"16px 20px", borderTop:"1px solid #222" }}>
          <div style={{ color:"#555", fontSize:11, marginBottom:8, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{userEmail}</div>
          <button onClick={handleLogout} style={{ background:"transparent", color:"#666", border:"1px solid #333", padding:"8px 16px", cursor:"pointer", fontSize:12, fontWeight:700, borderRadius:2, width:"100%", letterSpacing:.5 }}>
            Logout
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={s.main}>
        {/* Header */}
        <div style={s.header}>
          <h1 style={{ fontSize:18, fontWeight:800, color:"#111" }}>
            {navItems.find(n=>n.key===tab)?.icon} {navItems.find(n=>n.key===tab)?.label}
          </h1>
          <div style={{ display:"flex", gap:24 }}>
            {[
              { label:"Jerseys",  value: jerseys.length },
              { label:"Orders",   value: orders.length },
              { label:"Requests", value: customReqs.length },
            ].map(({label,value}) => (
              <div key={label} style={{ textAlign:"center" }}>
                <div style={{ fontSize:20, fontWeight:900, color:"#111", lineHeight:1 }}>{value}</div>
                <div style={{ fontSize:10, color:"#999", textTransform:"uppercase", letterSpacing:1 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={s.content}>

          {/* ── JERSEYS TAB ── */}
          {tab==="jerseys" && (
            <div>
              <p style={{ color:"#999", fontSize:13, marginBottom:20 }}>{jerseys.length} jerseys in database</p>
              {jerseys.length === 0 && (
                <div style={{ ...s.card, textAlign:"center", padding:48, color:"#aaa" }}>
                  No jerseys yet. Go to "Add Jersey" to add one.
                </div>
              )}
              {jerseys.map(j => (
                <div key={j.id} style={{ ...s.card, display:"flex", alignItems:"center", gap:16 }}>
                  <img src={j.image} alt={j.name}
                    style={{ width:60, height:60, objectFit:"contain", background:"#f9f9f9", padding:4, borderRadius:2, flexShrink:0 }}
                    onError={e => { e.target.style.display="none"; }}
                  />
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:700, fontSize:15, color:"#111" }}>{j.name}</div>
                    <div style={{ fontSize:12, color:"#999", marginTop:2 }}>
                      {j.team} · {j.category || "—"} · ₹{j.price?.toLocaleString()}
                    </div>
                  </div>
                  <span style={s.badge(j.in_stock)}>{j.in_stock ? "In Stock" : "Out of Stock"}</span>
                  <button onClick={() => toggleStock(j.id, j.in_stock)}
                    style={{ ...s.btn, background:"#555", fontSize:11, padding:"7px 14px" }}>
                    Toggle Stock
                  </button>
                  <button onClick={() => handleDelete(j.id)} style={s.danger}>Delete</button>
                </div>
              ))}
            </div>
          )}

          {/* ── ORDERS TAB ── */}
          {tab==="orders" && (
            <div>
              <p style={{ color:"#999", fontSize:13, marginBottom:20 }}>{orders.length} orders total</p>
              {orders.length === 0 && (
                <div style={{ ...s.card, textAlign:"center", padding:48, color:"#aaa" }}>No orders yet.</div>
              )}
              {orders.map(o => (
                <div key={o.id} style={s.card}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8, flexWrap:"wrap", gap:8 }}>
                    <div style={{ fontWeight:700, fontSize:15 }}>{o.customer_name || "—"}</div>
                    <div style={{ fontSize:12, color:"#999" }}>{o.customer_phone} · {o.customer_email}</div>
                  </div>
                  <div style={{ fontSize:13, color:"#555", marginBottom:8 }}>
                    {Array.isArray(o.items)
                      ? o.items.map(i => `${i.name} (₹${i.price})`).join(", ")
                      : typeof o.items === "object" ? JSON.stringify(o.items) : o.items || "—"}
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div style={{ fontWeight:800, fontSize:16, color:"#111" }}>₹{o.total_price?.toLocaleString() || "—"}</div>
                    {o.address && <div style={{ fontSize:12, color:"#999" }}>📍 {o.address}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── CUSTOM REQUESTS TAB ── */}
          {tab==="custom" && (
            <div>
              <p style={{ color:"#999", fontSize:13, marginBottom:20 }}>{customReqs.length} custom requests</p>
              {customReqs.length === 0 && (
                <div style={{ ...s.card, textAlign:"center", padding:48, color:"#aaa" }}>No custom requests yet.</div>
              )}
              {customReqs.map(c => (
                <div key={c.id} style={s.card}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6, flexWrap:"wrap", gap:8 }}>
                    <div style={{ fontWeight:700, fontSize:15 }}>{c.customer_name || "—"}</div>
                    <div style={{ fontSize:12, color:"#999" }}>{c.customer_phone} · {c.customer_email}</div>
                  </div>
                  <div style={{ fontSize:13, color:"#555" }}>
                    Team: <strong>{c.team_name || "—"}</strong> · Player: <strong>{c.player_name || "—"}</strong>
                  </div>
                  {c.created_at && (
                    <div style={{ fontSize:11, color:"#bbb", marginTop:8 }}>
                      {new Date(c.created_at).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ── ADD JERSEY TAB ── */}
          {tab==="add" && (
            <div style={{ maxWidth:560 }}>
              <div style={s.card}>
                {[
                  { label:"Jersey Name", key:"name",     placeholder:"e.g. Portugal Home Kit 2025" },
                  { label:"Team",        key:"team",     placeholder:"e.g. Portugal" },
                  { label:"Price (₹)",   key:"price",    placeholder:"e.g. 1099", type:"number" },
                  { label:"Image URL",   key:"image",    placeholder:"https://..." },
                  { label:"Category",    key:"category", placeholder:"e.g. International, club, national" },
                ].map(({label, key, placeholder, type}) => (
                  <div key={key}>
                    <label style={{ fontSize:11, fontWeight:700, letterSpacing:1.2, textTransform:"uppercase", color:"#888", display:"block", marginBottom:6 }}>{label}</label>
                    <input
                      style={s.input}
                      type={type || "text"}
                      placeholder={placeholder}
                      value={newJersey[key]}
                      onChange={e => setNewJersey(p => ({ ...p, [key]: e.target.value }))}
                    />
                  </div>
                ))}
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
                  <input type="checkbox" id="instock" checked={newJersey.in_stock}
                    onChange={e => setNewJersey(p => ({ ...p, in_stock: e.target.checked }))}
                    style={{ width:16, height:16, cursor:"pointer" }}
                  />
                  <label htmlFor="instock" style={{ fontSize:14, fontWeight:600, color:"#555", cursor:"pointer" }}>In Stock</label>
                </div>
                {addMsg && (
                  <p style={{ color: addMsg.startsWith("✓") ? "#059669" : "#dc2626", fontSize:13, marginBottom:12, fontWeight:600 }}>
                    {addMsg}
                  </p>
                )}
                <button style={{ ...s.btn, width:"100%", padding:14 }} onClick={handleAddJersey}>
                  Add Jersey to Database
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
