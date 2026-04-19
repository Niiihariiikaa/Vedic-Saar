import { useState, useEffect, useRef } from "react";

const gold = "#c9a96e";

const globalCss = `
  @import url('https://fonts.googleapis.com/css2?family=Ibarra+Real+Nova:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&display=swap');
  @import url('https://fonts.cdnfonts.com/css/glacial-indifference-2');

  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #fff; color: #2a1f1a; }
  html { scroll-behavior: smooth; }

  @keyframes twinkle { from { opacity: 0.05; } to { opacity: 0.6; } }
  @keyframes floatUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }

  /* Strip colours locked via CSS classes — JS inline styles won't override bg on scroll */
  .strip-wrap { overflow: hidden; line-height: 0; font-size: 0; }
  .strip-cream {
    display: block;
    white-space: nowrap;
    background-color: #e9e4dc;
    padding: 18px 0;
    font-family: 'Ibarra Real Nova', Georgia, serif;
    font-size: 56px;
    color: #2a1f1a;
    will-change: transform;
  }
  .strip-black {
    display: block;
    white-space: nowrap;
    background-color: #111;
    padding: 14px 0;
    font-family: 'Glacial Indifference', sans-serif;
    font-size: 26px;
    color: #fff;
    will-change: transform;
  }
  .strip-cream span { color: #2a1f1a; margin-right: 60px; }
  .strip-black span { color: #fff; margin-right: 44px; }

  .who-card {
    background: #faf8f5;
    border: 0.5px solid rgba(201,169,110,0.25);
    border-radius: 10px;
    padding: 24px 20px;
    display: flex;
    gap: 14px;
    align-items: flex-start;
    transition: border-color 0.3s, box-shadow 0.3s;
  }
  .who-card:hover {
    border-color: rgba(201,169,110,0.6);
    box-shadow: 0 8px 24px rgba(201,169,110,0.08);
  }
`;

/* ── STARFIELD ──────────────────────────────────────────────────────────────── */
function StarField() {
  const stars = Array.from({ length: 60 }, (_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 100,
    size: Math.random() * 1.5 + 0.5, opacity: Math.random() * 0.5 + 0.1,
    delay: Math.random() * 4,
  }));
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {stars.map(s => (
        <div key={s.id} style={{
          position: "absolute", left: `${s.x}%`, top: `${s.y}%`,
          width: s.size, height: s.size, background: "#fff", borderRadius: "50%",
          opacity: s.opacity,
          animation: `twinkle ${2 + s.delay}s ease-in-out infinite alternate`,
          animationDelay: `${s.delay}s`,
        }} />
      ))}
    </div>
  );
}

/* ── HERO ───────────────────────────────────────────────────────────────────── */
function Hero() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <section style={{
      position: "relative", minHeight: "100vh",
      display: "flex", alignItems: "flex-start", justifyContent: "center",
      textAlign: "center", background: "white",
      backgroundImage: 'url("/assets/vedicbg.svg")', backgroundSize: "cover",
      overflow: "hidden", padding: "160px 40px 80px",
    }}>
      <StarField />

      {/* LEFT — beigecrystal, moves DOWN on scroll */}
      <div style={{
        position: "absolute", left: "-40px", bottom: "60px",
        width: 320, height: 420,
        transform: `translateY(${scrollY * 0.25}px)`,
        pointerEvents: "none", zIndex: 10, opacity: 0.85,
      }}>
        <img src="/assets/beigecrystal.png" alt=""
          style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </div>

      {/* RIGHT — moon, moves DOWN on scroll */}
      <div style={{
        position: "absolute", right: "-20px", top: "60px",
        width: 200, height: 300,
        transform: `translateY(${scrollY * 0.18}px)`,
        pointerEvents: "none", zIndex: 1, opacity: 0.80,
      }}>
        <img src="/assets/moon.png" alt=""
          style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </div>

      <div style={{ position: "relative", zIndex: 2, maxWidth: 680, transform: "translateY(-80px)" }}>
        <div style={{
          fontFamily: "'Ibarra Real Nova', serif", fontWeight: 450,
          display: "inline-block", fontSize: 70, color: "black",
          padding: "6px 20px", marginBottom: 137,
          animation: "floatUp 0.8s ease forwards",
        }}>
          Vedic Astrology
        </div>

        <h1 style={{
          fontFamily: "'Ibarra Real Nova', serif", fontSize: "clamp(38px,6vw,40px)",
          fontWeight: 300, lineHeight: 1.15, color: "black",
          marginBottom: 24, animation: "floatUp 0.8s 0.2s ease both",
        }}>
          Decode Your Destiny Through<br />
          <em style={{ color: gold, fontStyle: "italic" }}> Vedic Astrology</em>
        </h1>
        <p style={{
          fontSize: 16, color: "#9b8fa0", lineHeight: 1.8, marginBottom: 10,
          fontFamily: "'Glacial Indifference', sans-serif",
          animation: "floatUp 0.8s 0.4s ease both",
        }}>
          Ancient wisdom. Modern clarity. Personalized guidance for life's biggest decisions.
        </p>
        <p style={{
          fontSize: 14, color: "#6b6075", fontStyle: "italic", marginBottom: 44,
          fontFamily: "'Glacial Indifference', sans-serif",
          animation: "floatUp 0.8s 0.5s ease both",
        }}>
          Your journey is not random — it is written in the stars.
        </p>
        <button style={{
          color: "#0a0a14", border: "2px dashed black", background: "transparent",
          fontSize: 12, letterSpacing: 2, padding: "16px 44px",
          cursor: "pointer", textTransform: "uppercase",
          fontFamily: "'Glacial Indifference', sans-serif",
          fontWeight: 500, transition: "all 0.3s",
          animation: "floatUp 0.8s 0.6s ease both",
        }}
          onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = `0 12px 32px ${gold}44`; }}
          onMouseLeave={e => { e.target.style.transform = "none"; e.target.style.boxShadow = "none"; }}
        >
          Book Your Consultation →
        </button>
      </div>
    </section>
  );
}
function ConstellationOverlay() {
  return (
    <div
      style={{
        position: "relative",
        height: "0px", // 👈 important (no layout shift)
        zIndex: 20,
      }}
    >
      <img
        src="/assets/costelation.png"
        alt=""
        style={{
          position: "absolute",
          top: "-320px", // 👈 controls overlap into Hero
          left: "80%",
          transform: "translateX(-50%)",
          width: "500px",
          opacity: 0.5,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}


function CrescentMoonOverlay() {
  return (
    <div
      style={{
        position: "relative",
        height: "0px", // 👈 important (no layout shift)
        zIndex: 2,
      }}
    >
      <img
        src="/assets/crescentmoon.png"
        alt=""
        style={{
          position: "absolute",
          top: "-420px", // 👈 controls overlap into Hero
          left: "85%",
          transform: "translateX(-50%)",
          width: "600px",
          zIndex: 2,
          opacity: 0.5,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

function SlidingStrip() {
  const [offset, setOffset] = useState(0);
  const rafRef = useRef(null);
  const scrollRef = useRef(0);

  useEffect(() => {
    const onScroll = () => { scrollRef.current = window.scrollY; };
    window.addEventListener("scroll", onScroll, { passive: true });

    const tick = () => {
      setOffset(scrollRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const top = ["☾ Kundli Analysis","✶ Birth Chart","☯ Ascendant Reading","✧ Planetary Dashas","☾ Navamsa Chart","✶ Lagna Chart","☯ Sade Sati","✧ Yogas & Doshas"];
  const bot = ["✶ Career & Finance Reading","✶ Relationship Compatibility","✶ Muhurat Timing","✶ Retrograde Insights","✶ Nakshatra Analysis","✶ Life Path Reading","✶ Karma & Dharma","✶ Yearly Horoscope"];

  const topRow = [...top, ...top, ...top, ...top, ...top];
  const botRow = [...bot, ...bot, ...bot, ...bot, ...bot];

  const stripStyle = {
    display: "flex",
    gap: "60px",
    whiteSpace: "nowrap",
    height: "120px",
    alignItems: "center",
    padding: "0 40px",
    fontSize: "48px",
    fontFamily: "'Ibarra Real Nova', serif",
    willChange: "transform",
    minWidth: "300vw",
  };

  return (
    <div style={{ overflow: "hidden" }}>

      {/* TOP STRIP — scrolls left */}
      <div
        style={{
          ...stripStyle,
          backgroundColor: "#e9e4dc",
          transform: `translateX(-${offset * 0.2}px)`,
        }}
      >
        {topRow.map((t, i) => <span key={i}>{t}</span>)}
      </div>

      {/* BOTTOM STRIP — scrolls right, starts anchored left */}
      <div
        style={{
          ...stripStyle,
          backgroundColor: "black",
          color: "white",
          transform: `translateX(calc(-700px + ${offset * 0.2}px))`,  // ← -300px anchors it flush left on load
        }}
      >
        {botRow.map((t, i) => <span key={i}>{t}</span>)}
      </div>

    </div>
  );
}
function WhatIsSection() {
  return (
    <section
      style={{
        position: "relative",
        backgroundColor: "#faf8f5",
        backgroundImage: 'url("/assets/vedic2bg.svg")',
        backgroundSize: "100% auto",
        backgroundPosition: "left 20px top -720px", // ← tweak these to reposition
        backgroundRepeat: "no-repeat",
        padding: "120px 80px 180px 60px",
        minHeight: "700px",
        display: "flex",
        justifyContent: "flex-end",                  // ← content to the right
      }}
    >
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 560,                             // ← narrower right column
        }}
      >
        <div
          style={{
            fontSize: 60,
            letterSpacing: 3,
            color: "black",
            marginBottom: 12,
            fontFamily: "'Ibarra Real Nova', serif",
          }}
        >
          What is Vedic Astrology?
        </div>

        <h2
          style={{
            fontFamily: "'Ibarra Real Nova', serif",
            fontSize: 38,
            fontWeight: 400,
            color: gold,
            marginBottom: 24,
            lineHeight: 1.2,
          }}
        >
          Jyotish Shastra
        </h2>

        <p style={{ fontSize: 20, color: "#6b5f5e", lineHeight: 1.9, marginBottom: 16 }}>
          Vedic Astrology is a 5,000-year-old sacred science rooted in the Vedas.
          It studies the precise positions of planets at the time of your birth to create
          your unique birth chart (Kundli) — a cosmic blueprint of your life.
        </p>

        <p style={{ fontSize: 20, color: "#6b5f5e", lineHeight: 1.9, marginBottom: 24 }}>
          This chart is a map of your personality, karmic patterns, strengths,
          challenges, and life purpose — not just predictions.
        </p>

        <div
          style={{
            borderLeft: `2px solid ${gold}`,
            fontSize: 18,
            color: "#8b7060",
            lineHeight: 1.7,
            background: `${gold}0d`,
            padding: "16px 20px",
            fontFamily: "'Ibarra Real Nova', serif",
          }}
        >
          Unlike generic horoscopes, Vedic Astrology is deeply personalized and
          incredibly precise when interpreted correctly.
        </div>
      </div>
    </section>
  );
}
/* ── WHY SECTION ────────────────────────────────────────────────────────────── */
function WhySection() {
  const questions = [
    { q: "Am I choosing the right career path?", sub: "Finding direction in work & purpose" },
    { q: "Why are my relationships not working?", sub: "Understanding karmic connections" },
    { q: "When will things finally get better?", sub: "Timing cycles & planetary shifts" },
  ];
  const benefits = [
    "Understand why things are happening in your life",
    "Make confident decisions with better timing (muhurat)",
    "Prepare for challenges instead of reacting to them",
    "Recognize opportunities you might otherwise miss",
    "Align your actions with favorable planetary energies",
    "Feel guided and in control, not lost",
  ];

  return (
    <section style={{  background: "#faf8f5", padding: "100px 48px", position: "relative", overflow: "hidden" }}>

      <style>{`
        @keyframes wobble {
          0%   { transform: rotate(0deg) translateY(0px); }
          15%  { transform: rotate(-1.5deg) translateY(-4px); }
          30%  { transform: rotate(1.5deg) translateY(-6px); }
          45%  { transform: rotate(-1deg) translateY(-3px); }
          60%  { transform: rotate(0.8deg) translateY(-5px); }
          75%  { transform: rotate(-0.5deg) translateY(-2px); }
          100% { transform: rotate(0deg) translateY(0px); }
        }
        .why-card:hover {
          animation: wobble 0.7s ease forwards;
          border-color: ${gold} !important;
          box-shadow: 0 8px 32px ${gold}22;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .why-card {
          animation: fadeUp 0.6s ease both;
          z-index: 3;
        }
        .why-card:nth-child(1) { animation-delay: 0.1s; }
        .why-card:nth-child(2) { animation-delay: 0.22s; }
        .why-card:nth-child(3) { animation-delay: 0.34s; z-index: 3; }
      `}</style>

      <div style={{ maxWidth: 960, margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* heading */}
        <div style={{ fontSize: 42, letterSpacing: 3, color: "black", marginBottom: 10, fontFamily: "'Ibarra Real Nova', serif" }}>
          Why It Matters
        </div>
        <h2 style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 36, fontWeight: 400, color: gold, marginBottom: 14, lineHeight: 1.2 }}>
          Clarity where there is confusion
        </h2>
        <p style={{ fontSize: 15, color: "#7a6e68", marginBottom: 48, fontFamily: "'Glacial Indifference', sans-serif", maxWidth: 560 }}>
          At some point, everyone faces uncertainty. Vedic Astrology brings light to life's hardest questions.
        </p>

        {/* question cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, marginBottom: 56 }}>
          {questions.map((item, i) => (
            <div
              key={i}
              className="why-card"
              style={{
                background: "#fff",
                border: `1.5px dashed ${gold}66`,
                padding: "36px 24px 32px",
                cursor: "default",
                transition: "border-color 0.3s, box-shadow 0.3s",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: 220,
              }}
            >
              <div style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 52, color: gold, lineHeight: 0.7, marginBottom: 18, opacity: 0.7 }}>"</div>
              <p style={{ fontSize: 15, color: "#4a3f3a", lineHeight: 1.75, fontFamily: "'Glacial Indifference', sans-serif", flexGrow: 1, marginBottom: 20 }}>
                {item.q}
              </p>
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 11,
                color: gold,
                fontFamily: "'Glacial Indifference', sans-serif",
                letterSpacing: 1.5,
                textTransform: "uppercase",
                borderTop: `0.5px solid ${gold}33`,
                paddingTop: 14,
              }}>
                <span style={{ fontSize: 14 }}>✦</span>
                {item.sub}
              </div>
            </div>
          ))}
        </div>

        {/* benefits */}
        <p style={{ fontSize: 13, color: "#9a8a80", marginBottom: 20, fontFamily: "'Glacial Indifference', sans-serif", letterSpacing: 2, textTransform: "uppercase" }}>
          Vedic Astrology helps you
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {benefits.map((b, i) => (
            <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", fontSize: 14, color: "#7a6e68", lineHeight: 1.7, fontFamily: "'Glacial Indifference', sans-serif" }}>
              <span style={{ width: 6, height: 6, background: gold, borderRadius: "50%", marginTop: 8, flexShrink: 0 }} />
              {b}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

function ServicesSection() {
  const trackRef = useRef(null);
  const sectionRef = useRef(null);
  const [scrollNeeded, setScrollNeeded] = useState(800);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // measure actual overflow after render
    const needed = track.scrollWidth - track.clientWidth;
    setScrollNeeded(needed);

    const onScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const progress = -rect.top / (rect.height - window.innerHeight);
      const maxScroll = track.scrollWidth - track.clientWidth;
      track.scrollLeft = Math.max(0, Math.min(maxScroll, progress * maxScroll));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const services = [
    { icon: "☽", title: "Personality & Life Path",    desc: "Deep insights into your personality and life path — who you truly are at a soul level." },
    { icon: "★", title: "Career & Finances",           desc: "Clarity on career choices, finances, and major life decisions with precise timing." },
    { icon: "☯", title: "Relationship Dynamics",       desc: "Understanding compatibility, karmic bonds, and how to nurture your closest relationships." },
    { icon: "✦", title: "Opportunities & Challenges",  desc: "Awareness of upcoming planetary shifts — so you prepare instead of react." },
    { icon: "◎", title: "Emotional Reassurance",       desc: "Direction, grounding, and the confidence to move forward aligned with your chart." },
  ];

  return (
    <section
      ref={sectionRef}
      style={{
        background: "#faf8f5",
        padding: 0,
        height: `calc(100vh + ${scrollNeeded}px)`,
        zIndex: 1,
      }}
    >
      <div style={{
        position: "sticky", top: 0, height: "100vh",
        display: "flex", flexDirection: "column", justifyContent: "center",
        background: "#faf8f5", overflow: "hidden",
      }}>

        {/* heading */}
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 48px 28px", textAlign: "center" }}>
          <div style={{ fontSize: 60, letterSpacing: 4, color: 'black' , marginBottom: 12, fontFamily: "'Ibarra Real Nova', serif" }}>
            What You Can Gain
          </div>
          <h2 style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 42, fontWeight: 400, color: gold, lineHeight: 1.2, marginBottom: 8 }}>
            From a Consultation
          </h2>
          <p style={{ fontSize: 15, color: "#9a8a80", fontFamily: "'Glacial Indifference', sans-serif", maxWidth: 560, margin: "0 auto 4px", lineHeight: 1.7 }}>
            A Vedic Astrology consultation is not just about knowing the future — it's about empowerment.
          </p>
         
        </div>

        {/* cards track */}
        <div
          ref={trackRef}
          style={{ overflowX: "hidden", overflowY: "hidden", scrollbarWidth: "none" }}
        >
          <div style={{ display: "flex", gap: "24px", padding: "8px 48px", width: "max-content" }}>
            {services.map((s, i) => (
              <div
                key={i}
                style={{
                  width: 300, flexShrink: 0,
                  background: "transparent",
                  border: `1.5px dashed ${gold}66`,
                  borderRadius: 0,
                  padding: "44px 32px",
                  display: "flex", flexDirection: "column", gap: 18,
                  transition: "border-color 0.3s, transform 0.3s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = gold;
                  e.currentTarget.style.transform = "translateY(-6px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = `${gold}66`;
                  e.currentTarget.style.transform = "none";
                }}
              >
                <div style={{
                  width: 64, height: 64,
                  border: `1px dashed ${gold}88`,
                  borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 30, color: gold,
                }}>
                  {s.icon}
                </div>
                <h4 style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 24, fontWeight: 600, color: "#2a1f1a", lineHeight: 1.3, margin: 0 }}>
                  {s.title}
                </h4>
                <p style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 16, color: "#8b7f78", lineHeight: 1.8, flexGrow: 1, margin: 0 }}>
                  {s.desc}
                </p>
                
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
/* ── APPROACH ───────────────────────────────────────────────────────────────── */
function ApproachSection() {
  const items = [
    { n: "1", title: "Detailed Birth Chart Analysis", desc: "No surface-level readings — every house, planet, and transit examined thoroughly." },
    { n: "2", title: "Real-Life Guidance", desc: "Practical advice you can actually apply to your current situation and goals." },
    { n: "3", title: "Effective Remedies", desc: "Mantras, rituals, and simple lifestyle shifts aligned to your unique chart." },
    { n: "4", title: "Personalized Attention", desc: "Every consultation is uniquely tailored to you and your life journey." },
  ];
  return (
    <section style={{ marginTop: -80, zIndex: 10, background: "#faf8f5", padding: "80px 48px" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 64, alignItems: "start" }}>
        <div>
          <div style={{ fontSize: 60, letterSpacing: 3, color: "black", marginBottom: 12, fontFamily: "'Ibarra Real Nova', serif" }}>Our Approach</div>
          <h2 style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 40, fontWeight: 400, color:gold, marginBottom: 20, lineHeight: 1.2 }}>
            How We Help at<br /><em>Vedic Saar</em>
          </h2>
          <p style={{ fontSize: 20, color: "#7a6e68", lineHeight: 1.8, fontFamily: "'Glacial Indifference', sans-serif" }}>
            We believe astrology should be practical, honest, and actionable — not vague or fear-based. We don't just tell you what's happening. We help you understand what to do about it.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {items.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              <div style={{
                width: 38, height: 38,
                border: `0.5px solid rgba(201,169,110,0.5)`,
                borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 23, color: gold,
                background: `rgba(201,169,110,0.06)`,
                flexShrink: 0,
              }}>{item.n}</div>
              <div>
                <h5 style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 30, fontWeight: 600, color: "#2a1f1a", marginBottom: 6 }}>{item.title}</h5>
                <p style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 20, color: "#8b7f78", lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhoAndCTASection() {
  const items = [
    "Feeling stuck or confused about your life direction",
    "Facing repeated obstacles or unexplained delays",
    "Seeking clarity in relationships or marriage decisions",
    "Planning major decisions — career, business, relocation",
    "Looking for deeper self-understanding and spiritual growth",
    "Ready to stop reacting and start living with intention",
  ];

  return (
    <section style={{
      marginTop: -50,
      position: "relative",
      backgroundImage: 'url("/assets/vediclast.svg")',
      backgroundSize: "cover",
      backgroundPosition: "top center",
      backgroundRepeat: "no-repeat",
      backgroundColor: "#faf8f5",
      padding: "100px 48px 120px",
      overflow: "hidden",
    }}>

      {/* WHO IS THIS FOR */}
      <div style={{ maxWidth: 1080, margin: "0 auto 100px" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{
            fontSize: 60,
            letterSpacing: 2,
            color: "black",
            fontFamily: "'Ibarra Real Nova', serif",
            fontWeight: 400,
            lineHeight: 1.1,
            marginBottom: 16,
          }}>
            Who Is This For?
          </div>
          <h2 style={{
            fontFamily: "'Ibarra Real Nova', serif",
            fontSize: 40,
            fontWeight: 400,
            color: gold,
            lineHeight: 1.2,
            margin: 0,
          }}>
            This consultation is ideal if you are:
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {items.map((item, i) => (
            <div
              key={i}
              style={{
                border: `2px dashed ${gold}66`,
                borderRadius: 0,
                padding: "32px 28px",
                display: "flex",
                gap: 16,
                alignItems: "flex-start",
                background: "transparent",
                transition: "border-color 0.3s, transform 0.3s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = gold;
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = `${gold}66`;
                e.currentTarget.style.transform = "none";
              }}
            >
              <span style={{ color: gold, fontSize: 16, marginTop: 4, flexShrink: 0 }}>▶</span>
              <p style={{
                fontSize: 18,
                color: "#7a6e68",
                lineHeight: 1.75,
                fontFamily: "'Glacial Indifference', sans-serif",
                margin: 0,
              }}>
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>

   

      {/* CTA */}
      <div style={{ textAlign: "center", position: "relative", zIndex: 2 }}>
        <div style={{
          fontSize: 12,
          letterSpacing: 4,
          color: gold,
          textTransform: "uppercase",
          marginTop: '320px',
          marginBottom: 20,
          fontFamily: "'Glacial Indifference', sans-serif",
        }}>
          Illuminate Your Path
        </div>

        <h2 style={{
          fontFamily: "'Ibarra Real Nova', serif",
          fontSize: "clamp(36px, 5vw, 54px)",
          fontWeight: 400,
          color: "#2a1f1a",
          lineHeight: 1.2,
          maxWidth: 560,
          margin: "0 auto 16px",
        }}>
          Book Your Vedic Astrology<br />Consultation
        </h2>

        <p style={{
          fontSize: 20,
          color: "#8b7f78",
          fontStyle: "italic",
          marginBottom: 48,
          fontFamily: "'Ibarra Real Nova', serif",
          lineHeight: 1.7,
        }}>
          The answers you are searching for already exist —<br />let us uncover them together.
        </p>

        <button
          style={{
            background: "transparent",
            color: gold,
            border: `2px dashed ${gold}`,
            borderRadius: 0,
            fontSize: 14,
            letterSpacing: 3,
            padding: "20px 56px",
            cursor: "pointer",
            textTransform: "uppercase",
            fontFamily: "'Glacial Indifference', sans-serif",
            fontWeight: 500,
            transition: "all 0.3s",
          }}
          onMouseEnter={e => {
            e.target.style.background = gold;
            e.target.style.color = "#fff";
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = `0 16px 40px rgba(201,169,110,0.3)`;
          }}
          onMouseLeave={e => {
            e.target.style.background = "transparent";
            e.target.style.color = gold;
            e.target.style.transform = "none";
            e.target.style.boxShadow = "none";
          }}
        >
          Book Your Consultation Now →
        </button>
      </div>

    </section>
  );
}

/* ── ROOT ────────────────────────────────────────────────────────────────────── */
export default function VedicAstrologyPage() {
  return (
    <>
      <style>{globalCss}</style>
      <div style={{ fontFamily: "'Glacial Indifference', sans-serif", background: "#fff", minHeight: "100vh" }}>
        <Hero />
        <ConstellationOverlay />
        <WhatIsSection />
        <SlidingStrip />
        <WhySection />
        <CrescentMoonOverlay />
        <ServicesSection />
        <ApproachSection />
        <WhoAndCTASection />
        
      </div>
    </>
  );
}