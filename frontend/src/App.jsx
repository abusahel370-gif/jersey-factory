import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";

import portugalImg from "./assets/portugal_2.webp";
import franceImg from "./assets/france_1.webp";
import netherlandsImg from "./assets/IB5334-809-1.webp";
import englandImg from "./assets/england_1.jpeg";
import argentinaImg from "./assets/argentina_1.webp";
import brazilImg from "./assets/brazil_1.webp";
import ronaldo from "./assets/ronaldo.png";
import messi from "./assets/messi.png";
import neymar from "./assets/neymar.jpeg";

/* ─── DATA ─────────────────────────────────────────────────── */
const NAV_LINKS = [
  { name: "Home",    id: "home"    },
  { name: "Shop",    id: "shop"    },
  { name: "Custom",  id: "custom"  },
  { name: "Contact", id: "contact" },
];

const JERSEYS = [
  { id:1, name:"Portugal Home Kit",         team:"Portugal · Puma",    price:1099, badge:"bestseller", img:portugalImg,    flag:"🇵🇹" },
  { id:2, name:"France Home Jersey",        team:"France · Nike",      price:999,  badge:"new",        img:franceImg,      flag:"🇫🇷" },
  { id:3, name:"Netherlands Home Kit",      team:"Netherlands · Nike", price:999,  badge:"new",        img:netherlandsImg, flag:"🇳🇱" },
  { id:4, name:"England Away Jersey",       team:"England · Nike",     price:899,  badge:"limited",    img:englandImg,     flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { id:5, name:"Argentina Special Edition", team:"Argentina · Adidas", price:999,  badge:"new",        img:argentinaImg,   flag:"🇦🇷" },
  { id:6, name:"Brazil Home Jersey",        team:"Brazil · Nike",      price:999,  badge:null,         img:brazilImg,      flag:"🇧🇷" },
];

const BEST_SELLERS = [JERSEYS[0], JERSEYS[1], JERSEYS[4]];
const TRENDING     = [JERSEYS[2], JERSEYS[3], JERSEYS[5]];

const FEATURED_COUNTRIES = [
  { flag:"🇧🇷", name:"Brazil",    color:"#009c3b" },
  { flag:"🇦🇷", name:"Argentina", color:"#74acdf" },
  { flag:"🇵🇹", name:"Portugal",  color:"#c0392b" },
  { flag:"🇫🇷", name:"France",    color:"#002395" },
  { flag:"🇪🇸", name:"Spain",     color:"#c60b1e" },
  { flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", name:"England",   color:"#cf142b" },
];

const BADGE_STYLES = {
  bestseller: { bg:"#5740dbd4", text:"#fff" },
  new:        { bg:"#3be37a",   text:"#111" },
  limited:    { bg:"#ff5757",   text:"#fff" },
};

const REVIEWS = [
  { name:"Arjun Mehta",    location:"Mumbai",    rating:5, text:"Got the Portugal kit for my son — quality is absolutely top notch. Custom printing was perfect. Delivered in 3 days!", avatar:"🧑‍💼" },
  { name:"Priya Nair",     location:"Kochi",     rating:5, text:"Argentina jersey for World Cup was exactly what I wanted. Fabric feels premium. Will definitely order again!", avatar:"👩‍🎓" },
  { name:"Ravi Kumar",     location:"Bangalore", rating:5, text:"Ordered custom Ronaldo jersey. Name and number print is super crisp. Jersey Factory is the real deal!", avatar:"🧔" },
  { name:"Sneha Patil",    location:"Pune",      rating:4, text:"Great quality jerseys at an unbeatable price. WhatsApp ordering process is quick and hassle-free.", avatar:"👩‍💻" },
  { name:"Mohammed Sadiq", location:"Chennai",   rating:5, text:"France jersey arrived well-packed. Looks exactly like the official kit. Highly recommended!", avatar:"🧑" },
  { name:"Kavitha Rao",    location:"Hyderabad", rating:5, text:"Bought Brazil and England kits together. Both are brilliant. Fast delivery and amazing packaging.", avatar:"👩" },
];

const WHY_CHOOSE = [
  { icon:"🏅", title:"Premium Quality", desc:"High-quality polyester fabric — breathable, durable, and match-ready." },
  { icon:"✏️", title:"Custom Printing",  desc:"Your name and number, printed sharp on any jersey in 3–5 days." },
  { icon:"🚚", title:"Fast Delivery",    desc:"Secure packaging, tracked shipping across every corner of India." },
  { icon:"💬", title:"WhatsApp Order",   desc:"No complicated checkout — just message us and we handle the rest." },
  { icon:"💰", title:"Best Prices",      desc:"Authentic-quality kits at prices that don't break the bank." },
  { icon:"🔄", title:"Easy Returns",     desc:"Not happy? We make it right — no questions asked within 7 days." },
];

/* ─── helpers ───────────────────────────────────────────────── */
const validateEmail    = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const validatePassword = (v) => v.length >= 6;

/* ─── JERSEY CARD ───────────────────────────────────────────── */
function JerseyCard({ jersey, onAdd }) {
  const [added,   setAdded]   = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleAdd = () => {
    setAdded(true);
    onAdd(jersey);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background:"#111",
        border: hovered ? "1.5px solid rgba(232,197,71,0.5)" : "1.5px solid rgba(255,255,255,0.07)",
        borderRadius:20,
        overflow:"hidden",
        position:"relative",
        transition:"transform .28s ease, border-color .28s ease, box-shadow .28s ease",
        transform: hovered ? "translateY(-8px)" : "translateY(0)",
        boxShadow: hovered ? "0 24px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(232,197,71,0.1)" : "none",
      }}
    >
      {jersey.badge && (
        <span style={{
          position:"absolute", top:14, right:14, zIndex:2,
          borderRadius:6, padding:"4px 10px",
          fontSize:10, fontWeight:800, letterSpacing:1, textTransform:"uppercase",
          background: BADGE_STYLES[jersey.badge].bg,
          color:       BADGE_STYLES[jersey.badge].text,
        }}>{jersey.badge}</span>
      )}

      <div style={{
        background:"linear-gradient(160deg,#f5f5f5 0%,#e8e8e8 100%)",
        display:"flex", justifyContent:"center", alignItems:"center",
        padding:"32px 24px", minHeight:220, overflow:"hidden",
      }}>
        <img src={jersey.img} alt={jersey.name} style={{
          width:"100%", maxWidth:200, height:210, objectFit:"contain", display:"block",
          transition:"transform .35s ease",
          transform: hovered ? "scale(1.1)" : "scale(1)",
        }} />
      </div>

      <div style={{ padding:"22px 22px 20px" }}>
        <p style={{
          fontSize:11, fontWeight:700, letterSpacing:1.5,
          textTransform:"uppercase", color:"rgba(255,255,255,0.3)",
          margin:"0 0 6px", display:"flex", alignItems:"center", gap:6,
        }}>
          <span style={{fontSize:13}}>{jersey.flag}</span>{jersey.team}
        </p>
        <h3 style={{fontSize:17, fontWeight:800, color:"#fff", margin:"0 0 20px", lineHeight:1.3}}>{jersey.name}</h3>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
          <div>
            <span style={{fontSize:14,fontWeight:600,color:"rgba(209,200,200,0.45)",verticalAlign:"top",lineHeight:"28px"}}>₹</span>
            <span style={{fontSize:26,fontWeight:900,color:"#bbb9c3"}}>{jersey.price.toLocaleString()}</span>
          </div>
          <button onClick={handleAdd} style={{
            border:"none", borderRadius:10, padding:"11px 20px",
            fontSize:13, fontWeight:800, cursor:"pointer", color:"#111",
            transition:"background .3s, transform .15s",
            background: added ? "#3be37a" : "#c3b37b",
            transform:  added ? "scale(0.95)" : "scale(1)",
          }}>{added ? "✓ Added!" : "Add to Cart"}</button>
        </div>
      </div>
    </div>
  );
}

/* ─── LOGIN MODAL ───────────────────────────────────────────── */
function LoginModal({ onClose, onLogin }) {
  const [email,       setEmail]       = useState("");
  const [password,    setPassword]    = useState("");
  const [emailErr,    setEmailErr]    = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [loading,     setLoading]     = useState(false);

  const handleLogin = () => {
    let valid = true;
    if (!validateEmail(email)) { setEmailErr("Please enter a valid email address."); valid = false; } else { setEmailErr(""); }
    if (!validatePassword(password)) { setPasswordErr("Password must be at least 6 characters."); valid = false; } else { setPasswordErr(""); }
    if (!valid) return;
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("jf_logged_in", "true");
      localStorage.setItem("jf_email", email.trim());
      setLoading(false);
      onLogin(email.trim());
      onClose();
    }, 700);
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleLogin(); };

  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",justifyContent:"center",alignItems:"center",zIndex:9999}}>
      <div onClick={e => e.stopPropagation()} onKeyDown={handleKeyDown} style={{width:400,background:"#111",padding:"44px 40px",borderRadius:16,border:"1px solid rgba(232,197,71,0.4)",boxShadow:"0 32px 64px rgba(0,0,0,0.6)"}}>
        <h2 style={{fontFamily:"'Barlow Condensed',sans-serif",color:"#e8c547",textAlign:"center",fontSize:32,fontWeight:900,fontStyle:"italic",marginBottom:8,letterSpacing:.5}}>Welcome Back</h2>
        <p style={{color:"rgba(255,255,255,0.35)",textAlign:"center",fontSize:13,marginBottom:28}}>Sign in to your Jersey Factory account</p>

        <label style={{fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:"rgba(255,255,255,0.35)",display:"block",marginBottom:8}}>Email</label>
        <input className="input-field" type="email" placeholder="you@example.com" value={email} onChange={e=>{setEmail(e.target.value);setEmailErr("");}} style={{marginBottom:emailErr?6:16,borderColor:emailErr?"#ff5757":undefined}}/>
        {emailErr && <p style={{color:"#ff5757",fontSize:12,marginBottom:14}}>{emailErr}</p>}

        <label style={{fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:"rgba(255,255,255,0.35)",display:"block",marginBottom:8}}>Password</label>
        <input className="input-field" type="password" placeholder="••••••••" value={password} onChange={e=>{setPassword(e.target.value);setPasswordErr("");}} style={{marginBottom:passwordErr?6:28,borderColor:passwordErr?"#ff5757":undefined}}/>
        {passwordErr && <p style={{color:"#ff5757",fontSize:12,marginBottom:20}}>{passwordErr}</p>}

        <button onClick={handleLogin} disabled={loading} style={{width:"100%",padding:"14px",background:loading?"rgba(232,197,71,0.5)":"linear-gradient(135deg,#e8c547,#f0d060)",color:"#111",border:"none",borderRadius:10,fontWeight:800,fontSize:15,cursor:loading?"not-allowed":"pointer",marginBottom:12,letterSpacing:.3,transition:"background .3s"}}>
          {loading ? "Signing in…" : "Login"}
        </button>
        <button onClick={onClose} style={{width:"100%",padding:"14px",background:"transparent",color:"rgba(255,255,255,0.5)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:10,cursor:"pointer",fontSize:14}}>Cancel</button>
      </div>
    </div>
  );
}

/* ─── STAR RATING ───────────────────────────────────────────── */
function Stars({ count }) {
  return (
    <div style={{display:"flex",gap:3}}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{fontSize:14,color: i <= count ? "#e8c547" : "rgba(255,255,255,0.15)"}}>★</span>
      ))}
    </div>
  );
}

/* ─── MAIN APP ──────────────────────────────────────────────── */
export default function App() {
  const [cartCount,      setCartCount]      = useState(0);
  const [cartItems,      setCartItems]      = useState([]);
  const [activeNav,      setActiveNav]      = useState("Home");
  const [customName,     setCustomName]     = useState("");
  const [customNumber,   setCustomNumber]   = useState("");
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [heroVisible,    setHeroVisible]    = useState(false);
  const [showLogin,      setShowLogin]      = useState(false);
  const [loggedIn,       setLoggedIn]       = useState(false);
  const [userEmail,      setUserEmail]      = useState("");
  const [searchQuery,    setSearchQuery]    = useState("");
  const [jerseys, setJerseys] = useState([]);
  const heroRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("jf_logged_in");
    const savedEmail = localStorage.getItem("jf_email");
    if (saved === "true" && savedEmail) { setLoggedIn(true); setUserEmail(savedEmail); }
  }, []);

useEffect(() => {
  async function fetchJerseys() {
    const { data, error } = await supabase
      .from("jerseys")
      .select("*");

    if (error) {
      console.error("Error:", error);
    } else {
      console.log("Jerseys:", data);
      setJerseys(data);
    }
  }

  fetchJerseys();
}, []);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleAddToCart  = (jersey) => { setCartCount(c => c + 1); setCartItems(p => [...p, jersey]); };
  const handleRemoveItem = (i) => { setCartItems(p => p.filter((_,idx) => idx !== i)); setCartCount(c => c - 1); };
  const handleLogout = () => {
    localStorage.removeItem("jf_logged_in");
    localStorage.removeItem("jf_email");
    setLoggedIn(false);
    setUserEmail("");
  };

  const handleSubmitCustom = () => {
    if (!customName.trim() || !customNumber.trim()) return;
    const msg = encodeURIComponent(`Hello Jersey Factory!\n\nI'd like a Custom Jersey:\n• Name on Jersey: ${customName.trim()}\n• Jersey Number: ${customNumber.trim()}\n\nPlease confirm availability and pricing.`);
    window.open(`https://wa.me/919363964260?text=${msg}`, "_blank", "noopener,noreferrer");
    setOrderSubmitted(true);
    setTimeout(() => setOrderSubmitted(false), 3000);
    setCustomName("");
    setCustomNumber("");
  };

  const scrollTo = (id, name) => {
    setActiveNav(name);
    document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });
  };

  const filteredJerseys = searchQuery.trim()
    ? JERSEYS.filter(j => j.name.toLowerCase().includes(searchQuery.toLowerCase()) || j.team.toLowerCase().includes(searchQuery.toLowerCase()))
    : JERSEYS;

  const cartTotal = cartItems.reduce((s, i) => s + Number(i.price), 0);
  const waMsg = encodeURIComponent(`Hello Jersey Factory!\n\nI'd like to order:\n${cartItems.map(i => `• ${i.name} — ₹${i.price}`).join("\n")}\n\nTotal: ₹${cartTotal}`);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,700;0,900;1,900&family=Inter:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html { scroll-behavior:smooth; }
        body { background:#0a0a0a; }

        @keyframes fadeUp    { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeRight { from{opacity:0;transform:translateX(-40px)} to{opacity:1;transform:translateX(0)} }
        @keyframes fadeLeft  { from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:translateX(0)} }
        @keyframes pulse     { 0%,100%{box-shadow:0 0 0 0 rgba(156,133,51,0.76)} 50%{box-shadow:0 0 0 12px rgba(232,197,71,0)} }
        @keyframes shimmer   { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes flagFloat { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-6px)} }
        @keyframes offerSlide{ from{opacity:0;transform:translateY(-100%)} to{opacity:1;transform:translateY(0)} }
        @keyframes reviewFade{ from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

        .hero-text  { opacity:0; animation:fadeRight .8s ease forwards; }
        .hero-img   { opacity:0; animation:fadeLeft  .9s ease .2s forwards; }
        .hero-sub   { opacity:0; animation:fadeUp    .8s ease .4s forwards; }
        .hero-btns  { opacity:0; animation:fadeUp    .8s ease .6s forwards; }
        .hero-flags { opacity:0; animation:fadeUp    .8s ease .8s forwards; }

        .primary-btn {
          background:linear-gradient(135deg,#e8c547,#f0d060);
          color:#111; border:none; border-radius:12px;
          padding:16px 36px; font-size:16px; font-weight:800;
          cursor:pointer; letter-spacing:.5px;
          animation:pulse 2.5s ease-in-out 1.5s infinite;
          transition:transform .2s, box-shadow .2s;
          font-family:'Inter',sans-serif;
        }
        .primary-btn:hover { transform:scale(1.05); }

        .ghost-btn {
          background:transparent; color:#fff;
          border:2px solid rgba(255,255,255,0.3); border-radius:12px;
          padding:16px 32px; font-size:15px; font-weight:600; cursor:pointer;
          transition:border-color .2s, color .2s, transform .2s;
          font-family:'Inter',sans-serif;
        }
        .ghost-btn:hover { border-color:#e8c547; color:#e8c547; transform:scale(1.03); }

        .country-pill {
          display:flex; align-items:center; gap:10px;
          padding:12px 22px; border-radius:50px;
          border:1.5px solid rgba(255,255,255,0.1);
          background:rgba(255,255,255,0.04);
          cursor:pointer; transition:border-color .2s, background .2s, transform .2s;
          animation:flagFloat 3s ease-in-out infinite;
          font-family:'Inter',sans-serif;
        }
        .country-pill:hover { border-color:rgba(232,197,71,0.5); background:rgba(232,197,71,0.06); transform:translateY(-4px) !important; }

        .nav-link-btn {
          background:none; border:none; border-bottom:2px solid transparent;
          cursor:pointer; font-size:14px; font-weight:500; padding:8px 14px;
          transition:color .2s, border-color .2s; letter-spacing:.3px;
          font-family:'Inter',sans-serif;
        }

        .input-field {
          width:100%; padding:14px 18px; border-radius:10px;
          border:1.5px solid rgba(255,255,255,0.1);
          background:#1a1a1a; color:#fff; font-size:15px;
          outline:none; transition:border-color .2s;
          font-family:'Inter',sans-serif; display:block;
        }
        .input-field:focus { border-color:#e8c547; }
        .input-field::placeholder { color:rgba(255,255,255,0.3); }

        .search-bar {
          width:100%; padding:13px 20px 13px 48px; border-radius:12px;
          border:1.5px solid rgba(255,255,255,0.1);
          background:#161616; color:#fff; font-size:15px;
          outline:none; transition:border-color .2s, background .2s;
          font-family:'Inter',sans-serif;
        }
        .search-bar:focus { border-color:#e8c547; background:#1c1c1c; }
        .search-bar::placeholder { color:rgba(255,255,255,0.28); }

        .why-card { transition:border-color .25s, transform .25s; }
        .why-card:hover { border-color:rgba(232,197,71,0.4) !important; transform:translateY(-6px); }
        .review-card { transition:border-color .25s; }
        .review-card:hover { border-color:rgba(232,197,71,0.3) !important; }

        .section-eyebrow {
          font-size:11px; font-weight:700; letter-spacing:3px;
          text-transform:uppercase; margin-bottom:10px; display:block;
        }
        .section-heading {
          font-family:'Barlow Condensed',sans-serif;
          font-size:clamp(32px,5vw,56px); font-weight:900; font-style:italic;
          color:#fff; margin:0 0 10px; letter-spacing:-1px; line-height:1;
        }
        .section-sub { font-size:15px; color:rgba(255,255,255,0.38); }
      `}</style>

      <div style={{minHeight:"100vh",background:"#0a0a0a",color:"#f5f5f5",fontFamily:"'Inter','Segoe UI',sans-serif",overflowX:"hidden"}}>

        {/* ══ TOP OFFER BAR ═══════════════════════════════════ */}
        <div style={{
          background:"linear-gradient(90deg,#e84747,#c0392b,#e84747)",
          padding:"10px 24px", textAlign:"center",
          animation:"offerSlide .5s ease forwards",
          position:"relative", zIndex:300, overflow:"hidden",
        }}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:12,fontSize:13,fontWeight:700,color:"#fff",letterSpacing:.4,flexWrap:"wrap"}}>
            <span>🔥</span>
            <span>FREE DELIVERY on orders above ₹1,499</span>
            <span style={{opacity:.5}}>·</span>
            <span>Use code <strong style={{background:"rgba(255,255,255,0.2)",padding:"2px 8px",borderRadius:4}}>JFREE</strong> for 10% off your first order</span>
            <span style={{opacity:.5}}>·</span>
            <span>🚚 48hr Express Shipping Available</span>
          </div>
        </div>

        {/* ══ HEADER ══════════════════════════════════════════ */}
        <header style={{
          position:"sticky", top:0, zIndex:200,
          background:"rgba(10,10,10,0.97)", backdropFilter:"blur(20px)",
          borderBottom:"1px solid rgba(255,255,255,0.06)",
        }}>
          {/* Top: Logo + Search + Cart + Login */}
          <div style={{maxWidth:1200,margin:"0 auto",padding:"0 24px",height:64,display:"flex",alignItems:"center",gap:20}}>
            <div style={{display:"flex",alignItems:"baseline",flexShrink:0}}>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:26,fontWeight:900,color:"#e84747",letterSpacing:2,textTransform:"uppercase"}}>JERSEY</span>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:26,fontWeight:400,color:"rgba(255,255,255,0.7)",letterSpacing:4}}>&nbsp;FACTORY</span>
            </div>

            <div style={{flex:1,maxWidth:480,position:"relative"}}>
              <span style={{position:"absolute",left:16,top:"50%",transform:"translateY(-50%)",fontSize:16,pointerEvents:"none",color:"rgba(255,255,255,0.3)"}}>🔍</span>
              <input
                className="search-bar"
                type="text"
                placeholder="Search jerseys, teams, nations…"
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); if (e.target.value.trim()) scrollTo("shop","Shop"); }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} aria-label="Clear" style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"rgba(255,255,255,0.35)",cursor:"pointer",fontSize:20,lineHeight:1}}>×</button>
              )}
            </div>

            <div style={{display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
              <button style={{background:"none",border:"none",cursor:"pointer",position:"relative",padding:"4px 8px"}} onClick={() => scrollTo("cart","Cart")}>
                <span style={{fontSize:22}}>🛒</span>
                {cartCount > 0 && (
                  <span style={{position:"absolute",top:0,right:0,background:"#e84747",color:"#fff",borderRadius:"50%",width:18,height:18,fontSize:11,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center"}}>{cartCount}</span>
                )}
              </button>
              {loggedIn ? (
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:12,color:"rgba(255,255,255,0.45)",maxWidth:130,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>👤 {userEmail}</span>
                  <button onClick={handleLogout} style={{background:"transparent",color:"rgba(255,255,255,0.5)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:8,padding:"7px 14px",fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>Logout</button>
                </div>
              ) : (
                <button onClick={() => setShowLogin(true)} style={{background:"#e8c547",color:"#111",border:"none",borderRadius:8,padding:"9px 22px",fontWeight:800,fontSize:13,cursor:"pointer",letterSpacing:.3,fontFamily:"'Inter',sans-serif"}}>Login</button>
              )}
            </div>
          </div>

          {/* Bottom: Nav links */}
          <div style={{borderTop:"1px solid rgba(255,255,255,0.05)"}}>
            <div style={{maxWidth:1200,margin:"0 auto",padding:"0 24px",display:"flex",alignItems:"center",gap:4,height:44}}>
              {NAV_LINKS.map(l => (
                <button key={l.name} className="nav-link-btn"
                  style={{color:activeNav===l.name?"#e8c547":"rgba(255,255,255,0.6)",borderBottomColor:activeNav===l.name?"#e8c547":"transparent"}}
                  onClick={() => scrollTo(l.id, l.name)}
                >{l.name}</button>
              ))}
              <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:16}}>
                <span style={{fontSize:12,color:"rgba(255,255,255,0.3)"}}>📞 9363964260</span>
                <a href="https://wa.me/919363964260" target="_blank" rel="noopener noreferrer"
                  style={{background:"#25D366",color:"#fff",borderRadius:8,padding:"6px 14px",fontSize:12,fontWeight:700,textDecoration:"none",display:"flex",alignItems:"center",gap:6}}>
                  💬 WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* ══ BIG HERO BANNER ═════════════════════════════════ */}
        <section id="home" ref={heroRef} style={{
          position:"relative", minHeight:"100vh",
          display:"flex", alignItems:"center",
          background:"linear-gradient(135deg,#0a0a0a 0%,#160d00 40%,#0a0a14 100%)",
          overflow:"hidden",
        }}>
          <div style={{position:"absolute",width:700,height:700,borderRadius:"50%",top:"50%",left:"55%",transform:"translate(-50%,-50%)",background:"radial-gradient(circle,rgba(232,197,71,0.09) 0%,transparent 65%)",pointerEvents:"none"}}/>
          <div style={{position:"absolute",inset:0,opacity:.025,backgroundImage:"repeating-linear-gradient(60deg,#e8c547 0px,#e8c547 1px,transparent 1px,transparent 40px)",pointerEvents:"none"}}/>

          <div style={{maxWidth:1200,margin:"0 auto",padding:"0 32px",width:"100%",display:"grid",gridTemplateColumns:"1fr 1fr",gap:48,alignItems:"center",minHeight:"90vh"}}>
            <div>
              <p className="hero-text" style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:700,letterSpacing:4,textTransform:"uppercase",color:"#e8c547",marginBottom:18}}>
                ⚽ International Collection 2025
              </p>
              <h1 className="hero-text" style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"clamp(52px,7vw,90px)",fontWeight:900,fontStyle:"italic",lineHeight:.95,color:"#fff",margin:"0 0 12px",letterSpacing:-1,animationDelay:".1s"}}>
                Elite Jerseys<br/>
                <span style={{background:"linear-gradient(90deg,#e8c547,#f5d96b,#e8c547)",backgroundSize:"200% auto",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"shimmer 3s linear infinite"}}>For Elite Fans.</span>
              </h1>
              <p className="hero-sub" style={{fontSize:17,color:"rgba(255,255,255,0.5)",lineHeight:1.75,maxWidth:460,margin:"0 0 36px"}}>
                Premium international football jerseys with custom name printing, superior comfort, and nationwide delivery.
              </p>
              <div className="hero-btns" style={{display:"flex",gap:16,flexWrap:"wrap",marginBottom:48}}>
                <button className="primary-btn" onClick={() => scrollTo("shop","Shop")}>Shop Now →</button>
                <button className="ghost-btn" onClick={() => scrollTo("custom","Custom")}>Custom Jersey</button>
              </div>
              <div className="hero-flags" style={{display:"flex",gap:40}}>
                {[["6+","Nations"],["48hr","Delivery"],["10k+","Fans Served"]].map(([n,l]) => (
                  <div key={l}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:34,fontWeight:700,color:"#e8c547",lineHeight:1}}>{n}</div>
                    <div style={{fontSize:12,color:"rgba(255,255,255,0.35)",fontWeight:500,marginTop:3}}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══ FEATURES STRIP ══════════════════════════════════ */}
        <section style={{
          background:"linear-gradient(90deg,#0e0e0e,#111,#0e0e0e)",
          borderTop:"1px solid rgba(232,197,71,0.12)",
          borderBottom:"1px solid rgba(232,197,71,0.12)",
          padding:"44px 24px",
        }}>
          <div style={{maxWidth:1200,margin:"0 auto"}}>
            <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:700,letterSpacing:4,textTransform:"uppercase",color:"rgba(255,255,255,0.3)",textAlign:"center",marginBottom:28}}>Featured Nations</p>
            <div style={{display:"flex",justifyContent:"center",flexWrap:"wrap",gap:14}}>
              {FEATURED_COUNTRIES.map((c,i) => (
                <button key={c.name} className="country-pill" style={{animationDelay:`${i * 0.4}s`}} onClick={() => scrollTo("shop","Shop")}>
                  <span style={{fontSize:26,lineHeight:1}}>{c.flag}</span>
                  <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:700,color:"#fff",letterSpacing:1,textTransform:"uppercase"}}>{c.name}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ══ BEST SELLERS ════════════════════════════════════ */}
        <section style={{maxWidth:1200,margin:"0 auto",padding:"90px 24px"}}>
          <div style={{marginBottom:36,display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:16}}>
            <div>
              <span className="section-eyebrow" style={{color:"#e8c547"}}>🏆 Top Picks</span>
              <h2 className="section-heading">Best Sellers</h2>
              <p className="section-sub">Our most-loved kits — ordered again and again</p>
            </div>
            <button onClick={() => scrollTo("shop","Shop")} style={{background:"transparent",border:"1.5px solid rgba(232,197,71,0.4)",color:"#e8c547",borderRadius:10,padding:"10px 24px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Inter',sans-serif",letterSpacing:.3}}>View All →</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:24}}>
            {BEST_SELLERS.map(j => <JerseyCard key={j.id} jersey={j} onAdd={handleAddToCart}/>)}
          </div>
        </section>

        {/* ══ TRENDING JERSEYS ════════════════════════════════ */}
        <section style={{background:"linear-gradient(160deg,#0d0d0d,#0a0a0a)",borderTop:"1px solid rgba(255,255,255,0.05)",padding:"90px 24px"}}>
          <div style={{maxWidth:1200,margin:"0 auto"}}>
            <div style={{marginBottom:36,display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:16}}>
              <div>
                <span className="section-eyebrow" style={{color:"#ff5757"}}>🔥 Hot Right Now</span>
                <h2 className="section-heading">Trending Jerseys</h2>
                <p className="section-sub">Flying off the shelves — grab yours before they're gone</p>
              </div>
              <button onClick={() => scrollTo("shop","Shop")} style={{background:"transparent",border:"1.5px solid rgba(255,87,87,0.4)",color:"#ff5757",borderRadius:10,padding:"10px 24px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Inter',sans-serif",letterSpacing:.3}}>View All →</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:24}}>
              {TRENDING.map(j => <JerseyCard key={j.id} jersey={j} onAdd={handleAddToCart}/>)}
            </div>
          </div>
        </section>
{/* ══ FULL SHOP ═══════════════════════════════════════ */}
        <section id="shop" style={{maxWidth:1200,margin:"0 auto",padding:"90px 24px"}}>
          <div style={{marginBottom:36}}>
            <span className="section-eyebrow" style={{color:"#47e87d"}}>International Jerseys</span>
            <h2 className="section-heading">All Jerseys</h2>
            <p className="section-sub">Official national team kits — wear your colours with pride</p>
          </div>
          <div style={{position:"relative",marginBottom:40,maxWidth:480}}>
            <span style={{position:"absolute",left:16,top:"50%",transform:"translateY(-50%)",fontSize:18,pointerEvents:"none",color:"rgba(255,255,255,0.3)"}}>🔍</span>
            <input className="search-bar" type="text" placeholder="Search by team or jersey name…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}/>
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} aria-label="Clear" style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"rgba(255,255,255,0.35)",cursor:"pointer",fontSize:20,lineHeight:1}}>×</button>
            )}
          </div>
          {filteredJerseys.length > 0 ? (
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:24}}>
              {filteredJerseys.map(j => <JerseyCard key={j.id} jersey={j} onAdd={handleAddToCart}/>)}
            </div>
          ) : (
            <div style={{textAlign:"center",padding:"60px 24px",background:"#111",borderRadius:18,border:"1.5px solid rgba(255,255,255,0.07)"}}>
              <div style={{fontSize:44,marginBottom:14}}>🔍</div>
              <p style={{color:"rgba(255,255,255,0.4)",fontSize:17,marginBottom:8}}>No jerseys found for "<span style={{color:"#e8c547"}}>{searchQuery}</span>"</p>
              <p style={{color:"rgba(255,255,255,0.25)",fontSize:14}}>Try searching by country or team name</p>
            </div>
          )}
        </section>
      {/* ══ CART ════════════════════════════════════════════ */}
        <section id="cart" style={{background:"linear-gradient(160deg,#0a0a0a,#0e0900)",borderTop:"1px solid rgba(232,197,71,0.08)",padding:"90px 24px"}}>
          <div style={{maxWidth:1200,margin:"0 auto"}}>
            <span className="section-eyebrow" style={{color:"#e8c547"}}>Your Selection</span>
            <h2 className="section-heading" style={{marginBottom:40}}>
              Shopping Cart{cartCount > 0 && <span style={{fontSize:26,color:"#e8c547"}}> ({cartCount})</span>}
            </h2>
            {cartItems.length === 0 ? (
              <div style={{textAlign:"center",padding:"60px 24px",background:"#111",borderRadius:18,border:"1.5px solid rgba(255,255,255,0.07)"}}>
                <div style={{fontSize:48,marginBottom:16}}>🛒</div>
                <p style={{color:"rgba(255,255,255,0.4)",fontSize:18,marginBottom:20}}>Your cart is empty.</p>
                <button className="primary-btn" style={{animation:"none"}} onClick={() => scrollTo("shop","Shop")}>Browse Jerseys</button>
              </div>
            ) : (
              <>
                <div style={{display:"flex",flexDirection:"column",gap:14}}>
                  {cartItems.map((item,idx) => (
                    <div key={idx} style={{display:"flex",alignItems:"center",gap:20,background:"#111",padding:"18px 22px",borderRadius:16,border:"1.5px solid rgba(255,255,255,0.07)"}}>
                      <img src={item.img} alt={item.name} style={{width:80,height:80,objectFit:"contain",borderRadius:10,background:"#f5f5f5",padding:6}}/>
                      <div style={{flex:1}}>
                        <p style={{fontSize:11,color:"rgba(255,255,255,0.3)",letterSpacing:2,textTransform:"uppercase",marginBottom:4}}>{item.team}</p>
                        <h3 style={{color:"#fff",fontWeight:800,fontSize:16,marginBottom:4}}>{item.name}</h3>
                        <p style={{color:"#e8c547",fontWeight:900,fontSize:18}}>₹{item.price.toLocaleString()}</p>
                      </div>
                      <button onClick={() => handleRemoveItem(idx)} style={{background:"rgba(255,87,87,0.12)",color:"#ff5757",border:"1px solid rgba(255,87,87,0.3)",borderRadius:8,padding:"8px 16px",cursor:"pointer",fontWeight:700,fontSize:13}}>Remove</button>
                    </div>
                  ))}
                </div>
                <div style={{marginTop:28,background:"#111",border:"1.5px solid rgba(232,197,71,0.25)",borderRadius:18,padding:"28px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:20}}>
                  <div>
                    <p style={{color:"rgba(255,255,255,0.4)",fontSize:13,marginBottom:4}}>{cartItems.length} item{cartItems.length>1?"s":""}</p>
                    <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:34,fontWeight:900,color:"#e8c547"}}>Total: ₹{cartTotal.toLocaleString()}</p>
                  </div>
                  <a href={`https://wa.me/919363964260?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
                    style={{background:"#25D366",color:"#fff",border:"none",padding:"16px 32px",borderRadius:12,cursor:"pointer",fontWeight:800,fontSize:15,textDecoration:"none",display:"inline-flex",alignItems:"center",gap:10}}>
                    💬 Checkout on WhatsApp
                  </a>
                </div>
              </>
            )}
          </div>
        </section>
        {/* ══ CUSTOM JERSEY CTA ═══════════════════════════════ */}
        <section id="custom" style={{borderTop:"1px solid rgba(232,197,71,0.08)",padding:"90px 24px",background:"#0a0a0a"}}>
          <div style={{maxWidth:1200,margin:"0 auto"}}>
            <div style={{textAlign:"center",marginBottom:56}}>
              <span className="section-eyebrow" style={{color:"#e8c547"}}>✏️ Personalise Your Kit</span>
              <h2 className="section-heading">Create Your Custom Jersey</h2>
              <p className="section-sub" style={{maxWidth:500,margin:"10px auto 0"}}>Your name. Your number. Any jersey. Ready in 3–5 days.</p>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:56,alignItems:"center"}}>
              <div style={{display:"flex",justifyContent:"center",alignItems:"flex-end",gap:0,height:440,position:"relative"}}>
                <img src={messi} alt="Messi" style={{height:380,width:220,objectFit:"cover",objectPosition:"top",borderRadius:"12px 0 0 12px",filter:"brightness(0.85)",border:"10px solid rgba(0,0,0,0.36)"}}/>
                <img src={ronaldo} alt="Ronaldo" style={{height:420,width:180,objectFit:"cover",objectPosition:"top",borderRadius:12,zIndex:2,position:"relative",boxShadow:"0 0 60px rgba(5,5,5,0.2)",margin:"0 -1px"}}/>
                <img src={neymar} alt="Neymar" style={{height:380,width:220,objectFit:"cover",objectPosition:"top",borderRadius:"0 12px 12px 0",filter:"brightness(0.85)",border:"20px solid rgba(0,0,0,0.15)"}}/>
              </div>
              <div style={{background:"#111",border:"1.5px solid rgba(255,255,255,0.08)",borderRadius:20,padding:"44px 36px"}}>
                <h3 style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:28,fontWeight:900,color:"#fff",marginBottom:28,letterSpacing:.5}}>Your Details</h3>
                <div style={{marginBottom:16}}>
                  <label style={{fontSize:12,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:"rgba(255,255,255,0.35)",display:"block",marginBottom:8}}>Your Name</label>
                  <input className="input-field" type="text" placeholder="e.g. Rahul" value={customName} onChange={e => setCustomName(e.target.value)}/>
                </div>
                <div style={{marginBottom:28}}>
                  <label style={{fontSize:12,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:"rgba(255,255,255,0.35)",display:"block",marginBottom:8}}>Jersey Number</label>
                  <input className="input-field" type="number" placeholder="e.g. 7" value={customNumber} onChange={e => setCustomNumber(e.target.value)} min="1" max="99"/>
                </div>
                <button onClick={handleSubmitCustom} disabled={!customName.trim() || !customNumber.trim()} style={{width:"100%",border:"none",borderRadius:12,padding:"16px",fontSize:15,fontWeight:800,letterSpacing:.4,background:orderSubmitted?"#3be37a":"linear-gradient(135deg,#e8c547,#f0d060)",color:"#111",transition:"background .3s, opacity .2s",fontFamily:"'Inter',sans-serif",cursor:(!customName.trim()||!customNumber.trim())?"not-allowed":"pointer",opacity:(!customName.trim()||!customNumber.trim())?0.5:1}}>
                  {orderSubmitted ? "✓ Opening WhatsApp…" : "💬 Submit via WhatsApp"}
                </button>
                <p style={{fontSize:13,color:"rgba(255,255,255,0.3)",marginTop:16,textAlign:"center"}}>Opens WhatsApp to confirm your custom order</p>
              </div>
            </div>
          </div>
        </section>

        {/* ══ CUSTOMER REVIEWS ════════════════════════════════ */}
        <section style={{padding:"90px 24px",background:"linear-gradient(160deg,#0d0d0d,#0a0a0a)",borderTop:"1px solid rgba(255,255,255,0.05)"}}>
          <div style={{maxWidth:1200,margin:"0 auto"}}>
            <div style={{textAlign:"center",marginBottom:48}}>
              <span className="section-eyebrow" style={{color:"#e8c547"}}>⭐ Real Customers</span>
              <h2 className="section-heading">What Fans Are Saying</h2>
              <p className="section-sub" style={{maxWidth:480,margin:"10px auto 0"}}>Over 10,000 happy fans across India</p>
            </div>

            {/* Overall rating */}
            <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:32,marginBottom:48,padding:"24px 32px",background:"#111",borderRadius:16,border:"1.5px solid rgba(232,197,71,0.2)",maxWidth:480,margin:"0 auto 48px"}}>
              <div style={{textAlign:"center"}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:64,fontWeight:900,color:"#e8c547",lineHeight:1}}>4.9</div>
                <Stars count={5}/>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.35)",marginTop:6}}>Based on 10,000+ orders</div>
              </div>
              <div style={{flex:1,display:"flex",flexDirection:"column",gap:8}}>
                {[[5,"92%"],[4,"6%"],[3,"2%"]].map(([star,pct]) => (
                  <div key={star} style={{display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontSize:12,color:"rgba(255,255,255,0.4)",width:10}}>{star}</span>
                    <div style={{flex:1,height:6,borderRadius:4,background:"rgba(255,255,255,0.08)"}}>
                      <div style={{height:"100%",borderRadius:4,background:"#e8c547",width:pct}}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:20}}>
              {REVIEWS.map((r,i) => (
                <div key={i} className="review-card" style={{background:"#111",border:"1.5px solid rgba(255,255,255,0.07)",borderRadius:18,padding:"28px 24px",animation:`reviewFade .5s ease ${i*0.08}s both`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                    <div style={{display:"flex",alignItems:"center",gap:12}}>
                      <span style={{fontSize:32}}>{r.avatar}</span>
                      <div>
                        <div style={{fontWeight:800,fontSize:15,color:"#fff"}}>{r.name}</div>
                        <div style={{fontSize:12,color:"rgba(255,255,255,0.3)",marginTop:2}}>📍 {r.location}</div>
                      </div>
                    </div>
                    <Stars count={r.rating}/>
                  </div>
                  <p style={{color:"rgba(255,255,255,0.6)",lineHeight:1.7,fontSize:14}}>"{r.text}"</p>
                  <div style={{marginTop:16,borderTop:"1px solid rgba(255,255,255,0.06)",paddingTop:12}}>
                    <span style={{fontSize:11,color:"rgba(255,255,255,0.2)",fontWeight:600,letterSpacing:1,textTransform:"uppercase"}}>Verified Purchase ✓</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* ══ CONTACT ═════════════════════════════════════════ */}
        <section id="contact" style={{maxWidth:1200,margin:"0 auto",padding:"90px 24px",textAlign:"center"}}>
          <span className="section-eyebrow" style={{color:"#e8c547"}}>Reach Out</span>
          <h2 className="section-heading" style={{marginBottom:48}}>Contact Us</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:20,maxWidth:900,margin:"0 auto"}}>
            {[
              {icon:"📞",label:"Phone",value:"9363964260"},
              {icon:"📧",label:"Email",value:"abusahel40@gmail.com"},
              {icon:"📍",label:"Location",value:"Devala"},
              {icon:"💬",label:"WhatsApp",value:"9363964260"},
            ].map(({icon,label,value}) => (
              <div key={label} style={{background:"#111",border:"1.5px solid rgba(255,255,255,0.07)",borderRadius:16,padding:"30px 20px"}}>
                <div style={{fontSize:30,marginBottom:12}}>{icon}</div>
                <p style={{fontSize:11,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"rgba(255,255,255,0.35)",marginBottom:8}}>{label}</p>
                <p style={{color:"#fff",fontWeight:700,fontSize:15}}>{value}</p>
              </div>
            ))}
          </div>
        </section>
               
        {/* ══ WHY CHOOSE US ═══════════════════════════════════ */}
        <section style={{padding:"90px 24px",background:"linear-gradient(160deg,#0e0900 0%,#0a0a0a 100%)",borderTop:"1px solid rgba(232,197,71,0.08)"}}>
          <div style={{maxWidth:1200,margin:"0 auto"}}>
            <div style={{textAlign:"center",marginBottom:56}}>
              <span className="section-eyebrow" style={{color:"#3be37a"}}>✅ Our Promise</span>
              <h2 className="section-heading">Why Choose Jersey Factory?</h2>
              <p className="section-sub" style={{maxWidth:500,margin:"10px auto 0"}}>Everything you need. Nothing you don't.</p>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:20}}>
              {WHY_CHOOSE.map(({icon,title,desc}) => (
                <div key={title} className="why-card" style={{background:"#111",border:"1.5px solid rgba(255,255,255,0.07)",borderRadius:18,padding:"32px 26px",cursor:"default"}}>
                  <div style={{fontSize:36,marginBottom:16}}>{icon}</div>
                  <h3 style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:700,color:"#e8c547",marginBottom:10,letterSpacing:.5}}>{title}</h3>
                  <p style={{color:"rgba(255,255,255,0.42)",lineHeight:1.7,fontSize:14}}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* ══ ABOUT ═══════════════════════════════════════════ */}
        <section id="about" style={{maxWidth:1200,margin:"0 auto",padding:"90px 24px",textAlign:"center"}}>
          <span className="section-eyebrow" style={{color:"#e8c547"}}>Who We Are</span>
          <h2 className="section-heading" style={{marginBottom:20}}>About Jersey Factory</h2>
          <p style={{fontSize:16,color:"rgba(255,255,255,0.5)",lineHeight:1.85,maxWidth:780,margin:"0 auto 56px"}}>
            Jersey Factory is your trusted destination for premium football jerseys. We provide high-quality national team kits from Portugal, France, Netherlands, England, Argentina, Brazil and more — delivering authentic designs, superior comfort, and affordable prices for football fans across India.
          </p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:22}}>
            {[
              {icon:"🏅",title:"Premium Quality",desc:"High-quality materials built for comfort, durability, and all-day wear."},
              {icon:"✏️",title:"Custom Printing",desc:"Your name, your number — printed on any jersey in 3–5 days."},
              {icon:"🚚",title:"Fast Delivery",desc:"Secure packaging and quick delivery across every corner of India."},
            ].map(({icon,title,desc}) => (
              <div key={title} style={{background:"#111",border:"1.5px solid rgba(255,255,255,0.07)",borderRadius:18,padding:"34px 26px"}}>
                <div style={{fontSize:36,marginBottom:14}}>{icon}</div>
                <h3 style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:700,color:"#e8c547",marginBottom:10,letterSpacing:.5}}>{title}</h3>
                <p style={{color:"rgba(255,255,255,0.42)",lineHeight:1.7,fontSize:14}}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══ FOOTER ══════════════════════════════════════════ */}
        <footer style={{borderTop:"1px solid rgba(255,255,255,0.07)",background:"#080808",padding:"40px 24px",textAlign:"center"}}>
          <div style={{maxWidth:1200,margin:"0 auto"}}>
            <div style={{display:"flex",alignItems:"baseline",justifyContent:"center",marginBottom:16}}>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:900,color:"#e84747",letterSpacing:2,textTransform:"uppercase"}}>JERSEY</span>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:400,color:"rgba(255,255,255,0.5)",letterSpacing:4}}>&nbsp;FACTORY</span>
            </div>
            <p style={{color:"rgba(255,255,255,0.25)",fontSize:13,marginBottom:8}}>Premium football jerseys for fans across India</p>
            <p style={{color:"rgba(255,255,255,0.15)",fontSize:12}}>© {new Date().getFullYear()} Jersey Factory · Devala · abusahel40@gmail.com</p>
          </div>
        </footer>

      </div>

      {showLogin && (
        <LoginModal onClose={() => setShowLogin(false)} onLogin={(email) => { setLoggedIn(true); setUserEmail(email); }}/>
      )}
    </>
  );
}
