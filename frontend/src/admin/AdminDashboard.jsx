import { useState, useEffect } from "react";
import { supabase } from "../supabase";

const ADMIN_EMAIL = "abusahel40@gmail.com";

export default function AdminDashboard() {
  const [authed,         setAuthed]         = useState(false);
  const [email,          setEmail]          = useState("");
  const [password,       setPassword]       = useState("");
  const [loginErr,       setLoginErr]       = useState("");
  const [loading,        setLoading]        = useState(false);
  const [tab,            setTab]            = useState("jerseys");
  const [jerseys,        setJerseys]        = useState([]);
  const [orders,         setOrders]         = useState([]);
  const [customReqs,     setCustomReqs]     = useState([]);
  const [newJersey,      setNewJersey]      = useState({ name:"", team:"", price:"", image:"", category:"", in_stock:true });
  const [addMsg,         setAddMsg]         = useState("");

  /* ── Auth ── */
  const handleLogin = async () => {
    setLoading(true); setLoginErr("");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { setLoginErr(error.message); return; }
    if (data.user.email !== ADMIN_EMAIL) {
      await supabase.auth.signOut();
      setLoginErr("Access denied. Not an admin account.");
      return;
    }
    setAuthed(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setAuthed(false);
  };

  /* ── Data fetching ── */
  useEffect(() => {
    if (!authed) return;
    fetchAll();
  }, [authed]);

  const fetchAll = async () => {
    const [j, o, c] = await Promise.all([
      supabase.from("jerseys").select("*").order("id"),
      supabase.from("orders").select("*").order("created_at", { ascending: false }),
      supabase.from("custom_requests").select("*").order("created_at", { ascending: false }),
    ]);
    if (j.data) setJerseys(j.data);
    if (o.data) setOrders(o.data);
    if (c.data) setCustomReqs(c.data);
  };

  /* ── Add jersey ── */
  const handleAddJersey = async () => {
    if (!newJersey.name || !newJersey.team || !newJersey.price) {
      setAddMsg("Name, team and price are required."); return;
    }
    const { error } = await supabase.from("jerseys").insert([{
      ...newJersey,
      price: Number(newJersey.price),
    }]);
    if (error) { setAddMsg("Error: " + error.message); return; }
    setAddMsg("✓ Jersey added!");
    setNewJersey({ name:"", team:"", price:"", image:"", category:"", in_stock:true });
    fetchAll();
    setTimeout(() => setAddMsg(""), 3000);
  };

  /* ── Delete jersey ── */
  const handleDelete = async (id) => {
    if (!confirm("Delete this jersey?")) return;
    await supabase.from("jerseys").delete().eq("id", id);
    fetchAll();
  };

  /* ── Toggle in_stock ── */
  const toggleStock = async (id, current) => {
    await supabase.from("jerseys").update({ in_stock: !current }).eq("id", id);
    fetchAll();
  };

  const s = {
    page:    { minHeight:"100vh", background:"#f5f5f5", fontFamily:"'Inter',sans-serif" },
    header:  { background:"#111", padding:"0 32px", height:60, display:"flex", alignItems:"center", justifyContent:"space-between" },
    logo:    { color:"#e84747", fontWeight:900, fontSize:20, letterSpacing:2, fontFamily:"'Barlow Condensed',sans-serif" },
    card:    { background:"#fff", border:"1.5px solid #eee", padding:"28px 24px", marginBottom:16 },
    input:   { width:"100%", padding:"10px 14px", border:"1.5px solid #ddd", outline:"none", fontSize:14, fontFamily:"'Inter',sans-serif", marginBottom:10, borderRadius:2 },
    btn:     { background:"#111", color:"#fff", border:"none", padding:"11px 24px", fontWeight:700, fontSize:13, cursor:"pointer", letterSpacing:.5, textTransform:"uppercase", borderRadius:2 },
    tab:     (active) => ({ background: active?"#111":"transparent", color: active?"#fff":"#555", border:"none", padding:"10px 20px", fontWeight:700, fontSize:13, cursor:"pointer", letterSpacing:.5, textTransform:"uppercase", borderBottom: active?"3px solid #e84747":"3px solid transparent" }),
    badge:   (v) => ({ background: v?"#3be37a":"#eee", color: v?"#111":"#999", padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700 }),
    danger:  { background:"transparent", color:"#cc0000", border:"1.5px solid #eee", padding:"6px 14px", cursor:"pointer", fontWeight:700, fontSize:12, borderRadius:2 },
  };

  /* ── LOGIN SCREEN ── */
  if (!authed) return (
    <div style={{ minHeight:"100vh", background:"#111", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:"#fff", padding:"48px 40px", width:380, borderRadius:2 }}>
        <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:28, fontWeight:900, textAlign:"center", marginBottom:6, textTransform:"uppercase" }}>Admin Login</h2>
        <p style={{ color:"#aaa", textAlign:"center", fontSize:13, marginBottom:28 }}>Jersey Factory Dashboard</p>
        <input style={s.input} type="email" placeholder="Admin email" value={email} onChange={e=>setEmail(e.target.value)}/>
        <input style={s.input} type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()}/>
        {loginErr && <p style={{ color:"#cc0000", fontSize:13, marginBottom:12 }}>{loginErr}</p>}
        <button style={{...s.btn, width:"100%", padding:14}} onClick={handleLogin} disabled={loading}>
          {loading ? "Signing in…" : "Login"}
        </button>
      </div>
    </div>
  );

  /* ── DASHBOARD ── */
  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <span style={s.logo}>JERSEY FACTORY · ADMIN</span>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <span style={{ color:"#aaa", fontSize:13 }}>{ADMIN_EMAIL}</span>
          <button onClick={handleLogout} style={{ background:"transparent", color:"#aaa", border:"1px solid #444", padding:"6px 14px", cursor:"pointer", fontSize:12, fontWeight:700, borderRadius:2 }}>Logout</button>
        </div>
      </div>

      {/* Stats Bar */}
      <div style={{ background:"#fff", borderBottom:"1px solid #eee", padding:"0 32px", display:"flex", gap:0 }}>
        {[
          { label:"Total Jerseys",  value: jerseys.length },
          { label:"Orders",         value: orders.length },
          { label:"Custom Requests",value: customReqs.length },
          { label:"In Stock",       value: jerseys.filter(j=>j.in_stock).length },
        ].map(({label,value}) => (
          <div key={label} style={{ padding:"20px 32px", borderRight:"1px solid #eee" }}>
            <div style={{ fontSize:26, fontWeight:900, color:"#111", fontFamily:"'Barlow Condensed',sans-serif" }}>{value}</div>
            <div style={{ fontSize:11, color:"#999", textTransform:"uppercase", letterSpacing:1, marginTop:2 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ background:"#fff", borderBottom:"1px solid #eee", padding:"0 32px", display:"flex", gap:0 }}>
        {["jerseys","orders","custom","add"].map(t => (
          <button key={t} style={s.tab(tab===t)} onClick={()=>setTab(t)}>
            {t==="add" ? "➕ Add Jersey" : t==="custom" ? "Custom Requests" : t.charAt(0).toUpperCase()+t.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ maxWidth:1200, margin:"32px auto", padding:"0 32px" }}>

        {/* ── JERSEYS TAB ── */}
        {tab==="jerseys" && (
          <div>
            <h2 style={{ fontSize:20, fontWeight:800, marginBottom:20 }}>All Jerseys ({jerseys.length})</h2>
            {jerseys.map(j => (
              <div key={j.id} style={{ ...s.card, display:"flex", alignItems:"center", gap:20 }}>
                <img src={j.image} alt={j.name} style={{ width:64, height:64, objectFit:"contain", background:"#f5f5f5", padding:4, borderRadius:2 }} onError={e=>e.target.style.display="none"}/>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:15, color:"#111" }}>{j.name}</div>
                  <div style={{ fontSize:12, color:"#999", marginTop:2 }}>{j.team} · {j.category} · ₹{j.price?.toLocaleString()}</div>
                </div>
                <span style={s.badge(j.in_stock)}>{j.in_stock ? "In Stock" : "Out of Stock"}</span>
                <button style={{ ...s.btn, background:"#555", fontSize:11, padding:"7px 14px" }} onClick={()=>toggleStock(j.id, j.in_stock)}>
                  Toggle Stock
                </button>
                <button style={s.danger} onClick={()=>handleDelete(j.id)}>Delete</button>
              </div>
            ))}
            {jerseys.length===0 && <p style={{ color:"#aaa", textAlign:"center", padding:40 }}>No jerseys found.</p>}
          </div>
        )}

        {/* ── ORDERS TAB ── */}
        {tab==="orders" && (
          <div>
            <h2 style={{ fontSize:20, fontWeight:800, marginBottom:20 }}>Orders ({orders.length})</h2>
            {orders.map(o => (
              <div key={o.id} style={s.card}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                  <div style={{ fontWeight:700, fontSize:14 }}>{o.customer_name}</div>
                  <div style={{ fontSize:12, color:"#999" }}>{o.customer_phone} · {o.customer_email}</div>
                </div>
                <div style={{ fontSize:13, color:"#555", marginBottom:6 }}>
                  {Array.isArray(o.items) ? o.items.map(i=>`${i.name} (₹${i.price})`).join(", ") : JSON.stringify(o.items)}
                </div>
                <div style={{ fontWeight:800, color:"#111" }}>Total: ₹{o.total_price?.toLocaleString()}</div>
                {o.address && <div style={{ fontSize:12, color:"#999", marginTop:4 }}>📍 {o.address}</div>}
              </div>
            ))}
            {orders.length===0 && <p style={{ color:"#aaa", textAlign:"center", padding:40 }}>No orders yet.</p>}
          </div>
        )}

        {/* ── CUSTOM REQUESTS TAB ── */}
        {tab==="custom" && (
          <div>
            <h2 style={{ fontSize:20, fontWeight:800, marginBottom:20 }}>Custom Requests ({customReqs.length})</h2>
            {customReqs.map(c => (
              <div key={c.id} style={s.card}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                  <div style={{ fontWeight:700, fontSize:14 }}>{c.customer_name}</div>
                  <div style={{ fontSize:12, color:"#999" }}>{c.customer_phone} · {c.customer_email}</div>
                </div>
                <div style={{ fontSize:13, color:"#555" }}>
                  Team: <strong>{c.team_name}</strong> · Player: <strong>{c.player_name}</strong>
                </div>
              </div>
            ))}
            {customReqs.length===0 && <p style={{ color:"#aaa", textAlign:"center", padding:40 }}>No custom requests yet.</p>}
          </div>
        )}

        {/* ── ADD JERSEY TAB ── */}
        {tab==="add" && (
          <div style={{ maxWidth:560 }}>
            <h2 style={{ fontSize:20, fontWeight:800, marginBottom:20 }}>Add New Jersey</h2>
            <div style={s.card}>
              {[
                { label:"Jersey Name",  key:"name",     placeholder:"e.g. Portugal Home Kit" },
                { label:"Team",         key:"team",     placeholder:"e.g. Portugal" },
                { label:"Price (₹)",    key:"price",    placeholder:"e.g. 1099", type:"number" },
                { label:"Image URL",    key:"image",    placeholder:"https://..." },
                { label:"Category",     key:"category", placeholder:"e.g. International, club" },
              ].map(({label,key,placeholder,type}) => (
                <div key={key}>
                  <label style={{ fontSize:11, fontWeight:700, letterSpacing:1.2, textTransform:"uppercase", color:"#888", display:"block", marginBottom:6 }}>{label}</label>
                  <input
                    style={s.input}
                    type={type||"text"}
                    placeholder={placeholder}
                    value={newJersey[key]}
                    onChange={e=>setNewJersey(p=>({...p,[key]:e.target.value}))}
                  />
                </div>
              ))}
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
                <input type="checkbox" id="instock" checked={newJersey.in_stock} onChange={e=>setNewJersey(p=>({...p,in_stock:e.target.checked}))} style={{ width:16, height:16 }}/>
                <label htmlFor="instock" style={{ fontSize:13, fontWeight:600, color:"#555" }}>In Stock</label>
              </div>
              {addMsg && <p style={{ color: addMsg.startsWith("✓")?"#25a244":"#cc0000", fontSize:13, marginBottom:12 }}>{addMsg}</p>}
              <button style={{...s.btn, width:"100%", padding:14}} onClick={handleAddJersey}>Add Jersey</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
