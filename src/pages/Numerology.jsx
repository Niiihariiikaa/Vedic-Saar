import { useState, useEffect, useRef } from "react";
import SplashCursor from "../components/SplashCursor";
import ScrollStack, { ScrollStackItem } from "../components/ScrollStack";
import CircularGallery from "../components/CircularGallery";
import { Hash, Compass, Type, Smartphone, Home } from "lucide-react";

/* ── Scroll Manager ─────────────────────────────────────────────────────────── */
let _scrollY = 0;
let _ticking = false;
let _scrollInitialized = false;
const _listeners = new Set();

function subscribeScroll(fn) {
  if (!_scrollInitialized && typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      _scrollY = window.scrollY;
      if (!_ticking) {
        requestAnimationFrame(() => { _listeners.forEach(f => f(_scrollY)); _ticking = false; });
        _ticking = true;
      }
    }, { passive: true });
    _scrollInitialized = true;
  }
  _listeners.add(fn);
  return () => _listeners.delete(fn);
}

const gold = "#c9a96e";
const dark = "#1a1410";
const HEADING_SIZE = "clamp(36px,3.8vw,52px)";

const dashedBtn = (color = dark) => ({
  background: "transparent",
  color,
  border: `2px dashed ${color}`,
  fontSize: 12,
  letterSpacing: 2,
  padding: "15px 44px",
  cursor: "pointer",
  textTransform: "uppercase",
  fontFamily: "'Glacial Indifference', sans-serif",
  fontWeight: 500,
  transition: "all 0.3s",
  whiteSpace: "nowrap",
});

const tilt = {
  onMouseEnter(e) { const el = e.currentTarget; el.style.willChange = "transform"; el._tiltRect = el.getBoundingClientRect(); },
  onMouseMove(e) {
    const el = e.currentTarget;
    const r  = el._tiltRect || el.getBoundingClientRect();
    const x  = (e.clientX - r.left) / r.width  - 0.5;
    const y  = (e.clientY - r.top)  / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * 12}deg) rotateX(${y * -12}deg) scale3d(1.025,1.025,1.025)`;
  },
  onMouseLeave(e) {
    const el = e.currentTarget;
    el.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)";
    el.style.willChange = "auto"; el._tiltRect = null;
  },
};

function useReveal(ref) {
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const obs = new IntersectionObserver(
      entries => entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("vis"); obs.unobserve(en.target); } }),
      { threshold: 0.08, rootMargin: "-10px" }
    );
    c.querySelectorAll(".rv").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ── GLOBAL CSS ─────────────────────────────────────────────────────────────── */
const globalCss = `
  @import url('https://fonts.googleapis.com/css2?family=Ibarra+Real+Nova:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&display=swap');
  @import url('https://fonts.cdnfonts.com/css/glacial-indifference-2');

  * { margin:0; padding:0; box-sizing:border-box; -webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale; }
  body { background:#fff; color:#1a1410; }
  html { scroll-behavior:smooth; }

  @keyframes twinkle  { from { opacity:0.05; } to { opacity:0.6; } }
  @keyframes floatUp  { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
  @keyframes spinSlow { to { transform:rotate(360deg); } }
  @keyframes drift    { 0%{transform:translateY(0px);} 50%{transform:translateY(-12px);} 100%{transform:translateY(0px);} }

  .rv { opacity:0; transform:translateY(28px); transition:opacity 0.65s cubic-bezier(.22,1,.36,1),transform 0.65s cubic-bezier(.22,1,.36,1); }
  .rv.vis { opacity:1; transform:translateY(0); }
  .card-3d { transform-style:preserve-3d; transition:transform 0.15s ease,box-shadow 0.2s ease; }

  @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
  .why-card { animation:fadeUp 0.6s ease both; transform-style:preserve-3d; }
  .why-card:nth-child(1) { animation-delay:0.1s; }
  .why-card:nth-child(2) { animation-delay:0.22s; }
  .why-card:nth-child(3) { animation-delay:0.34s; }
  .why-card:hover { border-color:${gold} !important; box-shadow:0 20px 50px rgba(201,169,110,0.16) !important; }

  .benefit-row { display:flex; gap:14px; align-items:flex-start; padding:12px 16px; background:rgba(255,255,255,0.5); border:0.5px solid rgba(201,169,110,0.14); transition:background 0.2s,border-color 0.2s; cursor:default; }
  .benefit-row:hover { background:#fff; border-color:rgba(201,169,110,0.5); }

  .step-row { display:flex; gap:20px; align-items:flex-start; padding:26px 0; border-bottom:1px solid rgba(26,20,16,0.07); transition:padding-left 0.2s; cursor:default; }
  .step-row:hover { padding-left:10px; }
  .step-num { width:44px; height:44px; border:1px solid rgba(201,169,110,0.5); border-radius:50%; display:flex; align-items:center; justify-content:center; font-family:'Ibarra Real Nova',serif; font-size:13px; color:${gold}; background:rgba(201,169,110,0.06); flex-shrink:0; margin-top:3px; transition:background 0.3s,color 0.3s,box-shadow 0.3s; }
  .step-row:hover .step-num { background:${gold}; color:#fff; box-shadow:0 0 0 5px rgba(201,169,110,0.15); }

  .num-row { display:flex; gap:32px; align-items:flex-start; padding:32px 0; border-bottom:1px solid rgba(201,169,110,0.15); transition:padding-left 0.22s cubic-bezier(.22,1,.36,1),background 0.2s; cursor:default; }
  .num-row:first-child { border-top:1px solid rgba(201,169,110,0.15); }
  .num-row:hover { padding-left:12px; }
  .num-glyph { width:64px; height:64px; border:1px solid rgba(201,169,110,0.35); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:28px; background:rgba(201,169,110,0.05); flex-shrink:0; margin-top:4px; transition:background 0.3s,border-color 0.3s,box-shadow 0.3s; }
  .num-row:hover .num-glyph { background:rgba(201,169,110,0.12); border-color:${gold}; box-shadow:0 0 0 5px rgba(201,169,110,0.1); }

  .who-row { display:flex; align-items:flex-start; gap:14px; padding:16px 0; border-bottom:1px solid rgba(26,20,16,0.1); transition:padding-left 0.22s cubic-bezier(.22,1,.36,1); cursor:default; }
  .who-row:hover { padding-left:10px; }

  .acc-item { border-bottom:1px solid rgba(26,20,16,0.1); }
  .acc-btn  { width:100%; background:none; border:none; cursor:pointer; display:flex; align-items:center; gap:12px; padding:15px 0; text-align:left; }
  .acc-arrow { font-size:20px; color:${gold}; transition:transform 0.3s; flex-shrink:0; line-height:1; }
  .acc-arrow.open { transform:rotate(90deg); }
  .acc-body { overflow:hidden; transition:max-height 0.35s cubic-bezier(.22,1,.36,1),opacity 0.35s; }

  .strip-row { display:flex; gap:48px; white-space:nowrap; align-items:center; padding:0 40px; will-change:transform; min-width:300vw; height:68px; }
  .strip-row span { font-family:'Ibarra Real Nova',serif; font-size:30px; }
`;

/* ── Accordion ───────────────────────────────────────────────────────────────── */
function AccItem({ title, body }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="acc-item">
      <button className="acc-btn" onClick={() => setOpen(o => !o)}>
        <span className={`acc-arrow${open ? " open" : ""}`}>›</span>
        <span style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 20, color: dark, letterSpacing: 0.4 }}>{title}</span>
      </button>
      <div className="acc-body" style={{ maxHeight: open ? 140 : 0, opacity: open ? 1 : 0 }}>
        <p style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 14, color: "#7a6e68", lineHeight: 1.75, paddingBottom: 14, paddingLeft: 32 }}>{body}</p>
      </div>
    </div>
  );
}

/* ── HERO ────────────────────────────────────────────────────────────────────── */
function Hero() {
  const crystalRef = useRef(null);
  const moonRef    = useRef(null);
  useEffect(() => {
    return subscribeScroll((y) => {
      if (y > window.innerHeight * 1.5) return;
      if (crystalRef.current) crystalRef.current.style.transform = `translate3d(0, ${y * 0.25}px, 0)`;
      if (moonRef.current)    moonRef.current.style.transform    = `translate3d(0, ${y * 0.18}px, 0)`;
    });
  }, []);

  return (
    <section style={{
      position: "relative", minHeight: "100vh",
      display: "flex", alignItems: "flex-start", justifyContent: "center",
      textAlign: "center", background: "white",
      backgroundImage: 'url("/assets/vedicbg.svg")', backgroundSize: "cover",
      
      overflow: "visible", padding: "160px 40px 80px",
    }}>
      <div ref={crystalRef} style={{ position: "absolute", left: "-40px", bottom: "60px", width: 320, height: 420, transform: "translate3d(0,0,0)", willChange: "transform", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", pointerEvents: "none", zIndex: 40, opacity: 0.85 }}>
        <img src="/assets/beigecrystal.png" alt="" decoding="async" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </div>
      <div ref={moonRef} style={{ position: "absolute", right: "-20px", top: "90px", width: 200, height: 300, transform: "translate3d(0,0,0)", willChange: "transform", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", pointerEvents: "none", zIndex: 1, opacity: 0.80 }}>
        <img src="/assets/moon.png" alt="" decoding="async" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </div>

      <div style={{ position: "relative", zIndex: 2, maxWidth: 700, marginBottom: -180, transform: "translateY(-80px)" }}>
        <div style={{ fontFamily: "'Ibarra Real Nova', serif", fontWeight: 450, display: "inline-block", fontSize: 70, color: "black", padding: "6px 20px", marginBottom: 137, animation: "floatUp 0.8s ease forwards" }}>
          Numerology
        </div>

        <h1 style={{ marginTop: 80, fontFamily: "'Ibarra Real Nova', serif", fontSize: HEADING_SIZE, fontWeight: 400, lineHeight: 1.15, color: "black", marginBottom: 40, animation: "floatUp 0.8s 0.2s ease both" }}>
          Discover the Hidden Power of Numbers —<br />
          <em style={{ color: gold, fontStyle: "italic" }}>Your Life's Blueprint Awaits</em>
        </h1>
        <p style={{ fontSize: 20, color: "#9b8fa0", lineHeight: 1.8, marginBottom: 10, fontFamily: "'Glacial Indifference', sans-serif", animation: "floatUp 0.8s 0.4s ease both" }}>
          At Vedic Saar, we believe your destiny isn't random. It's written in numbers.
        </p>
        <p style={{ fontSize: 20, color: gold, fontStyle: "italic", marginBottom: 44, fontFamily: "'Ibarra Real Nova', serif", animation: "floatUp 0.8s 0.5s ease both" }}>
          Every number carries a cosmic frequency that shapes your relationships, career, health, and wealth.
        </p>
        <button
          style={{ ...dashedBtn(dark), animation: "floatUp 0.8s 0.6s ease both" }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = gold; e.currentTarget.style.color = gold; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = dark; e.currentTarget.style.color = dark; }}>
          Book Your Consultation →
        </button>
      </div>
    </section>
  );
}

/* ── CONSTELLATION OVERLAY ──────────────────────────────────────────────────── */
function ConstellationOverlay() {
  return (
    <div style={{ position: "relative", height: "0px", zIndex: 20 }}>
      <img src="/assets/costelation.png" alt="" loading="lazy" decoding="async" style={{ position: "absolute", top: "-120px", left: "70%", transform: "translateX(-50%)", width: "600px", opacity: 0.5, pointerEvents: "none" }} />
    </div>
  );
}

/* ── SLIDING STRIP ───────────────────────────────────────────────────────────── */
function SlidingStrip() {
  const topRowRef = useRef(null);
  const botRowRef = useRef(null);
  useEffect(() => {
    return subscribeScroll((y) => {
      if (topRowRef.current) topRowRef.current.style.transform = `translateX(-${y * 0.2}px)`;
      if (botRowRef.current) botRowRef.current.style.transform = `translateX(calc(-700px + ${y * 0.2}px))`;
    });
  }, []);

  const top = ["✦ Birth Number", "✦ Life Path Number", "✦ Name Number", "✦ Mobile Number", "✦ House Number", "✦ Expression Number", "✦ Soul Urge", "✦ Karmic Debt"];
  const bot = ["✶ Name Correction", "✶ Lucky Dates", "✶ Personal Year", "✶ Business Name", "✶ Compatibility", "✶ Favorable Timing", "✶ Master Numbers", "✶ Yearly Forecast"];
  const topRow = [...top,...top,...top,...top,...top];
  const botRow = [...bot,...bot,...bot,...bot,...bot];
  const fadeEdge = "linear-gradient(90deg, transparent 0%, black 7%, black 93%, transparent 100%)";

  return (
    <div style={{ overflow: "hidden", position: "relative" }}>
      <div style={{ position: "relative", background: "rgba(233,228,220,0.65)", borderTop: "1px solid rgba(201,169,110,0.2)", borderBottom: "1px solid rgba(201,169,110,0.15)", WebkitMaskImage: fadeEdge, maskImage: fadeEdge }}>
        <div ref={topRowRef} className="strip-row" style={{ color: "#2a1f1a" }}>
          {topRow.map((t, i) => <span key={i}>{t}</span>)}
        </div>
      </div>
      <div style={{ position: "relative", background: "rgba(17,17,17,0.78)", borderBottom: "1px solid rgba(201,169,110,0.12)", WebkitMaskImage: fadeEdge, maskImage: fadeEdge }}>
        <div ref={botRowRef} className="strip-row" style={{ color: "rgba(255,255,255,0.80)" }}>
          {botRow.map((t, i) => <span key={i}>{t}</span>)}
        </div>
      </div>
    </div>
  );
}

/* ── WHAT IS NUMEROLOGY ──────────────────────────────────────────────────────── */
function WhatIsSection() {
  const sectionRef = useRef(null);
  const wheelRef   = useRef(null);
  const bodyRef    = useRef(null);
  useReveal(bodyRef);

  useEffect(() => {
    const s = sectionRef.current;
    const w = wheelRef.current;
    if (!s || !w) return;
    let topOffset = s.getBoundingClientRect().top + window.scrollY;
    const onResize = () => { topOffset = s.getBoundingClientRect().top + window.scrollY; };
    window.addEventListener("resize", onResize, { passive: true });
    const sHeight = s.offsetHeight;
    const unsub = subscribeScroll((y) => {
      if (y > topOffset + sHeight || y + window.innerHeight < topOffset) return;
      const scrolledPast = y - topOffset;
      w.style.transform = `translate3d(-200px, 0, 0) rotateZ(${Math.max(0, scrolledPast) / 4}deg)`;
    });
    return () => { unsub(); window.removeEventListener("resize", onResize); };
  }, []);

  return (
    <section ref={sectionRef} style={{
      padding: "130px 80px 140px", overflow: "hidden", position: "relative", contain: "paint",
      background: `url("/assets/vedic2bg.svg") bottom / cover no-repeat, #faf8f5`, 
    }}>
      <div style={{ position: "absolute", bottom: 0, left: 0, width: 900, height: 300, background: "radial-gradient(ellipse at bottom left, rgba(201,169,110,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 0, right: 0, width: 600, height: 400, background: "radial-gradient(ellipse at top right, rgba(201,169,110,0.06) 0%, transparent 65%)", pointerEvents: "none" }} />

      <div ref={bodyRef} style={{
        maxWidth: 1200, marginTop: -100,
        display: "grid", gridTemplateColumns: "1fr 1.25fr",
        gap: 200, alignItems: "center", position: "relative", zIndex: 50,
      }}>
        {/* LEFT — wheel */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          <img
            ref={wheelRef}
            src="/assets/num.png"
            alt="Numerology Wheel"
            style={{ width: "250%", maxWidth: "none", height: "auto", display: "block", transformOrigin: "center", willChange: "transform", transform: "translate3d(-200px, 0, 0)", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", position: "relative", zIndex: 1 }}
          />
        </div>

        {/* RIGHT */}
        <div style={{ paddingTop: 8 }}>
          <div className="rv" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
            <span style={{ width: 28, height: 1, background: gold }} />
            <span style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: gold }}>Ancient Vedic Science</span>
          </div>
          <h2 className="rv" style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: HEADING_SIZE, fontWeight: 400, color: dark, lineHeight: 1.1, marginBottom: 16, transitionDelay: "0.08s" }}>
            What is<br />Numerology?
          </h2>
          <p className="rv" style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 37, color: gold, fontStyle: "italic", marginBottom: 36, transitionDelay: "0.12s" }}>
            The Language of Numbers
          </p>
          <p className="rv" style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 22, color: "#6b5f5e", lineHeight: 1.95, marginBottom: 20, transitionDelay: "0.16s" }}>
            Rooted in thousands of years of Indian wisdom, numerology is the study of the mystical relationship between numbers and the events that govern your life. Every letter in your name and every digit in your birth date carries a vibrational signature.
          </p>
          <p className="rv" style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 22, color: "#6b5f5e", lineHeight: 1.95, marginBottom: 40, transitionDelay: "0.2s" }}>
            When decoded together, these vibrations reveal your personality, strengths, hidden challenges, and soul's true purpose — with remarkable precision.
          </p>
          <div className="rv" style={{ borderLeft: `3px solid ${gold}`, padding: "20px 26px", background: `${gold}0a`, marginBottom: 44, transitionDelay: "0.24s" }}>
            <p style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 20, color: "#7a6460", lineHeight: 1.85, fontStyle: "italic" }}>
              Every number around you — your name, birth date, phone number, house number — carries a cosmic frequency that shapes your entire life.
            </p>
          </div>
          <div className="rv" style={{ transitionDelay: "0.28s" }}>
            <AccItem title="Birth & Life Path Numbers" body="Derived from your date of birth, these reveal your natural personality, life's overarching purpose, and why certain phases feel effortless while others feel like a struggle." />
            <AccItem title="Name & Mobile Number Vibration" body="Every alphabet carries a numerical value. A name or mobile number misaligned with your core numbers creates invisible resistance — even when you're doing everything right." />
          </div>
          <div className="rv" style={{ marginTop: 44, transitionDelay: "0.32s" }}>
            <button
              style={dashedBtn(dark)}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = gold; e.currentTarget.style.color = gold; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = dark; e.currentTarget.style.color = dark; }}>
              Book Your Consultation →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── KEY NUMBERS ─────────────────────────────────────────────────────────────── */
function KeyNumbersSection() {
  const numbers = [
    { icon: Hash,       label: "Birth Number",    sub: "Who You Are at the Core",      desc: "Derived from your date of birth, this number reveals your natural personality, talents, and the energy you carry through life. It influences how you think, the relationships you attract, and the career paths where you truly thrive.", bg: "#faf8f5" },
    { icon: Compass,    label: "Life Path Number", sub: "Your Cosmic Roadmap",           desc: "The most important number in Vedic numerology. Calculated from your full date of birth, it reveals your life's overarching purpose, the lessons your soul came to learn, and why certain phases feel effortless while others feel like a struggle.", bg: "#f7f2ea" },
    { icon: Type,       label: "Name Number",      sub: "The Vibration You Project",     desc: "Every alphabet carries a numerical value. Your name, when converted into numbers, reveals the energy you broadcast to the world. A name misaligned with your Birth or Life Path Number creates invisible resistance — repeated failures and blocked opportunities.", bg: "#fdf8f0" },
    { icon: Smartphone, label: "Mobile Number",    sub: "Energy You Carry Every Day",   desc: "Your phone number is not just a contact detail — you interact with it dozens of times daily. When its vibration clashes with your personal numbers, it can subtly drain your energy, invite miscommunication, and block financial growth.", bg: "#f7f2ea" },
    { icon: Home,       label: "House Number",     sub: "The Energy of Your Space",     desc: "Where you live carries a numerological vibration that affects your health, peace of mind, family relationships, and financial stability. Understanding your house number helps you choose the right home and create a space that truly supports your goals.", bg: "#faf8f5" },
  ];

  return (
    <section style={{
      position: "relative", overflow: "hidden",
      background: `url("/assets/vedic3bg.svg") center / cover no-repeat, linear-gradient(0deg, #f2ece0 0%, #fdf8f0 55%, #faf8f5 100%)`,
    }}>
      <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "80%", height: 280, background: "radial-gradient(ellipse at top center, rgba(201,169,110,0.08) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "80%", height: 300, background: "radial-gradient(ellipse at bottom center, rgba(201,169,110,0.11) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "absolute", top: "40%", left: 0, width: 400, height: 400, background: "radial-gradient(ellipse at center left, rgba(201,169,110,0.05) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "absolute", top: "40%", right: 0, width: 400, height: 400, background: "radial-gradient(ellipse at center right, rgba(201,169,110,0.05) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      {/* Section heading — above the scroll stack */}
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "100px 72px 0", position: "relative", zIndex: 1, textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginBottom: 16 }}>
          <span style={{ width: 28, height: 1, background: gold }} />
          <span style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: gold }}>Your Numerological Blueprint</span>
          <span style={{ width: 28, height: 1, background: gold }} />
        </div>
        <h2 style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: HEADING_SIZE, fontWeight: 400, color: dark, lineHeight: 1.1, marginBottom: 14 }}>
          The Significance of<br />Your Key Numbers
        </h2>
        <p style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 22, color: "#7a6e68", margin: "0 auto", maxWidth: 540, lineHeight: 1.8 }}>
          Every number in your life carries meaning. Together, they tell the complete story of who you are.
        </p>
      </div>

      <ScrollStack
        itemDistance={60}
        itemScale={0.04}
        itemStackDistance={20}
        stackPosition="15%"
        scaleEndPosition="8%"
        baseScale={0.88}
      >
        {numbers.map((n, i) => (
          <ScrollStackItem key={i}>
            <div style={{
              background: "#fff",
              borderRadius: 32,
              border: `1px solid rgba(201,169,110,0.25)`,
              padding: "48px 56px",
              display: "flex",
              gap: 40,
              alignItems: "flex-start",
            }}>
              <div style={{
                width: 72, height: 72, flexShrink: 0,
                border: `1.5px solid rgba(201,169,110,0.4)`,
                borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "rgba(201,169,110,0.07)",
                marginTop: 4,
                color: gold,
              }}>
                <n.icon size={28} strokeWidth={1.5} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 18, marginBottom: 14, flexWrap: "wrap" }}>
                  <h3 style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 30, fontWeight: 600, color: dark, lineHeight: 1.15 }}>{n.label}</h3>
                  <span style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 11, letterSpacing: 2.5, textTransform: "uppercase", color: gold }}>{n.sub}</span>
                </div>
                <p style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 19, color: "#7a6e68", lineHeight: 1.85, maxWidth: 680 }}>{n.desc}</p>
              </div>
            </div>
          </ScrollStackItem>
        ))}
      </ScrollStack>
    </section>
  );
}

const IMPACT_AREAS = [
  { label: "Career & Business",   desc: "Find your most aligned profession and ensure your business name attracts success and opportunity.",   bg: "#fff" },
  { label: "Love & Relationships", desc: "Understand deep compatibility beyond sun signs and navigate karmic bonds with clarity.",              bg: "#fff" },
  { label: "Wealth & Finance",     desc: "Know the right time to invest, launch, or consolidate — working with your personal vibration.",      bg: "#fff" },
  { label: "Health",               desc: "Identify numerological vulnerabilities before they manifest and strengthen your wellbeing.",          bg: "#fff" },
  { label: "Child Naming",         desc: "Give your child a name that sets them up for confidence, ease, and a life in alignment.",             bg: "#fff" },
];

const SIGNS = [
  "You work hard but success always feels out of reach",
  "Your relationships repeat the same painful patterns",
  "You're planning a major decision — business, marriage, or relocation",
  "You want to rename yourself, your child, or your business",
  "You feel something in your life is persistently \"off\"",
];

function makeAreaCanvas(label, desc, bg, index) {
  const W = 800, H = 600;
  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d");
  const cx = W / 2;

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // gold bar — centered
  ctx.fillStyle = "#c9a96e";
  ctx.fillRect(cx - 22, 60, 44, 3);

  // number — centered
  ctx.textAlign = "center";
  ctx.font = "500 15px 'Glacial Indifference', sans-serif";
  ctx.fillStyle = "#c9a96e";
  ctx.fillText(`0${index + 1}`, cx, 108);

  // label — centered, word wrap at 40px
  ctx.font = "bold 42px 'Ibarra Real Nova', serif";
  ctx.fillStyle = "#1a1410";
  const words = label.split(" ");
  const maxW = W - 120;
  let lines = [], current = "";
  for (const w of words) {
    const test = current ? current + " " + w : w;
    if (ctx.measureText(test).width > maxW && current) {
      lines.push(current); current = w;
    } else { current = test; }
  }
  lines.push(current);
  const labelStartY = lines.length > 1 ? 188 : 210;
  lines.forEach((l, li) => ctx.fillText(l, cx, labelStartY + li * 54));

  // divider
  const divY = labelStartY + lines.length * 54 + 22;
  ctx.strokeStyle = "rgba(201,169,110,0.3)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(80, divY); ctx.lineTo(W - 80, divY);
  ctx.stroke();

  // description — centered word wrap at 20px
  ctx.font = "20px 'Glacial Indifference', sans-serif";
  ctx.fillStyle = "#7a6e68";
  const dwords = desc.split(" ");
  let dline = "", dy = divY + 46;
  for (const w of dwords) {
    const test = dline ? dline + " " + w : w;
    if (ctx.measureText(test).width > maxW && dline) {
      ctx.fillText(dline, cx, dy);
      dline = w; dy += 34;
    } else { dline = test; }
  }
  ctx.fillText(dline, cx, dy);

  return canvas.toDataURL();
}

/* ── HOW IT IMPACTS LIFE ─────────────────────────────────────────────────────── */
function ImpactSection() {
  const [galleryItems, setGalleryItems] = useState([]);
  const bodyRef = useRef(null);
  useReveal(bodyRef);

  useEffect(() => {
    document.fonts.ready.then(() => {
      const items = IMPACT_AREAS.map((a, i) => ({
        image: makeAreaCanvas(a.label, a.desc, a.bg, i),
        text: "",
      }));
      setGalleryItems(items);
    });
  }, []);

  return (
    <section style={{
      overflow: "hidden", position: "relative",
      background: "linear-gradient(180deg, #f2ece0 0%, #fdf8f0 60%, #faf8f5 100%)",
    }}>
      <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "80%", height: 300, background: "radial-gradient(ellipse at top center, rgba(201,169,110,0.09) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* ── HEADING ── */}
      <div ref={bodyRef} style={{ maxWidth: 1160, margin: "0 auto", padding: "100px 72px 48px", textAlign: "center" }}>
        <div className="rv" style={{ marginBottom: 18 }}>
          <span style={{
            display: "inline-block",
            fontFamily: "'Ibarra Real Nova', serif",
            fontSize: 28,
            color: gold,
            lineHeight: 1,
            transform: "scaleX(1.4)",
            letterSpacing: -2,
            opacity: 0.7,
          }}>∧</span>
        </div>
        <div className="rv" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginBottom: 16, transitionDelay: "0.04s" }}>
          <span style={{ width: 28, height: 1, background: gold }} />
          <span style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: gold }}>Every Area of Life</span>
          <span style={{ width: 28, height: 1, background: gold }} />
        </div>
        <h2 className="rv" style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: HEADING_SIZE, fontWeight: 400, color: dark, lineHeight: 1.1, marginBottom: 14, transitionDelay: "0.08s" }}>
          How Numerology<br />Impacts Your Life
        </h2>
        <p className="rv" style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 20, color: "#7a6e68", lineHeight: 1.85, maxWidth: 520, margin: "0 auto", transitionDelay: "0.14s" }}>
          Numbers touch every dimension of your existence — once decoded, nothing feels random again.
        </p>
      </div>

      {/* ── CIRCULAR GALLERY ── */}
      {galleryItems.length > 0 && (
        <div style={{ height: 560, position: "relative", marginBottom: 80 }}>
          <CircularGallery
            items={galleryItems}
            bend={1}
            textColor="rgba(0,0,0,0)"
            borderRadius={0.06}
            scrollSpeed={2}
            scrollEase={0.05}
          />
        </div>
      )}

      {/* ── SIGNS — ScrollStack on dark bg ── */}
      <div style={{ padding: "0 72px 0", maxWidth: 1160, margin: "0 auto", position: "relative" }}>
        <img
          src="/assets/costelation.png"
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          style={{
            position: "absolute", top: "-60px", left: "-40px",
            width: 480, opacity: 0.5, pointerEvents: "none",
            userSelect: "none",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <span style={{ width: 28, height: 1, background: gold }} />
          <span style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: gold }}>Do You Recognise This?</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "end", marginBottom: 16 }}>
          <h2 style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: HEADING_SIZE, fontWeight: 400, color: dark, lineHeight: 1.1 }}>
            Signs You Need<br />a Consultation
          </h2>
          <p style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 19, color: gold, fontStyle: "italic", lineHeight: 1.7, paddingBottom: 6 }}>
            If even one of these resonates — your numbers have a message for you.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 72px 100px" }}>
        {SIGNS.map((s, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "flex-start", gap: 32,
            padding: "28px 0",
            borderBottom: i < SIGNS.length - 1 ? "1px solid rgba(26,20,16,0.08)" : "none",
          }}>
            <span style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 13, color: gold, flexShrink: 0, marginTop: 7, letterSpacing: 2, lineHeight: 1 }}>0{i + 1}</span>
            <p style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: "clamp(20px,1.8vw,26px)", fontWeight: 400, color: dark, lineHeight: 1.6 }}>{s}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── WHAT YOU GET ────────────────────────────────────────────────────────────── */
function ApproachSection() {
  const ref = useRef(null);
  useReveal(ref);

  const steps = [
    { n: "01", title: "Complete Numerology Chart", desc: "Birth, Life Path, Expression & Soul Urge Numbers fully decoded — deep, honest interpretation of every vibration, not surface-level readings." },
    { n: "02", title: "Name & Mobile Number Analysis", desc: "Vibration analysis of your current name and mobile number — with precise corrections if they're creating friction or blocking your growth." },
    { n: "03", title: "Yearly Cycle Forecast", desc: "Know your best windows for action — the right timing for career moves, business launches, relationships, and major life decisions." },
    { n: "04", title: "Practical Remedies & Corrections", desc: "Simple, actionable steps you can apply immediately — number corrections, name adjustments, and personalized guidance for your life's flow." },
    { n: "05", title: "Personalised Q&A", desc: "Dedicated time on career, relationships, finances and health — your specific questions answered with clarity and precision." },
  ];

  return (
    <section style={{
      overflow: "visible", padding: "100px 72px", position: "relative",
      background: "linear-gradient(180deg, #faf8f5 0%, #f2ece0 55%, #f7efe2 100%)",
    }}>
      <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "80%", height: 300, background: "radial-gradient(ellipse at top center, rgba(201,169,110,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "30%", right: 0, width: 500, height: 500, background: "radial-gradient(ellipse at center right, rgba(201,169,110,0.06) 0%, transparent 65%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, width: 600, height: 300, background: "radial-gradient(ellipse at bottom left, rgba(201,169,110,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div ref={ref} style={{ maxWidth: 1160, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 80, alignItems: "start", position: "relative", zIndex: 1 }}>
        <div>
          <div className="rv" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ width: 28, height: 1, background: gold }} />
            <span style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: gold }}>Your Session</span>
          </div>
          <h2 className="rv" style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: HEADING_SIZE, fontWeight: 400, color: dark, lineHeight: 1.12, marginBottom: 24, transitionDelay: "0.08s" }}>
            What You Get at<br /><em style={{ color: gold, fontStyle: "italic" }}>Vedic Saar</em>
          </h2>
          <p className="rv" style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 22, color: "#7a6e68", lineHeight: 1.9, marginBottom: 40, transitionDelay: "0.14s" }}>
            A complete, practical numerology session — not vague predictions but precise, actionable insight tailored entirely to you.
          </p>
          <div className="rv" style={{ borderLeft: `3px solid ${gold}`, padding: "20px 26px", background: `${gold}0a`, marginBottom: 44, transitionDelay: "0.24s" }}>
            <p style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 20, color: "#7a6460", lineHeight: 1.85, fontStyle: "italic" }}>
              "Ancient Wisdom. Modern Clarity. Timeless Results."
            </p>
          </div>
        </div>
        <div>
          {steps.map((s, i) => (
            <div key={i} className="rv step-row" style={{ transitionDelay: `${0.08 + i * 0.1}s` }}>
              <div className="step-num">{s.n}</div>
              <div>
                <h5 style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 22, fontWeight: 600, color: dark, marginBottom: 8 }}>{s.title}</h5>
                <p style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 18, color: "#7a7068", lineHeight: 1.75 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── WHO + CTA ───────────────────────────────────────────────────────────────── */
function WhoAndCTASection() {
  const ref       = useRef(null);
  const mantraRef = useRef(null);
  useReveal(ref);

  useEffect(() => {
    const el = mantraRef.current;
    if (!el) return;
    el.style.animationPlayState = "paused";
    const obs = new IntersectionObserver(
      ([entry]) => { el.style.animationPlayState = entry.isIntersecting ? "running" : "paused"; },
      { threshold: 0.01 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const who = [
    "Feeling stuck or out of alignment with your goals",
    "Planning a new business, brand name, or personal rebrand",
    "Seeking clarity on major decisions — career, finance, relationships",
    "Experiencing repeated patterns or unexplained obstacles",
    "Curious about your life's deeper purpose and direction",
    "Ready to stop reacting and start living with intention",
  ];

  return (
    <section style={{
      position: "relative", overflow: "visible",
      backgroundColor: "#f7efe2",
      backgroundImage: 'url("/assets/vediclast.svg")',
      backgroundSize: "cover", backgroundPosition: "center top",
      backgroundRepeat: "no-repeat",
      padding: "120px 72px 140px",
    }}>

      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 180, background: "linear-gradient(180deg, #f7efe2 0%, transparent 100%)", pointerEvents: "none", zIndex: 2 }} />

      <div ref={mantraRef} style={{ position: "absolute", zIndex: 60, top: "-350px", left: "-250px", width: 980, opacity: 0.07, pointerEvents: "none", animation: "spinSlow 90s linear infinite", willChange: "transform" }}>
        <img src="/assets/mantra-wheel.png" alt="" loading="lazy" decoding="async" style={{ width: "200%", objectFit: "contain" }} />
      </div>
      <div style={{ position: "absolute", top: "-990px", right: "-80px", width: 820, opacity: 0.5, pointerEvents: "none" }}>
        <img src="/assets/crescentmoon.png" alt="" loading="lazy" decoding="async" style={{ width: "100%", objectFit: "contain" }} />
      </div>

      <div ref={ref} style={{ maxWidth: 1160, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 80, marginBottom: 100, alignItems: "start" }}>
          <div>
            <div className="rv" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <span style={{ width: 28, height: 1, background: gold }} />
              <span style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: gold }}>Is This For You?</span>
            </div>
            <h2 className="rv" style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: HEADING_SIZE, fontWeight: 400, color: dark, lineHeight: 1.12, marginBottom: 16, transitionDelay: "0.08s" }}>
              Who Is This<br />Consultation For?
            </h2>
            <p className="rv" style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 18, color: gold, fontStyle: "italic", transitionDelay: "0.14s" }}>
              This is ideal if you are:
            </p>
          </div>
          <div style={{ paddingTop: 6 }}>
            {who.map((item, i) => (
              <div key={i} className="rv who-row" style={{ transitionDelay: `${i * 0.07}s` }}>
                <span style={{ color: gold, fontSize: 16, flexShrink: 0, marginTop: 1 }}>›</span>
                <span style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 22, color: dark, lineHeight: 1.8 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rv" style={{
          transitionDelay: "0.1s",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          textAlign: "center", minHeight: "70vh", padding: "240px 100px 160px",
        }}>
          <div style={{ maxWidth: "720px" }}>
            <p style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 22, letterSpacing: 3, textTransform: "uppercase", color: gold, marginTop: 40, marginBottom: 22 }}>
              Book Your Consultation Today
            </p>
            <h2 style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: HEADING_SIZE, fontWeight: 400, color: dark, lineHeight: 1.2, marginBottom: 22, letterSpacing: "0.02em" }}>
              Your Numbers Are Ready<br />
              <em style={{ color: gold, fontStyle: "italic" }}>To Speak</em>
            </h2>
            <p style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 22, color: "#7a6460", lineHeight: 1.75, marginBottom: 14 }}>
              Stop leaving your life to chance when the universe has already written your blueprint.
            </p>
            <p style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 18, color: gold, fontStyle: "italic", lineHeight: 1.7, marginBottom: 42 }}>
              Limited slots available — book early to secure your session.
            </p>
            <button
              style={{ ...dashedBtn("#fff"), background: dark, border: "2px dashed #fff" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.background = "#2e2620"; e.currentTarget.style.boxShadow = "0 10px 32px rgba(0,0,0,0.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.background = dark; e.currentTarget.style.boxShadow = "none"; }}>
              Book Your Numerology Consultation →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── ROOT ────────────────────────────────────────────────────────────────────── */
export default function NumerologyPage() {
  return (
    <>
      <SplashCursor
        DENSITY_DISSIPATION={3.5}
        VELOCITY_DISSIPATION={2}
        PRESSURE={0.1}
        CURL={3}
        SPLAT_RADIUS={0.2}
        SPLAT_FORCE={6000}
        COLOR_UPDATE_SPEED={10}
        SHADING
        RAINBOW_MODE={false}
        COLOR="#faf8f5"
      />
      <style>{globalCss}</style>
      <div style={{ fontFamily: "'Glacial Indifference', sans-serif", background: "#fff", minHeight: "100vh", overflowX: "hidden" }}>
        <Hero />
        
        <WhatIsSection />
        <SlidingStrip />
        <KeyNumbersSection />
        <ImpactSection />
        <ApproachSection />
        <WhoAndCTASection />
      </div>
    </>
  );
}
