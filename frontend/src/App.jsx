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
  { name: "New",    id: "shop"   },
  { name: "Sports", id: "shop"   },
  { name: "Men",    id: "shop"   },
  { name: "Women",  id: "shop"   },
  { name: "Kids",   id: "shop"   },
  { name: "Custom", id: "custom" },
  { name: "Sale",   id: "shop"   },
];

const CATEGORY_PILLS = [
  { label: "All Jerseys",   filter: ""              },
  { label: "Portugal",      filter: "portugal"      },
  { label: "France",        filter: "france"        },
  { label: "Argentina",     filter: "argentina"     },
  { label: "Brazil",        filter: "brazil"        },
  { label: "England",       filter: "england"       },
  { label: "Netherlands",   filter: "netherlands"   },
  { label: "Custom Print",  filter: "custom"        },
];

const BADGE_STYLES = {
  bestseller: { bg: "#5740dbd4", text: "#fff" },
  new:        { bg: "#3be37a",   text: "#111" },
  limited:    { bg: "#ff5757",   text: "#fff" },
};

const REVIEWS = [
  { name:"Arjun Mehta",    location:"Mumbai",    rating:5, text:"Got the Portugal kit for my son — quality is absolutely top notch. Custom printing was perfect. Delivered in 3 days!", avatar:"🧑‍💼" },
  { name:"Priya Nair",     location:"Kochi",     rating:5, text:"Argentina jersey for World Cup was exactly what I wanted. Fabric feels premium. Will definitely order again!", avatar:"👩‍🎓" },
  { name:"Ravi Kumar",     location:"Bangalore", rating:5, text:"Ordered custom Ronaldo jersey. Name and number print is super crisp. Jersey Factory is the real deal!", avatar:"🧔" },
  { name:"Sneha Patil",    location:"Pune",      rating:4, text:"Great quality jerseys at an unbeatable price. WhatsApp ordering process is quick and hassle-free.", avatar:"👩‍💻" },
  { name:"Mohammed Sadiq", location:"Chennai",   rating:5, text:"France jersey arrived well-packed. Looks exactly like the official kit. Highly recommended!", avatar:"🧑" },
  { name:"Kavitha Rao",    location:"Hyderabad", rating:5, text:"Bought Brazil and England kits together. Both are brilliant. Fast delivery and amazing packaging.", avatar:"👩" },
];

const SORT_OPTIONS = ["Recommended", "Price: Low to High", "Price: High to Low", "Newest First"];

const validateEmail    = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const validatePassword = (v) => v.length >= 6;

/* ─── JERSEY CARD ───────────────────────────────────────────── */
function JerseyCard({ jersey, onAdd, onWishlist, wishlisted }) {
  const [added,   setAdded]   = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    setAdded(true);
    onAdd(jersey);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff",
        border: "1.5px solid #eee",
        borderRadius: 4,
        overflow: "hidden",
        position: "relative",
        transition: "transform .22s ease, box-shadow .22s ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? "0 8px 24px rgba(0,0,0,0.12)" : "0 2px 8px rgba(0,0,0,0.06)",
        cursor: "pointer",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {jersey.badge && (
        <span style={{
          position:"absolute", top:12, left:12, zIndex:2,
          borderRadius:2, padding:"3px 8px",
          fontSize:10, fontWeight:800, letterSpacing:1, textTransform:"uppercase",
          background: BADGE_STYLES[jersey.badge]?.bg || "#eee",
          color: BADGE_STYLES[jersey.badge]?.text || "#111",
        }}>{jersey.badge}</span>
      )}

      {/* Wishlist heart on card */}
      <button
        onClick={(e) => { e.stopPropagation(); onWishlist(jersey); }}
        style={{
          position:"absolute", top:10, right:10, zIndex:2,
          background:"rgba(255,255,255,0.9)", border:"none",
          borderRadius:"50%", width:32, height:32,
          display:"flex", alignItems:"center", justifyContent:"center",
          cursor:"pointer", fontSize:16,
          boxShadow:"0 1px 4px rgba(0,0,0,0.12)",
          transition:"transform .15s",
        }}
        title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        {wishlisted ? "❤️" : "🤍"}
      </button>

      <div style={{
        background:"#f5f5f5",
        display:"flex", justifyContent:"center", alignItems:"center",
        padding:"28px 20px", minHeight:220, overflow:"hidden", flex:"0 0 auto",
      }}>
        <img
          src={jersey.image || jersey.img}
          alt={jersey.name}
          style={{
            width:"100%", maxWidth:200, height:200,
            objectFit:"contain", display:"block",
            transition:"transform .3s ease",
            transform: hovered ? "scale(1.07)" : "scale(1)",
          }}
        />
      </div>

      <div style={{ padding:"16px 16px 18px", borderTop:"1px solid #eee", flex:1, display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
        <div>
          <p style={{
            fontSize:11, fontWeight:600, letterSpacing:1.2,
            textTransform:"uppercase", color:"#999",
            margin:"0 0 4px", display:"flex", alignItems:"center", gap:5,
          }}>
            <span style={{fontSize:13}}>{jersey.flag}</span>{jersey.team}
          </p>
          <h3 style={{fontSize:15, fontWeight:700, color:"#111", margin:"0 0 12px", lineHeight:1.3}}>{jersey.name}</h3>
        </div>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
          <div>
            <span style={{fontSize:13,fontWeight:600,color:"#555",verticalAlign:"top",lineHeight:"24px"}}>₹</span>
            <span style={{fontSize:22,fontWeight:800,color:"#111"}}>{Number(jersey.price).toLocaleString()}</span>
          </div>
          <button onClick={handleAdd} style={{
            border:"2px solid #111", borderRadius:0, padding:"9px 18px",
            fontSize:12, fontWeight:800, cursor:"pointer",
            color: added ? "#fff" : "#111",
            letterSpacing:.5, textTransform:"uppercase",
            transition:"background .25s, color .25s",
            background: added ? "#111" : "transparent",
            fontFamily:"'Inter',sans-serif",
          }}>{added ? "✓ ADDED" : "ADD TO CART"}</button>
        </div>
      </div>
    </div>
  );
}

/* ─── FILTER DROPDOWN ───────────────────────────────────────── */
function FilterDropdown({ label, options, selected, onSelect }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{position:"relative"}}>
      <button
        className="filter-btn"
        onClick={() => setOpen(o => !o)}
        style={{ borderColor: selected ? "#111" : "#ddd", color: selected ? "#111" : "#333", fontWeight: selected ? 800 : 600 }}
      >
        {selected || label} ▾
      </button>
      {open && (
        <div style={{
          position:"absolute", top:"calc(100% + 4px)", left:0, zIndex:300,
          background:"#fff", border:"1.5px solid #eee",
          boxShadow:"0 8px 24px rgba(0,0,0,0.1)", minWidth:180,
        }}>
          <div
            onClick={() => { onSelect(""); setOpen(false); }}
            style={{ padding:"10px 16px", fontSize:13, cursor:"pointer", color:"#999", borderBottom:"1px solid #f0f0f0" }}
          >All</div>
          {options.map(opt => (
            <div
              key={opt}
              onClick={() => { onSelect(opt); setOpen(false); }}
              style={{
                padding:"10px 16px", fontSize:13, cursor:"pointer",
                background: selected === opt ? "#f5f5f5" : "#fff",
                fontWeight: selected === opt ? 700 : 400,
                color:"#111",
              }}
            >{opt}</div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── WISHLIST PANEL ────────────────────────────────────────── */
function WishlistPanel({ items, onClose, onRemove, onAdd }) {
  return (
    <div style={{position:"fixed",inset:0,zIndex:9998,display:"flex"}}>
      <div onClick={onClose} style={{flex:1,background:"rgba(0,0,0,0.4)"}}/>
      <div style={{
        width: Math.min(400, window.innerWidth),
        background:"#fff", height:"100%", overflowY:"auto",
        display:"flex", flexDirection:"column",
        boxShadow:"-4px 0 24px rgba(0,0,0,0.15)",
      }}>
        <div style={{padding:"20px 24px", borderBottom:"1px solid #eee", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
          <h2 style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:900,letterSpacing:1,textTransform:"uppercase"}}>
            WISHLIST {items.length > 0 && <span style={{color:"#e84747"}}>({items.length})</span>}
          </h2>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:22,cursor:"pointer",color:"#666"}}>×</button>
        </div>
        {items.length === 0 ? (
          <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:40,textAlign:"center"}}>
            <div style={{fontSize:48,marginBottom:16}}>🤍</div>
            <p style={{color:"#aaa",fontSize:15}}>Your wishlist is empty.</p>
            <p style={{color:"#ccc",fontSize:12,marginTop:6}}>Tap the heart on any jersey to save it here.</p>
          </div>
        ) : (
          <div style={{flex:1,padding:16,display:"flex",flexDirection:"column",gap:12}}>
            {items.map((item, idx) => (
              <div key={idx} style={{display:"flex",gap:12,background:"#f9f9f9",border:"1.5px solid #eee",padding:12,borderRadius:4}}>
                <img src={item.image || item.img} alt={item.name} style={{width:64,height:64,objectFit:"contain",background:"#fff",padding:4,borderRadius:2}}/>
                <div style={{flex:1,minWidth:0}}>
                  <p style={{fontSize:10,color:"#bbb",letterSpacing:1.5,textTransform:"uppercase",marginBottom:2}}>{item.team}</p>
                  <p style={{fontSize:13,fontWeight:700,color:"#111",marginBottom:6,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{item.name}</p>
                  <p style={{fontSize:14,fontWeight:800,color:"#111"}}>₹{Number(item.price).toLocaleString()}</p>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:6,flexShrink:0}}>
                  <button onClick={() => onAdd(item)} style={{background:"#111",color:"#fff",border:"none",padding:"5px 10px",fontSize:10,fontWeight:800,cursor:"pointer",letterSpacing:.5,textTransform:"uppercase"}}>ADD</button>
                  <button onClick={() => onRemove(item.id)} style={{background:"transparent",color:"#cc0000",border:"1px solid #eee",padding:"5px 10px",fontSize:10,fontWeight:700,cursor:"pointer",textTransform:"uppercase"}}>REMOVE</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── CART PANEL (slide-in) ─────────────────────────────────── */
function CartPanel({ items, onClose, onRemove, cartTotal }) {
  const waMsg = encodeURIComponent(
    `Hello Jersey Factory!\n\nI'd like to order:\n${items.map(i => `• ${i.name} — ₹${i.price}`).join("\n")}\n\nTotal: ₹${cartTotal}`
  );
  return (
    <div style={{position:"fixed",inset:0,zIndex:9998,display:"flex"}}>
      <div onClick={onClose} style={{flex:1,background:"rgba(0,0,0,0.4)"}}/>
      <div style={{
        width: Math.min(420, window.innerWidth),
        background:"#fff", height:"100%", overflowY:"auto",
        display:"flex", flexDirection:"column",
        boxShadow:"-4px 0 24px rgba(0,0,0,0.15)",
      }}>
        <div style={{padding:"20px 24px", borderBottom:"1px solid #eee", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
          <h2 style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:900,letterSpacing:1,textTransform:"uppercase"}}>
            CART {items.length > 0 && <span style={{color:"#e84747"}}>({items.length})</span>}
          </h2>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:22,cursor:"pointer",color:"#666"}}>×</button>
        </div>

        {items.length === 0 ? (
          <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:40,textAlign:"center"}}>
            <div style={{fontSize:48,marginBottom:16}}>🛒</div>
            <p style={{color:"#aaa",fontSize:15}}>Your cart is empty.</p>
          </div>
        ) : (
          <>
            <div style={{flex:1,padding:16,display:"flex",flexDirection:"column",gap:12}}>
              {items.map((item, idx) => (
                <div key={idx} style={{display:"flex",gap:12,background:"#f9f9f9",border:"1.5px solid #eee",padding:12,borderRadius:4}}>
                  <img src={item.image || item.img} alt={item.name} style={{width:64,height:64,objectFit:"contain",background:"#fff",padding:4,borderRadius:2}}/>
                  <div style={{flex:1,minWidth:0}}>
                    <p style={{fontSize:10,color:"#bbb",letterSpacing:1.5,textTransform:"uppercase",marginBottom:2}}>{item.team}</p>
                    <p style={{fontSize:13,fontWeight:700,color:"#111",marginBottom:4,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{item.name}</p>
                    <p style={{fontSize:15,fontWeight:800,color:"#111"}}>₹{Number(item.price).toLocaleString()}</p>
                  </div>
                  <button onClick={() => onRemove(idx)} style={{background:"transparent",color:"#cc0000",border:"none",fontSize:18,cursor:"pointer",alignSelf:"flex-start",lineHeight:1}}>×</button>
                </div>
              ))}
            </div>
            <div style={{padding:"20px 24px",borderTop:"1px solid #eee"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <span style={{fontSize:13,color:"#888",fontWeight:600}}>TOTAL</span>
                <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:26,fontWeight:900,color:"#111"}}>₹{cartTotal.toLocaleString()}</span>
              </div>
              <a
                href={`https://wa.me/919363964260?text=${waMsg}`}
                target="_blank" rel="noopener noreferrer"
                style={{
                  display:"block", textAlign:"center",
                  background:"#25D366", color:"#fff",
                  padding:"14px", fontWeight:800, fontSize:13,
                  textDecoration:"none", letterSpacing:.5, textTransform:"uppercase",
                  borderRadius:2,
                }}
              >💬 CHECKOUT ON WHATSAPP</a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── MOBILE MENU ───────────────────────────────────────────── */
function MobileMenu({ onClose, scrollTo }) {
  return (
    <div style={{position:"fixed",inset:0,zIndex:9997,display:"flex"}}>
      <div style={{
        width:280, background:"#111", height:"100%",
        display:"flex", flexDirection:"column", padding:"24px 0",
      }}>
        <div style={{padding:"0 24px 20px",borderBottom:"1px solid rgba(255,255,255,0.1)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"baseline"}}>
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:900,color:"#e84747",letterSpacing:2}}>JERSEY</span>
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:400,color:"rgba(255,255,255,0.6)",letterSpacing:2}}>&nbsp;FACTORY</span>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#fff",fontSize:22,cursor:"pointer"}}>×</button>
        </div>
        <nav style={{display:"flex",flexDirection:"column",padding:"16px 0"}}>
          {NAV_LINKS.map(l => (
            <button key={l.name} onClick={() => { scrollTo(l.id, l.name); onClose(); }} style={{
              background:"none", border:"none", color:"#fff",
              textAlign:"left", padding:"14px 24px",
              fontSize:16, fontWeight:700, cursor:"pointer",
              fontFamily:"'Barlow Condensed',sans-serif",
              letterSpacing:2, textTransform:"uppercase",
              borderBottom:"1px solid rgba(255,255,255,0.05)",
            }}>{l.name}</button>
          ))}
        </nav>
        <div style={{padding:"16px 24px",marginTop:"auto"}}>
          <a href="https://wa.me/919363964260" target="_blank" rel="noopener noreferrer"
            style={{display:"block",background:"#25D366",color:"#fff",padding:"12px",textAlign:"center",fontWeight:800,fontSize:13,textDecoration:"none",letterSpacing:1,textTransform:"uppercase",borderRadius:2}}>
            💬 WHATSAPP US
          </a>
        </div>
      </div>
      <div onClick={onClose} style={{flex:1,background:"rgba(0,0,0,0.5)"}}/>
    </div>
  );
}

/* ─── LOGIN MODAL ───────────────────────────────────────────── */
function LoginModal({ onClose, onLogin }) {
  const [tab,         setTab]         = useState("login"); // "login" | "signup"
  const [email,       setEmail]       = useState("");
  const [password,    setPassword]    = useState("");
  const [emailErr,    setEmailErr]    = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [loading,     setLoading]     = useState(false);
  const [successMsg,  setSuccessMsg]  = useState("");

  const handleAuth = async () => {
    let valid = true;
    if (!validateEmail(email))    { setEmailErr("Please enter a valid email address."); valid = false; } else setEmailErr("");
    if (!validatePassword(password)) { setPasswordErr("Password must be at least 6 characters."); valid = false; } else setPasswordErr("");
    if (!valid) return;

    setLoading(true);
    if (tab === "login") {
      const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      setLoading(false);
      if (error) { setEmailErr(error.message); return; }
      localStorage.setItem("jf_logged_in", "true");
      localStorage.setItem("jf_email", data.user.email);
      onLogin(data.user.email);
      onClose();
    } else {
      const { data, error } = await supabase.auth.signUp({ email: email.trim(), password });
      setLoading(false);
      if (error) { setEmailErr(error.message); return; }
      setSuccessMsg("Account created! Please check your email to confirm, then log in.");
      setTab("login");
    }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleAuth(); };

  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",display:"flex",justifyContent:"center",alignItems:"center",zIndex:9999,padding:"0 16px"}}>
      <div onClick={e => e.stopPropagation()} onKeyDown={handleKeyDown}
        style={{width:"100%",maxWidth:420,background:"#fff",padding:"40px 32px",borderRadius:0,boxShadow:"0 20px 60px rgba(0,0,0,0.2)"}}>

        {/* Tabs */}
        <div style={{display:"flex",marginBottom:28,borderBottom:"2px solid #eee"}}>
          {["login","signup"].map(t => (
            <button key={t} onClick={() => { setTab(t); setEmailErr(""); setPasswordErr(""); setSuccessMsg(""); }} style={{
              flex:1, padding:"12px", background:"none", border:"none",
              borderBottom: tab===t ? "2px solid #111" : "2px solid transparent",
              marginBottom:-2,
              fontFamily:"'Barlow Condensed',sans-serif",
              fontSize:18, fontWeight:900, letterSpacing:1, textTransform:"uppercase",
              color: tab===t ? "#111" : "#bbb", cursor:"pointer",
            }}>{t === "login" ? "Sign In" : "Sign Up"}</button>
          ))}
        </div>

        {successMsg && <p style={{background:"#f0fff4",border:"1px solid #b7ebc9",color:"#276749",padding:"10px 14px",fontSize:13,marginBottom:20,borderRadius:2}}>{successMsg}</p>}

        <label style={{fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:"#555",display:"block",marginBottom:8}}>Email</label>
        <input className="input-field" type="email" placeholder="you@example.com" value={email}
          onChange={e => { setEmail(e.target.value); setEmailErr(""); }} style={{marginBottom: emailErr ? 6 : 16}}/>
        {emailErr && <p style={{color:"#cc0000",fontSize:12,marginBottom:14}}>{emailErr}</p>}

        <label style={{fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:"#555",display:"block",marginBottom:8}}>Password</label>
        <input className="input-field" type="password" placeholder="••••••••" value={password}
          onChange={e => { setPassword(e.target.value); setPasswordErr(""); }} style={{marginBottom: passwordErr ? 6 : 24}}/>
        {passwordErr && <p style={{color:"#cc0000",fontSize:12,marginBottom:18}}>{passwordErr}</p>}

        <button onClick={handleAuth} disabled={loading} style={{
          width:"100%", padding:"14px", background: loading ? "#888" : "#111",
          color:"#fff", border:"none", borderRadius:0, fontWeight:800, fontSize:14,
          cursor: loading ? "not-allowed" : "pointer", marginBottom:12,
          letterSpacing:1, textTransform:"uppercase", transition:"background .2s",
          fontFamily:"'Inter',sans-serif",
        }}>
          {loading ? (tab==="login" ? "Signing in…" : "Creating account…") : (tab==="login" ? "Login" : "Create Account")}
        </button>
        <button onClick={onClose} style={{
          width:"100%", padding:"14px", background:"transparent", color:"#555",
          border:"2px solid #ddd", borderRadius:0, cursor:"pointer",
          fontSize:13, fontWeight:600, letterSpacing:.5, textTransform:"uppercase",
          fontFamily:"'Inter',sans-serif",
        }}>Cancel</button>
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
  const [cartItems,      setCartItems]      = useState([]);
  const [wishlistItems,  setWishlistItems]  = useState([]);
  const [activeNav,      setActiveNav]      = useState("New");
  const [activeCategory, setActiveCategory] = useState("");
  const [customName,     setCustomName]     = useState("");
  const [customNumber,   setCustomNumber]   = useState("");
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [showLogin,      setShowLogin]      = useState(false);
  const [showCart,       setShowCart]       = useState(false);
  const [showWishlist,   setShowWishlist]   = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [loggedIn,       setLoggedIn]       = useState(false);
  const [userEmail,      setUserEmail]      = useState("");
  const [searchQuery,    setSearchQuery]    = useState("");
  const [showSearch,     setShowSearch]     = useState(false);
  const [jerseys,        setJerseys]        = useState([]);
  const [heroBanner,     setHeroBanner]     = useState(0);
  const [sortBy,         setSortBy]         = useState("Recommended");
  const [priceFilter,    setPriceFilter]    = useState("");
  const heroRef = useRef(null);

  const HERO_BANNERS = [
    { bg:"#c0392b", tag:"END OF SEASON SALE",  title:"FLAT 40% OFF",             sub:"Premium Football Jerseys",           links:["FOR HIM","FOR HER"],         extra:"+ 5% OFF ON ONLINE PAYMENTS",        ctaId:"shop" },
    { bg:"#111",    tag:"NEW ARRIVAL",          title:"PORTUGAL HOME KIT 2025",   sub:"Official Puma Kit — Limited Stock",  links:["BUY NOW","CUSTOM PRINT"],    extra:"FREE DELIVERY above ₹1,499",         ctaId:"shop" },
    { bg:"#003366", tag:"TRENDING",             title:"ARGENTINA SPECIAL EDITION",sub:"Wear the World Cup Winners' Jersey", links:["SHOP MEN","CUSTOM NAME"],    extra:"3–5 Day Custom Printing Available",  ctaId:"shop" },
  ];

  const cartCount     = cartItems.length;
  const wishlistCount = wishlistItems.length;
  const cartTotal     = cartItems.reduce((s, i) => s + Number(i.price), 0);

  /* ── Init ── */
  useEffect(() => {
    const saved      = localStorage.getItem("jf_logged_in");
    const savedEmail = localStorage.getItem("jf_email");
    if (saved === "true" && savedEmail) { setLoggedIn(true); setUserEmail(savedEmail); }

    const savedWishlist = localStorage.getItem("jf_wishlist");
    if (savedWishlist) { try { setWishlistItems(JSON.parse(savedWishlist)); } catch(_) {} }
  }, []);

  /* ── Fetch jerseys from Supabase ── */
  useEffect(() => {
    async function fetchJerseys() {
      const { data, error } = await supabase.from("jerseys").select("*");
      if (!error && data) setJerseys(data);
    }
    fetchJerseys();
  }, []);

  /* ── Hero auto-rotate ── */
  useEffect(() => {
    const t = setInterval(() => setHeroBanner(i => (i + 1) % HERO_BANNERS.length), 4000);
    return () => clearInterval(t);
  }, []);

  /* ── Persist wishlist ── */
  useEffect(() => {
    localStorage.setItem("jf_wishlist", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  /* ── Handlers ── */
  const handleAddToCart = (jersey) => setCartItems(p => [...p, jersey]);

  const handleRemoveFromCart = (idx) => setCartItems(p => p.filter((_, i) => i !== idx));

  const handleWishlist = (jersey) => {
    setWishlistItems(prev => {
      const exists = prev.find(i => i.id === jersey.id);
      return exists ? prev.filter(i => i.id !== jersey.id) : [...prev, jersey];
    });
  };

  const handleRemoveFromWishlist = (id) => setWishlistItems(prev => prev.filter(i => i.id !== id));

  const handleLogout = async () => {
    await supabase.auth.signOut();
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

  const handleCategoryClick = (filter, idx) => {
    setActiveCategory(filter);
    setSearchQuery("");
    if (filter === "custom") {
      scrollTo("custom", "Custom");
    } else {
      scrollTo("shop", "New");
    }
  };

  /* ── Filtering & sorting ── */
  let displayJerseys = [...jerseys];

  // Category filter
  if (activeCategory && activeCategory !== "custom") {
    displayJerseys = displayJerseys.filter(j =>
      j.name?.toLowerCase().includes(activeCategory) ||
      j.team?.toLowerCase().includes(activeCategory)
    );
  }

  // Search filter
  if (searchQuery.trim()) {
    displayJerseys = displayJerseys.filter(j =>
      j.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.team?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Price filter
  if (priceFilter === "Under ₹999") {
    displayJerseys = displayJerseys.filter(j => Number(j.price) < 999);
  } else if (priceFilter === "₹999 – ₹1,499") {
    displayJerseys = displayJerseys.filter(j => Number(j.price) >= 999 && Number(j.price) <= 1499);
  } else if (priceFilter === "Above ₹1,499") {
    displayJerseys = displayJerseys.filter(j => Number(j.price) > 1499);
  }

  // Sort
  if (sortBy === "Price: Low to High")  displayJerseys.sort((a,b) => Number(a.price) - Number(b.price));
  if (sortBy === "Price: High to Low")  displayJerseys.sort((a,b) => Number(b.price) - Number(a.price));
  if (sortBy === "Newest First")        displayJerseys.sort((a,b) => b.id - a.id);

  const banner = HERO_BANNERS[heroBanner];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,700;0,900;1,700;1,900&family=Inter:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html { scroll-behavior:smooth; }
        body { background:#fff; }

        @keyframes bannerIn { from{opacity:0;transform:scale(1.03)} to{opacity:1;transform:scale(1)} }

        .nav-link {
          background:none; border:none; cursor:pointer;
          font-size:13px; font-weight:600; padding:0 4px;
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
          width:100%; padding:11px 16px 11px 40px; border:none;
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
          border:1.5px solid #ddd; background:#fff; padding:9px 16px;
          font-size:12px; font-weight:600; cursor:pointer; border-radius:2px;
          display:flex; align-items:center; gap:6px; color:#333;
          font-family:'Inter',sans-serif; transition:border-color .2s;
          white-space:nowrap;
        }
        .filter-btn:hover { border-color:#111; }

        /* ── MOBILE ── */
        .desktop-nav  { display:flex; }
        .mobile-menu-btn { display:none; }
        .search-label { display:inline; }

        @media (max-width: 768px) {
          .desktop-nav  { display:none !important; }
          .mobile-menu-btn { display:flex !important; }
          .search-label { display:none !important; }
          .custom-grid { grid-template-columns: 1fr !important; }
          .custom-player-imgs { display:none !important; }
          .jersey-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .filter-row { overflow-x:auto; padding-bottom:4px; flex-wrap:nowrap !important; }
          .hero-section { padding:48px 16px 56px !important; }
          .section-padding { padding:40px 16px !important; }
          .cart-item-img { width:52px !important; height:52px !important; }
        }

        @media (max-width: 400px) {
          .jersey-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={{minHeight:"100vh",background:"#fff",color:"#111",fontFamily:"'Inter','Segoe UI',sans-serif",overflowX:"hidden"}}>

        {/* ══ ANNOUNCEMENT BAR ════════════════════════════════ */}
        <div style={{background:"#111",padding:"9px 16px",textAlign:"center"}}>
          <div style={{maxWidth:1300,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"center",gap:8,fontSize:12,fontWeight:600,color:"rgba(255,255,255,0.85)",flexWrap:"wrap"}}>
            <span>🚀 FREE DELIVERY ABOVE ₹1,499 · CUSTOM PRINT IN 3–5 DAYS</span>
            <a href="https://wa.me/919363964260" target="_blank" rel="noopener noreferrer"
              style={{color:"#e8c547",fontWeight:800,textDecoration:"none"}}>
              WhatsApp: 9363964260 →
            </a>
          </div>
        </div>

        {/* ══ HEADER ══════════════════════════════════════════ */}
        <header style={{position:"sticky",top:0,zIndex:200,background:"#1a1a1a",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
          <div style={{maxWidth:1300,margin:"0 auto",padding:"0 20px",height:60,display:"flex",alignItems:"center",gap:24}}>

            {/* Mobile hamburger */}
            <button
              className="mobile-menu-btn"
              onClick={() => setShowMobileMenu(true)}
              style={{background:"none",border:"none",cursor:"pointer",color:"#fff",fontSize:22,display:"none",alignItems:"center",flexShrink:0}}
            >☰</button>

            {/* Logo */}
            <div style={{flexShrink:0,display:"flex",alignItems:"baseline",cursor:"pointer"}} onClick={() => window.scrollTo({top:0,behavior:"smooth"})}>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:24,fontWeight:900,color:"#e84747",letterSpacing:2,textTransform:"uppercase"}}>JERSEY</span>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:24,fontWeight:400,color:"rgba(255,255,255,0.65)",letterSpacing:3}}>&nbsp;FACTORY</span>
            </div>

            {/* Desktop nav */}
            <nav className="desktop-nav" style={{alignItems:"center",gap:24,flex:1}}>
              {NAV_LINKS.map(l => (
                <button key={l.name} className={`nav-link${activeNav===l.name?" active":""}`}
                  onClick={() => scrollTo(l.id, l.name)}>{l.name}</button>
              ))}
            </nav>

            {/* Right icons */}
            <div style={{display:"flex",alignItems:"center",gap:16,flexShrink:0,marginLeft:"auto"}}>

              {/* Search */}
              <button onClick={() => setShowSearch(s => !s)}
                style={{background:"none",border:"none",cursor:"pointer",color:"#fff",display:"flex",alignItems:"center",gap:5,fontFamily:"'Inter',sans-serif",fontWeight:600,fontSize:12,letterSpacing:.5}}>
                🔍 <span className="search-label">SEARCH</span>
              </button>

              {/* Wishlist */}
              <button onClick={() => setShowWishlist(true)}
                style={{background:"none",border:"none",cursor:"pointer",color:"#fff",fontSize:19,position:"relative",lineHeight:1}}>
                {wishlistCount > 0 ? "❤️" : "🤍"}
                {wishlistCount > 0 && (
                  <span style={{position:"absolute",top:-4,right:-4,background:"#e84747",color:"#fff",borderRadius:"50%",width:16,height:16,fontSize:9,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center"}}>{wishlistCount}</span>
                )}
              </button>

              {/* Cart */}
              <button onClick={() => setShowCart(true)}
                style={{background:"none",border:"none",cursor:"pointer",position:"relative",color:"#fff",fontSize:19,lineHeight:1}}>
                🛒
                {cartCount > 0 && (
                  <span style={{position:"absolute",top:-4,right:-4,background:"#e84747",color:"#fff",borderRadius:"50%",width:16,height:16,fontSize:9,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center"}}>{cartCount}</span>
                )}
              </button>

              {/* Account */}
              {loggedIn ? (
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:11,color:"rgba(255,255,255,0.5)",maxWidth:90,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>👤 {userEmail}</span>
                  <button onClick={handleLogout} style={{background:"transparent",color:"rgba(255,255,255,0.65)",border:"1px solid rgba(255,255,255,0.15)",padding:"5px 10px",fontWeight:700,fontSize:10,cursor:"pointer",letterSpacing:.5,textTransform:"uppercase",fontFamily:"'Inter',sans-serif"}}>OUT</button>
                </div>
              ) : (
                <button onClick={() => setShowLogin(true)} style={{background:"none",border:"none",cursor:"pointer",color:"#fff",fontSize:19,lineHeight:1}}>👤</button>
              )}
            </div>
          </div>

          {/* Expandable search */}
          {showSearch && (
            <div style={{background:"#fff",borderTop:"1px solid #eee",padding:"14px 20px"}}>
              <div style={{maxWidth:600,margin:"0 auto",position:"relative"}}>
                <span style={{position:"absolute",left:0,top:"50%",transform:"translateY(-50%)",fontSize:16,color:"#aaa"}}>🔍</span>
                <input
                  className="search-bar"
                  type="text"
                  placeholder="Search jerseys, teams, nations…"
                  value={searchQuery}
                  autoFocus
                  onChange={e => { setSearchQuery(e.target.value); setActiveCategory(""); scrollTo("shop","New"); }}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} style={{position:"absolute",right:0,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#aaa",cursor:"pointer",fontSize:20}}>×</button>
                )}
              </div>
            </div>
          )}
        </header>

        <div id="home" ref={heroRef}>

          {/* ══ HERO BANNER ═════════════════════════════════════ */}
          <div
            key={heroBanner}
            className="banner-transition hero-section"
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
            <div style={{position:"absolute",inset:0,opacity:.04,backgroundImage:"repeating-linear-gradient(45deg,#fff 0px,#fff 1px,transparent 1px,transparent 20px)",pointerEvents:"none"}}/>

            <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:700,letterSpacing:4,textTransform:"uppercase",color:"rgba(255,255,255,0.7)",marginBottom:10}}>{banner.tag}</p>
            <h1 style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"clamp(36px,6vw,80px)",fontWeight:900,color:"#fff",lineHeight:1,marginBottom:10,letterSpacing:-1}}>{banner.title}</h1>
            <p style={{fontSize:15,color:"rgba(255,255,255,0.72)",marginBottom:24,fontWeight:500}}>{banner.sub}</p>

            <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap",marginBottom:20}}>
              {banner.links.map(link => (
                <button key={link} className="outline-btn" onClick={() => scrollTo(banner.ctaId, "New")}>{link}</button>
              ))}
            </div>
            <p style={{fontSize:11,color:"rgba(255,255,255,0.45)",letterSpacing:1.5,textTransform:"uppercase",fontWeight:600}}>{banner.extra}</p>

            <div style={{display:"flex",gap:8,justifyContent:"center",marginTop:28}}>
              {HERO_BANNERS.map((_,i) => (
                <button key={i} onClick={() => setHeroBanner(i)} style={{
                  width: i===heroBanner ? 24 : 8, height:8, borderRadius:4,
                  background: i===heroBanner ? "#fff" : "rgba(255,255,255,0.3)",
                  border:"none", cursor:"pointer",
                  transition:"width .3s, background .3s", padding:0,
                }}/>
              ))}
            </div>
          </div>

          {/* ══ CATEGORY PILLS ══════════════════════════════════ */}
          <div style={{background:"#fafafa",borderBottom:"1px solid #eee",padding:"0 20px",overflowX:"auto"}}>
            <div style={{maxWidth:1300,margin:"0 auto",display:"flex",gap:0}}>
              {CATEGORY_PILLS.map((cat, i) => {
                const active = activeCategory === cat.filter;
                return (
                  <button key={cat.label}
                    onClick={() => handleCategoryClick(cat.filter, i)}
                    style={{
                      background:"transparent", border:"none",
                      borderBottom: active ? "3px solid #111" : "3px solid transparent",
                      padding:"13px 18px",
                      fontSize:13, fontWeight: active ? 700 : 600,
                      color: active ? "#111" : "#666",
                      cursor:"pointer", whiteSpace:"nowrap",
                      letterSpacing:.3, fontFamily:"'Inter',sans-serif",
                      transition:"color .2s, border-color .2s",
                    }}>
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ══ JERSEY SHOWCASE ═════════════════════════════════ */}
          <section className="section-padding" style={{padding:"48px 24px",background:"#fff"}}>
            <div style={{maxWidth:1300,margin:"0 auto"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:28,flexWrap:"wrap",gap:12}}>
                <div>
                  <span className="section-label">⚽ International Collection 2025</span>
                  <h2 className="section-title">JERSEYS</h2>
                  <p className="section-sub">Official national team kits — wear your colours with pride</p>
                </div>
                <div className="filter-row" style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
                  <FilterDropdown
                    label="Price"
                    options={["Under ₹999","₹999 – ₹1,499","Above ₹1,499"]}
                    selected={priceFilter}
                    onSelect={setPriceFilter}
                  />
                  <FilterDropdown
                    label="Sort"
                    options={SORT_OPTIONS}
                    selected={sortBy !== "Recommended" ? sortBy : ""}
                    onSelect={(v) => setSortBy(v || "Recommended")}
                  />
                  {(priceFilter || sortBy !== "Recommended" || activeCategory) && (
                    <button onClick={() => { setPriceFilter(""); setSortBy("Recommended"); setActiveCategory(""); setSearchQuery(""); }}
                      style={{background:"#111",color:"#fff",border:"none",padding:"9px 14px",fontSize:11,fontWeight:700,cursor:"pointer",letterSpacing:.5,textTransform:"uppercase",fontFamily:"'Inter',sans-serif",borderRadius:2}}>
                      CLEAR ×
                    </button>
                  )}
                </div>
              </div>

              {displayJerseys.length > 0 ? (
                <div className="jersey-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:16}}>
                  {displayJerseys.map(j => (
                    <JerseyCard
                      key={j.id}
                      jersey={j}
                      onAdd={handleAddToCart}
                      onWishlist={handleWishlist}
                      wishlisted={wishlistItems.some(w => w.id === j.id)}
                    />
                  ))}
                </div>
              ) : (
                <div style={{textAlign:"center",padding:"60px 24px",background:"#f9f9f9",border:"1.5px solid #eee",borderRadius:4}}>
                  <div style={{fontSize:40,marginBottom:12}}>🔍</div>
                  <p style={{color:"#888",fontSize:16,marginBottom:6}}>No jerseys found</p>
                  <p style={{color:"#bbb",fontSize:13,marginBottom:20}}>Try a different search or clear your filters</p>
                  <button className="primary-btn" onClick={() => { setActiveCategory(""); setSearchQuery(""); setPriceFilter(""); setSortBy("Recommended"); }}>CLEAR FILTERS</button>
                </div>
              )}
            </div>
          </section>

          {/* ══ CUSTOM PROMO BANNER ═════════════════════════════ */}
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

          {/* ══ SHOP SECTION (duplicate grid for #shop anchor) ══ */}
          <section id="shop" style={{maxWidth:1300,margin:"0 auto",padding:"64px 24px 0"}}>
            <div style={{marginBottom:8}}>
              <span className="section-label">International Jerseys</span>
              <h2 className="section-title">ALL JERSEYS</h2>
            </div>
          </section>

          {/* ══ CUSTOM JERSEY ═══════════════════════════════════ */}
          <section id="custom" className="section-padding" style={{borderTop:"1px solid #eee",padding:"64px 24px",background:"#f9f9f9"}}>
            <div style={{maxWidth:1300,margin:"0 auto"}}>
              <div style={{textAlign:"center",marginBottom:48}}>
                <span className="section-label">✏️ PERSONALISE YOUR KIT</span>
                <h2 className="section-title">CREATE YOUR CUSTOM JERSEY</h2>
                <p className="section-sub" style={{maxWidth:480,margin:"8px auto 0"}}>Your name. Your number. Any jersey. Ready in 3–5 days.</p>
              </div>
              <div className="custom-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:48,alignItems:"center"}}>
                <div className="custom-player-imgs" style={{display:"flex",justifyContent:"center",alignItems:"flex-end",gap:0,height:400,position:"relative"}}>
                  <img src={messi}   alt="Messi"   style={{height:380,width:220,objectFit:"cover",objectPosition:"top",filter:"brightness(0.9)"}}/>
                  <img src={ronaldo} alt="Ronaldo" style={{height:380,width:200,objectFit:"cover",objectPosition:"top",zIndex:2,position:"relative",margin:"0 -1px",boxShadow:"0 0 40px rgba(0,0,0,0.15)"}}/>
                  <img src={neymar}  alt="Neymar"  style={{height:380,width:220,objectFit:"cover",objectPosition:"top",filter:"brightness(0.9)"}}/>
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
                  <button onClick={handleSubmitCustom}
                    disabled={!customName.trim() || !customNumber.trim()}
                    style={{
                      width:"100%", border:"none", padding:"15px",
                      fontSize:14, fontWeight:800, letterSpacing:1,
                      background: orderSubmitted ? "#25D366" : "#111",
                      color:"#fff",
                      cursor:(!customName.trim()||!customNumber.trim()) ? "not-allowed" : "pointer",
                      opacity:(!customName.trim()||!customNumber.trim()) ? 0.4 : 1,
                      textTransform:"uppercase", fontFamily:"'Inter',sans-serif",
                      transition:"background .3s, opacity .2s",
                    }}>
                    {orderSubmitted ? "✓ Opening WhatsApp…" : "💬 SUBMIT VIA WHATSAPP"}
                  </button>
                  <p style={{fontSize:12,color:"#aaa",marginTop:12,textAlign:"center"}}>Opens WhatsApp to confirm your custom order</p>
                </div>
              </div>
            </div>
          </section>

          {/* ══ WHY CHOOSE ══════════════════════════════════════ */}
          <section className="section-padding" style={{padding:"56px 24px",background:"#fff",borderTop:"1px solid #eee"}}>
            <div style={{maxWidth:1300,margin:"0 auto"}}>
              <div style={{textAlign:"center",marginBottom:40}}>
                <span className="section-label">✅ OUR PROMISE</span>
                <h2 className="section-title">WHY JERSEY FACTORY?</h2>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:20}}>
                {[
                  { icon:"🏅", title:"Premium Quality", desc:"High-quality polyester — breathable, durable, match-ready." },
                  { icon:"✏️", title:"Custom Printing",  desc:"Your name & number printed sharp in 3–5 days." },
                  { icon:"🚚", title:"Fast Delivery",    desc:"Tracked shipping to every corner of India." },
                  { icon:"💬", title:"WhatsApp Order",   desc:"No checkout hassle — just message and we handle the rest." },
                  { icon:"💰", title:"Best Prices",      desc:"Authentic quality at prices that don't break the bank." },
                  { icon:"🔄", title:"Easy Returns",     desc:"Not happy? We make it right within 7 days." },
                ].map(({icon,title,desc}) => (
                  <div key={title} className="why-card" style={{background:"#f9f9f9",border:"1.5px solid #eee",padding:"24px 20px",borderRadius:4}}>
                    <div style={{fontSize:30,marginBottom:10}}>{icon}</div>
                    <h3 style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:800,color:"#111",marginBottom:6,letterSpacing:.3,textTransform:"uppercase"}}>{title}</h3>
                    <p style={{color:"#777",lineHeight:1.6,fontSize:13}}>{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ══ CONTACT ═════════════════════════════════════════ */}
          <section id="contact" className="section-padding" style={{maxWidth:1300,margin:"0 auto",padding:"64px 24px",textAlign:"center"}}>
            <span className="section-label">REACH OUT</span>
            <h2 className="section-title" style={{marginBottom:40}}>CONTACT US</h2>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:16,maxWidth:800,margin:"0 auto"}}>
              {[
                {icon:"📞", label:"Phone",    value:"9363964260",         href:"tel:9363964260"},
                {icon:"📧", label:"Email",    value:"abusahel40@gmail.com", href:"mailto:abusahel40@gmail.com"},
                {icon:"📍", label:"Location", value:"Devala",              href:null},
                {icon:"💬", label:"WhatsApp", value:"9363964260",         href:"https://wa.me/919363964260"},
              ].map(({icon,label,value,href}) => (
                <div key={label}
                  onClick={() => href && window.open(href,"_blank","noopener,noreferrer")}
                  style={{
                    background:"#f9f9f9", border:"1.5px solid #eee",
                    padding:"28px 18px", cursor: href ? "pointer" : "default",
                    transition:"box-shadow .2s, transform .2s", borderRadius:4,
                  }}
                  onMouseEnter={e => { if(href){ e.currentTarget.style.boxShadow="0 6px 20px rgba(0,0,0,0.08)"; e.currentTarget.style.transform="translateY(-2px)"; } }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow=""; e.currentTarget.style.transform=""; }}
                >
                  <div style={{fontSize:28,marginBottom:10}}>{icon}</div>
                  <p style={{fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"#bbb",marginBottom:6}}>{label}</p>
                  <p style={{color:"#111",fontWeight:700,fontSize:13}}>{value}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ══ REVIEWS ═════════════════════════════════════════ */}
          <section className="section-padding" style={{padding:"56px 24px",background:"#f9f9f9",borderTop:"1px solid #eee"}}>
            <div style={{maxWidth:1300,margin:"0 auto"}}>
              <div style={{textAlign:"center",marginBottom:40}}>
                <span className="section-label">⭐ REAL CUSTOMERS</span>
                <h2 className="section-title">WHAT FANS ARE SAYING</h2>
                <p className="section-sub">Over 10,000 happy fans across India</p>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:16}}>
                {REVIEWS.map((r,i) => (
                  <div key={i} className="review-card" style={{background:"#fff",border:"1.5px solid #eee",padding:"22px 18px",borderRadius:4}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <span style={{fontSize:26}}>{r.avatar}</span>
                        <div>
                          <div style={{fontWeight:700,fontSize:13,color:"#111"}}>{r.name}</div>
                          <div style={{fontSize:11,color:"#999",marginTop:2}}>📍 {r.location}</div>
                        </div>
                      </div>
                      <Stars count={r.rating}/>
                    </div>
                    <p style={{color:"#555",lineHeight:1.65,fontSize:13}}>"{r.text}"</p>
                    <div style={{marginTop:12,borderTop:"1px solid #f0f0f0",paddingTop:10}}>
                      <span style={{fontSize:10,color:"#bbb",fontWeight:700,letterSpacing:1,textTransform:"uppercase"}}>Verified Purchase ✓</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ══ FOOTER ══════════════════════════════════════════ */}
          <footer style={{borderTop:"1px solid #222",background:"#111",padding:"32px 24px",textAlign:"center"}}>
            <div style={{maxWidth:1300,margin:"0 auto"}}>
              <div style={{display:"flex",alignItems:"baseline",justifyContent:"center",marginBottom:12}}>
                <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:900,color:"#e84747",letterSpacing:2,textTransform:"uppercase"}}>JERSEY</span>
                <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:400,color:"rgba(255,255,255,0.4)",letterSpacing:3}}>&nbsp;FACTORY</span>
              </div>
              <div style={{display:"flex",justifyContent:"center",gap:24,marginBottom:16,flexWrap:"wrap"}}>
                {[{label:"Shop",id:"shop"},{label:"Custom",id:"custom"},{label:"Contact",id:"contact"}].map(l => (
                  <button key={l.label} onClick={() => scrollTo(l.id,l.label)}
                    style={{background:"none",border:"none",color:"rgba(255,255,255,0.4)",fontSize:12,cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:600,letterSpacing:1,textTransform:"uppercase"}}>
                    {l.label}
                  </button>
                ))}
              </div>
              <p style={{color:"rgba(255,255,255,0.2)",fontSize:11,marginBottom:4}}>Premium football jerseys for fans across India</p>
              <p style={{color:"rgba(255,255,255,0.12)",fontSize:10}}>© {new Date().getFullYear()} Jersey Factory · Devala · abusahel40@gmail.com</p>
            </div>
          </footer>

        </div>
      </div>

      {/* ══ OVERLAYS ════════════════════════════════════════════ */}
      {showMobileMenu && <MobileMenu onClose={() => setShowMobileMenu(false)} scrollTo={scrollTo}/>}
      {showCart      && <CartPanel items={cartItems} onClose={() => setShowCart(false)} onRemove={handleRemoveFromCart} cartTotal={cartTotal}/>}
      {showWishlist  && <WishlistPanel items={wishlistItems} onClose={() => setShowWishlist(false)} onRemove={handleRemoveFromWishlist} onAdd={(item) => { handleAddToCart(item); }}/>}
      {showLogin     && <LoginModal onClose={() => setShowLogin(false)} onLogin={(email) => { setLoggedIn(true); setUserEmail(email); }}/>}
    </>
  );
}