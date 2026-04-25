import { useEffect, useRef } from "react";
import { useBooking } from "../components/BookingContext";

if (typeof document !== "undefined" && !document.getElementById("lm-fonts")) {
  const l = document.createElement("link");
  l.id = "lm-fonts"; l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Ibarra+Real+Nova:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&display=swap";
  document.head.appendChild(l);
}

const gold  = "#c9a96e";
const dark  = "#1c140d";
const muted = "#7a6e68";
const W     = "#ffffff";
const C1    = "#f5f0e8";
const C2    = "#fdf8f0";
const C3    = "#f0e8dc";

let _scrollY = 0, _ticking = false, _init = false;
const _fns = new Set();
function subscribeScroll(fn) {
  if (!_init && typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      _scrollY = window.scrollY;
      if (!_ticking) {
        requestAnimationFrame(() => { _fns.forEach(f => f(_scrollY)); _ticking = false; });
        _ticking = true;
      }
    }, { passive: true });
    _init = true;
  }
  _fns.add(fn);
  return () => _fns.delete(fn);
}

function useReveal(ref) {
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const obs = new IntersectionObserver(
      entries => entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add("lm-vis"); obs.unobserve(en.target); }
      }),
      { threshold: 0.06, rootMargin: "-10px" }
    );
    c.querySelectorAll(".lm-rv").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

const CSS = `
  @import url('https://fonts.cdnfonts.com/css/glacial-indifference-2');

  .lm-rv { opacity:0; transform:translateY(28px); transition:opacity 0.7s cubic-bezier(.22,1,.36,1),transform 0.7s cubic-bezier(.22,1,.36,1); }
  .lm-rv.lm-vis { opacity:1; transform:none; }
  .lm-rv.d1{transition-delay:.10s} .lm-rv.d2{transition-delay:.20s}
  .lm-rv.d3{transition-delay:.30s} .lm-rv.d4{transition-delay:.42s}
  .lm-rv.d5{transition-delay:.54s} .lm-rv.d6{transition-delay:.66s}

  @keyframes lm-rise    { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:none} }
  @keyframes lm-spin    { to{transform:rotate(360deg)} }
  @keyframes lm-drift   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
  @keyframes lm-pulse   { 0%,100%{opacity:.06} 50%{opacity:.18} }

  .lm-hcard { transition:transform .3s ease,box-shadow .3s ease,border-color .3s; }
  .lm-hcard:hover { transform:translateY(-5px); box-shadow:0 18px 48px rgba(201,169,110,0.12); border-color:rgba(201,169,110,0.5) !important; }

  .lm-planet-icon { transition:background .3s,color .3s,box-shadow .3s; }
  .lm-planet-row:hover .lm-planet-icon { background:${gold} !important; color:#fff !important; box-shadow:0 0 0 6px rgba(201,169,110,0.12); }

  .lm-num-card { transition:transform .35s cubic-bezier(.22,1,.36,1),box-shadow .35s; cursor:default; }
  .lm-num-card:hover { transform:translateY(-7px); box-shadow:0 24px 64px rgba(201,169,110,0.14) !important; }

  .lm-row-hover { transition:padding-left .22s; cursor:default; }
  .lm-row-hover:hover { padding-left:12px !important; }

  .lm-guide-item { transition:border-color .3s,box-shadow .3s; cursor:default; }
  .lm-guide-item:hover { border-color:rgba(201,169,110,0.5) !important; box-shadow:0 10px 36px rgba(201,169,110,0.08); }

  .lm-btn { transition:background .3s,color .3s,border-color .3s; }
  .lm-btn:hover { background:${gold} !important; color:#fff !important; border-color:${gold} !important; }
`;

/* ─── DATA ─────────────────────────────────────────────────────── */
const houses = [
  { num: "7th",  title: "House of Marriage",              desc: "Primary house of your spouse, committed relationships, and legal partnerships. The 7th lord and planets placed here shape your entire marriage experience." },
  { num: "5th",  title: "House of Romance",               desc: "Governs falling in love, attraction, and the joy of courtship. Indicates past-life romantic karma and whether your relationship will blossom into marriage." },
  { num: "2nd",  title: "House of Family",                desc: "Represents your family of marriage, domestic happiness, and the wealth accumulated through your union." },
  { num: "8th",  title: "Transformation Through Love",    desc: "Rules longevity of marriage, in-laws, secrets in relationships, and deeply karmic bonds. Intense 8th house connections create unforgettable, life-changing relationships." },
  { num: "12th", title: "Bed Pleasures & Foreign Spouse", desc: "Governs intimacy, private life in marriage, and indicates possibility of a foreign or distant spouse." },
  { num: "11th", title: "Fulfilment of Desires",          desc: "Whether your wishes in love get fulfilled — a strong 11th house connected to the 7th often brings successful love marriages." },
];

const planets = [
  { icon: "♀", name: "Venus",      sub: "Karaka of Love & Desire",            desc: "Primary planet for love, romance, and beauty. For men, Venus directly represents the wife and quality of love life. An afflicted Venus can bring dissatisfaction, infidelity energy, or repeated heartbreaks." },
  { icon: "♃", name: "Jupiter",    sub: "Karaka of Husband & Wisdom in Love", desc: "For women, Jupiter represents the husband. A strong Jupiter gives a wise, caring, and prosperous spouse. Afflicted Jupiter delays marriage or brings a difficult husband." },
  { icon: "♂", name: "Mars",       sub: "Passion, Drive & Mangal Dosha",      desc: "Mars rules physical attraction and passion. However, Mars in houses 1, 2, 4, 7, 8, or 12 creates Mangal Dosha — a powerful imbalance that can create relationship conflict, delays, or separation if not properly matched." },
  { icon: "☽", name: "Moon",       sub: "Emotional Connection",               desc: "Governs emotional compatibility, nurturing in relationships, and the ability to bond deeply. A damaged Moon creates emotional unavailability and difficulty sustaining intimacy." },
  { icon: "☊", name: "Rahu & Ketu", sub: "Karmic Relationships",             desc: "Rahu-Ketu connections in synastry create intensely karmic relationships — passionate and destabilising in equal measure. Often indicate past-life love stories being revisited." },
  { icon: "♄", name: "Saturn",     sub: "Delays, Duty & Mature Love",         desc: "Saturn's influence on the 7th house or Venus delays marriage but often brings a stable, long-lasting union once it arrives. Indicates relationships built on responsibility over romance." },
];

const numbers = [
  { num: "2", title: "The Lover",        sub: "Ruled by Moon",   desc: "Deeply romantic, emotionally sensitive, and partnership-oriented. Compatibility best with 1, 6, and 9." },
  { num: "6", title: "The Nurturer",     sub: "Ruled by Venus",  desc: "Natural partners, deeply devoted, most marriage-oriented of all numbers." },
  { num: "9", title: "Karmic Love",      sub: "Ruled by Mars",   desc: "Intense, passionate connections with strong past-life undertones. Relationships feel destined but require work." },
  { num: "8", title: "Love as a Lesson", sub: "Ruled by Saturn", desc: "Love comes late, with tests and delays, but when it arrives — it is built to last a lifetime." },
];

const problems = [
  "Marriage keeps getting delayed despite being the right age — why?",
  "I love someone my family disapproves of — what does my chart say?",
  "Constant arguments and fights in marriage — is this permanent?",
  "Spouse is emotionally distant, cold, or unfaithful — planetary cause?",
  "I keep attracting the wrong people — what is my karmic pattern?",
  "We separated — is there any chance of reconciliation?",
  "I want to know my future spouse's personality and timing of marriage",
  "Is a love marriage or arranged marriage better for my chart?",
  "Second marriage — will it succeed?",
  "Mangal Dosha — do I have it, and how serious is it?",
];

const hiddenIssues = [
  "Mangal Dosha — degree of severity and matching requirements",
  "Shukra Ashtama — Venus in the 8th causing love disappointments",
  "Darakaraka analysis — the planet that represents your actual spouse",
  "Navamsha (D9) chart — the soul chart of marriage, revealing hidden truths",
  "Dasha timing — the exact planetary period when marriage is most likely",
  "Saturn or Rahu transit over 7th house — causing current relationship delays",
];

const guideItems = [
  "Identify your ideal spouse's qualities based on your Darakaraka and 7th house",
  "Pinpoint the exact Dasha and transit windows when marriage is most likely",
  "Provide Mangal Dosha compatibility assessment and required matching criteria",
  "Offer specific mantras — Om Shukraya Namah, Katyayani Mantra for delayed marriage",
  "Recommend fasting days, gemstones (Diamond/White Sapphire for Venus), and rituals",
  "Guide on Kundli matching — going beyond the 36 points to check real compatibility",
];

/* ─── HELPERS ──────────────────────────────────────────────────── */
function Eyebrow({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginBottom: 16 }}>
      <span style={{ width: 36, height: 1, background: gold, opacity: 0.6 }} />
      <span style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: gold }}>
        {label}
      </span>
      <span style={{ width: 36, height: 1, background: gold, opacity: 0.6 }} />
    </div>
  );
}

function Wave({ from, to, flip }) {
  const d = flip
    ? "M0,0 C360,90 1080,90 1440,0 L1440,90 L0,90 Z"
    : "M0,90 C360,0 1080,0 1440,90 L1440,0 L0,0 Z";
  return (
    <div style={{ background: from, lineHeight: 0, marginBottom: -1 }}>
      <svg viewBox="0 0 1440 90" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 90 }}>
        <path d={d} fill={to} />
      </svg>
    </div>
  );
}

/* ─── HERO ─────────────────────────────────────────────────────── */
function Hero() {
  const parallaxRef = useRef(null);
  const { openBooking } = useBooking();

  useEffect(() => {
    return subscribeScroll(y => {
      if (parallaxRef.current && y < window.innerHeight * 1.2)
        parallaxRef.current.style.transform = `translateY(${y * 0.22}px)`;
    });
  }, []);

  return (
    <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", background: C3 }}>

      {/* Parallax solutionsbg */}
      <div ref={parallaxRef} style={{ position: "absolute", inset: "-15%", backgroundImage: 'url("/assets/solutionsbg.svg")', backgroundSize: "cover", backgroundPosition: "center", opacity: 0.8, willChange: "transform", pointerEvents: "none" }} />

      {/* Constellation top-left */}
      
    

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "120px 40px 140px", animation: "lm-rise 1s cubic-bezier(.22,1,.36,1) forwards" }}>
        <div style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "rgba(201,169,110,0.8)", marginBottom: 28 }}>
          Vedic Saar · Sacred Services
        </div>
        <h1 style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: "clamp(52px,9vw,100px)", fontWeight: 400, color: dark, margin: "0 0 22px", lineHeight: 0.95, letterSpacing: -1 }}>
          Love &amp;<br />Marriage
        </h1>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18, margin: "0 auto 32px", maxWidth: 660 }}>
          <span style={{ flex: 1, height: "0.5px", background: `linear-gradient(to right, transparent, ${gold})` }} />
          <span style={{ fontFamily: "'Ibarra Real Nova', serif", fontStyle: "italic", fontSize: 16, color: muted, whiteSpace: "nowrap" }}>
            ✦ &nbsp; Love is not a coincidence. It is a cosmic contract. &nbsp; ✦
          </span>
          <span style={{ flex: 1, height: "0.5px", background: `linear-gradient(to left, transparent, ${gold})` }} />
        </div>
        <p style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 13, color: muted, maxWidth: 380, margin: "0 auto 48px", lineHeight: 2, letterSpacing: 0.5 }}>
          Astrology &amp; Numerology Consultation
        </p>
        <button onClick={openBooking} className="lm-btn" style={{
          background: "transparent", color: dark,
          border: `2px dashed ${gold}`, fontSize: 11, letterSpacing: 2.5,
          padding: "15px 46px", cursor: "pointer", textTransform: "uppercase",
          fontFamily: "'Glacial Indifference', sans-serif", fontWeight: 500,
        }}>
          Book Consultation
        </button>
      </div>

      
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, lineHeight: 0 }}>
        <svg viewBox="0 0 1440 90" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 90 }}>
          <path d="M0,0 C360,90 1080,90 1440,0 L1440,90 L0,90 Z" fill={W} />
        </svg>
      </div>
    </section>
  );
}

/* ─── INTRO ─────────────────────────────────────────────────────── */
function IntroSection() {
  const ref = useRef(null);
  useReveal(ref);

  return (
    <section ref={ref} style={{ background: W, position: "relative", overflow: "hidden" }}>
      <img src="/assets/costelation.png" alt="" style={{ position: "absolute", right: "-80px", bottom: "-40px", width: 420, opacity: 0.07, pointerEvents: "none", transform: "rotate(20deg)" }} />

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "88px 48px 72px", textAlign: "center", position: "relative", zIndex: 1 }}>
        <Eyebrow label="Vedic Wisdom" />
        <h2 className="lm-rv" style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: "clamp(28px,3.8vw,46px)", fontWeight: 400, color: dark, lineHeight: 1.15, margin: "0 0 40px" }}>
          A Sacred Samskara Across<br />
          <em style={{ fontStyle: "italic", color: gold }}>Lifetimes</em>
        </h2>
        <p className="lm-rv d1" style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 17, color: muted, lineHeight: 2.05, marginBottom: 22 }}>
          In Vedic tradition, marriage is a sacred samskara — a rite of passage that shapes your soul's journey across lifetimes. Whether you are waiting for love to arrive, trying to fix a troubled relationship, or seeking clarity after heartbreak — your birth chart carries the most honest, unbiased answer about your relationship destiny.
        </p>
        <p className="lm-rv d2" style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 17, color: muted, lineHeight: 2.05, marginBottom: 52 }}>
          At Vedic Saar, we decode your relationship karma with precision and compassion — helping you understand not just <em>when</em> love will come, but what kind of love your soul truly seeks.
        </p>
        <div className="lm-rv d3" style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ flex: 1, height: "0.5px", background: `linear-gradient(to right, transparent, rgba(201,169,110,0.5))` }} />
          <span style={{ width: 7, height: 7, background: gold, transform: "rotate(45deg)", flexShrink: 0 }} />
          <span style={{ flex: 1, height: "0.5px", background: `linear-gradient(to left, transparent, rgba(201,169,110,0.5))` }} />
        </div>
      </div>

      <div style={{ lineHeight: 0 }}>
        <svg viewBox="0 0 1440 90" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 90 }}>
          <path d="M0,0 C360,90 1080,90 1440,0 L1440,90 L0,90 Z" fill={C1} />
        </svg>
      </div>
    </section>
  );
}

/* ─── HOUSE ARCH SVGs ───────────────────────────────────────────── */
/* All use viewBox="0 0 120 150", white card bg allows white-fill masking for crescent */
const S = "#1c140d";
const G = "#c9a96e";
const houseIcons = [

  /* 7th — Marriage: two overlapping rings + diamond above + rays */
  <svg key="7" viewBox="0 0 120 150" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
    <line x1="60" y1="6" x2="60" y2="18" stroke={S} strokeWidth="0.9"/>
    <line x1="48" y1="9" x2="51" y2="20" stroke={S} strokeWidth="0.7"/>
    <line x1="72" y1="9" x2="69" y2="20" stroke={S} strokeWidth="0.7"/>
    <line x1="38" y1="18" x2="43" y2="27" stroke={S} strokeWidth="0.6"/>
    <line x1="82" y1="18" x2="77" y2="27" stroke={S} strokeWidth="0.6"/>
    <polygon points="60,28 65,37 60,46 55,37" stroke={G} strokeWidth="0.9" fill="rgba(201,169,110,0.14)"/>
    <circle cx="43" cy="102" r="30" stroke={S} strokeWidth="1.3"/>
    <circle cx="77" cy="102" r="30" stroke={S} strokeWidth="1.3"/>
    <circle cx="16" cy="130" r="2.5" fill={G}/>
    <circle cx="104" cy="74" r="2" fill={G}/>
  </svg>,

  /* 5th — Romance: crescent moon (circle + white mask) + 4-pt star + dot accents */
  <svg key="5" viewBox="0 0 120 150" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
    <circle cx="57" cy="62" r="34" stroke={S} strokeWidth="1.3" fill="none"/>
    {/* white circle masks right side → left-facing crescent */}
    <circle cx="70" cy="56" r="28" fill="white"/>
    {/* 4-pointed diamond star */}
    <polygon points="60,102 63,112 60,122 57,112" stroke={S} strokeWidth="1" fill="none"/>
    <polygon points="50,112 60,109 70,112 60,115" stroke={S} strokeWidth="1" fill="none"/>
    {/* cross-star accents */}
    <line x1="96" y1="42" x2="104" y2="42" stroke={S} strokeWidth="0.8"/>
    <line x1="100" y1="38" x2="100" y2="46" stroke={S} strokeWidth="0.8"/>
    <line x1="14" y1="88" x2="20" y2="88" stroke={S} strokeWidth="0.7"/>
    <line x1="17" y1="85" x2="17" y2="91" stroke={S} strokeWidth="0.7"/>
    <circle cx="14" cy="52" r="2" fill={G}/>
    <circle cx="106" cy="100" r="2" fill={G}/>
  </svg>,

  /* 2nd — Family: lotus — 6 rotated ellipses + white center circle */
  <svg key="2" viewBox="0 0 120 150" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
    {[0,60,120,180,240,300].map(a => (
      <ellipse key={a} cx="60" cy="108" rx="9" ry="24"
        transform={`rotate(${a} 60 86)`}
        stroke={S} strokeWidth="1" fill="none"/>
    ))}
    <circle cx="60" cy="86" r="13" stroke={S} strokeWidth="1.2" fill="white"/>
    <circle cx="60" cy="86" r="4" fill={S} opacity="0.12"/>
    <line x1="60" y1="12" x2="60" y2="26" stroke={S} strokeWidth="0.8"/>
    <line x1="49" y1="16" x2="52" y2="28" stroke={S} strokeWidth="0.7"/>
    <line x1="71" y1="16" x2="68" y2="28" stroke={S} strokeWidth="0.7"/>
    <polygon points="60,30 64,40 60,50 56,40" stroke={G} strokeWidth="0.9" fill="rgba(201,169,110,0.14)"/>
    <circle cx="14" cy="120" r="2" fill={G}/>
    <circle cx="106" cy="120" r="2" fill={G}/>
  </svg>,

  /* 8th — Transformation: eye (two Q-curves) + iris + pupil + radial ticks */
  <svg key="8" viewBox="0 0 120 150" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
    {[0,30,60,90,120,150,180,210,240,270,300,330].map(a => {
      const r = a * Math.PI / 180;
      return <line key={a}
        x1={60 + 44 * Math.cos(r)} y1={72 + 44 * Math.sin(r)}
        x2={60 + 52 * Math.cos(r)} y2={72 + 52 * Math.sin(r)}
        stroke={S} strokeWidth="0.55"/>;
    })}
    <circle cx="60" cy="72" r="38" stroke={S} strokeWidth="0.6" strokeDasharray="1.5 3"/>
    {/* almond eye — top arc */}
    <path d="M18,72 Q60,36 102,72" stroke={S} strokeWidth="1.4" fill="none"/>
    {/* almond eye — bottom arc */}
    <path d="M18,72 Q60,108 102,72" stroke={S} strokeWidth="1.4" fill="none"/>
    <circle cx="60" cy="72" r="16" stroke={S} strokeWidth="1" fill="none"/>
    <circle cx="60" cy="72" r="6" fill={S}/>
    {/* lash lines top */}
    <line x1="38" y1="58" x2="36" y2="50" stroke={S} strokeWidth="0.7"/>
    <line x1="52" y1="51" x2="51" y2="42" stroke={S} strokeWidth="0.7"/>
    <line x1="60" y1="50" x2="60" y2="41" stroke={S} strokeWidth="0.7"/>
    <line x1="68" y1="51" x2="69" y2="42" stroke={S} strokeWidth="0.7"/>
    <line x1="82" y1="58" x2="84" y2="50" stroke={S} strokeWidth="0.7"/>
    <circle cx="14" cy="108" r="2" fill={G}/>
    <circle cx="106" cy="108" r="2" fill={G}/>
    {/* curved flourish below */}
    <path d="M30,122 Q60,112 90,122" stroke={S} strokeWidth="0.8" fill="none"/>
    <path d="M38,132 Q60,124 82,132" stroke={S} strokeWidth="0.6" fill="none"/>
  </svg>,

  /* 12th — Foreign / Intimate: compass circle + cardinal arrows + crescent top */
  <svg key="12" viewBox="0 0 120 150" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
    {/* crescent moon top-left */}
    <circle cx="26" cy="22" r="14" stroke={S} strokeWidth="1" fill="none"/>
    <circle cx="32" cy="18" r="11" fill="white"/>
    <circle cx="88" cy="16" r="4" stroke={S} strokeWidth="0.8" fill="none"/>
    <circle cx="103" cy="24" r="2.5" stroke={S} strokeWidth="0.7" fill="none"/>
    {/* compass outer circle */}
    <circle cx="60" cy="95" r="42" stroke={S} strokeWidth="1"/>
    {/* N-S-E-W lines */}
    <line x1="60" y1="53" x2="60" y2="137" stroke={S} strokeWidth="0.8"/>
    <line x1="18" y1="95" x2="102" y2="95" stroke={S} strokeWidth="0.8"/>
    {/* diagonal lines */}
    <line x1="30" y1="65" x2="90" y2="125" stroke={S} strokeWidth="0.5" opacity="0.4"/>
    <line x1="90" y1="65" x2="30" y2="125" stroke={S} strokeWidth="0.5" opacity="0.4"/>
    {/* North pointer filled */}
    <polygon points="60,53 56,70 60,66 64,70" fill={S}/>
    {/* South pointer outline */}
    <polygon points="60,137 56,120 60,124 64,120" stroke={S} strokeWidth="0.9" fill="none"/>
    {/* inner circle + gold dot */}
    <circle cx="60" cy="95" r="10" stroke={S} strokeWidth="0.9" fill="none"/>
    <circle cx="60" cy="95" r="3.5" fill={G}/>
  </svg>,

  /* 11th — Desires: 5-pointed star polygon + radial lines + gold center */
  <svg key="11" viewBox="0 0 120 150" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
    {/* radial lines around star */}
    {[0,45,90,135,180,225,270,315].map(a => {
      const r = a * Math.PI / 180;
      return <line key={a}
        x1={60 + 46 * Math.cos(r)} y1={70 + 46 * Math.sin(r)}
        x2={60 + 55 * Math.cos(r)} y2={70 + 55 * Math.sin(r)}
        stroke={S} strokeWidth="0.6"/>;
    })}
    {/* 5-pointed star — outer r=32, inner r=13, center (60,70) */}
    <polygon
      points="60,38 68,62 90,62 72,76 79,100 60,86 41,100 48,76 30,62 52,62"
      stroke={S} strokeWidth="1.3" fill="none"/>
    {/* inner ring hint */}
    <circle cx="60" cy="70" r="14" stroke={S} strokeWidth="0.5" strokeDasharray="2 3" fill="none"/>
    <circle cx="60" cy="70" r="4" fill={G}/>
    <circle cx="14" cy="130" r="2" fill={G}/>
    <circle cx="106" cy="130" r="2" fill={G}/>
    <line x1="30" y1="140" x2="90" y2="140" stroke={S} strokeWidth="0.5" opacity="0.35"/>
    <circle cx="60" cy="140" r="3" stroke={G} strokeWidth="0.8" fill="none"/>
  </svg>,
];

/* ─── HOUSES ────────────────────────────────────────────────────── */
function HousesSection() {
  const ref = useRef(null);
  useReveal(ref);

  return (
    <section ref={ref} style={{ background: C1, position: "relative", overflow: "hidden" }}>
      <img src="/assets/wheel.png" alt="" style={{ position: "absolute", right: "-80px", top: "50%", transform: "translateY(-50%)", width: 480, opacity: 0.05, pointerEvents: "none", animation: "lm-spin 100s linear infinite" }} />

      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "80px 48px 80px", position: "relative", zIndex: 1 }}>
        <Eyebrow label="Vedic Astrology" />
        <h2 className="lm-rv" style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: "clamp(28px,3.8vw,46px)", fontWeight: 400, color: dark, textAlign: "center", margin: "0 0 6px" }}>
          Houses That Govern
        </h2>
        <p className="lm-rv d1" style={{ fontFamily: "'Ibarra Real Nova', serif", fontStyle: "italic", fontSize: 22, color: gold, textAlign: "center", margin: "0 0 56px" }}>
          Love &amp; Marriage
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 28 }}>
          {houses.map((h, i) => (
            <div key={i} className={`lm-rv d${(i % 3) + 1} lm-hcard`} style={{
              background: W,
              border: "1px solid rgba(28,20,13,0.13)",
              borderRadius: "90px 90px 4px 4px",
              overflow: "hidden",
              textAlign: "center",
              display: "flex", flexDirection: "column",
            }}>
              {/* arch illustration area */}
              <div style={{ padding: "28px 32px 16px", background: W }}>
                <div style={{ width: "100%", maxWidth: 160, margin: "0 auto" }}>
                  {houseIcons[i]}
                </div>
              </div>
              {/* text content */}
              <div style={{ padding: "6px 26px 34px", flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ fontFamily: "'Ibarra Real Nova', serif", fontStyle: "italic", fontSize: 13, color: gold, letterSpacing: 1, marginBottom: 8, textTransform: "uppercase" }}>
                  {h.num} House
                </div>
                <div style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: dark, marginBottom: 12, fontWeight: 500 }}>
                  {h.title}
                </div>
                <div style={{ width: 28, height: "0.5px", background: gold, opacity: 0.5, marginBottom: 14 }} />
                <p style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 13, color: muted, lineHeight: 1.85, margin: 0 }}>
                  {h.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ lineHeight: 0 }}>
        <svg viewBox="0 0 1440 90" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 90 }}>
          <path d="M0,90 C360,10 1080,10 1440,90 L1440,0 L0,0 Z" fill={W} />
        </svg>
      </div>
    </section>
  );
}

/* ─── PLANETS ───────────────────────────────────────────────────── */
function PlanetsSection() {
  const ref = useRef(null);
  useReveal(ref);

  return (
    <section ref={ref} style={{ background: W, position: "relative", overflow: "hidden" }}>
      <img src="/assets/planet.png" alt="" style={{ position: "absolute", left: "-60px", top: "50%", transform: "translateY(-50%)", width: 360, opacity: 0.07, pointerEvents: "none", animation: "lm-drift 14s ease-in-out infinite" }} />
      <img src="/assets/crescentmoon.png" alt="" style={{ position: "absolute", right: "-30px", bottom: "60px", width: 180, opacity: 0.1, pointerEvents: "none", animation: "lm-drift 10s ease-in-out infinite", animationDelay: "5s" }} />

      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "88px 48px 72px", position: "relative", zIndex: 1 }}>
        <Eyebrow label="Planetary Influences" />
        <h2 className="lm-rv" style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: "clamp(28px,3.8vw,46px)", fontWeight: 400, color: dark, textAlign: "center", margin: "0 0 6px" }}>
          Planets That Shape
        </h2>
        <p className="lm-rv d1" style={{ fontFamily: "'Ibarra Real Nova', serif", fontStyle: "italic", fontSize: 22, color: gold, textAlign: "center", margin: "0 0 52px" }}>
          Your Love Life
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 56px" }}>
          {planets.map((p, i) => (
            <div key={i} className={`lm-rv d${(i % 2) + 1} lm-planet-row`} style={{
              display: "flex", gap: 22, padding: "28px 0",
              borderBottom: "1px solid rgba(201,169,110,0.14)",
              alignItems: "flex-start",
            }}>
              <div className="lm-planet-icon" style={{
                width: 50, height: 50, borderRadius: "50%", flexShrink: 0,
                border: "1px solid rgba(201,169,110,0.38)",
                background: C2,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, color: gold, marginTop: 2,
              }}>{p.icon}</div>
              <div>
                <div style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 19, fontWeight: 500, color: dark, marginBottom: 4 }}>{p.name}</div>
                <div style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 10, color: gold, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>{p.sub}</div>
                <p style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 14, color: muted, lineHeight: 1.88 }}>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ lineHeight: 0 }}>
        <svg viewBox="0 0 1440 90" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 90 }}>
          <path d="M0,0 C360,90 1080,90 1440,0 L1440,90 L0,90 Z" fill={C2} />
        </svg>
      </div>
    </section>
  );
}

/* ─── NUMEROLOGY ────────────────────────────────────────────────── */
function NumerologySection() {
  const ref = useRef(null);
  useReveal(ref);

  return (
    <section ref={ref} style={{ background: C2, position: "relative", overflow: "hidden" }}>
      <img src="/assets/costelation.png" alt="" style={{ position: "absolute", left: "50%", top: "-60px", transform: "translateX(-50%)", width: 700, opacity: 0.06, pointerEvents: "none" }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 48px 88px", position: "relative", zIndex: 1 }}>
        <Eyebrow label="Vedic Numerology" />
        <h2 className="lm-rv" style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: "clamp(28px,3.8vw,46px)", fontWeight: 400, color: dark, textAlign: "center", margin: "0 0 6px" }}>
          Numerology &amp; Love
        </h2>
        <p className="lm-rv d1" style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 15, color: muted, textAlign: "center", maxWidth: 580, margin: "0 auto 52px", lineHeight: 1.95 }}>
          In Vedic numerology, your Life Path Number and Destiny Number reveal deep truths about your love compatibility and relationship patterns. Numbers also govern the timing of love and marriage in your life.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 22 }}>
          {numbers.map((n, i) => (
            <div key={i} className={`lm-rv d${i + 1} lm-num-card`} style={{
              textAlign: "center", padding: "46px 22px 38px",
              border: "1px solid rgba(201,169,110,0.2)",
              background: W,
              borderRadius: 2,
            }}>
              <div style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 76, fontWeight: 400, color: gold, lineHeight: 1, marginBottom: 14, opacity: 0.8 }}>
                {n.num}
              </div>
              <div style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 17, fontWeight: 500, color: dark, marginBottom: 6 }}>{n.title}</div>
              <div style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 10, color: gold, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16, opacity: 0.8 }}>{n.sub}</div>
              <p style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 13, color: muted, lineHeight: 1.82 }}>{n.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ lineHeight: 0 }}>
        <svg viewBox="0 0 1440 90" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 90 }}>
          <path d="M0,90 C360,10 1080,10 1440,90 L1440,0 L0,0 Z" fill={W} />
        </svg>
      </div>
    </section>
  );
}

/* ─── PROBLEMS & HIDDEN ISSUES ──────────────────────────────────── */
function ProblemsSection() {
  const ref = useRef(null);
  useReveal(ref);

  return (
    <section ref={ref} style={{ background: W, position: "relative", overflow: "hidden" }}>
      <img src="/assets/moon.png" alt="" style={{ position: "absolute", right: "-40px", top: "40px", width: 280, opacity: 0.07, pointerEvents: "none", animation: "lm-drift 16s ease-in-out infinite" }} />

      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "88px 48px 80px", position: "relative", zIndex: 1 }}>
        <Eyebrow label="Common Concerns" />
        <h2 className="lm-rv" style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: "clamp(28px,3.8vw,46px)", fontWeight: 400, color: dark, textAlign: "center", margin: "0 0 52px" }}>
          Questions We Help You Answer
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64 }}>
          <div className="lm-rv d1">
            <h3 style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 23, fontWeight: 500, color: dark, marginBottom: 30, lineHeight: 1.25 }}>
              Common Love &amp; Marriage Problems
            </h3>
            {problems.map((p, i) => (
              <div key={i} className="lm-row-hover" style={{
                display: "flex", gap: 14, padding: "13px 0",
                borderBottom: i < problems.length - 1 ? "1px solid rgba(201,169,110,0.12)" : "none",
                alignItems: "flex-start",
              }}>
                <span style={{ color: gold, fontSize: 9, marginTop: 5, flexShrink: 0 }}>◆</span>
                <span style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 14, color: muted, lineHeight: 1.75 }}>{p}</span>
              </div>
            ))}
          </div>
          <div className="lm-rv d2">
            <h3 style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 23, fontWeight: 500, color: dark, marginBottom: 16, lineHeight: 1.25 }}>
              Potential Hidden Issues<br />in Your Chart
            </h3>
            <p style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 14, color: muted, marginBottom: 28, lineHeight: 1.9 }}>
              Certain planetary combinations can create invisible barriers in love and marriage. Our reading specifically checks for:
            </p>
            {hiddenIssues.map((h, i) => (
              <div key={i} className="lm-row-hover" style={{
                display: "flex", gap: 14, padding: "15px 0",
                borderBottom: i < hiddenIssues.length - 1 ? "1px solid rgba(201,169,110,0.12)" : "none",
                alignItems: "flex-start",
              }}>
                <span style={{ color: gold, fontSize: 9, marginTop: 5, flexShrink: 0 }}>◆</span>
                <span style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 14, color: muted, lineHeight: 1.75 }}>{h}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ lineHeight: 0 }}>
        <svg viewBox="0 0 1440 90" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 90 }}>
          <path d="M0,0 C360,90 1080,90 1440,0 L1440,90 L0,90 Z" fill={C1} />
        </svg>
      </div>
    </section>
  );
}

/* ─── GUIDE ─────────────────────────────────────────────────────── */
function GuideSection() {
  const ref = useRef(null);
  useReveal(ref);

  return (
    <section ref={ref} style={{ background: C1, position: "relative", overflow: "hidden" }}>
      <img src="/assets/vastu-wheel.svg" alt="" style={{ position: "absolute", left: "-100px", bottom: "-60px", width: 500, opacity: 0.06, pointerEvents: "none", animation: "lm-spin 140s linear infinite" }} />

      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "80px 48px 88px", position: "relative", zIndex: 1 }}>
        <Eyebrow label="Our Approach" />
        <h2 className="lm-rv" style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: "clamp(28px,3.8vw,46px)", fontWeight: 400, color: dark, textAlign: "center", margin: "0 0 6px" }}>
          How We Guide You
        </h2>
        <p className="lm-rv d1" style={{ fontFamily: "'Ibarra Real Nova', serif", fontStyle: "italic", fontSize: 22, color: gold, textAlign: "center", margin: "0 0 52px" }}>
          Towards Love
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22 }}>
          {guideItems.map((g, i) => (
            <div key={i} className={`lm-rv d${(i % 3) + 1} lm-guide-item`} style={{
              padding: "28px 24px",
              border: "1px solid rgba(201,169,110,0.2)",
              background: W,
              borderRadius: 2,
              display: "flex", gap: 16, alignItems: "flex-start",
            }}>
              <span style={{ fontFamily: "'Ibarra Real Nova', serif", fontStyle: "italic", fontSize: 30, color: gold, lineHeight: 1, flexShrink: 0, opacity: 0.6, paddingTop: 2 }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 14, color: muted, lineHeight: 1.88 }}>
                {g}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ lineHeight: 0 }}>
        <svg viewBox="0 0 1440 90" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 90 }}>
          <path d="M0,90 C360,10 1080,10 1440,90 L1440,0 L0,0 Z" fill={C3} />
        </svg>
      </div>
    </section>
  );
}

/* ─── CTA ───────────────────────────────────────────────────────── */
function CTASection() {
  const ref = useRef(null);
  useReveal(ref);
  const { openBooking } = useBooking();

  return (
    <section ref={ref} style={{ background: C3, padding: "88px 48px 110px", textAlign: "center", position: "relative", overflow: "hidden" }}>
      <img src="/assets/costelation.png" alt="" style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: 800, opacity: 0.07, pointerEvents: "none" }} />
      <img src="/assets/crescentmoon.png" alt="" style={{ position: "absolute", left: "4%", bottom: "30px", width: 160, opacity: 0.1, pointerEvents: "none", animation: "lm-drift 12s ease-in-out infinite" }} />
      <img src="/assets/wheel.png" alt="" style={{ position: "absolute", right: "3%", top: "20px", width: 200, opacity: 0.07, pointerEvents: "none", animation: "lm-spin 100s linear infinite" }} />

      {/* Geometric ring */}
      <svg style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", opacity: 0.06, pointerEvents: "none", width: 580, height: 580 }} viewBox="0 0 580 580">
        <circle cx="290" cy="290" r="274" stroke={gold} strokeWidth="0.8" fill="none" strokeDasharray="6 5" />
        <circle cx="290" cy="290" r="190" stroke={gold} strokeWidth="0.4" fill="none" />
        {[0,60,120,180,240,300].map(a => {
          const r = a * Math.PI / 180;
          return <line key={a} x1={290} y1={290} x2={290 + 274 * Math.sin(r)} y2={290 - 274 * Math.cos(r)} stroke={gold} strokeWidth="0.3" />;
        })}
      </svg>

      <div style={{ position: "relative", zIndex: 1 }}>
        <div className="lm-rv" style={{ fontFamily: "'Ibarra Real Nova', serif", fontStyle: "italic", fontSize: "clamp(15px,1.8vw,20px)", color: muted, marginBottom: 36, letterSpacing: 0.4 }}>
          ✦ &nbsp; Your person exists. Your chart shows you how to find them — and when. &nbsp; ✦
        </div>
        <h2 className="lm-rv d1" style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: "clamp(30px,4.5vw,54px)", fontWeight: 400, color: dark, margin: "0 0 10px", lineHeight: 1.1 }}>
          Book Your Love &amp; Marriage
        </h2>
        <h2 className="lm-rv d2" style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: "clamp(30px,4.5vw,54px)", fontWeight: 400, color: gold, fontStyle: "italic", margin: "0 0 44px", lineHeight: 1.1 }}>
          Consultation
        </h2>
        <p className="lm-rv d3" style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 14, color: muted, maxWidth: 420, margin: "0 auto 46px", lineHeight: 2, letterSpacing: 0.4 }}>
          Transform Your Relationship Destiny
        </p>
        <div className="lm-rv d4">
          <button onClick={openBooking} className="lm-btn" style={{
            background: dark, color: C1,
            border: `2px solid ${dark}`,
            fontSize: 11, letterSpacing: 2.5,
            padding: "16px 54px", cursor: "pointer",
            textTransform: "uppercase",
            fontFamily: "'Glacial Indifference', sans-serif", fontWeight: 500,
            borderRadius: 1,
          }}>
            Book Consultation →
          </button>
        </div>
      </div>
    </section>
  );
}

export default function LoveMarriagePage() {
  return (
    <>
      <style>{CSS}</style>
      <Hero />
      <IntroSection />
      <HousesSection />
      <PlanetsSection />
      <NumerologySection />
      <ProblemsSection />
      <GuideSection />
      <CTASection />
    </>
  );
}
