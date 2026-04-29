import { useState, useEffect, useRef } from "react";

/* ── Fonts ── */
if (typeof document !== "undefined" && !document.getElementById("lk-fonts")) {
  const l = document.createElement("link");
  l.id = "lk-fonts"; l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Ibarra+Real+Nova:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap";
  document.head.appendChild(l);
}
if (typeof document !== "undefined" && !document.getElementById("lk-fonts2")) {
  const l = document.createElement("link");
  l.id = "lk-fonts2"; l.rel = "stylesheet";
  l.href = "https://fonts.cdnfonts.com/css/glacial-indifference-2";
  document.head.appendChild(l);
}

const H    = "'Ibarra Real Nova', serif";
const B    = "'Glacial Indifference', sans-serif";
const GOLD = "#c4902a";

/* Navbar top-bar (38px) + nav row (112px) = 150px */
const NAV_H = 150;

const remedies = [
  { planet: "Saturn",  symbol: "♄", text: "Feed black dogs or crows. Donate black sesame on Saturdays. Pour mustard oil on a peepal tree." },
  { planet: "Rahu",    symbol: "☊", text: "Feed stray dogs. Offer coal or coconut in flowing water. Wear Hessonite (Gomed) as prescribed." },
  { planet: "Ketu",    symbol: "☋", text: "Feed spotted dogs. Donate blankets to the needy. Keep a dog at home." },
  { planet: "Mars",    symbol: "♂", text: "Feed chapatis with jaggery to monkeys. Donate red lentils. Plant a red flower tree." },
  { planet: "Jupiter", symbol: "♃", text: "Respect elders and teachers. Donate yellow items. Keep gold or yellow objects at home." },
  { planet: "Venus",   symbol: "♀", text: "Donate white items. Treat women with respect. Feed white cows." },
  { planet: "Mercury", symbol: "☿", text: "Donate green items. Feed green grass to cows. Respect sisters and aunts." },
  { planet: "Sun",     symbol: "☉", text: "Offer water to the Sun at sunrise. Donate wheat or copper. Serve father figures." },
  { planet: "Moon",    symbol: "☽", text: "Keep silver at home. Fast on Mondays. Donate milk or rice." },
];

export default function LalKitab() {
  /* 0 = book closed | 1 = book open | 2 = content visible */
  const [phase, setPhase] = useState(0);
  const lastWheel         = useRef(0);
  const touchStartY       = useRef(null);
  const phaseRef          = useRef(0);
  phaseRef.current        = phase;

  /* ── body scroll lock (phases 0 & 1 only) ── */
  useEffect(() => {
    document.body.style.overflow = phase < 2 ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [phase]);

  /* ── non-passive wheel → preventDefault stops page scroll ── */
  useEffect(() => {
    const onWheel = (e) => {
      if (phaseRef.current >= 2) return;
      e.preventDefault();
      const now = Date.now();
      if (now - lastWheel.current < 800) return;
      lastWheel.current = now;
      if (e.deltaY > 0) setPhase(p => Math.min(p + 1, 2));
      if (e.deltaY < 0) setPhase(p => Math.max(p - 1, 0));
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  /* ── touch ── */
  useEffect(() => {
    const onStart = (e) => { if (phaseRef.current < 2) touchStartY.current = e.touches[0].clientY; };
    const onEnd   = (e) => {
      if (touchStartY.current == null || phaseRef.current >= 2) return;
      const dy = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(dy) < 50) { touchStartY.current = null; return; }
      if (dy > 0) setPhase(p => Math.min(p + 1, 2));
      else        setPhase(p => Math.max(p - 1, 0));
      touchStartY.current = null;
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend",   onEnd,   { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend",   onEnd);
    };
  }, []);

  /* Section fills exactly the viewport below the navbar */
  const sectionH = `calc(100vh - ${NAV_H}px)`;

  return (
    <>
      <style>{`
        @keyframes lk-pulse  { 0%,100%{opacity:.5} 50%{opacity:1} }
        @keyframes lk-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(7px)} }
      `}</style>

      {/*
        ─── OUTER SECTION ───────────────────────────────────────────
        In the normal page flow — Navbar above, Footer below.
        height = viewport minus navbar so it fills the visible window.
        overflow:hidden clips the sliding panels.
      */}
      <div style={{
        position:        "relative",
        width:           "100%",
        height:          sectionH,
        overflow:        "hidden",
        backgroundImage: "url('/assets/Mantra-bg.png')",
        backgroundSize:  "cover",
        backgroundPosition: "center",
      }}>

        {/* vignette only — NO dark overlay per user request */}

        {/* ══════════════════════════════════════════════════════════
            BOOK SCENE — phases 0 & 1
            Absolutely positioned so it fills the section, never
            touching the Navbar or Footer.
        ══════════════════════════════════════════════════════════ */}
        <div style={{
          position:      "absolute", inset: 0, zIndex: 10,
          display:       "flex", flexDirection: "column",
          alignItems:    "center", justifyContent: "center",
          opacity:       phase < 2 ? 1 : 0,
          pointerEvents: phase < 2 ? "auto" : "none",
          transition:    "opacity .6s ease",
        }}>

          {/* ── Book ── fades out as it opens so back cover never overlaps pages */}
          <div
            style={{
              perspective: 1200, width: 260, height: 340,
              cursor: "pointer", position: "relative", zIndex: 1,
              opacity:    phase >= 1 ? 0 : 1,
              transition: "opacity 0.4s ease 0.5s",   /* fade out mid-rotation */
              pointerEvents: phase >= 1 ? "none" : "auto",
            }}
            onClick={() => setPhase(p => Math.min(p + 1, 2))}
          >
            {/* rotating inner — origin at spine (left edge) */}
            <div style={{
              width: "100%", height: "100%",
              transformStyle: "preserve-3d",
              transformOrigin: "left center",
              transition: "transform 1s cubic-bezier(.19,1,.22,1)",
              transform: phase >= 1
                ? "rotateY(-148deg) rotateX(4deg)"
                : "rotateY(0deg)    rotateX(4deg)",
            }}>
              {/* spine */}
              <div style={{ position:"absolute",left:-20,top:0,width:20,height:"100%",background:"#3d0808",borderRadius:"5px 0 0 5px",transform:"rotateY(-90deg)",transformOrigin:"right center" }} />

              {/* front cover — backfaceVisibility hidden so it disappears past 90° */}
              <div style={{
                position:"absolute",inset:0,
                display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10,
                background:"linear-gradient(160deg,#9b2020,#6b0f0f)",
                borderRadius:"3px 10px 10px 3px",
                border:"2px solid #5a0d0d",
                boxShadow:"inset -8px 0 18px rgba(0,0,0,.4)",
                backfaceVisibility:"hidden",WebkitBackfaceVisibility:"hidden",
              }}>
                <div style={{ position:"absolute",inset:10,border:"1px solid rgba(196,144,42,.38)",borderRadius:5,pointerEvents:"none" }} />
                <div style={{ width:120,height:1,background:"linear-gradient(90deg,transparent,#d4a030,transparent)" }} />
                <div style={{ fontFamily:H,fontSize:20,color:"#e8c060",letterSpacing:2 }}>लाल किताब</div>
                <div style={{ fontFamily:H,fontWeight:700,fontSize:26,letterSpacing:".18em",color:"#f5d080",textShadow:"0 2px 8px rgba(0,0,0,.5)" }}>LAL KITAB</div>
                <div style={{ fontFamily:B,fontSize:9,letterSpacing:".4em",textTransform:"uppercase",color:GOLD }}>The Red Book</div>
                <div style={{ width:120,height:1,background:"linear-gradient(90deg,transparent,#d4a030,transparent)" }} />
                <div style={{ fontFamily:B,fontSize:10,letterSpacing:".1em",color:"#8a6020" }}>Practical Remedies of the Stars</div>
              </div>
              {/* no back cover — it was the culprit appearing over the open pages */}
            </div>

            {/* pages edge */}
            <div style={{ position:"absolute",top:4,right:-10,width:12,height:"calc(100% - 8px)",background:"repeating-linear-gradient(90deg,#f5edd8 0,#f5edd8 2px,#ddd0a8 3px,#ddd0a8 4px)",borderRadius:"0 2px 2px 0",pointerEvents:"none" }} />
          </div>

          {/* ── Open pages — fade in after book has faded out ── */}
          <div style={{
            position:"absolute",
            width:"min(520px, 90vw)", height:300,
            left:"50%", top:"50%", transform:"translate(-50%,-50%)",
            display:"flex",
            opacity:       phase === 1 ? 1 : 0,
            pointerEvents: "none",
            transition:    "opacity 0.5s ease 0.75s",   /* starts after book is gone */
          }}>
            {/* left page */}
            <div style={{ flex:1,position:"relative",display:"flex",flexDirection:"column",justifyContent:"center",padding:"30px 26px",background:"#fdf6e3",borderRadius:"6px 0 0 6px",borderRight:"2px solid #c8b870",boxShadow:"inset -10px 0 20px rgba(0,0,0,.08)" }}>
              <div style={{ textAlign:"center",fontSize:18,color:GOLD,marginBottom:8 }}>✦</div>
              <div style={{ fontFamily:H,fontWeight:600,fontSize:15,marginBottom:8,color:"#8b1a1a" }}>Lal Kitab</div>
              <div style={{ width:"100%",height:1,background:`linear-gradient(90deg,transparent,${GOLD},transparent)`,opacity:.5,marginBottom:12 }} />
              <p style={{ fontFamily:B,fontSize:12,lineHeight:1.9,color:"#3a2a15",margin:0 }}>
                Written in 19th-century Punjab, the Red Book introduced a revolutionary approach — one focused on actively rewriting fate, not merely reading it.
              </p>
              <p style={{ position:"absolute",bottom:12,left:22,fontFamily:B,fontSize:9,color:"#a08040",margin:0 }}>i</p>
            </div>
            {/* right page */}
            <div style={{ flex:1,position:"relative",display:"flex",flexDirection:"column",justifyContent:"center",padding:"30px 26px",background:"#fdf6e3",borderRadius:"0 6px 6px 0",boxShadow:"inset 10px 0 20px rgba(0,0,0,.06)" }}>
              <div style={{ textAlign:"center",fontSize:18,color:GOLD,marginBottom:8 }}>❧</div>
              <div style={{ fontFamily:H,fontWeight:600,fontSize:15,marginBottom:8,color:"#8b1a1a" }}>The Principle</div>
              <div style={{ width:"100%",height:1,background:`linear-gradient(90deg,transparent,${GOLD},transparent)`,opacity:.5,marginBottom:12 }} />
              <p style={{ fontFamily:B,fontSize:12,lineHeight:1.9,color:"#3a2a15",margin:0 }}>
                Karmic debts (rin) can be repaid through conscious symbolic actions — freeing you from malefic planetary grip. The universe doesn't require suffering to heal.
              </p>
              <p style={{ position:"absolute",bottom:12,right:22,fontFamily:B,fontSize:9,color:"#a08040",margin:0 }}>ii</p>
            </div>
          </div>

          {/* ── Scroll hint ── */}
          <div style={{ position:"absolute",bottom:28,left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:6,pointerEvents:"none" }}>
            <p style={{ fontFamily:B,fontSize:9,letterSpacing:".32em",textTransform:"uppercase",color:"rgba(248,220,160,.9)",textShadow:"0 1px 6px rgba(0,0,0,.7)",animation:"lk-pulse 2s ease-in-out infinite",margin:0 }}>
              {phase === 0 ? "Scroll to open" : "Scroll to reveal"}
            </p>
            <span style={{ fontSize:22,color:"rgba(248,210,120,.7)",textShadow:"0 1px 6px rgba(0,0,0,.6)",animation:"lk-bounce 1.6s ease-in-out infinite",lineHeight:1 }}>⌄</span>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            CONTENT PANEL — phase 2
            Slides up from the bottom of the section. Fills the
            same section so Navbar and Footer are untouched.
        ══════════════════════════════════════════════════════════ */}
        <div style={{
          position:   "absolute", inset: 0, zIndex: 20,
          overflowY:  "auto",
          background: "#ffffff",
          transform:  phase === 2 ? "translateY(0)" : "translateY(100%)",
          transition: "transform .9s cubic-bezier(.19,1,.22,1)",
        }}>
          <div style={{ maxWidth: 760, margin: "0 auto", padding: "60px 36px 64px" }}>

            {/* header */}
            <div style={{ textAlign:"center", marginBottom:44 }}>
              <p style={{ fontFamily:B,fontSize:9,letterSpacing:".42em",textTransform:"uppercase",color:GOLD,margin:"0 0 14px" }}>
                Simple Actions · Profound Transformations
              </p>
              <div style={{ width:160,height:1,margin:"0 auto 20px",background:`linear-gradient(90deg,transparent,${GOLD},transparent)` }} />
              <h1 style={{ fontFamily:H,fontWeight:600,fontSize:40,letterSpacing:".15em",color:"#6b0f0f",margin:"0 0 6px" }}>
                LAL KITAB
              </h1>
              <p style={{ fontFamily:H,fontStyle:"italic",fontSize:15,color:"#a08040",margin:0 }}>
                लाल किताब — Remedies of the Stars
              </p>
              <div style={{ width:160,height:1,margin:"18px auto 0",background:`linear-gradient(90deg,transparent,${GOLD},transparent)` }} />
            </div>

            {/* intro */}
            <p style={{ fontFamily:B,textAlign:"center",fontSize:13,lineHeight:2,color:"#7a5c30",maxWidth:520,margin:"0 auto 48px" }}>
              Each planet carries a karmic debt. These time-honoured remedies — drawn from the everyday world — dissolve obstructions and awaken dormant blessings.
            </p>

            {/* remedy cards — cream */}
            <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:44 }}>
              {remedies.map(r => (
                <div
                  key={r.planet}
                  style={{ position:"relative",background:"#faf8f5",border:"2px dashed rgba(196,144,42,.35)",padding:"20px 16px",overflow:"hidden",transition:"transform .25s,box-shadow .25s",cursor:"default" }}
                  onMouseEnter={e => { e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="0 8px 28px rgba(139,26,26,.1)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=""; }}
                >
                  <div style={{ position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,rgba(196,144,42,.6),transparent)" }} />
                  <div style={{ position:"absolute",top:8,right:8,fontSize:9,color:GOLD,opacity:.28 }}>✦</div>
                  <div style={{ fontFamily:H,fontWeight:600,fontSize:13,marginBottom:6,display:"flex",alignItems:"center",gap:6,color:"#6b0f0f" }}>
                    <span style={{ opacity:.65,fontSize:15 }}>{r.symbol}</span>
                    <span style={{ fontFamily:B,letterSpacing:".12em",textTransform:"uppercase",fontSize:10 }}>{r.planet}</span>
                  </div>
                  <div style={{ width:"100%",height:1,marginBottom:10,background:"linear-gradient(90deg,rgba(196,144,42,.5),transparent)" }} />
                  <p style={{ fontFamily:B,fontSize:11.5,lineHeight:1.8,color:"#6b5030",margin:0 }}>{r.text}</p>
                </div>
              ))}
            </div>

            {/* kundali box */}
            <div style={{ padding:"28px 32px",marginBottom:32,textAlign:"center",background:"#faf8f5",border:"2px dashed rgba(196,144,42,.35)" }}>
              <div style={{ fontFamily:B,fontSize:9,letterSpacing:".3em",textTransform:"uppercase",color:GOLD,marginBottom:14 }}>
                Lal Kitab Kundali Reading
              </div>
              <p style={{ fontFamily:B,fontSize:13,lineHeight:1.95,color:"#7a5c30",marginBottom:8 }}>
                Our experts prepare a dedicated Lal Kitab Kundali mapping your karmic debts (rin), sleeping planets, year-by-year forecasts, and personalised annual remedy prescriptions.
              </p>
              <p style={{ fontFamily:H,fontStyle:"italic",fontSize:13,color:"#a08040",margin:0 }}>
                Especially powerful for those facing sudden reversals, ancestral karma, or limited results from traditional remedies.
              </p>
            </div>

            {/* CTA */}
            <div style={{ textAlign:"center",marginBottom:16 }}>
              <button
                style={{ fontFamily:B,fontSize:10,letterSpacing:".22em",textTransform:"uppercase",padding:"15px 44px",background:"black",border:"2px dashed white",color:"white",cursor:"pointer",transition:"opacity .2s" }}
                onMouseEnter={e => e.currentTarget.style.opacity=".8"}
                onMouseLeave={e => e.currentTarget.style.opacity="1"}
              >
                Book a Reading →
              </button>
            </div>

            {/* close */}
            <div style={{ textAlign:"center",marginTop:12 }}>
              <button
                style={{ fontFamily:B,fontSize:9,letterSpacing:".18em",textTransform:"uppercase",color:"rgba(160,128,64,.5)",background:"none",border:"none",cursor:"pointer" }}
                onClick={() => setPhase(1)}
              >
                ↑ close
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
