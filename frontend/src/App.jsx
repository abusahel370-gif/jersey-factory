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

/* ─── PALETTE & TOKENS ─────────────────────────────────────── */
const C = {
  bg:       "#0a0f1e",
  bgCard:   "#111827",
  bgDeep:   "#060b16",
  border:   "#1e2d45",
  accent:   "#f5a623",
  accentDim:"#c47f10",
  red:      "#e63946",
  green:    "#25D366",
  textPri:  "#f0f4ff",
  textSec:  "#8899bb",
  textMid:  "#c4d0e8",
};

/* ─── DATA ─────────────────────────────────────────────────── */
const NAV_LINKS = [
  { name: "New",    id: "shop"    },
  { name: "Sports", id: "shop"    },
  { name: "Men",    id: "shop"    },
  { name: "Women",  id: "shop"    },
  { name: "Kids",   id: "shop"    },
  { name: "Custom", id: "custom"  },
  { name: "Sale",   id: "shop"    },
];

const JERSEYS = [
  { id:1, name:"Portugal Home Kit",         team:"Portugal · Puma",    price:1099, badge:"bestseller", img:portugalImg,    flag:"🇵🇹" },
  { id:2, name:"France Home Jersey",        team:"France · Nike",      price:999,  badge:"new",        img:franceImg,      flag:"🇫🇷" },
  { id:3, name:"Netherlands Home Kit",      team:"Netherlands · Nike", price:999,  badge:"new",        img:netherlandsImg, flag:"🇳🇱" },
  { id:4, name:"England Away Jersey",       team:"England · Nike",     price:899,  badge:"limited",    img:englandImg,     flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { id:5, name:"Argentina Special Edition", team:"Argentina · Adidas", price:999,  badge:"new",        img:argentinaImg,   flag:"🇦🇷" },
  { id:6, name:"Brazil Home Jersey",        team:"Brazil · Nike",      price:999,  badge:null,         img:brazilImg,      flag:"🇧🇷" },
];

const BADGE_STYLES = {
  bestseller: { bg:"#7c3aed", text:"#fff", label:"BESTSELLER" },
  new:        { bg:C.accent,  text:"#111", label:"NEW" },
  limited:    { bg:C.red,     text:"#fff", label:"LIMITED" },
};

const REVIEWS = [
  { name:"Arjun Mehta",    location:"Mumbai",    rating:5, text:"Got the Portugal kit for my son — quality is absolutely top notch. Custom printing was perfect. Delivered in 3 days!", avatar:"🧑‍💼" },
  { name:"Priya Nair",     location:"Kochi",     rating:5, text:"Argentina jersey for World Cup was exactly what I wanted. Fabric feels premium. Will definitely order again!", avatar:"👩‍🎓" },
  { name:"Ravi Kumar",     location:"Bangalore", rating:5, text:"Ordered custom Ronaldo jersey. Name and number print is super crisp. Jersey Factory is the real deal!", avatar:"🧔" },
  { name:"Sneha Patil",    location:"Pune",      rating:4, text:"Great quality jerseys at an unbeatable price. WhatsApp ordering process is quick and hassle-free.", avatar:"👩‍💻" },
  { name:"Mohammed Sadiq", location:"Chennai",   rating:5, text:"France jersey arrived well-packed. Looks exactly like the official kit. Highly recommended!", avatar:"🧑" },
  { name:"Kavitha Rao",    location:"Hyderabad", rating:5, text:"Bought Brazil and England kits together. Both are brilliant. Fast delivery and amazing packaging.", avatar:"👩" },
];

const validateEmail    = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const validatePassword = (v) => v.length >= 6;

/* ─── STARS ────────────────────────────────────────────────── */
function Stars({ count }) {
  return (
    <div style={{display:"flex",gap:2}}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{fontSize:12,color: i <= count ? C.accent : C.border}}>★</span>
      ))}
    </div>
  );
}

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
        background: C.bgCard,
        border: `1.5px solid ${hovered ? C.accent : C.border}`,
        borderRadius: 0,
        overflow: "hidden",
        position: "relative",
        transition: "transform .22s ease, border-color .22s ease, box-shadow .22s ease",
        transform: hovered ? "translateY(-5px)" : "translateY(0)",
        boxShadow: hovered ? `0 16px 40px rgba(245,166,35,0.12)` : "none",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {jersey.badge && (
        <span style={{
          position:"absolute", top:10, left:10, zIndex:2,
          borderRadius:2, padding:"3px 8px",
          fontSize:9, fontWeight:800, letterSpacing:1.5, textTransform:"uppercase",
          fontFamily:"'DM Sans',sans-serif",
          background: BADGE_STYLES[jersey.badge].bg,
          color:       BADGE_STYLES[jersey.badge].text,
        }}>{BADGE_STYLES[jersey.badge].label}</span>
      )}

      {/* Image area */}
      <div style={{
        background:"#0d1526",
        display:"flex", justifyContent:"center", alignItems:"center",
        padding:"32px 20px", minHeight:220, overflow:"hidden", position:"relative",
      }}>
        {/* diagonal stripe signature */}
        <div style={{
          position:"absolute",inset:0,
          backgroundImage:`repeating-linear-gradient(135deg,rgba(245,166,35,0.03) 0px,rgba(245,166,35,0.03) 1px,transparent 1px,transparent 18px)`,
          pointerEvents:"none",
        }}/>
        <img
          src={jersey.img || jersey.image}
          alt={jersey.name}
          style={{
            width:"100%", maxWidth:200, height:200, objectFit:"contain",
            display:"block",
            transition:"transform .3s ease",
            transform: hovered ? "scale(1.08)" : "scale(1)",
            position:"relative", zIndex:1,
            filter: hovered ? "drop-shadow(0 8px 24px rgba(245,166,35,0.3))" : "none",
          }}
        />
      </div>

      {/* Info */}
      <div style={{padding:"16px 16px 20px",borderTop:`1px solid ${C.border}`,flex:1,display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
        <div>
          <p style={{
            fontSize:10, fontWeight:700, letterSpacing:1.8,
            textTransform:"uppercase", color:C.textSec,
            margin:"0 0 4px", display:"flex", alignItems:"center", gap:5,
            fontFamily:"'DM Sans',sans-serif",
          }}>
            <span style={{fontSize:13}}>{jersey.flag}</span>{jersey.team}
          </p>
          <h3 style={{
            fontFamily:"'Bebas Neue',sans-serif",
            fontSize:20, fontWeight:400, color:C.textPri,
            margin:"0 0 14px", lineHeight:1.15, letterSpacing:.5,
          }}>{jersey.name}</h3>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"baseline",gap:2}}>
            <span style={{fontFamily:"'Space Mono',monospace",fontSize:11,color:C.textSec,marginRight:1}}>₹</span>
            <span style={{fontFamily:"'Space Mono',monospace",fontSize:22,fontWeight:700,color:C.accent}}>{jersey.price.toLocaleString()}</span>
          </div>
          <button onClick={handleAdd} style={{
            border:`1.5px solid ${added ? C.accent : C.border}`,
            borderRadius:2, padding:"9px 16px",
            fontSize:10, fontWeight:700, cursor:"pointer",
            color: added ? "#111" : C.textSec,
            letterSpacing:1.2, textTransform:"uppercase",
            transition:"background .25s, color .25s, border-color .25s",
            background: added ? C.accent : "transparent",
            fontFamily:"'DM Sans',sans-serif",
          }}>{added ? "✓ ADDED" : "ADD TO CART"}</button>
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

  const handleLogin = async () => {
    let valid = true;
    if (!validateEmail(email)) { setEmailErr("Please enter a valid email address."); valid = false; } else setEmailErr("");
    if (!validatePassword(password)) { setPasswordErr("Password must be at least 6 characters."); valid = false; } else setPasswordErr("");
    if (!valid) return;
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (error) { setEmailErr(error.message); return; }
    onLogin(data.user.email);
    onClose();
  };

  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",display:"flex",justifyContent:"center",alignItems:"center",zIndex:9999,backdropFilter:"blur(4px)"}}>
      <div onClick={e => e.stopPropagation()} onKeyDown={e => e.key==="Enter" && handleLogin()} style={{
        width:420, background:C.bgCard, padding:"48px 40px",
        border:`1.5px solid ${C.border}`, boxShadow:"0 40px 80px rgba(0,0,0,0.6)",
      }}>
        <h2 style={{fontFamily:"'Bebas Neue',sans-serif",color:C.textPri,textAlign:"center",fontSize:36,fontWeight:400,marginBottom:6,letterSpacing:2}}>Sign In</h2>
        <p style={{color:C.textSec,textAlign:"center",fontSize:13,marginBottom:28,fontFamily:"'DM Sans',sans-serif"}}>Access your Jersey Factory account</p>

        <label style={{fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:C.textSec,display:"block",marginBottom:8,fontFamily:"'DM Sans',sans-serif"}}>Email</label>
        <input className="jf-input" type="email" placeholder="you@example.com" value={email} onChange={e=>{setEmail(e.target.value);setEmailErr("");}} style={{marginBottom:emailErr?6:16}}/>
        {emailErr && <p style={{color:C.red,fontSize:12,marginBottom:14,fontFamily:"'DM Sans',sans-serif"}}>{emailErr}</p>}

        <label style={{fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:C.textSec,display:"block",marginBottom:8,fontFamily:"'DM Sans',sans-serif"}}>Password</label>
        <input className="jf-input" type="password" placeholder="••••••••" value={password} onChange={e=>{setPassword(e.target.value);setPasswordErr("");}} style={{marginBottom:passwordErr?6:28}}/>
        {passwordErr && <p style={{color:C.red,fontSize:12,marginBottom:20,fontFamily:"'DM Sans',sans-serif"}}>{passwordErr}</p>}

        <button onClick={handleLogin} disabled={loading} style={{
          width:"100%",padding:"14px",background:loading?C.accentDim:C.accent,
          color:"#111",border:"none",fontWeight:800,fontSize:13,cursor:loading?"not-allowed":"pointer",
          marginBottom:12,letterSpacing:1.5,textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif",
        }}>
          {loading ? "Signing in…" : "LOGIN"}
        </button>
        <button onClick={onClose} style={{
          width:"100%",padding:"14px",background:"transparent",color:C.textSec,
          border:`1.5px solid ${C.border}`,cursor:"pointer",fontSize:13,fontWeight:600,
          letterSpacing:.5,textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif",
        }}>Cancel</button>
      </div>
    </div>
  );
}

/* ─── PHONE MODEL WIDGET ────────────────────────────────────── */
function PhoneModel({ scrollTo }) {
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState("");
  const [jersey, setJersey] = useState("");
  const options = JERSEYS.map(j => j.name);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const sendWhatsApp = () => {
    if (!name.trim()) return;
    const msg = encodeURIComponent(`Hi Jersey Factory! I'm ${name.trim()}. I'm interested in: ${jersey || "browsing your collection"}. Please help me!`);
    window.open(`https://wa.me/919363964260?text=${msg}`, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      {/* Fixed phone CTA button */}
      <a
        href="tel:9363964260"
        style={{
          position:"fixed", bottom:80, right:20, zIndex:999,
          background:C.bgCard, border:`1.5px solid ${C.accent}`,
          color:C.accent, width:48, height:48, borderRadius:"50%",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:20, boxShadow:`0 4px 20px rgba(245,166,35,0.3)`,
          textDecoration:"none",
          transition:"transform .2s",
        }}
        title="Call Us"
      >📞</a>

      {/* Fixed WhatsApp button */}
      <a
        href="https://wa.me/919363964260"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position:"fixed", bottom:20, right:20, zIndex:999,
          background:"#25D366", border:"none",
          color:"#fff", width:48, height:48, borderRadius:"50%",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:22, boxShadow:"0 4px 20px rgba(37,211,102,0.4)",
          textDecoration:"none",
        }}
        title="WhatsApp"
      >💬</a>

      {/* Mobile sticky bottom bar — shown on narrow screens */}
      <div style={{
        position:"fixed", bottom:0, left:0, right:0, zIndex:998,
        background:C.bgDeep, borderTop:`1px solid ${C.border}`,
        padding:"10px 16px",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        gap:8,
      }} className="mobile-bottom-bar">
        <a href="tel:9363964260" style={{
          flex:1, background:C.bgCard, border:`1.5px solid ${C.border}`,
          color:C.textPri, padding:"10px 0", borderRadius:2,
          textAlign:"center", fontFamily:"'DM Sans',sans-serif",
          fontSize:12, fontWeight:700, letterSpacing:1, textDecoration:"none",
          display:"flex", alignItems:"center", justifyContent:"center", gap:6,
        }}>📞 CALL</a>
        <a href="https://wa.me/919363964260" target="_blank" rel="noopener noreferrer" style={{
          flex:2, background:"#25D366", border:"none",
          color:"#fff", padding:"10px 0", borderRadius:2,
          textAlign:"center", fontFamily:"'DM Sans',sans-serif",
          fontSize:12, fontWeight:700, letterSpacing:1, textDecoration:"none",
          display:"flex", alignItems:"center", justifyContent:"center", gap:6,
        }}>💬 ORDER ON WHATSAPP</a>
        <button onClick={() => scrollTo("cart","Cart")} style={{
          flex:1, background:C.accent, border:"none",
          color:"#111", padding:"10px 0", borderRadius:2,
          fontFamily:"'DM Sans',sans-serif",
          fontSize:12, fontWeight:700, letterSpacing:1, cursor:"pointer",
        }}>🛒 CART</button>
      </div>
    </>
  );
}

/* ─── MAIN APP ──────────────────────────────────────────────── */
export default function App() {
  const [cartCount,      setCartCount]      = useState(0);
  const [cartItems,      setCartItems]      = useState([]);
  const [activeNav,      setActiveNav]      = useState("New");
  const [customName,     setCustomName]     = useState("");
  const [customNumber,   setCustomNumber]   = useState("");
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [showLogin,      setShowLogin]      = useState(false);
  const [loggedIn,       setLoggedIn]       = useState(false);
  const [userEmail,      setUserEmail]      = useState("");
  const [searchQuery,    setSearchQuery]    = useState("");
  const [showSearch,     setShowSearch]     = useState(false);
  const [jerseys,        setJerseys]        = useState([]);
  const [heroBanner,     setHeroBanner]     = useState(0);
  const heroRef = useRef(null);

  const HERO_BANNERS = [
    {
      tag:"END OF SEASON SALE",
      headline:"FLAT 40% OFF",
      sub:"Premium Football Jerseys",
      extra:"+ 5% OFF ON ONLINE PAYMENTS",
      accent: C.accent,
      ctaId:"shop",
    },
    {
      tag:"NEW ARRIVAL",
      headline:"PORTUGAL HOME KIT 2025",
      sub:"Official Puma Kit — Limited Stock",
      extra:"FREE DELIVERY above ₹1,499",
      accent:"#e63946",
      ctaId:"shop",
    },
    {
      tag:"TRENDING NOW",
      headline:"ARGENTINA SPECIAL EDITION",
      sub:"Wear the World Cup Winners' Jersey",
      extra:"3–5 Day Custom Printing Available",
      accent:"#74acdf",
      ctaId:"shop",
    },
  ];

  useEffect(() => {
    const saved = localStorage.getItem("jf_logged_in");
    const savedEmail = localStorage.getItem("jf_email");
    if (saved === "true" && savedEmail) { setLoggedIn(true); setUserEmail(savedEmail); }
  }, []);

  useEffect(() => {
    async function fetchJerseys() {
      const { data, error } = await supabase.from("jerseys").select("*");
      if (!error && data) {
        const formatted = data.map(item => ({ ...item, img: item.image }));
        setJerseys(formatted);
      }
    }
    fetchJerseys();
  }, []);

  useEffect(() => {
    const t = setInterval(() => setHeroBanner(i => (i + 1) % HERO_BANNERS.length), 4500);
    return () => clearInterval(t);
  }, []);

  const handleAddToCart  = (jersey) => { setCartCount(c => c + 1); setCartItems(p => [...p, jersey]); };
  const handleRemoveItem = (i) => { setCartItems(p => p.filter((_,idx) => idx !== i)); setCartCount(c => c - 1); };
  const handleLogout = async () => { await supabase.auth.signOut(); setLoggedIn(false); setUserEmail(""); };

  const handleSubmitCustom = () => {
    if (!customName.trim() || !customNumber.trim()) return;
    const msg = encodeURIComponent(`Hello Jersey Factory!\n\nI'd like a Custom Jersey:\n• Name on Jersey: ${customName.trim()}\n• Jersey Number: ${customNumber.trim()}\n\nPlease confirm availability and pricing.`);
    window.open(`https://wa.me/919363964260?text=${msg}`, "_blank", "noopener,noreferrer");
    setOrderSubmitted(true);
    setTimeout(() => setOrderSubmitted(false), 3000);
    setCustomName(""); setCustomNumber("");
  };

  const scrollTo = (id, name) => {
    setActiveNav(name);
    document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });
  };

  const filteredJerseys = searchQuery.trim()
    ? jerseys.filter(j => j.name?.toLowerCase().includes(searchQuery.toLowerCase()) || j.team?.toLowerCase().includes(searchQuery.toLowerCase()))
    : jerseys;

  const cartTotal = cartItems.reduce((s, i) => s + Number(i.price), 0);
  const waMsg = encodeURIComponent(`Hello Jersey Factory!\n\nI'd like to order:\n${cartItems.map(i => `• ${i.name} — ₹${i.price}`).join("\n")}\n\nTotal: ₹${cartTotal}`);
  const banner = HERO_BANNERS[heroBanner];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html { scroll-behavior:smooth; }
        body { background:${C.bg}; color:${C.textPri}; }

        @keyframes fadeUp   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes bannerIn { from{opacity:0;transform:scale(1.04)} to{opacity:1;transform:scale(1)} }
        @keyframes glow     { 0%,100%{opacity:.7} 50%{opacity:1} }

        .jf-nav-link {
          background:none; border:none; cursor:pointer;
          font-size:12px; font-weight:700; padding:0 2px;
          color:${C.textSec}; letter-spacing:1.5px;
          transition:color .2s; position:relative;
          font-family:'DM Sans',sans-serif;
          text-transform:uppercase;
        }
        .jf-nav-link::after {
          content:""; position:absolute; bottom:-4px; left:0; right:0;
          height:2px; background:${C.accent}; transform:scaleX(0);
          transition:transform .2s; transform-origin:left;
        }
        .jf-nav-link:hover::after, .jf-nav-link.active::after { transform:scaleX(1); }
        .jf-nav-link:hover { color:${C.accent}; }
        .jf-nav-link.active { color:${C.accent}; }

        .jf-input {
          width:100%; padding:12px 16px;
          border:1.5px solid ${C.border};
          background:${C.bg}; color:${C.textPri}; font-size:14px;
          outline:none; transition:border-color .2s;
          font-family:'DM Sans',sans-serif; display:block;
          border-radius:0;
        }
        .jf-input:focus { border-color:${C.accent}; }
        .jf-input::placeholder { color:${C.textSec}; }

        .jf-section-label {
          font-family:'DM Sans',sans-serif;
          font-size:10px; font-weight:700; letter-spacing:3.5px;
          text-transform:uppercase; color:${C.accent}; margin-bottom:8px; display:block;
        }
        .jf-section-title {
          font-family:'Bebas Neue',sans-serif;
          font-size:clamp(36px,5vw,60px); font-weight:400;
          color:${C.textPri}; margin:0 0 8px; letter-spacing:1px; line-height:1;
        }

        .jf-why-card { transition:border-color .2s, transform .2s; }
        .jf-why-card:hover { border-color:${C.accent} !important; transform:translateY(-4px); }

        .jf-review-card { transition:border-color .2s; }
        .jf-review-card:hover { border-color:${C.accent} !important; }

        .jf-cat-pill {
          border:1.5px solid ${C.border}; background:transparent;
          padding:8px 18px; border-radius:50px;
          font-size:12px; font-weight:600; color:${C.textSec};
          cursor:pointer; white-space:nowrap;
          font-family:'DM Sans',sans-serif; transition:all .2s;
          letter-spacing:.5px;
        }
        .jf-cat-pill:hover, .jf-cat-pill.active {
          border-color:${C.accent}; color:${C.accent}; background:rgba(245,166,35,0.07);
        }

        .banner-transition { animation: bannerIn .5s ease forwards; }

        /* mobile bottom bar only shows on small screens */
        .mobile-bottom-bar { display:none; }
        @media (max-width:768px) {
          .mobile-bottom-bar { display:flex; }
          .jf-desktop-nav { display:none; }
          body { padding-bottom:70px; }
        }
        @media (min-width:769px) {
          .mobile-bottom-bar { display:none !important; }
        }

        .jf-primary-btn {
          background:${C.accent}; color:#111; border:none;
          padding:14px 36px; font-size:12px; font-weight:800;
          cursor:pointer; letter-spacing:2px; text-transform:uppercase;
          transition:background .2s, transform .15s;
          font-family:'DM Sans',sans-serif;
        }
        .jf-primary-btn:hover { background:${C.accentDim}; transform:translateY(-1px); }

        .jf-outline-btn {
          background:transparent; color:${C.textPri};
          border:1.5px solid rgba(240,244,255,0.3);
          padding:12px 28px; font-size:11px; font-weight:700;
          cursor:pointer; letter-spacing:1.5px; text-transform:uppercase;
          transition:background .2s, border-color .2s;
          font-family:'DM Sans',sans-serif;
        }
        .jf-outline-btn:hover { background:rgba(255,255,255,0.07); border-color:${C.accent}; color:${C.accent}; }

        .jf-filter-btn {
          border:1.5px solid ${C.border}; background:transparent; padding:9px 16px;
          font-size:11px; font-weight:600; cursor:pointer;
          display:flex; align-items:center; gap:4px; color:${C.textSec};
          font-family:'DM Sans',sans-serif; transition:border-color .2s, color .2s;
          letter-spacing:.5px;
        }
        .jf-filter-btn:hover { border-color:${C.accent}; color:${C.accent}; }
      `}</style>

      <div style={{minHeight:"100vh",background:C.bg,color:C.textPri,fontFamily:"'DM Sans',sans-serif",overflowX:"hidden"}}>

        {/* ══ ANNOUNCEMENT BAR ════════════════════════════════ */}
        <div style={{
          background:"#0d1627",
          borderBottom:`1px solid ${C.border}`,
          padding:"9px 24px",
          textAlign:"center",
        }}>
          <div style={{maxWidth:1300,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"center",gap:8,fontSize:12,fontWeight:600,color:C.textSec,flexWrap:"wrap",fontFamily:"'DM Sans',sans-serif",letterSpacing:.5}}>
            <span style={{color:C.accent}}>⚡</span>
            <span>NEED HELP? SEND US A 'HI' ON WHATSAPP AT</span>
            <a href="https://wa.me/919363964260" target="_blank" rel="noopener noreferrer"
              style={{color:C.accent,fontWeight:800,letterSpacing:1,textDecoration:"none"}}>
              93639 64260 →
            </a>
          </div>
        </div>

        {/* ══ HEADER ══════════════════════════════════════════ */}
        <header style={{
          position:"sticky", top:0, zIndex:200,
          background:"rgba(10,15,30,0.95)",
          backdropFilter:"blur(12px)",
          borderBottom:`1px solid ${C.border}`,
        }}>
          <div style={{maxWidth:1300,margin:"0 auto",padding:"0 24px",height:62,display:"flex",alignItems:"center",gap:32}}>

            {/* Logo */}
            <div style={{flexShrink:0,display:"flex",alignItems:"baseline",gap:0}}>
              <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:26,fontWeight:400,color:C.accent,letterSpacing:3}}>JERSEY</span>
              <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:26,fontWeight:400,color:"rgba(240,244,255,0.45)",letterSpacing:4}}>&nbsp;FACTORY</span>
            </div>

            {/* Nav Links */}
            <nav className="jf-desktop-nav" style={{display:"flex",alignItems:"center",gap:28,flex:1}}>
              {NAV_LINKS.map(l => (
                <button key={l.name} className={`jf-nav-link${activeNav===l.name?" active":""}`}
                  onClick={() => scrollTo(l.id, l.name)}>
                  {l.name}
                </button>
              ))}
            </nav>

            {/* Right controls */}
            <div style={{display:"flex",alignItems:"center",gap:18,flexShrink:0,marginLeft:"auto"}}>
              <button onClick={() => setShowSearch(s => !s)} style={{
                background:"none",border:"none",cursor:"pointer",
                color:showSearch?C.accent:C.textSec,fontSize:18,
                display:"flex",alignItems:"center",gap:6,
                fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:11,letterSpacing:1.5,
                textTransform:"uppercase", transition:"color .2s",
              }}>
                🔍 <span className="jf-desktop-nav">SEARCH</span>
              </button>

              <button style={{background:"none",border:"none",cursor:"pointer",color:C.textSec,fontSize:18,transition:"color .2s"}}
                onMouseEnter={e=>e.target.style.color=C.accent} onMouseLeave={e=>e.target.style.color=C.textSec}>♡</button>

              <button onClick={() => scrollTo("cart","Cart")} style={{background:"none",border:"none",cursor:"pointer",position:"relative",color:C.textSec,fontSize:18,transition:"color .2s"}}
                onMouseEnter={e=>e.currentTarget.style.color=C.accent} onMouseLeave={e=>e.currentTarget.style.color=C.textSec}>
                🛒
                {cartCount > 0 && (
                  <span style={{position:"absolute",top:-4,right:-4,background:C.accent,color:"#111",borderRadius:"50%",width:17,height:17,fontSize:10,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Space Mono',monospace"}}>{cartCount}</span>
                )}
              </button>

              {loggedIn ? (
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:11,color:C.textSec,maxWidth:110,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>👤 {userEmail}</span>
                  <button onClick={handleLogout} style={{background:"transparent",color:C.textSec,border:`1px solid ${C.border}`,padding:"5px 10px",fontWeight:700,fontSize:10,cursor:"pointer",letterSpacing:1,textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif"}}>OUT</button>
                </div>
              ) : (
                <button onClick={() => setShowLogin(true)} style={{background:"none",border:"none",cursor:"pointer",color:C.textSec,fontSize:18,transition:"color .2s"}}
                  onMouseEnter={e=>e.target.style.color=C.accent} onMouseLeave={e=>e.target.style.color=C.textSec}>👤</button>
              )}
            </div>
          </div>

          {/* Search bar */}
          {showSearch && (
            <div style={{background:C.bgCard,borderTop:`1px solid ${C.border}`,padding:"14px 24px"}}>
              <div style={{maxWidth:600,margin:"0 auto",position:"relative"}}>
                <span style={{position:"absolute",left:0,top:"50%",transform:"translateY(-50%)",fontSize:15,color:C.textSec}}>🔍</span>
                <input
                  className="jf-input"
                  style={{paddingLeft:28,background:"transparent",borderLeft:"none",borderTop:"none",borderRight:"none",borderBottom:`2px solid ${C.accent}`}}
                  type="text"
                  placeholder="Search jerseys, teams, nations…"
                  value={searchQuery}
                  autoFocus
                  onChange={e => { setSearchQuery(e.target.value); if (e.target.value.trim()) scrollTo("shop","New"); }}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} style={{position:"absolute",right:0,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:C.textSec,cursor:"pointer",fontSize:20}}>×</button>
                )}
              </div>
            </div>
          )}
        </header>

        {/* ══ HOME ════════════════════════════════════════════ */}
        <div id="home" ref={heroRef}>

          {/* ── HERO ────────────────────────────────────────── */}
          <div
            key={heroBanner}
            className="banner-transition"
            style={{
              background: C.bgDeep,
              padding:"80px 24px 88px",
              textAlign:"center",
              position:"relative",
              overflow:"hidden",
              minHeight:360,
              display:"flex",
              flexDirection:"column",
              alignItems:"center",
              justifyContent:"center",
            }}
          >
            {/* diagonal stripe bg */}
            <div style={{
              position:"absolute",inset:0,
              backgroundImage:`repeating-linear-gradient(135deg,rgba(245,166,35,0.025) 0px,rgba(245,166,35,0.025) 2px,transparent 2px,transparent 28px)`,
              pointerEvents:"none",
            }}/>
            {/* accent glow blob */}
            <div style={{
              position:"absolute",top:"50%",left:"50%",
              transform:"translate(-50%,-50%)",
              width:500,height:300,
              background:`radial-gradient(ellipse at center, ${banner.accent}18 0%, transparent 70%)`,
              pointerEvents:"none",
            }}/>

            <p style={{
              fontFamily:"'DM Sans',sans-serif",
              fontSize:10, fontWeight:800, letterSpacing:5,
              textTransform:"uppercase", color:banner.accent,
              marginBottom:14, position:"relative",
            }}>{banner.tag}</p>

            <h1 style={{
              fontFamily:"'Bebas Neue',sans-serif",
              fontSize:"clamp(52px,7vw,96px)",
              fontWeight:400, color:C.textPri,
              lineHeight:.95, marginBottom:10, letterSpacing:2,
              position:"relative",
            }}>{banner.headline}</h1>

            <p style={{
              fontSize:15, color:C.textSec,
              marginBottom:28, fontWeight:500, letterSpacing:.3,
              fontFamily:"'DM Sans',sans-serif", position:"relative",
            }}>{banner.sub}</p>

            <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap",marginBottom:22,position:"relative"}}>
              <button className="jf-primary-btn" onClick={() => scrollTo("shop","New")}>SHOP NOW →</button>
              <button className="jf-outline-btn" onClick={() => scrollTo("custom","Custom")}>CUSTOM PRINT</button>
            </div>

            <p style={{
              fontSize:10, color:banner.accent,
              letterSpacing:2, textTransform:"uppercase", fontWeight:700,
              fontFamily:"'DM Sans',sans-serif", position:"relative",
            }}>{banner.extra}</p>

            {/* Dot indicators */}
            <div style={{display:"flex",gap:8,justifyContent:"center",marginTop:32,position:"relative"}}>
              {HERO_BANNERS.map((_,i) => (
                <button key={i} onClick={() => setHeroBanner(i)} style={{
                  width: i===heroBanner ? 28 : 8, height:8, borderRadius:4,
                  background: i===heroBanner ? C.accent : C.border,
                  border:"none", cursor:"pointer",
                  transition:"width .3s, background .3s", padding:0,
                }}/>
              ))}
            </div>
          </div>

          {/* ── CATEGORY PILLS ──────────────────────────────── */}
          <div style={{background:C.bgCard,borderBottom:`1px solid ${C.border}`,padding:"14px 24px",overflowX:"auto"}}>
            <div style={{maxWidth:1300,margin:"0 auto",display:"flex",gap:10,flexWrap:"nowrap"}}>
              {["All Jerseys","Portugal","France","Argentina","Brazil","England","Netherlands","Custom Print"].map((cat,i) => (
                <button key={cat} className={`jf-cat-pill${i===0?" active":""}`} onClick={() => scrollTo("shop","New")}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* ── JERSEY GRID ─────────────────────────────────── */}
          <section style={{padding:"56px 24px",background:C.bg}}>
            <div style={{maxWidth:1300,margin:"0 auto"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:32,flexWrap:"wrap",gap:12}}>
                <div>
                  <span className="jf-section-label">⚽ International Collection 2025</span>
                  <h2 className="jf-section-title">JERSEYS</h2>
                  <p style={{fontSize:13,color:C.textSec,fontFamily:"'DM Sans',sans-serif"}}>Official national team kits — wear your colours with pride</p>
                </div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  <button className="jf-filter-btn">Product Type ▾</button>
                  <button className="jf-filter-btn">Price ▾</button>
                  <button className="jf-filter-btn">Size ▾</button>
                  <button className="jf-filter-btn">Colour ▾</button>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:12}}>
                {filteredJerseys.map(j => (
                  <JerseyCard key={j.id} jersey={j} onAdd={handleAddToCart}/>
                ))}
              </div>
            </div>
          </section>

          {/* ── PROMO: CUSTOM ───────────────────────────────── */}
          <section style={{background:C.bgCard,borderTop:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}`,padding:"64px 24px",textAlign:"center",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",inset:0,backgroundImage:`repeating-linear-gradient(135deg,rgba(245,166,35,0.02) 0px,rgba(245,166,35,0.02) 2px,transparent 2px,transparent 28px)`,pointerEvents:"none"}}/>
            <div style={{maxWidth:700,margin:"0 auto",position:"relative"}}>
              <span className="jf-section-label">✏️ PERSONALISE YOUR KIT</span>
              <h2 className="jf-section-title" style={{fontSize:"clamp(40px,6vw,72px)"}}>CUSTOM NAME & NUMBER</h2>
              <p style={{color:C.textSec,fontSize:15,marginBottom:32,lineHeight:1.75,fontFamily:"'DM Sans',sans-serif",maxWidth:480,margin:"0 auto 32px"}}>
                Your name. Your number. Any jersey. Ready in 3–5 days — delivered across India.
              </p>
              <button className="jf-primary-btn" onClick={() => scrollTo("custom","Custom")}>
                CUSTOMISE NOW →
              </button>
            </div>
          </section>

          {/* ── WHY CHOOSE ──────────────────────────────────── */}
          <section style={{padding:"56px 24px",background:C.bg}}>
            <div style={{maxWidth:1300,margin:"0 auto"}}>
              <div style={{textAlign:"center",marginBottom:40}}>
                <span className="jf-section-label">✅ OUR PROMISE</span>
                <h2 className="jf-section-title">WHY JERSEY FACTORY?</h2>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:16}}>
                {[
                  { icon:"🏅", title:"Premium Quality", desc:"High-quality polyester — breathable, durable, match-ready." },
                  { icon:"✏️", title:"Custom Printing",  desc:"Your name & number printed sharp in 3–5 days." },
                  { icon:"🚚", title:"Fast Delivery",    desc:"Tracked shipping to every corner of India." },
                  { icon:"💬", title:"WhatsApp Order",   desc:"No checkout hassle — just message and we handle the rest." },
                  { icon:"💰", title:"Best Prices",      desc:"Authentic quality at prices that won't break the bank." },
                  { icon:"🔄", title:"Easy Returns",     desc:"Not happy? We make it right within 7 days." },
                ].map(({icon,title,desc}) => (
                  <div key={title} className="jf-why-card" style={{
                    background:C.bgCard,border:`1.5px solid ${C.border}`,
                    padding:"28px 22px",
                  }}>
                    <div style={{fontSize:30,marginBottom:14}}>{icon}</div>
                    <h3 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,fontWeight:400,color:C.textPri,marginBottom:8,letterSpacing:1}}>{title}</h3>
                    <p style={{color:C.textSec,lineHeight:1.7,fontSize:13,fontFamily:"'DM Sans',sans-serif"}}>{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── PHONE / CONTACT HIGHLIGHT ───────────────────── */}
          <section style={{background:C.bgCard,borderTop:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}`,padding:"48px 24px"}}>
            <div style={{maxWidth:1300,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:20,alignItems:"center"}}>
              <div>
                <span className="jf-section-label">📞 REACH US INSTANTLY</span>
                <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(32px,4vw,52px)",color:C.textPri,marginBottom:12,letterSpacing:1}}>CALL OR WHATSAPP US</h2>
                <p style={{color:C.textSec,fontSize:14,lineHeight:1.7,maxWidth:400,fontFamily:"'DM Sans',sans-serif",marginBottom:24}}>
                  Our team is available 7 days a week. Place orders, check availability, or get sizing help instantly.
                </p>
                <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                  <a href="tel:9363964260" style={{
                    display:"inline-flex",alignItems:"center",gap:8,
                    background:"transparent",border:`1.5px solid ${C.accent}`,
                    color:C.accent,padding:"12px 24px",
                    fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:13,
                    letterSpacing:1,textDecoration:"none",textTransform:"uppercase",
                    transition:"background .2s",
                  }}
                  onMouseEnter={e=>{e.currentTarget.style.background=`rgba(245,166,35,0.1)`}}
                  onMouseLeave={e=>{e.currentTarget.style.background="transparent"}}>
                    📞 93639 64260
                  </a>
                  <a href="https://wa.me/919363964260" target="_blank" rel="noopener noreferrer" style={{
                    display:"inline-flex",alignItems:"center",gap:8,
                    background:"#25D366",border:"none",
                    color:"#fff",padding:"12px 24px",
                    fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:13,
                    letterSpacing:1,textDecoration:"none",textTransform:"uppercase",
                  }}>
                    💬 WHATSAPP NOW
                  </a>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                {[
                  {icon:"📞",label:"Phone",value:"93639 64260"},
                  {icon:"📧",label:"Email",value:"abusahel40@gmail.com"},
                  {icon:"📍",label:"Location",value:"Devala"},
                  {icon:"⏰",label:"Hours",value:"7 Days, 9AM–9PM"},
                ].map(({icon,label,value}) => (
                  <div key={label} style={{background:C.bg,border:`1.5px solid ${C.border}`,padding:"20px 16px"}}>
                    <div style={{fontSize:22,marginBottom:8}}>{icon}</div>
                    <p style={{fontSize:9,fontWeight:700,letterSpacing:2.5,textTransform:"uppercase",color:C.accent,marginBottom:4,fontFamily:"'DM Sans',sans-serif"}}>{label}</p>
                    <p style={{color:C.textPri,fontWeight:700,fontSize:13,fontFamily:"'DM Sans',sans-serif"}}>{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── REVIEWS ─────────────────────────────────────── */}
          <section style={{padding:"56px 24px",background:C.bg}}>
            <div style={{maxWidth:1300,margin:"0 auto"}}>
              <div style={{textAlign:"center",marginBottom:40}}>
                <span className="jf-section-label">⭐ REAL CUSTOMERS</span>
                <h2 className="jf-section-title">WHAT FANS ARE SAYING</h2>
                <p style={{fontSize:13,color:C.textSec,fontFamily:"'DM Sans',sans-serif"}}>Over 10,000 happy fans across India</p>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16}}>
                {REVIEWS.map((r,i) => (
                  <div key={i} className="jf-review-card" style={{background:C.bgCard,border:`1.5px solid ${C.border}`,padding:"24px 20px"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <span style={{fontSize:26}}>{r.avatar}</span>
                        <div>
                          <div style={{fontWeight:700,fontSize:13,color:C.textPri,fontFamily:"'DM Sans',sans-serif"}}>{r.name}</div>
                          <div style={{fontSize:10,color:C.textSec,marginTop:2,letterSpacing:.5,fontFamily:"'DM Sans',sans-serif"}}>📍 {r.location}</div>
                        </div>
                      </div>
                      <Stars count={r.rating}/>
                    </div>
                    <p style={{color:C.textSec,lineHeight:1.7,fontSize:13,fontFamily:"'DM Sans',sans-serif"}}>"{r.text}"</p>
                    <div style={{marginTop:12,borderTop:`1px solid ${C.border}`,paddingTop:10}}>
                      <span style={{fontSize:9,color:C.accent,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif"}}>✓ Verified Purchase</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* ══ SHOP SECTION ════════════════════════════════════ */}
        <section id="shop" style={{maxWidth:1300,margin:"0 auto",padding:"64px 24px"}}>
          <div style={{marginBottom:32}}>
            <span className="jf-section-label">International Jerseys</span>
            <h2 className="jf-section-title">ALL JERSEYS</h2>
          </div>
          <div style={{position:"relative",marginBottom:36,maxWidth:480}}>
            <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:15,color:C.textSec}}>🔍</span>
            <input
              className="jf-input"
              style={{paddingLeft:40}}
              type="text"
              placeholder="Search by team or jersey name…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:C.textSec,cursor:"pointer",fontSize:20}}>×</button>
            )}
          </div>
          {filteredJerseys.length > 0 ? (
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:12}}>
              {filteredJerseys.map(j => (
                <JerseyCard key={j.id} jersey={j} onAdd={handleAddToCart}/>
              ))}
            </div>
          ) : (
            <div style={{textAlign:"center",padding:"60px 24px",background:C.bgCard,border:`1.5px solid ${C.border}`}}>
              <div style={{fontSize:40,marginBottom:12}}>🔍</div>
              <p style={{color:C.textSec,fontSize:16,marginBottom:6,fontFamily:"'DM Sans',sans-serif"}}>No jerseys found for "<strong style={{color:C.accent}}>{searchQuery}</strong>"</p>
              <p style={{color:C.border,fontSize:13,fontFamily:"'DM Sans',sans-serif"}}>Try searching by country or team name</p>
            </div>
          )}
        </section>

        {/* ══ CUSTOM JERSEY ═══════════════════════════════════ */}
        <section id="custom" style={{borderTop:`1px solid ${C.border}`,padding:"64px 24px",background:C.bgCard}}>
          <div style={{maxWidth:1300,margin:"0 auto"}}>
            <div style={{textAlign:"center",marginBottom:48}}>
              <span className="jf-section-label">✏️ PERSONALISE YOUR KIT</span>
              <h2 className="jf-section-title">CREATE YOUR CUSTOM JERSEY</h2>
              <p style={{fontSize:14,color:C.textSec,maxWidth:480,margin:"8px auto 0",fontFamily:"'DM Sans',sans-serif"}}>Your name. Your number. Any jersey. Ready in 3–5 days.</p>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:48,alignItems:"center"}}>
              <div style={{display:"flex",justifyContent:"center",alignItems:"flex-end",gap:0,height:400,position:"relative"}}>
                <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse at bottom, rgba(245,166,35,0.08) 0%, transparent 70%)`,pointerEvents:"none"}}/>
                <img src={messi} alt="Messi" style={{height:360,width:200,objectFit:"cover",objectPosition:"top",filter:"brightness(0.85) saturate(0.9)"}}/>
                <img src={ronaldo} alt="Ronaldo" style={{height:390,width:160,objectFit:"cover",objectPosition:"top",zIndex:2,position:"relative",margin:"0 -1px",boxShadow:`0 0 40px rgba(245,166,35,0.15)`,filter:"brightness(0.9)"}}/>
                <img src={neymar} alt="Neymar" style={{height:360,width:200,objectFit:"cover",objectPosition:"top",filter:"brightness(0.85) saturate(0.9)"}}/>
              </div>
              <div style={{background:C.bg,border:`1.5px solid ${C.border}`,padding:"40px 32px"}}>
                <h3 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,fontWeight:400,color:C.textPri,marginBottom:24,letterSpacing:1}}>YOUR DETAILS</h3>
                <div style={{marginBottom:14}}>
                  <label style={{fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:C.textSec,display:"block",marginBottom:8,fontFamily:"'DM Sans',sans-serif"}}>Your Name</label>
                  <input className="jf-input" type="text" placeholder="e.g. Rahul" value={customName} onChange={e => setCustomName(e.target.value)}/>
                </div>
                <div style={{marginBottom:24}}>
                  <label style={{fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:C.textSec,display:"block",marginBottom:8,fontFamily:"'DM Sans',sans-serif"}}>Jersey Number</label>
                  <input className="jf-input" type="number" placeholder="e.g. 7" value={customNumber} onChange={e => setCustomNumber(e.target.value)} min="1" max="99"/>
                </div>
                <button onClick={handleSubmitCustom} disabled={!customName.trim() || !customNumber.trim()} style={{
                  width:"100%",border:"none",padding:"16px",
                  fontSize:13,fontWeight:800,letterSpacing:1.5,
                  background: orderSubmitted ? "#25D366" : C.accent,
                  color: orderSubmitted ? "#fff" : "#111",
                  cursor:(!customName.trim()||!customNumber.trim())?"not-allowed":"pointer",
                  opacity:(!customName.trim()||!customNumber.trim())?0.35:1,
                  textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif",
                  transition:"background .3s, opacity .2s",
                }}>
                  {orderSubmitted ? "✓ Opening WhatsApp…" : "💬 SUBMIT VIA WHATSAPP"}
                </button>
                <p style={{fontSize:12,color:C.textSec,marginTop:12,textAlign:"center",fontFamily:"'DM Sans',sans-serif"}}>Opens WhatsApp to confirm your custom order</p>
              </div>
            </div>
          </div>
        </section>

        {/* ══ CART ════════════════════════════════════════════ */}
        <section id="cart" style={{background:C.bgDeep,borderTop:`1px solid ${C.border}`,padding:"64px 24px"}}>
          <div style={{maxWidth:1300,margin:"0 auto"}}>
            <span className="jf-section-label">YOUR SELECTION</span>
            <h2 className="jf-section-title" style={{marginBottom:32}}>
              SHOPPING CART{cartCount > 0 && <span style={{color:C.accent}}> ({cartCount})</span>}
            </h2>
            {cartItems.length === 0 ? (
              <div style={{textAlign:"center",padding:"56px 24px",background:C.bgCard,border:`1.5px solid ${C.border}`}}>
                <div style={{fontSize:44,marginBottom:14}}>🛒</div>
                <p style={{color:C.textSec,fontSize:16,marginBottom:18,fontFamily:"'DM Sans',sans-serif"}}>Your cart is empty.</p>
                <button className="jf-primary-btn" onClick={() => scrollTo("shop","New")}>BROWSE JERSEYS</button>
              </div>
            ) : (
              <>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {cartItems.map((item,idx) => (
                    <div key={idx} style={{display:"flex",alignItems:"center",gap:20,background:C.bgCard,padding:"16px 20px",border:`1.5px solid ${C.border}`}}>
                      <img src={item.img || item.image} alt={item.name} style={{width:70,height:70,objectFit:"contain",background:"#0d1526",padding:6}}/>
                      <div style={{flex:1}}>
                        <p style={{fontSize:9,color:C.textSec,letterSpacing:2,textTransform:"uppercase",marginBottom:3,fontFamily:"'DM Sans',sans-serif"}}>{item.team}</p>
                        <h3 style={{color:C.textPri,fontFamily:"'Bebas Neue',sans-serif",fontSize:18,fontWeight:400,marginBottom:3,letterSpacing:.5}}>{item.name}</h3>
                        <p style={{fontFamily:"'Space Mono',monospace",color:C.accent,fontWeight:700,fontSize:15}}>₹{item.price.toLocaleString()}</p>
                      </div>
                      <button onClick={() => handleRemoveItem(idx)} style={{
                        background:"transparent",color:C.red,
                        border:`1.5px solid ${C.border}`,padding:"7px 14px",
                        cursor:"pointer",fontWeight:700,fontSize:10,
                        letterSpacing:1,textTransform:"uppercase",
                        fontFamily:"'DM Sans',sans-serif",
                        transition:"border-color .2s",
                      }}
                      onMouseEnter={e=>e.currentTarget.style.borderColor=C.red}
                      onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>REMOVE</button>
                    </div>
                  ))}
                </div>
                <div style={{marginTop:16,background:C.bgCard,border:`1.5px solid ${C.border}`,padding:"24px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16}}>
                  <div>
                    <p style={{color:C.textSec,fontSize:11,marginBottom:4,textTransform:"uppercase",letterSpacing:1.5,fontFamily:"'DM Sans',sans-serif"}}>{cartItems.length} item{cartItems.length>1?"s":""}</p>
                    <p style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:32,fontWeight:400,color:C.textPri}}>
                      TOTAL: <span style={{color:C.accent}}>₹{cartTotal.toLocaleString()}</span>
                    </p>
                  </div>
                  <a href={`https://wa.me/919363964260?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
                    style={{background:"#25D366",color:"#fff",padding:"14px 28px",fontWeight:800,fontSize:12,textDecoration:"none",display:"inline-flex",alignItems:"center",gap:8,letterSpacing:1,textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif"}}>
                    💬 CHECKOUT ON WHATSAPP
                  </a>
                </div>
              </>
            )}
          </div>
        </section>

        {/* ══ FOOTER ══════════════════════════════════════════ */}
        <footer style={{borderTop:`1px solid ${C.border}`,background:C.bgDeep,padding:"36px 24px",textAlign:"center"}}>
          <div style={{maxWidth:1300,margin:"0 auto"}}>
            <div style={{display:"flex",alignItems:"baseline",justifyContent:"center",marginBottom:12,gap:0}}>
              <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,fontWeight:400,color:C.accent,letterSpacing:3}}>JERSEY</span>
              <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,fontWeight:400,color:"rgba(240,244,255,0.3)",letterSpacing:4}}>&nbsp;FACTORY</span>
            </div>
            <p style={{color:C.textSec,fontSize:12,marginBottom:6,fontFamily:"'DM Sans',sans-serif"}}>Premium football jerseys for fans across India</p>
            <p style={{color:"rgba(240,244,255,0.15)",fontSize:11,fontFamily:"'DM Sans',sans-serif"}}>© {new Date().getFullYear()} Jersey Factory · Devala · abusahel40@gmail.com</p>
          </div>
        </footer>

      </div>

      {/* ══ PHONE MODEL (floating + mobile bar) ════════════ */}
      <PhoneModel scrollTo={scrollTo} />

      {showLogin && (
        <LoginModal onClose={() => setShowLogin(false)} onLogin={(email) => { setLoggedIn(true); setUserEmail(email); }}/>
      )}
    </>
  );
}
