import { useEffect, useState } from "react";
import { supabase } from "../supabase";

const ADMIN_EMAIL = "abusahel40@gmail.com";

export default function AdminRouteGuard({ children }) {
  const [status, setStatus] = useState("loading"); // loading | authed | unauthed
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email === ADMIN_EMAIL) {
        setStatus("authed");
      } else {
        setStatus("unauthed");
      }
    });
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);
    if (authError) { setError(authError.message); return; }
    if (data.user.email !== ADMIN_EMAIL) {
      await supabase.auth.signOut();
      setError("Access denied. Not an admin account.");
      return;
    }
    setStatus("authed");
  }

  if (status === "loading") return (
    <div style={{ minHeight:"100vh", background:"#111", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ color:"#fff", fontSize:16 }}>Loading…</div>
    </div>
  );

  if (status === "unauthed") return (
    <div style={{ minHeight:"100vh", background:"#111", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Inter',sans-serif" }}>
      <div style={{ background:"#fff", padding:"48px 40px", width:380, borderRadius:4 }}>
        <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:28, fontWeight:900, textAlign:"center", marginBottom:6, textTransform:"uppercase" }}>Admin Login</h2>
        <p style={{ color:"#aaa", textAlign:"center", fontSize:13, marginBottom:28 }}>Jersey Factory Dashboard</p>
        <form onSubmit={handleLogin}>
          <label style={{ fontSize:11, fontWeight:700, letterSpacing:1.2, textTransform:"uppercase", color:"#888", display:"block", marginBottom:6 }}>Email</label>
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)} required
            style={{ width:"100%", padding:"10px 14px", border:"1.5px solid #ddd", outline:"none", fontSize:14, marginBottom:12, borderRadius:2, boxSizing:"border-box" }}
            placeholder="admin@email.com"
          />
          <label style={{ fontSize:11, fontWeight:700, letterSpacing:1.2, textTransform:"uppercase", color:"#888", display:"block", marginBottom:6 }}>Password</label>
          <input
            type="password" value={password} onChange={e => setPassword(e.target.value)} required
            style={{ width:"100%", padding:"10px 14px", border:"1.5px solid #ddd", outline:"none", fontSize:14, marginBottom:16, borderRadius:2, boxSizing:"border-box" }}
            placeholder="••••••••"
          />
          {error && <p style={{ color:"#cc0000", fontSize:13, marginBottom:12 }}>{error}</p>}
          <button type="submit" disabled={submitting}
            style={{ width:"100%", padding:14, background: submitting?"#888":"#111", color:"#fff", border:"none", fontWeight:800, fontSize:14, cursor:"pointer", borderRadius:2, textTransform:"uppercase", letterSpacing:1 }}>
            {submitting ? "Signing in…" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );

  return children;
}
