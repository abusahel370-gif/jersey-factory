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
  { name: "New",        id: "shop"    },
  { name: "Sports",     id: "shop"    },
  { name: "Men",        id: "shop"    },
  { name: "Women",      id: "shop"    },
  { name: "Kids",       id: "shop"    },
  { name: "Custom",     id: "custom"  },
  { name: "Sale",       id: "shop"    },
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
        background:"#fff",
        border: hovered ? "2px solid #111" : "2px solid #eee",
        borderRadius:0,
        overflow:"hidden",
        position:"relative",
        transition:"transform .22s ease, border-color .22s ease, box-shadow .22s ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? "0 12px 32px rgba(0,0,0,0.13)" : "0 2px 8px rgba(0,0,0,0.06)",
        cursor:"pointer",
      }}
    >
      {jersey.badge && (
        <span style={{
          position:"absolute", top:12, left:12, zIndex:2,
          borderRadius:2, padding:"3px 8px",
          fontSize:10, fontWeight:800, letterSpacing:1, textTransform:"uppercase",
          background: BADGE_STYLES[jersey.badge].bg,
          color:       BADGE_STYLES[jersey.badge].text,
        }}>{jersey.badge}</span>
      )}

      <div style={{
        background:"#f5f5f5",
        display:"flex", justifyContent:"center", alignItems:"center",
        padding:"28px 20px", minHeight:220, overflow:"hidden",
      }}>
        <img src={jersey.img} alt={jersey.name} style={{
          width:"100%", maxWidth:200, height:200, objectFit:"contain", display:"block",
          transition:"transform .3s ease",
          transform: hovered ? "scale(1.07)" : "scale(1)",
        }} />
      </div>

      <div style={{ padding:"16px 16px 18px", borderTop:"1px solid #eee" }}>
        <p style={{
          fontSize:11, fontWeight:600, letterSpacing:1.2,
          textTransform:"uppercase", color:"#999",
          margin:"0 0 4px", display:"flex", alignItems:"center", gap:5,
        }}>
          <span style={{fontSize:13}}>{jersey.flag}</span>{jersey.team}
        </p>
        <h3 style={{fontSize:15, fontWeight:700, color:"#111", margin:"0 0 12px", lineHeight:1.3}}>{jersey.name}</h3>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
          <div>
            <span style={{fontSize:13,fontWeight:600,color:"#555",verticalAlign:"top",lineHeight:"24px"}}>₹</span>
            <span style={{fontSize:22,fontWeight:800,color:"#111"}}>{jersey.price.toLocaleString()}</span>
          </div>
          <button onClick={handleAdd} style={{
            border:"2px solid #111", borderRadius:0, padding:"9px 18px",
            fontSize:12, fontWeight:800, cursor:"pointer", color: added ? "#fff" : "#111",
            letterSpacing:.5, textTransform:"uppercase",
            transition:"background .25s, color .25s",
            background: added ? "#111" : "transparent",
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
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",display:"flex",justifyContent:"center",alignItems:"center",zIndex:9999}}>
      <div onClick={e => e.stopPropagation()} onKeyDown={handleKeyDown} style={{width:420,background:"#fff",padding:"48px 40px",borderRadius:0,boxShadow:"0 20px 60px rgba(0,0,0,0.2)"}}>
        <h2 style={{fontFamily:"'Barlow Condensed',sans-serif",color:"#111",textAlign:"center",fontSize:30,fontWeight:900,marginBottom:6,letterSpacing:1,textTransform:"uppercase"}}>Sign In</h2>
        <p style={{color:"#888",textAlign:"center",fontSize:13,marginBottom:28}}>Access your Jersey Factory account</p>

        <label style={{fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:"#555",display:"block",marginBottom:8}}>Email</label>
        <input className="input-field" type="email" placeholder="you@example.com" value={email} onChange={e=>{setEmail(e.target.value);setEmailErr("");}} style={{marginBottom:emailErr?6:16}}/>
        {emailErr && <p style={{color:"#cc0000",fontSize:12,marginBottom:14}}>{emailErr}</p>}

        <label style={{fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:"#555",display:"block",marginBottom:8}}>Password</label>
        <input className="input-field" type="password" placeholder="••••••••" value={password} onChange={e=>{setPassword(e.target.value);setPasswordErr("");}} style={{marginBottom:passwordErr?6:28}}/>
        {passwordErr && <p style={{color:"#cc0000",fontSize:12,marginBottom:20}}>{passwordErr}</p>}

        <button onClick={handleLogin} disabled={loading} style={{width:"100%",padding:"14px",background:loading?"#888":"#111",color:"#fff",border:"none",borderRadius:0,fontWeight:800,fontSize:14,cursor:loading?"not-allowed":"pointer",marginBottom:12,letterSpacing:1,textTransform:"uppercase",transition:"background .2s"}}>
          {loading ? "Signing in…" : "Login"}
        </button>
        <button onClick={onClose} style={{width:"100%",padding:"14px",background:"transparent",color:"#555",border:"2px solid #ddd",borderRadius:0,cursor:"pointer",fontSize:13,fontWeight:600,letterSpacing:.5,textTransform:"uppercase"}}>Cancel</button>
      </div>
    </div>
  );
}

/* ─── STAR RATING ───────────────────────────────────────────── */
function Stars({ count }) {
  return (
    <div style={{display:"flex",gap:2}}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{fontSize:13,color: i <= count ? "#e8c547" : "#ddd"}}>★</span>
      ))}
    </div>
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
      bg:"#c0392b",
      tag:"END OF SEASON SALE",
      title:"FLAT 40% OFF",
      sub:"Premium Football Jerseys",
      links:["FOR HIM", "FOR HER"],
      extra:"+ 5% OFF ON ONLINE PAYMENTS",
      cta:"SHOP NOW",
      ctaId:"shop",
    },
    {
      bg:"#111",
      tag:"NEW ARRIVAL",
      title:"PORTUGAL HOME KIT 2025",
      sub:"Official Puma Kit — Limited Stock",
      links:["BUY NOW", "CUSTOM PRINT"],
      extra:"FREE DELIVERY above ₹1,499",
      cta:"EXPLORE",
      ctaId:"shop",
    },
    {
      bg:"#003366",
      tag:"TRENDING",
      title:"ARGENTINA SPECIAL EDITION",
      sub:"Wear the World Cup Winners' Jersey",
      links:["SHOP MEN", "CUSTOM NAME"],
      extra:"3–5 Day Custom Printing Available",
      cta:"GET YOURS",
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
      if (!error && data) setJerseys(data);
    }
    fetchJerseys();
  }, []);

  // Auto-rotate hero banners
  useEffect(() => {
    const t = setInterval(() => setHeroBanner(i => (i + 1) % HERO_BANNERS.length), 4000);
    return () => clearInterval(t);
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
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,700;0,900;1,700;1,900&family=Inter:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html { scroll-behavior:smooth; }
        body { background:#fff; }

        @keyframes fadeUp   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn  { from{opacity:0;transform:translateX(-30px)} to{opacity:1;transform:translateX(0)} }
        @keyframes bannerIn { from{opacity:0;transform:scale(1.03)} to{opacity:1;transform:scale(1)} }
        @keyframes shimmer  { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:.7} }

        .nav-link {
          background:none; border:none; cursor:pointer;
          font-size:14px; font-weight:600; padding:0 4px;
          color:#fff; letter-spacing:.3px;
          transition:color .2s; position:relative;
          font-family:'Inter',sans-serif;
          text-transform:uppercase;
        }
        .nav-link::after {
          content:""; position:absolute; bottom:-4px; left:0; right:0;
          height:2px; background:#fff; transform:scaleX(0);
          transition:transform .2s; transform-origin:left;
        }
        .nav-link:hover::after, .nav-link.active::after { transform:scaleX(1); }
        .nav-link:hover { color:#fff; }
        .nav-link.active { color:#fff; }

        .input-field {
          width:100%; padding:12px 16px; border-radius:0;
          border:1.5px solid #ddd;
          background:#fff; color:#111; font-size:14px;
          outline:none; transition:border-color .2s;
          font-family:'Inter',sans-serif; display:block;
        }
        .input-field:focus { border-color:#111; }
        .input-field::placeholder { color:#aaa; }

        .search-bar {
          width:100%; padding:11px 16px 11px 44px; border:none;
          border-bottom:2px solid #111;
          background:transparent; color:#111; font-size:15px;
          outline:none; font-family:'Inter',sans-serif;
        }
        .search-bar::placeholder { color:#aaa; }

        .primary-btn {
          background:#111; color:#fff; border:none;
          padding:14px 36px; font-size:13px; font-weight:800;
          cursor:pointer; letter-spacing:1.5px; text-transform:uppercase;
          transition:background .2s, transform .15s;
          font-family:'Inter',sans-serif;
        }
        .primary-btn:hover { background:#333; transform:translateY(-1px); }

        .outline-btn {
          background:transparent; color:#fff;
          border:2px solid rgba(255,255,255,0.7);
          padding:12px 28px; font-size:13px; font-weight:700;
          cursor:pointer; letter-spacing:1px; text-transform:uppercase;
          transition:background .2s, border-color .2s;
          font-family:'Inter',sans-serif;
        }
        .outline-btn:hover { background:rgba(255,255,255,0.12); border-color:#fff; }

        .why-card { transition:box-shadow .2s, transform .2s; }
        .why-card:hover { box-shadow:0 8px 24px rgba(0,0,0,0.1); transform:translateY(-4px); }
        .review-card { transition:box-shadow .2s; }
        .review-card:hover { box-shadow:0 6px 20px rgba(0,0,0,0.08); }

        .section-label {
          font-size:11px; font-weight:700; letter-spacing:3px;
          text-transform:uppercase; color:#999; margin-bottom:8px; display:block;
        }
        .section-title {
          font-family:'Barlow Condensed',sans-serif;
          font-size:clamp(28px,4vw,48px); font-weight:900;
          color:#111; margin:0 0 8px; letter-spacing:-.5px; line-height:1.05;
        }
        .section-sub { font-size:14px; color:#888; }

        .banner-transition { animation: bannerIn .5s ease forwards; }
        .filter-btn {
          border:1.5px solid #ddd; background:#fff; padding:9px 18px;
          font-size:13px; font-weight:600; cursor:pointer; border-radius:2px;
          display:flex; align-items:center; gap:6px; color:#333;
          font-family:'Inter',sans-serif; transition:border-color .2s;
        }
        .filter-btn:hover { border-color:#111; }

        .category-card {
          position:relative; overflow:hidden; cursor:pointer;
          transition:transform .25s;
        }
        .category-card:hover { transform:scale(1.02); }
        .category-card:hover .cat-overlay { background:rgba(0,0,0,0.5); }
        .cat-overlay {
          position:absolute; inset:0;
          background:rgba(0,0,0,0.35);
          transition:background .3s;
          display:flex; flex-direction:column;
          justify-content:flex-end; padding:24px;
        }
      `}</style>

      <div style={{minHeight:"100vh",background:"#fff",color:"#111",fontFamily:"'Inter','Segoe UI',sans-serif",overflowX:"hidden"}}>

        {/* ══ TOP ANNOUNCEMENT BAR ════════════════════════════ */}
        <div style={{
          background:"#fff",
          borderBottom:"1px solid #eee",
          padding:"10px 24px",
          textAlign:"center",
        }}>
          <div style={{maxWidth:1300,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"center",gap:8,fontSize:13,fontWeight:600,color:"#111",flexWrap:"wrap"}}>
            <span>SOLVE YOUR QUERIES FASTER! SEND US A 'HI' ON WHATSAPP AT 9363964260</span>
            <a href="https://wa.me/919363964260" target="_blank" rel="noopener noreferrer"
              style={{color:"#111",fontWeight:800,letterSpacing:.5,textDecoration:"underline",textUnderlineOffset:3}}>
              CLICK HERE
            </a>
          </div>
        </div>

        {/* ══ MAIN HEADER / NAV ═══════════════════════════════ */}
        <header style={{
          position:"sticky", top:0, zIndex:200,
          background:"#111",
        }}>
          <div style={{maxWidth:1300,margin:"0 auto",padding:"0 24px",height:60,display:"flex",alignItems:"center",gap:32}}>

            {/* Logo */}
            <div style={{flexShrink:0,display:"flex",alignItems:"baseline",gap:0}}>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:24,fontWeight:900,color:"#e84747",letterSpacing:2,textTransform:"uppercase"}}>JERSEY</span>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:24,fontWeight:400,color:"rgba(255,255,255,0.75)",letterSpacing:3}}>&nbsp;FACTORY</span>
            </div>

            {/* Nav Links */}
            <nav style={{display:"flex",alignItems:"center",gap:28,flex:1}}>
              {NAV_LINKS.map(l => (
                <button key={l.name} className={`nav-link${activeNav===l.name?" active":""}`}
                  onClick={() => scrollTo(l.id, l.name)}>
                  {l.name}
                </button>
              ))}
            </nav>

            {/* Right: Search + Wishlist + Cart + Account */}
            <div style={{display:"flex",alignItems:"center",gap:20,flexShrink:0}}>
              {/* Search toggle */}
              <button onClick={() => setShowSearch(s => !s)} style={{background:"none",border:"none",cursor:"pointer",color:"#fff",fontSize:18,display:"flex",alignItems:"center",gap:6,fontFamily:"'Inter',sans-serif",fontWeight:600,fontSize:13,letterSpacing:.5}}>
                🔍 <span>SEARCH</span>
              </button>

              {/* Wishlist */}
              <button style={{background:"none",border:"none",cursor:"pointer",color:"#fff",fontSize:20}}>♡</button>

              {/* Cart */}
              <button style={{background:"none",border:"none",cursor:"pointer",position:"relative",color:"#fff",fontSize:20}} onClick={() => scrollTo("cart","Cart")}>
                🛒
                {cartCount > 0 && (
                  <span style={{position:"absolute",top:-4,right:-4,background:"#e84747",color:"#fff",borderRadius:"50%",width:17,height:17,fontSize:10,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center"}}>{cartCount}</span>
                )}
              </button>

              {/* Account */}
              {loggedIn ? (
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:12,color:"rgba(255,255,255,0.6)",maxWidth:110,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>👤 {userEmail}</span>
                  <button onClick={handleLogout} style={{background:"transparent",color:"rgba(255,255,255,0.7)",border:"1px solid rgba(255,255,255,0.2)",borderRadius:0,padding:"6px 12px",fontWeight:700,fontSize:11,cursor:"pointer",letterSpacing:.5,textTransform:"uppercase"}}>Out</button>
                </div>
              ) : (
                <button onClick={() => setShowLogin(true)} style={{background:"none",border:"none",cursor:"pointer",color:"#fff",fontSize:20}}>👤</button>
              )}
            </div>
          </div>

          {/* Search bar (expandable) */}
          {showSearch && (
            <div style={{background:"#fff",borderTop:"1px solid #eee",padding:"16px 24px"}}>
              <div style={{maxWidth:600,margin:"0 auto",position:"relative"}}>
                <span style={{position:"absolute",left:0,top:"50%",transform:"translateY(-50%)",fontSize:17,color:"#aaa"}}>🔍</span>
                <input
                  className="search-bar"
                  type="text"
                  placeholder="Search jerseys, teams, nations…"
                  value={searchQuery}
                  autoFocus
                  onChange={e => { setSearchQuery(e.target.value); if (e.target.value.trim()) { scrollTo("shop","New"); } }}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} style={{position:"absolute",right:0,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#aaa",cursor:"pointer",fontSize:20}}>×</button>
                )}
              </div>
            </div>
          )}
        </header>

        {/* ══ HOME PAGE ═══════════════════════════════════════ */}
        <div id="home" ref={heroRef}>

          {/* ── HERO PROMOTIONAL BANNER ─────────────────────── */}
          <div
            key={heroBanner}
            className="banner-transition"
            style={{
              background: banner.bg,
              padding:"72px 24px 80px",
              textAlign:"center",
              position:"relative",
              overflow:"hidden",
              minHeight:340,
              display:"flex",
              flexDirection:"column",
              alignItems:"center",
              justifyContent:"center",
            }}
          >
            {/* subtle pattern overlay */}
            <div style={{position:"absolute",inset:0,opacity:.04,backgroundImage:"repeating-linear-gradient(45deg,#fff 0px,#fff 1px,transparent 1px,transparent 20px)",pointerEvents:"none"}}/>

            <p style={{
              fontFamily:"'Barlow Condensed',sans-serif",
              fontSize:13, fontWeight:700, letterSpacing:4,
              textTransform:"uppercase", color:"rgba(255,255,255,0.75)",
              marginBottom:12,
            }}>{banner.tag}</p>

            <h1 style={{
              fontFamily:"'Barlow Condensed',sans-serif",
              fontSize:"clamp(44px,6vw,80px)",
              fontWeight:900, color:"#fff",
              lineHeight:1, marginBottom:8, letterSpacing:-1,
            }}>{banner.title}</h1>

            <p style={{
              fontSize:16, color:"rgba(255,255,255,0.75)",
              marginBottom:24, fontWeight:500, letterSpacing:.3,
            }}>{banner.sub}</p>

            <div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap",marginBottom:20}}>
              {banner.links.map(link => (
                <button key={link} className="outline-btn" onClick={() => scrollTo(banner.ctaId, "New")}>
                  {link}
                </button>
              ))}
            </div>

            <p style={{
              fontSize:12, color:"rgba(255,255,255,0.55)",
              letterSpacing:1, textTransform:"uppercase", fontWeight:600,
            }}>{banner.extra}</p>

            {/* Dot indicators */}
            <div style={{display:"flex",gap:8,justifyContent:"center",marginTop:28}}>
              {HERO_BANNERS.map((_,i) => (
                <button key={i} onClick={() => setHeroBanner(i)} style={{
                  width: i===heroBanner ? 24 : 8,
                  height:8, borderRadius:4,
                  background: i===heroBanner ? "#fff" : "rgba(255,255,255,0.35)",
                  border:"none", cursor:"pointer",
                  transition:"width .3s, background .3s",
                  padding:0,
                }}/>
              ))}
            </div>
          </div>

          {/* ── QUICK CATEGORY PILLS ────────────────────────── */}
          <div style={{background:"#f5f5f5",borderBottom:"1px solid #eee",padding:"0 24px",overflowX:"auto"}}>
            <div style={{maxWidth:1300,margin:"0 auto",display:"flex",gap:0}}>
              {["All Jerseys","Portugal","France","Argentina","Brazil","England","Netherlands","Custom Print"].map((cat,i) => (
                <button key={cat} onClick={() => scrollTo("shop","New")} style={{
                  background:"transparent", border:"none",
                  borderBottom: i===0 ? "3px solid #111" : "3px solid transparent",
                  padding:"14px 20px",
                  fontSize:13, fontWeight:600, color: i===0 ? "#111" : "#666",
                  cursor:"pointer", whiteSpace:"nowrap",
                  letterSpacing:.3, fontFamily:"'Inter',sans-serif",
                  transition:"color .2s, border-color .2s",
                }}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* ── JERSEY SHOWCASE ROW (visual images) ─────────── */}
          <section style={{padding:"56px 24px",background:"#fff"}}>
            <div style={{maxWidth:1300,margin:"0 auto"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:32,flexWrap:"wrap",gap:12}}>
                <div>
                  <span className="section-label">⚽ International Collection 2025</span>
                  <h2 className="section-title">JERSEYS</h2>
                  <p className="section-sub">Official national team kits — wear your colours with pride</p>
                </div>
                <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                  <button className="filter-btn">Product Type ▾</button>
                  <button className="filter-btn">Price ▾</button>
                  <button className="filter-btn">Size ▾</button>
                  <button className="filter-btn">Colour ▾</button>
                  <button className="filter-btn" style={{marginLeft:"auto",borderColor:"#111",fontWeight:700,color:"#111"}}>RECOMMENDED ▾</button>
                </div>
              </div>

              {/* Jersey grid using local images */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:1,background:"#eee"}}>
                {JERSEYS.map(j => (
                  <div key={j.id} style={{background:"#fff"}}>
                    <JerseyCard jersey={j} onAdd={handleAddToCart}/>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── PROMO BANNER: CUSTOM JERSEY ─────────────────── */}
          <section style={{background:"#111",padding:"64px 24px",textAlign:"center"}}>
            <div style={{maxWidth:700,margin:"0 auto"}}>
              <span className="section-label" style={{color:"rgba(255,255,255,0.4)"}}>✏️ PERSONALISE YOUR KIT</span>
              <h2 style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"clamp(32px,5vw,60px)",fontWeight:900,color:"#fff",marginBottom:12,letterSpacing:-.5}}>
                CUSTOM NAME & NUMBER
              </h2>
              <p style={{color:"rgba(255,255,255,0.55)",fontSize:15,marginBottom:32,lineHeight:1.7}}>
                Get your name and number printed on any jersey. Ready in 3–5 days, delivered across India.
              </p>
              <button className="primary-btn" style={{background:"#e8c547",color:"#111",fontSize:14,letterSpacing:1.5}}
                onClick={() => scrollTo("custom","Custom")}>
                CUSTOMISE NOW →
              </button>
            </div>
          </section>

          {/* ── BEST SELLERS STRIP ──────────────────────────── */}
          <section style={{padding:"56px 24px",background:"#f9f9f9"}}>
            <div style={{maxWidth:1300,margin:"0 auto"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:28,flexWrap:"wrap",gap:12}}>
                <div>
                  <span className="section-label">🏆 TOP PICKS</span>
                  <h2 className="section-title">BEST SELLERS</h2>
                  <p className="section-sub">Our most-loved kits — ordered again and again</p>
                </div>
                <button onClick={() => scrollTo("shop","New")} style={{border:"2px solid #111",background:"transparent",color:"#111",padding:"10px 24px",fontSize:12,fontWeight:800,cursor:"pointer",letterSpacing:1,textTransform:"uppercase",fontFamily:"'Inter',sans-serif"}}>VIEW ALL →</button>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:1,background:"#eee"}}>
                {BEST_SELLERS.map(j => (
                  <div key={j.id} style={{background:"#fff"}}>
                    <JerseyCard jersey={j} onAdd={handleAddToCart}/>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── WHY CHOOSE ──────────────────────────────────── */}
          <section style={{padding:"56px 24px",background:"#fff",borderTop:"1px solid #eee"}}>
            <div style={{maxWidth:1300,margin:"0 auto"}}>
              <div style={{textAlign:"center",marginBottom:40}}>
                <span className="section-label">✅ OUR PROMISE</span>
                <h2 className="section-title">WHY JERSEY FACTORY?</h2>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:24}}>
                {[
                  { icon:"🏅", title:"Premium Quality", desc:"High-quality polyester — breathable, durable, match-ready." },
                  { icon:"✏️", title:"Custom Printing",  desc:"Your name & number printed sharp in 3–5 days." },
                  { icon:"🚚", title:"Fast Delivery",    desc:"Tracked shipping to every corner of India." },
                  { icon:"💬", title:"WhatsApp Order",   desc:"No checkout hassle — just message and we handle the rest." },
                  { icon:"💰", title:"Best Prices",      desc:"Authentic quality at prices that don't break the bank." },
                  { icon:"🔄", title:"Easy Returns",     desc:"Not happy? We make it right within 7 days." },
                ].map(({icon,title,desc}) => (
                  <div key={title} className="why-card" style={{background:"#f9f9f9",border:"1.5px solid #eee",padding:"28px 22px"}}>
                    <div style={{fontSize:32,marginBottom:12}}>{icon}</div>
                    <h3 style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:800,color:"#111",marginBottom:8,letterSpacing:.3,textTransform:"uppercase"}}>{title}</h3>
                    <p style={{color:"#777",lineHeight:1.65,fontSize:13}}>{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── CUSTOMER REVIEWS ────────────────────────────── */}
          <section style={{padding:"56px 24px",background:"#f9f9f9",borderTop:"1px solid #eee"}}>
            <div style={{maxWidth:1300,margin:"0 auto"}}>
              <div style={{textAlign:"center",marginBottom:40}}>
                <span className="section-label">⭐ REAL CUSTOMERS</span>
                <h2 className="section-title">WHAT FANS ARE SAYING</h2>
                <p className="section-sub">Over 10,000 happy fans across India</p>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:20}}>
                {REVIEWS.map((r,i) => (
                  <div key={i} className="review-card" style={{background:"#fff",border:"1.5px solid #eee",padding:"24px 20px"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <span style={{fontSize:28}}>{r.avatar}</span>
                        <div>
                          <div style={{fontWeight:700,fontSize:14,color:"#111"}}>{r.name}</div>
                          <div style={{fontSize:11,color:"#999",marginTop:2}}>📍 {r.location}</div>
                        </div>
                      </div>
                      <Stars count={r.rating}/>
                    </div>
                    <p style={{color:"#555",lineHeight:1.65,fontSize:13}}>"{r.text}"</p>
                    <div style={{marginTop:14,borderTop:"1px solid #f0f0f0",paddingTop:10}}>
                      <span style={{fontSize:10,color:"#bbb",fontWeight:700,letterSpacing:1,textTransform:"uppercase"}}>Verified Purchase ✓</span>
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
            <span className="section-label">International Jerseys</span>
            <h2 className="section-title">ALL JERSEYS</h2>
          </div>
          <div style={{position:"relative",marginBottom:36,maxWidth:480}}>
            <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:16,color:"#aaa"}}>🔍</span>
            <input className="search-bar" style={{paddingLeft:40}} type="text" placeholder="Search by team or jersey name…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}/>
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} style={{position:"absolute",right:0,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#aaa",cursor:"pointer",fontSize:20}}>×</button>
            )}
          </div>
          {filteredJerseys.length > 0 ? (
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:1,background:"#eee"}}>
              {filteredJerseys.map(j => (
                <div key={j.id} style={{background:"#fff"}}>
                  <JerseyCard jersey={j} onAdd={handleAddToCart}/>
                </div>
              ))}
            </div>
          ) : (
            <div style={{textAlign:"center",padding:"60px 24px",background:"#f9f9f9",border:"1.5px solid #eee"}}>
              <div style={{fontSize:40,marginBottom:12}}>🔍</div>
              <p style={{color:"#888",fontSize:16,marginBottom:6}}>No jerseys found for "<strong style={{color:"#111"}}>{searchQuery}</strong>"</p>
              <p style={{color:"#bbb",fontSize:13}}>Try searching by country or team name</p>
            </div>
          )}
        </section>

        {/* ══ CUSTOM JERSEY ═══════════════════════════════════ */}
        <section id="custom" style={{borderTop:"1px solid #eee",padding:"64px 24px",background:"#f9f9f9"}}>
          <div style={{maxWidth:1300,margin:"0 auto"}}>
            <div style={{textAlign:"center",marginBottom:48}}>
              <span className="section-label">✏️ PERSONALISE YOUR KIT</span>
              <h2 className="section-title">CREATE YOUR CUSTOM JERSEY</h2>
              <p className="section-sub" style={{maxWidth:480,margin:"8px auto 0"}}>Your name. Your number. Any jersey. Ready in 3–5 days.</p>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:48,alignItems:"center"}}>
              <div style={{display:"flex",justifyContent:"center",alignItems:"flex-end",gap:0,height:400,position:"relative"}}>
                <img src={messi} alt="Messi" style={{height:360,width:200,objectFit:"cover",objectPosition:"top",filter:"brightness(0.9)"}}/>
                <img src={ronaldo} alt="Ronaldo" style={{height:390,width:160,objectFit:"cover",objectPosition:"top",zIndex:2,position:"relative",margin:"0 -1px",boxShadow:"0 0 40px rgba(0,0,0,0.15)"}}/>
                <img src={neymar} alt="Neymar" style={{height:360,width:200,objectFit:"cover",objectPosition:"top",filter:"brightness(0.9)"}}/>
              </div>
              <div style={{background:"#fff",border:"1.5px solid #eee",padding:"40px 32px"}}>
                <h3 style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:26,fontWeight:900,color:"#111",marginBottom:24,letterSpacing:.3,textTransform:"uppercase"}}>Your Details</h3>
                <div style={{marginBottom:14}}>
                  <label style={{fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:"#888",display:"block",marginBottom:8}}>Your Name</label>
                  <input className="input-field" type="text" placeholder="e.g. Rahul" value={customName} onChange={e => setCustomName(e.target.value)}/>
                </div>
                <div style={{marginBottom:24}}>
                  <label style={{fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:"#888",display:"block",marginBottom:8}}>Jersey Number</label>
                  <input className="input-field" type="number" placeholder="e.g. 7" value={customNumber} onChange={e => setCustomNumber(e.target.value)} min="1" max="99"/>
                </div>
                <button onClick={handleSubmitCustom} disabled={!customName.trim() || !customNumber.trim()} style={{width:"100%",border:"none",padding:"15px",fontSize:14,fontWeight:800,letterSpacing:1,background:orderSubmitted?"#25D366":"#111",color:"#fff",cursor:(!customName.trim()||!customNumber.trim())?"not-allowed":"pointer",opacity:(!customName.trim()||!customNumber.trim())?0.4:1,textTransform:"uppercase",fontFamily:"'Inter',sans-serif",transition:"background .3s, opacity .2s"}}>
                  {orderSubmitted ? "✓ Opening WhatsApp…" : "💬 SUBMIT VIA WHATSAPP"}
                </button>
                <p style={{fontSize:12,color:"#aaa",marginTop:12,textAlign:"center"}}>Opens WhatsApp to confirm your custom order</p>
              </div>
            </div>
          </div>
        </section>

        {/* ══ CONTACT ═════════════════════════════════════════ */}
        <section id="contact" style={{maxWidth:1300,margin:"0 auto",padding:"64px 24px",textAlign:"center"}}>
          <span className="section-label">REACH OUT</span>
          <h2 className="section-title" style={{marginBottom:40}}>CONTACT US</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16,maxWidth:900,margin:"0 auto"}}>
            {[
              {icon:"📞",label:"Phone",value:"9363964260"},
              {icon:"📧",label:"Email",value:"abusahel40@gmail.com"},
              {icon:"📍",label:"Location",value:"Devala"},
              {icon:"💬",label:"WhatsApp",value:"9363964260"},
            ].map(({icon,label,value}) => (
              <div key={label} style={{background:"#f9f9f9",border:"1.5px solid #eee",padding:"28px 18px"}}>
                <div style={{fontSize:28,marginBottom:10}}>{icon}</div>
                <p style={{fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"#bbb",marginBottom:6}}>{label}</p>
                <p style={{color:"#111",fontWeight:700,fontSize:14}}>{value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══ CART ════════════════════════════════════════════ */}
        <section id="cart" style={{background:"#f9f9f9",borderTop:"1px solid #eee",padding:"64px 24px"}}>
          <div style={{maxWidth:1300,margin:"0 auto"}}>
            <span className="section-label">YOUR SELECTION</span>
            <h2 className="section-title" style={{marginBottom:32}}>
              SHOPPING CART{cartCount > 0 && <span style={{color:"#e84747"}}> ({cartCount})</span>}
            </h2>
            {cartItems.length === 0 ? (
              <div style={{textAlign:"center",padding:"56px 24px",background:"#fff",border:"1.5px solid #eee"}}>
                <div style={{fontSize:44,marginBottom:14}}>🛒</div>
                <p style={{color:"#aaa",fontSize:16,marginBottom:18}}>Your cart is empty.</p>
                <button className="primary-btn" onClick={() => scrollTo("shop","New")}>BROWSE JERSEYS</button>
              </div>
            ) : (
              <>
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  {cartItems.map((item,idx) => (
                    <div key={idx} style={{display:"flex",alignItems:"center",gap:20,background:"#fff",padding:"16px 20px",border:"1.5px solid #eee"}}>
                      <img src={item.img} alt={item.name} style={{width:72,height:72,objectFit:"contain",background:"#f5f5f5",padding:4}}/>
                      <div style={{flex:1}}>
                        <p style={{fontSize:10,color:"#bbb",letterSpacing:2,textTransform:"uppercase",marginBottom:3}}>{item.team}</p>
                        <h3 style={{color:"#111",fontWeight:700,fontSize:15,marginBottom:3}}>{item.name}</h3>
                        <p style={{color:"#111",fontWeight:800,fontSize:16}}>₹{item.price.toLocaleString()}</p>
                      </div>
                      <button onClick={() => handleRemoveItem(idx)} style={{background:"transparent",color:"#cc0000",border:"1.5px solid #eee",padding:"7px 14px",cursor:"pointer",fontWeight:700,fontSize:12,letterSpacing:.5,textTransform:"uppercase"}}>REMOVE</button>
                    </div>
                  ))}
                </div>
                <div style={{marginTop:20,background:"#fff",border:"1.5px solid #eee",padding:"24px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16}}>
                  <div>
                    <p style={{color:"#888",fontSize:12,marginBottom:4,textTransform:"uppercase",letterSpacing:1}}>{cartItems.length} item{cartItems.length>1?"s":""}</p>
                    <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:30,fontWeight:900,color:"#111"}}>Total: ₹{cartTotal.toLocaleString()}</p>
                  </div>
                  <a href={`https://wa.me/919363964260?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
                    style={{background:"#25D366",color:"#fff",padding:"14px 28px",fontWeight:800,fontSize:13,textDecoration:"none",display:"inline-flex",alignItems:"center",gap:8,letterSpacing:.5,textTransform:"uppercase"}}>
                    💬 CHECKOUT ON WHATSAPP
                  </a>
                </div>
              </>
            )}
          </div>
        </section>

        {/* ══ FOOTER ══════════════════════════════════════════ */}
        <footer style={{borderTop:"1px solid #eee",background:"#111",padding:"36px 24px",textAlign:"center"}}>
          <div style={{maxWidth:1300,margin:"0 auto"}}>
            <div style={{display:"flex",alignItems:"baseline",justifyContent:"center",marginBottom:12}}>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:900,color:"#e84747",letterSpacing:2,textTransform:"uppercase"}}>JERSEY</span>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:400,color:"rgba(255,255,255,0.5)",letterSpacing:3}}>&nbsp;FACTORY</span>
            </div>
            <p style={{color:"rgba(255,255,255,0.25)",fontSize:12,marginBottom:6}}>Premium football jerseys for fans across India</p>
            <p style={{color:"rgba(255,255,255,0.15)",fontSize:11}}>© {new Date().getFullYear()} Jersey Factory · Devala · abusahel40@gmail.com</p>
          </div>
        </footer>

      </div>

      {showLogin && (
        <LoginModal onClose={() => setShowLogin(false)} onLogin={(email) => { setLoggedIn(true); setUserEmail(email); }}/>
      )}
    </>
  );
}
