import { useState, useEffect, useRef } from "react";
import SplashCursor from "../components/SplashCursor";

/* ── Scroll Manager (singleton) ─────────────────────────────────────────────── */
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

const teal   = "#4ecdc4";
const indigo = "#2d2b55";
const HEADING_SIZE = "clamp(36px,3.8vw,52px)";

/* ── shared button ──────────────────────────────────────────────────────────── */
const dashedBtn = (color = indigo) => ({
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

/* ── tilt ────────────────────────────────────────────────────────────────────── */
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

/* ── GLOBAL CSS ──────────────────────────────────────────────────────────────── */
const globalCss = `
  @import url('https://fonts.googleapis.com/css2?family=Ibarra+Real+Nova:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&display=swap');
  @import url('https://fonts.cdnfonts.com/css/glacial-indifference-2');

  * { margin:0; padding:0; box-sizing:border-box; -webkit-font-smoothing:antialiased; }
  body { background:#fff; color:${indigo}; }
  html { scroll-behavior:smooth; }

  @keyframes floatUp  { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
  @keyframes spinSlow { to { transform:rotate(360deg); } }
  @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
  @keyframes drift { 0%{transform:translateY(0px);} 50%{transform:translateY(-12px);} 100%{transform:translateY(0px);} }

  .rv { opacity:0; transform:translateY(28px); transition:opacity 0.65s cubic-bezier(.22,1,.36,1),transform 0.65s cubic-bezier(.22,1,.36,1); }
  .rv.vis { opacity:1; transform:translateY(0); }

  .card-3d { transform-style:preserve-3d; transition:transform 0.15s ease, box-shadow 0.2s ease; }

  .num-glyph {
    width: 110px; height: 110px;
    border: 1.5px solid rgba(78,205,196,0.3);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 22px;
    font-family: 'Ibarra Real Nova', serif;
    font-size: 42px; color: ${teal};
    background: rgba(78,205,196,0.06);
    transition: background 0.35s, border-color 0.35s, box-shadow 0.35s, transform 0.35s;
  }
  .gain-card:hover .num-glyph {
    background: rgba(78,205,196,0.14);
    border-color: ${teal};
    box-shadow: 0 0 0 6px rgba(78,205,196,0.1);
    transform: scale(1.05);
  }
  .gain-card { transition: transform 0.28s cubic-bezier(.22,1,.36,1); cursor: default; }
  .gain-card:hover { transform: translateY(-8px); }

  .why-card { animation: fadeUp 0.6s ease both; transform-style: preserve-3d; }
  .why-card:nth-child(1) { animation-delay:0.1s; }
  .why-card:nth-child(2) { animation-delay:0.22s; }
  .why-card:nth-child(3) { animation-delay:0.34s; }
  .why-card:hover { border-color: ${teal} !important; box-shadow: 0 20px 50px rgba(78,205,196,0.14) !important; }

  .benefit-row { display:flex; gap:14px; align-items:flex-start; padding:12px 16px; background:rgba(255,255,255,0.5); border:0.5px solid rgba(78,205,196,0.15); transition:background 0.2s,border-color 0.2s; cursor:default; }
  .benefit-row:hover { background:#fff; border-color:rgba(78,205,196,0.5); }

  .step-row { display:flex; gap:20px; align-items:flex-start; padding:26px 0; border-bottom:1px solid rgba(45,43,85,0.08); transition:padding-left 0.2s; cursor:default; }
  .step-row:hover { padding-left:10px; }
  .step-num { width:44px; height:44px; border:1px solid rgba(78,205,196,0.4); border-radius:50%; display:flex; align-items:center; justify-content:center; font-family:'Ibarra Real Nova',serif; font-size:13px; color:${teal}; background:rgba(78,205,196,0.06); flex-shrink:0; margin-top:3px; transition:background 0.3s,color 0.3s,box-shadow 0.3s; }
  .step-row:hover .step-num { background:${teal}; color:#fff; box-shadow:0 0 0 5px rgba(78,205,196,0.15); }

  .who-row { display:flex; align-items:flex-start; gap:14px; padding:16px 0; border-bottom:1px solid rgba(45,43,85,0.1); transition:padding-left 0.22s cubic-bezier(.22,1,.36,1); cursor:default; }
  .who-row:hover { padding-left:10px; }

  .acc-item { border-bottom:1px solid rgba(45,43,85,0.1); }
  .acc-btn  { width:100%; background:none; border:none; cursor:pointer; display:flex; align-items:center; gap:12px; padding:15px 0; text-align:left; }
  .acc-arrow { font-size:20px; color:${teal}; transition:transform 0.3s; flex-shrink:0; line-height:1; }
  .acc-arrow.open { transform:rotate(90deg); }
  .acc-body { overflow:hidden; transition:max-height 0.35s cubic-bezier(.22,1,.36,1),opacity 0.35s; }

  .strip-row { display:flex; gap:48px; white-space:nowrap; align-items:center; padding:0 40px; will-change:transform; min-width:300vw; height:64px; }
  .strip-row span { font-family:'Ibarra Real Nova',serif; font-size:26px; }
`;

/* ── Accordion ───────────────────────────────────────────────────────────────── */
function AccItem({ title, body }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="acc-item">
      <button className="acc-btn" onClick={() => setOpen(o => !o)}>
        <span className={`acc-arrow${open ? " open" : ""}`}>›</span>
        <span style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 18, color: indigo, letterSpacing: 0.4 }}>{title}</span>
      </button>
      <div className="acc-body" style={{ maxHeight: open ? 140 : 0, opacity: open ? 1 : 0 }}>
        <p style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 14, color: "#7a6e68", lineHeight: 1.75, paddingBottom: 14, paddingLeft: 32 }}>{body}</p>
      </div>
    </div>
  );
}

/* ── HERO ────────────────────────────────────────────────────────────────────── */
function Hero() {
  const gemRef  = useRef(null);
  const orbRef  = useRef(null);
  useEffect(() => {
    return subscribeScroll((y) => {
      if (y > window.innerHeight * 1.5) return;
      if (gemRef.current)  gemRef.current.style.transform  = `translate3d(0, ${y * 0.22}px, 0)`;
      if (orbRef.current)  orbRef.current.style.transform  = `translate3d(0, ${y * 0.15}px, 0)`;
    });
  }, []);

  return (
    <section style={{
      position: "relative", minHeight: "100vh",
      display: "flex", alignItems: "flex-start", justifyContent: "center",
      textAlign: "center",
      background: "white",
      backgroundImage: 'url("/assets/vedicbg.svg")',
      backgroundSize: "cover",
      overflow: "hidden", padding: "160px 40px 80px",
    }}>
      {/* soft teal radial glow */}
      <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%,-50%)", width: 700, height: 700, background: "radial-gradient(circle, rgba(78,205,196,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* floating crystal left */}
      <div ref={gemRef} style={{ position: "absolute", left: "-40px", bottom: "60px", width: 300, height: 400, pointerEvents: "none", zIndex: 4, opacity: 0.75, animation: "drift 7s ease-in-out infinite" }}>
        <img src="/assets/beigecrystal.png" alt="" decoding="async" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </div>
      {/* orb right */}
      <div ref={orbRef} style={{ position: "absolute", right: "-20px", top: "90px", width: 200, height: 280, pointerEvents: "none", zIndex: 1, opacity: 0.70 }}>
        <img src="/assets/moon.png" alt="" decoding="async" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </div>

      <div style={{ position: "relative", zIndex: 2, maxWidth: 700, transform: "translateY(-60px)" }}>
        <div style={{ fontFamily: "'Ibarra Real Nova', serif", fontWeight: 450, display: "inline-block", fontSize: 68, color: "black", padding: "6px 20px", marginBottom: 40, animation: "floatUp 0.8s ease forwards", letterSpacing: "0.02em" }}>
          Numerology
        </div>

        {/* number decorations */}
        <div style={{ display: "flex", justifyContent: "center", gap: 28, marginBottom: 36, animation: "floatUp 0.8s 0.15s ease both" }}>
          {["1","7","∞","3","9"].map((n, i) => (
            <span key={i} style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 22, color: teal, opacity: 0.4 + i * 0.12 }}>{n}</span>
          ))}
        </div>

        <h1 style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: HEADING_SIZE, fontWeight: 400, lineHeight: 1.15, color: "black", marginBottom: 32, animation: "floatUp 0.8s 0.2s ease both" }}>
          Unlock the Hidden Power<br />of <em style={{ color: teal, fontStyle: "italic" }}>Your Numbers</em>
        </h1>
        <p style={{ fontSize: 18, color: "#9b8fa0", lineHeight: 1.85, marginBottom: 10, fontFamily: "'Glacial Indifference', sans-serif", animation: "floatUp 0.8s 0.35s ease both" }}>
          Your name and birth date carry vibrations that shape your destiny —<br />discover how to use them to your advantage.
        </p>
        <p style={{ fontSize: 18, color: teal, fontStyle: "italic", marginBottom: 50, fontFamily: "'Ibarra Real Nova', serif", animation: "floatUp 0.8s 0.45s ease both" }}>
          Every number is a message. Every pattern is a purpose.
        </p>
        <button
          style={{ ...dashedBtn(indigo), animation: "floatUp 0.8s 0.55s ease both" }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = teal; e.currentTarget.style.color = teal; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = indigo; e.currentTarget.style.color = indigo; }}>
          Book Your Consultation →
        </button>
      </div>
    </section>
  );
}

/* ── SLIDING STRIP ───────────────────────────────────────────────────────────── */
function SlidingStrip() {
  const topRef = useRef(null);
  const botRef = useRef(null);
  useEffect(() => {
    return subscribeScroll((y) => {
      if (topRef.current) topRef.current.style.transform = `translateX(-${y * 0.18}px)`;
      if (botRef.current) botRef.current.style.transform = `translateX(calc(-600px + ${y * 0.18}px))`;
    });
  }, []);

  const top = ["✦ Life Path Number","✦ Destiny Number","✦ Name Number","✦ Soul Urge","✦ Personality Number","✦ Maturity Number","✦ Birth Day Number","✦ Expression Number"];
  const bot = ["✦ Name Correction","✦ Lucky Dates","✦ Personal Year","✦ Karmic Debt","✦ Master Numbers","✦ Business Name","✦ Compatibility","✦ Favorable Timing"];
  const tr = [...top,...top,...top,...top]; const br = [...bot,...bot,...bot,...bot];
  const fade = "linear-gradient(90deg, transparent 0%, black 7%, black 93%, transparent 100%)";

  return (
    <div style={{ overflow: "hidden", position: "relative" }}>
      <div style={{ background: "rgba(233,228,220,0.65)", borderTop: "1px solid rgba(78,205,196,0.2)", borderBottom: "1px solid rgba(78,205,196,0.12)", WebkitMaskImage: fade, maskImage: fade }}>
        <div ref={topRef} className="strip-row" style={{ color: "#2a1f1a" }}>
          {tr.map((t, i) => <span key={i}>{t}</span>)}
        </div>
      </div>
      <div style={{ background: "rgba(17,17,17,0.78)", borderBottom: "1px solid rgba(78,205,196,0.1)", WebkitMaskImage: fade, maskImage: fade }}>
        <div ref={botRef} className="strip-row" style={{ color: teal }}>
          {br.map((t, i) => <span key={i}>{t}</span>)}
        </div>
      </div>
    </div>
  );
}

/* ── WHAT IS NUMEROLOGY ──────────────────────────────────────────────────────── */
function WhatIsSection() {
  const sectionRef = useRef(null);
  const numRef     = useRef(null);
  const bodyRef    = useRef(null);
  useReveal(bodyRef);

  useEffect(() => {
    const s = sectionRef.current; const w = numRef.current;
    if (!s || !w) return;
    let topOffset = s.getBoundingClientRect().top + window.scrollY;
    const onResize = () => { topOffset = s.getBoundingClientRect().top + window.scrollY; };
    window.addEventListener("resize", onResize, { passive: true });
    const sHeight = s.offsetHeight;
    const unsub = subscribeScroll((y) => {
      if (y > topOffset + sHeight || y + window.innerHeight < topOffset) return;
      const p = Math.max(0, y - topOffset);
      w.style.transform = `translate3d(200px, 0, 0) rotateZ(${p / 5}deg)`;
    });
    return () => { unsub(); window.removeEventListener("resize", onResize); };
  }, []);

  return (
    <section ref={sectionRef} style={{
      padding: "130px 80px 140px", overflow: "hidden", position: "relative",
      background: `url("/assets/vedic2bg.svg") calc(100% + 50px) bottom / cover no-repeat, #faf8f5`,
      contain: "paint",
    }}>
      <div style={{ position: "absolute", bottom: 0, left: 0, width: 900, height: 300, background: "radial-gradient(ellipse at bottom left, rgba(78,205,196,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div ref={bodyRef} style={{
        maxWidth: 1200, margin: "0 auto",
        display: "grid", gridTemplateColumns: "1.2fr 1fr",
        gap: 120, alignItems: "center", position: "relative", zIndex: 2,
      }}>
        {/* LEFT copy */}
        <div>
          <div className="rv" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
            <span style={{ width: 28, height: 1, background: teal }} />
            <span style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: teal }}>Ancient Vibrational Science</span>
          </div>
          <h2 className="rv" style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: HEADING_SIZE, fontWeight: 400, color: indigo, lineHeight: 1.1, marginBottom: 16, transitionDelay: "0.08s" }}>
            What is<br />Numerology?
          </h2>
          <p className="rv" style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 32, color: teal, fontStyle: "italic", marginBottom: 36, transitionDelay: "0.12s" }}>
            The Language of Numbers
          </p>
          <p className="rv" style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 20, color: "#6b5f5e", lineHeight: 1.95, marginBottom: 20, transitionDelay: "0.16s" }}>
            Numerology is the ancient science that studies the mystical relationship between numbers and life events. Every number carries a specific vibration — and those vibrations directly influence your reality.
          </p>
          <p className="rv" style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 20, color: "#6b5f5e", lineHeight: 1.95, marginBottom: 36, transitionDelay: "0.20s" }}>
            From your birth date to the letters in your name, numbers are already shaping your personality, strengths, challenges, and the patterns of your life.
          </p>
          <div className="rv" style={{ borderLeft: `3px solid ${teal}`, padding: "20px 26px", background: "rgba(78,205,196,0.06)", marginBottom: 44, transitionDelay: "0.24s" }}>
            <p style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 20, color: "#7a6460", lineHeight: 1.85, fontStyle: "italic" }}>
              Your Life Path, Destiny, and Name Numbers together reveal a powerful story about who you are — and where you are headed.
            </p>
          </div>
          <div className="rv" style={{ transitionDelay: "0.28s" }}>
            <AccItem title="Life Path Number" body="Calculated from your birth date, this is the most important number in your chart. It reveals your core personality, natural talents, and the overarching theme of your life's journey." />
            <AccItem title="Destiny & Name Number" body="Derived from the letters in your full birth name, these numbers reveal your life's purpose, how others perceive you, and what you are here to achieve." />
          </div>
          <div className="rv" style={{ marginTop: 40, transitionDelay: "0.32s" }}>
            <button
              style={dashedBtn(indigo)}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = teal; e.currentTarget.style.color = teal; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = indigo; e.currentTarget.style.color = indigo; }}>
              Book Your Consultation →
            </button>
          </div>
        </div>

        {/* RIGHT — number matrix visual */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          <div
            ref={numRef}
            style={{
              width: "250%", maxWidth: "none",
              height: "auto",
              display: "grid",
              gridTemplateColumns: "repeat(6,1fr)",
              gap: 18,
              transform: "translate3d(200px, 0, 0)",
              willChange: "transform",
              opacity: 0.5,
            }}
          >
            {Array.from({ length: 48 }, (_, i) => {
              const nums = ["1","2","3","4","5","6","7","8","9","∞","✦","◯"];
              return (
                <div key={i} style={{
                  fontFamily: "'Ibarra Real Nova', serif",
                  fontSize: 28 + (i % 3) * 10,
                  color: i % 7 === 0 ? teal : i % 5 === 0 ? indigo : "rgba(78,205,196,0.4)",
                  textAlign: "center",
                  lineHeight: 1.4,
                }}>
                  {nums[i % nums.length]}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── WHAT YOU CAN GAIN ───────────────────────────────────────────────────────── */
function GainSection() {
  const ref = useRef(null);
  useReveal(ref);

  const gains = [
    { glyph: "①", label: "Core Personality", desc: "Your core personality traits and natural tendencies — the strengths you were born with and the shadows you carry." },
    { glyph: "②", label: "Life Purpose",      desc: "Clarity on your ideal career paths, success patterns, and the opportunities most aligned with your energy." },
    { glyph: "③", label: "Relationships",     desc: "Compatibility insights — understand karmic bonds and how to nurture your most meaningful connections." },
    { glyph: "④", label: "Timing",            desc: "Lucky numbers, favorable dates, and personal year forecasts so you act when the vibration supports you." },
    { glyph: "⑤", label: "Alignment",         desc: "A sense of direction and flow — stop fighting your patterns and start working with your natural energies." },
  ];

  return (
    <section style={{
      padding: "100px 72px",
      position: "relative", overflow: "hidden",
      background: "linear-gradient(0deg, #f2ece0 0%, #fdf8f0 55%, #faf8f5 100%)",
    }}>
      <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "80%", height: 300, background: "radial-gradient(ellipse at bottom center, rgba(78,205,196,0.09) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div ref={ref} style={{ maxWidth: 1160, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div className="rv" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginBottom: 16 }}>
            <span style={{ width: 28, height: 1, background: teal }} />
            <span style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: teal }}>From a Consultation</span>
            <span style={{ width: 28, height: 1, background: teal }} />
          </div>
          <h2 className="rv" style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: HEADING_SIZE, fontWeight: 400, color: indigo, lineHeight: 1.1, transitionDelay: "0.08s" }}>
            What You Can Gain
          </h2>
          <p className="rv" style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 20, color: "#7a6e68", marginTop: 14, maxWidth: 520, margin: "14px auto 0", lineHeight: 1.8, transitionDelay: "0.14s" }}>
            A numerology session gives you clarity and control over patterns you didn't even realize existed.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 28 }}>
          {gains.map((g, i) => (
            <div key={i} className="rv gain-card" style={{ textAlign: "center", transitionDelay: `${0.06 + i * 0.09}s`, padding: "0 8px" }}>
              <div className="num-glyph">{g.glyph}</div>
              <h4 style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 24, fontWeight: 500, color: indigo, marginBottom: 10, lineHeight: 1.3 }}>{g.label}</h4>
              <p style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 15, color: "#7a6e68", lineHeight: 1.85 }}>{g.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── WHY IT MATTERS ──────────────────────────────────────────────────────────── */
function WhySection() {
  const ref = useRef(null);
  useReveal(ref);

  const questions = [
    { q: "Why do I keep facing the same obstacles despite trying?",  sub: "Recognizing karmic number patterns" },
    { q: "Why don't opportunities seem to align for me?",           sub: "Timing & vibrational alignment" },
    { q: "What is my true purpose and ideal path?",                 sub: "Life path & destiny clarity" },
  ];

  const benefits = [
    "Align with opportunities that match your personal energy",
    "Choose favorable dates for important life events",
    "Improve personal and professional relationships",
    "Enhance success by working with your natural strengths",
    "Reduce friction and unnecessary struggles",
    "Understand why certain patterns repeat in your life",
  ];

  return (
    <section style={{
      padding: "100px 72px", overflow: "hidden", position: "relative",
      background: "linear-gradient(180deg, #f2ece0 0%, #fdf8f0 55%, #faf8f5 100%)",
    }}>
      <div ref={ref} style={{ maxWidth: 1160, margin: "0 auto" }}>
        <div className="rv" style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <span style={{ width: 28, height: 1, background: teal }} />
            <span style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: teal }}>Why It Matters</span>
          </div>
          <h2 style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: HEADING_SIZE, fontWeight: 400, color: indigo, lineHeight: 1.1, marginBottom: 12 }}>
            Clarity Where There<br />Is Confusion
          </h2>
          <p style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 20, color: "#7a6e68", lineHeight: 1.85, maxWidth: 540 }}>
            Everyone hits moments where life feels misaligned. Numerology brings light to the patterns driving those moments.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, margin: "52px 0" }}>
          {questions.map((item, i) => (
            <div key={i} className="why-card card-3d" {...tilt} style={{
              background: "rgba(250,248,245,0.95)", border: `1px solid rgba(78,205,196,0.25)`,
              padding: "40px 32px 32px", cursor: "default", minHeight: 230,
              display: "flex", flexDirection: "column", justifyContent: "space-between",
              boxShadow: "0 2px 20px rgba(0,0,0,0.05)",
            }}>
              <div style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 52, color: teal, lineHeight: 0.75, marginBottom: 22, opacity: 0.5 }}>"</div>
              <p style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 20, fontWeight: 400, color: indigo, lineHeight: 1.65, flexGrow: 1, marginBottom: 24 }}>{item.q}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: teal, letterSpacing: 2, textTransform: "uppercase", fontFamily: "'Glacial Indifference', sans-serif", borderTop: `1px solid rgba(78,205,196,0.2)`, paddingTop: 16 }}>
                <span>✦</span>{item.sub}
              </div>
            </div>
          ))}
        </div>

        <div className="rv" style={{ transitionDelay: "0.1s" }}>
          <p style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 11, color: "#9a8a80", marginBottom: 24, letterSpacing: 3, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 20, height: 1, background: "#9a8a80" }} />
            Numerology helps you
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {benefits.map((b, i) => (
              <div key={i} className="rv benefit-row" style={{ transitionDelay: `${0.14 + i * 0.06}s` }}>
                <span style={{ width: 6, height: 6, background: teal, borderRadius: "50%", flexShrink: 0, marginTop: 7 }} />
                <span style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 17, color: "#6a5e58", lineHeight: 1.7 }}>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── HOW WE HELP ─────────────────────────────────────────────────────────────── */
function ApproachSection() {
  const ref = useRef(null);
  useReveal(ref);

  const steps = [
    { n: "01", title: "Complete Number Analysis",       desc: "Life Path, Destiny, and Name Numbers fully decoded — not surface-level readings but deep, honest interpretation of every vibration in your chart." },
    { n: "02", title: "Name Correction (If Needed)",    desc: "If your current name vibration is creating friction, we provide precise corrections to align your name with your life purpose and desired outcomes." },
    { n: "03", title: "Personalized Timing Guidance",   desc: "Recommendations for favorable dates, personal year forecasts, and the right timing for career moves, business launches, relationships, and major decisions." },
    { n: "04", title: "Simple, Actionable Direction",   desc: "No complexity. No confusion. We translate your numbers into clear, practical steps you can apply immediately to improve your life's flow." },
  ];

  return (
    <section style={{
      padding: "100px 72px", position: "relative", overflow: "hidden",
      background: "linear-gradient(180deg, #faf8f5 0%, #f2ece0 55%, #f7efe2 100%)",
    }}>
      <div ref={ref} style={{ maxWidth: 1160, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 80, alignItems: "start", position: "relative", zIndex: 1 }}>
        <div>
          <div className="rv" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ width: 28, height: 1, background: teal }} />
            <span style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: teal }}>Our Approach</span>
          </div>
          <h2 className="rv" style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: HEADING_SIZE, fontWeight: 400, color: indigo, lineHeight: 1.12, marginBottom: 24, transitionDelay: "0.08s" }}>
            How We Help You at<br /><em style={{ color: teal, fontStyle: "italic" }}>Vedic Saar</em>
          </h2>
          <p className="rv" style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 20, color: "#7a6e68", lineHeight: 1.9, marginBottom: 40, transitionDelay: "0.14s" }}>
            We focus on making numerology practical, precise, and result-oriented — not mystical confusion but clear, actionable insight.
          </p>
          <div className="rv" style={{ borderLeft: `3px solid ${teal}`, padding: "20px 26px", background: "rgba(78,205,196,0.06)", marginBottom: 44, transitionDelay: "0.24s" }}>
            <p style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 20, color: "#7a6460", lineHeight: 1.85, fontStyle: "italic" }}>
              "Your numbers are already influencing your life — it's time to make them work for you."
            </p>
          </div>
        </div>
        <div>
          {steps.map((s, i) => (
            <div key={i} className="rv step-row" style={{ transitionDelay: `${0.08 + i * 0.1}s` }}>
              <div className="step-num">{s.n}</div>
              <div>
                <h5 style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 20, fontWeight: 600, color: indigo, marginBottom: 8 }}>{s.title}</h5>
                <p style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 17, color: "#7a7068", lineHeight: 1.75 }}>{s.desc}</p>
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
  const ref     = useRef(null);
  const spinRef = useRef(null);
  useReveal(ref);

  useEffect(() => {
    const el = spinRef.current;
    if (!el) return;
    el.style.animationPlayState = "paused";
    const obs = new IntersectionObserver(
      ([e]) => { el.style.animationPlayState = e.isIntersecting ? "running" : "paused"; },
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
      position: "relative", overflow: "hidden",
      backgroundColor: "#f7efe2",
      backgroundImage: 'url("/assets/vediclast.svg")',
      backgroundSize: "cover", backgroundPosition: "center top",
      backgroundRepeat: "no-repeat",
      padding: "120px 72px 140px",
    }}>
      {/* top fade blend */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 180, background: "linear-gradient(180deg, #f7efe2 0%, transparent 100%)", pointerEvents: "none", zIndex: 2 }} />

      {/* spinning number wheel */}
      <div ref={spinRef} style={{ position: "absolute", zIndex: 1, top: "-200px", left: "-300px", width: 900, opacity: 0.06, pointerEvents: "none", animation: "spinSlow 80s linear infinite", willChange: "transform" }}>
        <img src="/assets/mantra-wheel.png" alt="" loading="lazy" decoding="async" style={{ width: "200%", objectFit: "contain" }} />
      </div>

      <div ref={ref} style={{ maxWidth: 1160, margin: "0 auto", position: "relative", zIndex: 3 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 80, marginBottom: 100, alignItems: "start" }}>
          <div>
            <div className="rv" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <span style={{ width: 28, height: 1, background: teal }} />
              <span style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: teal }}>Is This For You?</span>
            </div>
            <h2 className="rv" style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: HEADING_SIZE, fontWeight: 400, color: indigo, lineHeight: 1.12, marginBottom: 16, transitionDelay: "0.08s" }}>
              Who Is This<br />Consultation For?
            </h2>
            <p className="rv" style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 18, color: teal, fontStyle: "italic", transitionDelay: "0.14s" }}>
              This is ideal if you are:
            </p>
          </div>
          <div style={{ paddingTop: 6 }}>
            {who.map((item, i) => (
              <div key={i} className="rv who-row" style={{ transitionDelay: `${i * 0.07}s` }}>
                <span style={{ color: teal, fontSize: 16, flexShrink: 0, marginTop: 1 }}>›</span>
                <span style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 20, color: indigo, lineHeight: 1.8 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rv" style={{
          transitionDelay: "0.1s",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          textAlign: "center", minHeight: "60vh",
          padding: "120px 60px 100px",
        }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 20, marginBottom: 40 }}>
            {["1","∞","7","3","9","∞","4"].map((n, i) => (
              <span key={i} style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 20, color: teal, opacity: 0.25 + (i % 3) * 0.18 }}>{n}</span>
            ))}
          </div>

          <p style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: teal, marginBottom: 22 }}>
            Make Your Numbers Work For You
          </p>
          <h2 style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: HEADING_SIZE, fontWeight: 400, color: indigo, lineHeight: 1.2, marginBottom: 22, letterSpacing: "0.02em" }}>
            Book Your Numerology<br />
            <em style={{ color: teal, fontStyle: "italic" }}>Consultation Today</em>
          </h2>
          <p style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 20, color: "#7a6460", lineHeight: 1.75, marginBottom: 42, maxWidth: 520 }}>
            Your numbers are already influencing your life —<br />it's time to decode them and take control.
          </p>
          <button
            style={dashedBtn(teal)}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.background = `${teal}18`; e.currentTarget.style.boxShadow = `0 10px 32px ${teal}44`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.background = "transparent"; e.currentTarget.style.boxShadow = "none"; }}>
            Book Your Numerology Consultation →
          </button>
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
      <div style={{ fontFamily: "'Glacial Indifference', sans-serif", background: "#fff", minHeight: "100vh" }}>
        <Hero />
        <WhatIsSection />
        <SlidingStrip />
        <GainSection />
        <WhySection />
        <ApproachSection />
        <WhoAndCTASection />
      </div>
    </>
  );
}
