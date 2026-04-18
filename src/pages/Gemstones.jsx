import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ── DATA ──────────────────────────────────────────────────────────────────────
const gems = [
  {
    name: 'Yellow Sapphire', sanskrit: 'Pukhraj', planet: 'Jupiter', color: '#d4a017',
    price: '$89.99', img: '/assets/Yellow-Sapphire.png', thumb: '/assets/Yellow-Sapphire.png',
    description: 'Yellow Sapphire is the gemstone of Jupiter — planet of wisdom, fortune, and divine grace. Wearing it enhances intelligence, attracts wealth, and brings marital harmony.',
    benefits: ['Enhances wisdom & knowledge', 'Attracts prosperity & wealth', 'Strengthens Jupiter energy', 'Promotes spiritual growth'],
    bestFor: 'Sagittarius & Pisces', wearing: 'Index finger, gold ring, Thursday morning',
  },
  {
    name: 'Blue Sapphire', sanskrit: 'Neelam', planet: 'Saturn', color: '#2c5f8a',
    price: '$129.99', img: '/assets/Blue-Sapphire.png', thumb: '/assets/Blue-Sapphire.png',
    description: 'Blue Sapphire is the most powerful gemstone of Saturn. It acts swiftly and can bring dramatic transformations in career, finances, and overall destiny when worn correctly.',
    benefits: ['Career acceleration', 'Protection from evil eye', 'Mental clarity & focus', 'Removes Saturn doshas'],
    bestFor: 'Capricorn & Aquarius', wearing: 'Middle finger, silver/panchdhatu, Saturday morning',
  },
  {
    name: 'Emerald', sanskrit: 'Panna', planet: 'Mercury', color: '#2d7a57',
    price: '$99.99', img: '/assets/Emerald.png', thumb: '/assets/Emerald.png',
    description: 'Emerald represents Mercury — planet of intellect and communication. It boosts memory, sharpens analytical skills, and is especially beneficial for students and business professionals.',
    benefits: ['Boosts intellect & memory', 'Enhances communication', 'Business & trade success', 'Nervous system health'],
    bestFor: 'Gemini & Virgo', wearing: 'Little finger, gold/silver, Wednesday morning',
  },
  {
    name: 'Opal', sanskrit: 'Dudhiya Patthar', planet: 'Venus', color: '#9b6ba0',
    price: '$74.99', img: '/assets/Opal.png', thumb: '/assets/Opal.png',
    description: 'Opal is associated with Venus — planet of beauty, love, and luxury. It enhances creativity, brings romantic fulfillment, and attracts comfort and artistic expression.',
    benefits: ['Enhances creativity', 'Attracts love & romance', 'Boosts self-confidence', 'Brings luxury & comfort'],
    bestFor: 'Taurus & Libra', wearing: 'Index or ring finger, silver, Friday morning',
  },
  {
    name: "Cat's Eye", sanskrit: 'Lehsunia', planet: 'Ketu', color: '#8a6d2f',
    price: '$109.99', img: '/assets/CatsEye.png', thumb: '/assets/CatsEye.png',
    description: "Cat's Eye is the gemstone of Ketu — the shadow planet of spiritual liberation. It offers protection from unseen dangers and reverses misfortunes.",
    benefits: ['Protection from evil', 'Reverses misfortune', 'Spiritual liberation', 'Ketu Dasha relief'],
    bestFor: 'Scorpio & Pisces', wearing: 'Middle finger, panchdhatu, Tuesday or Saturday',
  },
  {
    name: 'Hessonite', sanskrit: 'Gomed', planet: 'Rahu', color: '#b05a2a',
    price: '$64.99', img: '/assets/Hessonite.png', thumb: '/assets/Hessonite.png',
    description: 'Hessonite is governed by Rahu — the north node of the Moon. It dispels confusion, removes obstacles, and helps the wearer gain clarity and professional success.',
    benefits: ['Removes Rahu obstacles', 'Enhances focus & clarity', 'Career & financial growth', 'Dispels fear & confusion'],
    bestFor: 'Virgo & Gemini', wearing: 'Middle finger, panchdhatu, Saturday evening',
  },
  {
    name: 'Ruby', sanskrit: 'Manik', planet: 'Sun', color: '#a82828',
    price: '$149.99', img: '/assets/Ruby.png', thumb: '/assets/Ruby.png',
    description: 'Ruby is the gemstone of the Sun — king of all planets. It bestows authority, confidence, and vitality. It strengthens leadership qualities and boosts self-expression.',
    benefits: ['Boosts confidence & authority', 'Strengthens solar energy', 'Leadership qualities', 'Vitality & health'],
    bestFor: 'Leo & Aries', wearing: 'Ring finger, gold, Sunday morning',
  },
  {
    name: 'Pearl', sanskrit: 'Moti', planet: 'Moon', color: '#8a7a60',
    price: '$54.99', img: '/assets/Pearl.png', thumb: '/assets/Pearl.png',
    description: 'Pearl represents the Moon — governing emotions, intuition, and mental peace. It calms an agitated mind and strengthens relationships.',
    benefits: ['Emotional stability', 'Mental peace & clarity', 'Strengthens Moon energy', 'Improves relationships'],
    bestFor: 'Cancer & Scorpio', wearing: 'Little finger, silver, Monday morning',
  },
  {
    name: 'Red Coral', sanskrit: 'Moonga', planet: 'Mars', color: '#c0392b',
    price: '$79.99', img: '/assets/RedCoral.png', thumb: '/assets/RedCoral.png',
    description: 'Red Coral is the gemstone of Mars — planet of energy and courage. It gives physical strength, eliminates hesitation, and helps overcome Mangal dosha.',
    benefits: ['Boosts energy & courage', 'Removes Mangal dosha', 'Physical strength', 'Overcomes fear & debt'],
    bestFor: 'Aries & Scorpio', wearing: 'Ring finger, gold/copper, Tuesday morning',
  },
];

// ── FLOATING PARTICLES ────────────────────────────────────────────────────────
function FloatingParticles({ color }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const particles = el.querySelectorAll('.fp');
    particles.forEach((p, i) => {
      gsap.set(p, { x: Math.random() * 400, y: Math.random() * 300, opacity: 0 });
      gsap.to(p, {
        y: `-=${40 + Math.random() * 60}`,
        x: `+=${(Math.random() - 0.5) * 30}`,
        opacity: [0, 0.7, 0],
        duration: 3 + Math.random() * 3,
        delay: i * 0.3,
        repeat: -1,
        ease: 'none',
      });
    });
    return () => gsap.killTweensOf(particles);
  }, [color]);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {Array.from({ length: 9 }).map((_, i) => (
        <div
          key={i}
          className="fp absolute rounded-full"
          style={{
            width: 4 + (i % 3) * 2,
            height: 4 + (i % 3) * 2,
            background: color,
            filter: 'blur(1px)',
          }}
        />
      ))}
    </div>
  );
}

// ── PAYPAL MODAL ──────────────────────────────────────────────────────────────
function PayPalModal({ gem, onClose }) {
  const overlayRef = useRef(null);
  const cardRef = useRef(null);
  const [step, setStep] = useState('details'); // details | processing | success
  const [email, setEmail] = useState('');
  const [cardNum, setCardNum] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  useEffect(() => {
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
    gsap.fromTo(cardRef.current,
      { scale: 0.82, opacity: 0, y: 40 },
      { scale: 1, opacity: 1, y: 0, duration: 0.45, ease: 'back.out(1.4)' }
    );
  }, []);

  const handleClose = () => {
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.2 });
    gsap.to(cardRef.current, { scale: 0.88, opacity: 0, y: 20, duration: 0.2, onComplete: onClose });
  };

  const handlePay = (e) => {
    e.preventDefault();
    setStep('processing');
    setTimeout(() => setStep('success'), 2200);
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: 'rgba(10,8,4,0.78)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => e.target === overlayRef.current && handleClose()}
    >
      <div
        ref={cardRef}
        className="relative w-full max-w-md mx-4 overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #1c1508 0%, #0f0d07 100%)',
          border: `1px solid ${gem.color}40`,
          borderRadius: 8,
          boxShadow: `0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px ${gem.color}15, inset 0 1px 0 ${gem.color}20`,
        }}
      >
        {/* Glow accent top */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${gem.color}80, transparent)` }} />

        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-7 pb-5" style={{ borderBottom: `1px solid ${gem.color}18` }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `${gem.color}20`, border: `1px solid ${gem.color}40` }}>
              <span style={{ fontSize: 14 }}>💎</span>
            </div>
            <div>
              <p style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: gem.color }}>{gem.planet} · {gem.sanskrit}</p>
              <p style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 18, color: '#f5ede0', lineHeight: 1 }}>{gem.name}</p>
            </div>
          </div>
          <button onClick={handleClose} style={{ color: '#9a8060', fontSize: 20, background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1 }}>✕</button>
        </div>

        {step === 'details' && (
          <form onSubmit={handlePay} className="px-7 py-6">
            {/* PayPal badge */}
            <div className="flex items-center gap-2 mb-6 py-3 px-4 rounded" style={{ background: 'rgba(0,112,186,0.12)', border: '1px solid rgba(0,112,186,0.25)' }}>
              <svg width="70" height="18" viewBox="0 0 70 18" fill="none">
                <text x="0" y="14" fontFamily="Arial" fontWeight="bold" fontSize="14" fill="#009CDE">Pay</text>
                <text x="28" y="14" fontFamily="Arial" fontWeight="bold" fontSize="14" fill="#012169">Pal</text>
              </svg>
              <span style={{ fontFamily: "'Glacial Indifference',sans-serif", fontSize: 9, letterSpacing: '0.1em', color: '#7ab3d4', textTransform: 'uppercase' }}>Secure Checkout</span>
              <span style={{ marginLeft: 'auto', fontSize: 12 }}>🔒</span>
            </div>

            {/* Amount */}
            <div className="flex justify-between items-center mb-6 pb-5" style={{ borderBottom: `1px solid ${gem.color}18` }}>
              <span style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 15, color: '#9a8060' }}>Total Amount</span>
              <span style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 28, color: '#f5ede0', fontWeight: 300 }}>{gem.price}</span>
            </div>

            {[
              { label: 'Email Address', val: email, set: setEmail, type: 'email', ph: 'you@example.com', full: true },
              { label: 'Card Number', val: cardNum, set: setCardNum, type: 'text', ph: '1234  5678  9012  3456', full: true },
            ].map(({ label, val, set, type, ph, full }) => (
              <div key={label} className="mb-4">
                <label style={{ fontFamily: "'Glacial Indifference',sans-serif", fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#9a8060', display: 'block', marginBottom: 6 }}>{label}</label>
                <input
                  required type={type} placeholder={ph} value={val} onChange={e => set(e.target.value)}
                  style={{
                    width: '100%', background: 'rgba(255,255,255,0.04)', border: `1px solid ${gem.color}30`,
                    borderRadius: 4, padding: '10px 14px', color: '#f5ede0',
                    fontFamily: "'Ibarra', serif", fontSize: 15,
                    outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>
            ))}

            <div className="flex gap-4 mb-6">
              {[
                { label: 'Expiry Date', val: expiry, set: setExpiry, ph: 'MM / YY' },
                { label: 'CVV', val: cvv, set: setCvv, ph: '•••' },
              ].map(({ label, val, set, ph }) => (
                <div key={label} style={{ flex: 1 }}>
                  <label style={{ fontFamily: "'Glacial Indifference',sans-serif", fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#9a8060', display: 'block', marginBottom: 6 }}>{label}</label>
                  <input
                    required type="text" placeholder={ph} value={val} onChange={e => set(e.target.value)}
                    style={{
                      width: '100%', background: 'rgba(255,255,255,0.04)', border: `1px solid ${gem.color}30`,
                      borderRadius: 4, padding: '10px 14px', color: '#f5ede0',
                      fontFamily: "'Ibarra', serif", fontSize: 15,
                      outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                </div>
              ))}
            </div>

            <button
              type="submit"
              style={{
                width: '100%', background: `linear-gradient(135deg, ${gem.color}, ${gem.color}cc)`,
                color: '#0f0d07', fontFamily: "'Glacial Indifference',sans-serif", fontSize: 11,
                letterSpacing: '0.2em', textTransform: 'uppercase', padding: '14px',
                border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 600,
              }}
            >
              ✦ Complete Purchase — {gem.price}
            </button>

            <p style={{ fontFamily: "'Glacial Indifference',sans-serif", fontSize: 9, color: '#6b5840', textAlign: 'center', marginTop: 12, letterSpacing: '0.08em' }}>
              256-bit SSL encrypted · Powered by PayPal
            </p>
          </form>
        )}

        {step === 'processing' && (
          <div className="px-7 py-14 flex flex-col items-center gap-5">
            <ProcessingSpinner color={gem.color} />
            <p style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 18, color: '#f5ede0' }}>Processing your order…</p>
            <p style={{ fontFamily: "'Glacial Indifference',sans-serif", fontSize: 9, letterSpacing: '0.14em', color: '#9a8060', textTransform: 'uppercase' }}>Please wait</p>
          </div>
        )}

        {step === 'success' && (
          <SuccessState gem={gem} onClose={handleClose} />
        )}
      </div>
    </div>
  );
}

function ProcessingSpinner({ color }) {
  const ringRef = useRef(null);
  useEffect(() => {
    gsap.to(ringRef.current, { rotation: 360, duration: 1.2, repeat: -1, ease: 'none' });
  }, []);
  return (
    <div ref={ringRef} style={{ width: 56, height: 56, borderRadius: '50%', border: `3px solid ${color}30`, borderTopColor: color }} />
  );
}

function SuccessState({ gem, onClose }) {
  const iconRef = useRef(null);
  useEffect(() => {
    gsap.fromTo(iconRef.current, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)' });
  }, []);
  return (
    <div className="px-7 py-12 flex flex-col items-center gap-4 text-center">
      <div ref={iconRef} className="w-16 h-16 rounded-full flex items-center justify-center mb-2"
        style={{ background: `${gem.color}25`, border: `2px solid ${gem.color}60` }}>
        <span style={{ fontSize: 28 }}>✓</span>
      </div>
      <p style={{ fontFamily: "'Ibarra', serif", fontSize: 26, color: '#f5ede0', fontWeight: 300 }}>Order Confirmed!</p>
      <p style={{ fontFamily: "'Ibarra', serif", fontSize: 15, color: '#9a8060', lineHeight: 1.7, maxWidth: 280 }}>
        Your <strong style={{ color: gem.color }}>{gem.name}</strong> will be energised, cleansed, and dispatched within 3–5 days.
      </p>
      <button onClick={onClose} style={{
        marginTop: 8, background: `${gem.color}20`, color: gem.color,
        fontFamily: "'Glacial Indifference',sans-serif", fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
        padding: '11px 28px', border: `1px solid ${gem.color}50`, borderRadius: 2, cursor: 'pointer',
      }}>
        Continue Shopping
      </button>
    </div>
  );
}

// ── BOOK CONSULTATION (fixed popup) ──────────────────────────────────────────
function BookConsultationFixed() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [concern, setConcern] = useState('');
  const panelRef = useRef(null);
  const btnRef = useRef(null);

  // Entrance animation for FAB
  useEffect(() => {
    gsap.fromTo(btnRef.current,
      { x: 80, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.7, delay: 1.2, ease: 'back.out(1.5)' }
    );
    // Subtle pulse on FAB
    gsap.to(btnRef.current, {
      boxShadow: '0 0 0 8px rgba(184,134,11,0.0)',
      repeat: -1, duration: 1.8, ease: 'power2.inOut', yoyo: true,
    });
  }, []);

  useEffect(() => {
    if (open && panelRef.current) {
      gsap.fromTo(panelRef.current,
        { opacity: 0, y: 24, scale: 0.94 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(1.3)' }
      );
    }
  }, [open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      {/* FAB */}
      <button
        ref={btnRef}
        onClick={() => setOpen(o => !o)}
        className="fixed z-[9998] flex items-center gap-2.5 overflow-hidden"
        style={{
          bottom: 28, right: 24,
          background: 'linear-gradient(135deg, #1a1206, #2a1e0a)',
          border: '1px solid #b8860b60',
          color: '#f5ede0',
          borderRadius: 50,
          padding: '12px 22px 12px 16px',
          cursor: 'pointer',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px #b8860b15',
          fontFamily: "'Glacial Indifference',sans-serif",
          fontSize: 10,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
        }}
      >
        <span style={{ fontSize: 18 }}>🔮</span>
        <span>Book Consultation</span>
        <span style={{ color: '#b8860b', marginLeft: 2, transition: 'transform 0.3s', display: 'inline-block', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>▲</span>
      </button>

      {/* Panel */}
      {open && (
        <div
          ref={panelRef}
          className="fixed z-[9997] w-80"
          style={{
            bottom: 82, right: 24,
            background: 'linear-gradient(160deg, #1c1508 0%, #0f0d07 100%)',
            border: '1px solid #b8860b35',
            borderRadius: 8,
            boxShadow: '0 24px 72px rgba(0,0,0,0.7), 0 0 0 1px #b8860b10',
            overflow: 'hidden',
          }}
        >
          {/* Top accent */}
          <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, #b8860b80, transparent)' }} />

          <div className="px-6 pt-5 pb-2" style={{ borderBottom: '1px solid rgba(184,134,11,0.12)' }}>
            <p style={{ fontFamily: "'Glacial Indifference',sans-serif", fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#b8860b', marginBottom: 4 }}>
              Vedic Astrology
            </p>
            <h3 style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 20, color: '#f5ede0', fontWeight: 400, lineHeight: 1.1 }}>
              Book a Personal<br />Consultation
            </h3>
            <p style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 13, color: '#9a8060', marginTop: 5, lineHeight: 1.6 }}>
              Get a birth-chart reading & gem recommendation.
            </p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-3">
              {[
                { label: 'Full Name', val: name, set: setName, ph: 'Your name', type: 'text' },
                { label: 'Phone / WhatsApp', val: phone, set: setPhone, ph: '+91 98765 43210', type: 'tel' },
                { label: 'Date of Birth', val: dob, set: setDob, ph: '', type: 'date' },
              ].map(({ label, val, set, ph, type }) => (
                <div key={label}>
                  <label style={{ fontFamily: "'Glacial Indifference',sans-serif", fontSize: 8, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#9a8060', display: 'block', marginBottom: 4 }}>{label}</label>
                  <input
                    required type={type} placeholder={ph} value={val} onChange={e => set(e.target.value)}
                    style={{
                      width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(184,134,11,0.25)',
                      borderRadius: 3, padding: '8px 12px', color: '#f5ede0',
                      fontFamily: "'Ibarra', serif", fontSize: 14,
                      outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                </div>
              ))}
              <div>
                <label style={{ fontFamily: "'Glacial Indifference',sans-serif", fontSize: 8, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#9a8060', display: 'block', marginBottom: 4 }}>Your Concern</label>
                <textarea
                  rows={2} placeholder="e.g. career, marriage, health…" value={concern} onChange={e => setConcern(e.target.value)}
                  style={{
                    width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(184,134,11,0.25)',
                    borderRadius: 3, padding: '8px 12px', color: '#f5ede0', resize: 'none',
                    fontFamily: "'Ibarra', serif", fontSize: 14,
                    outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>
              <button
                type="submit"
                style={{
                  background: '#b8860b', color: '#0f0d07', fontFamily: "'Glacial Indifference',sans-serif",
                  fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
                  padding: '11px', border: 'none', borderRadius: 3, cursor: 'pointer', fontWeight: 700, marginTop: 2,
                }}
              >
                ✦ Request Consultation
              </button>
            </form>
          ) : (
            <div className="px-6 py-8 text-center">
              <div className="text-4xl mb-3">🌟</div>
              <p style={{ fontFamily: "'Ibarra', serif", fontSize: 18, color: '#f5ede0', marginBottom: 6 }}>Request Received!</p>
              <p style={{ fontFamily: "'Ibarra', serif", fontSize: 13, color: '#9a8060', lineHeight: 1.7 }}>
                Our astrologer will reach out within 24 hours on WhatsApp.
              </p>
              <button
                onClick={() => { setSubmitted(false); setOpen(false); }}
                style={{ marginTop: 14, color: '#b8860b', fontFamily: "'Glacial Indifference',sans-serif", fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Close ✕
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

// ── HERO ──────────────────────────────────────────────────────────────────────
function GemHero({ gem, onBuy }) {
  const heroRef   = useRef(null);
  const imgRef    = useRef(null);
  const radialRef = useRef(null);
  const textRef   = useRef(null);
  const benefitsRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(heroRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
    )
    .fromTo(imgRef.current,
      { scale: 0.88, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.3)' }, '-=0.3'
    )
    .fromTo(radialRef.current,
      { scale: 0.2, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.5'
    )
    .fromTo(textRef.current?.children ? Array.from(textRef.current.children) : [],
      { opacity: 0, x: -12 },
      { opacity: 1, x: 0, duration: 0.4, stagger: 0.07, ease: 'power2.out' }, '-=0.5'
    );

    // Gem image float
    gsap.to(imgRef.current, {
      y: -8, duration: 2.5, repeat: -1, yoyo: true, ease: 'sine.inOut',
    });

    // Benefits stagger reveal
    if (benefitsRef.current) {
      gsap.fromTo(
        benefitsRef.current.children,
        { opacity: 0, x: -8 },
        { opacity: 1, x: 0, stagger: 0.1, duration: 0.35, delay: 0.6, ease: 'power2.out' }
      );
    }
  }, [gem.name]);

  return (
    <div ref={heroRef} className="relative w-full" style={{ background: 'transparent' }}>
      <div
        ref={radialRef}
        className="absolute pointer-events-none"
        style={{
          top: '50%', left: '22%', transform: 'translate(-50%, -50%)',
          width: 800, height: 1100,
          background: `radial-gradient(circle, ${gem.color}25 50%, ${gem.color}10 25%, transparent 28%)`,
          zIndex: 0, filter: 'blur(28px)',
          transition: 'background 0.7s ease',
        }}
      />

      <FloatingParticles color={gem.color} />

      <div className="relative z-10 max-w-5xl mx-auto px-8 md:px-16 py-16 flex flex-col md:flex-row items-center gap-14">

        {/* Gem image */}
        <div ref={imgRef} className="flex-shrink-0 relative flex items-center justify-center">
          <img
            src={gem.img}
            alt={gem.name}
            style={{
              width: 430, height: 200,
              borderRadius: '50%',
              objectFit: 'cover',
             
              boxShadow: `0 12px 48px ${gem.color}28`,
              position: 'relative', overflow: 'visible', zIndex: 1,
            }}
          />
        
        </div>

        {/* Text */}
        <div ref={textRef} className="flex-1">
          <p style={{ fontFamily: "'Glacial Indifference',sans-serif", fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: gem.color, marginBottom: 6 }}>
            {gem.sanskrit}
          </p>
          <h1 style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 'clamp(36px,5vw,56px)', fontWeight: 400, color: '#1a1206', lineHeight: 1, marginBottom: 10 }}>
            {gem.name}
          </h1>
          <p style={{ fontFamily: "'Glacial Indifference',sans-serif", fontSize: 36, fontWeight: 300, color: '#1a1206', marginBottom: 16, letterSpacing: '-0.01em' }}>
            {gem.price}
          </p>
          <p style={{ fontFamily: "'Glacial Indifference',sans-serif", fontSize: 16, color: '#6b5a40', lineHeight: 1.85, marginBottom: 18, maxWidth: 460 }}>
            {gem.description}
          </p>

          <div ref={benefitsRef} className="flex flex-wrap gap-x-6 gap-y-1 mb-5">
            {gem.benefits.map(b => (
              <span key={b} className="flex items-center gap-1.5"
                style={{ fontFamily: "'Glacial Indifference',sans-serif", fontSize: 14, color: '#4a3820' }}>
                <span style={{ color: gem.color }}>✦</span> {b}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-8 mb-6 pb-6" style={{ borderBottom: `1px solid ${gem.color}25` }}>
            <div>
              <p style={{ fontFamily: "'Glacial Indifference',sans-serif", fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#9a8060', marginBottom: 3 }}>Best For</p>
              <p style={{ fontFamily: "'Glacial Indifference',sans-serif", fontSize: 14, color: '#4a3820' }}>{gem.bestFor}</p>
            </div>
            <div>
              <p style={{ fontFamily: "'Glacial Indifference',sans-serif", fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#9a8060', marginBottom: 3 }}>How to Wear</p>
              <p style={{ fontFamily: "'Glacial Indifference',sans-serif", fontSize: 14, color: '#4a3820' }}>{gem.wearing}</p>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => onBuy(gem)}
              className="hover:opacity-90 transition-opacity duration-200"
              style={{
                background: `linear-gradient(135deg, ${gem.color}, ${gem.color}bb)`,
                color: '#0f0d07', fontFamily: "'Glacial Indifference',sans-serif", fontSize: 11,
                letterSpacing: '0.18em', textTransform: 'uppercase', padding: '13px 28px',
                border: 'none', cursor: 'pointer', fontWeight: 700, borderRadius: 2, border: `1px dashed black`,
              }}
            >
              ✦ Purchase Now
            </button>
            <button
              onClick={() => onBuy(gem)}
              className="hover:opacity-90 transition-opacity duration-200"
              style={{
                background: 'transparent', color: `${gem.color}`, fontFamily: "'Glacial Indifference',sans-serif", fontSize: 11,
                letterSpacing: '0.18em', textTransform: 'uppercase', padding: '13px 28px',
                border: 'none', cursor: 'pointer', borderRadius: 2, border: `2px dashed ${gem.color}50` ,
              }}
            >
              ✦ Add to Cart
            </button>
            <button
              className="transition-all duration-200 hover:opacity-80"
              style={{
                background: 'black', color: 'white', fontFamily: "'Glacial Indifference',sans-serif", fontSize: 11,
                letterSpacing: '0.18em', textTransform: 'uppercase', padding: '13px 28px',
                border: `1px solid ${gem.color}60`, cursor: 'pointer', borderRadius: 2, border: `1px dashed white`, boxShadow: `0 4px 16px ${gem.color}30`,
              }}
            >
              Consult Astrologer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── SHOP CARD ─────────────────────────────────────────────────────────────────
function GemShopCard({ gem, isActive, onClick }) {
  const cardRef = useRef(null);

  const handleMouseEnter = () => {
    if (!isActive) {
      gsap.to(cardRef.current, { y: -4, duration: 0.25, ease: 'power2.out' });
    }
  };
  const handleMouseLeave = () => {
    gsap.to(cardRef.current, { y: 0, duration: 0.25, ease: 'power2.out' });
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group cursor-pointer flex flex-col overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.55)',
        backdropFilter: 'blur(8px)',
        border: isActive ? `2px solid ${gem.color}60` : '2px dashed rgba(200,185,160,0.3)',
        borderRadius: 4,
        transition: 'border 0.25s ease, box-shadow 0.25s ease',
        boxShadow: isActive ? `0 4px 24px ${gem.color}22` : '0 2px 8px rgba(0,0,0,0.04)',
      }}
    >
      <div className="relative flex items-center justify-center overflow-hidden" style={{ height: 150, background: 'transparent' }}>
        <div
          className="absolute"
          style={{ width: 120, height: 120, border: `2px dashed ${gem.color}60`, borderRadius: '50%', background: `radial-gradient(circle, ${gem.color}40 0%, transparent 70%)`, filter: 'blur(14px)', opacity: isActive ? 1 : 0.5, transition: 'opacity 0.3s' }}
        />
        <img
          src={gem.thumb}
          alt={gem.name}
          className="relative z-10 transition-transform duration-400 group-hover:scale-105"
          style={{ width: 110, height: 110, borderRadius: '50%', objectFit: 'cover' }}
        />
        {isActive && (
          <div className="absolute top-2 right-2 rounded-full flex items-center justify-center" style={{ width: 22, height: 22, background: gem.color }}>
            <span style={{ color: '#fff', fontSize: 11 }}>✓</span>
          </div>
        )}
      </div>

      <div className="p-4" style={{ background: 'rgba(253,248,240,0.7)' }}>
        <p style={{ fontFamily: "'Glacial Indifference',sans-serif", fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: gem.color, marginBottom: 3 }}>{gem.planet}</p>
        <h3 style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 17, fontWeight: 400, color: '#1a1206', marginBottom: 2, lineHeight: 1.2 }}>{gem.name}</h3>
        <p style={{ fontFamily: "'Glacial Indifference',sans-serif", fontSize: 9, letterSpacing: '0.1em', color: '#9a8060', textTransform: 'uppercase', marginBottom: 10 }}>{gem.sanskrit}</p>
        <div className="flex items-center justify-between">
          <span style={{ fontFamily: "'Glacial Indifference',sans-serif", fontSize: 20, color: '#1a1206', fontWeight: 300 }}>{gem.price}</span>
          <button
            style={{
              background: isActive ? gem.color : '#1a1206', color: isActive ? '#0f0d07' : '#f5ede0',
              fontFamily: "'Glacial Indifference',sans-serif", fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase',
              padding: '6px 14px', border: 'none', cursor: 'pointer', borderRadius: 2, transition: 'background 0.2s',
            }}
          >
            {isActive ? 'Selected' : '+ Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function Gemstones() {
  const [active, setActive] = useState(gems[0]);
  const [paypalGem, setPaypalGem] = useState(null);
  const topRef = useRef(null);
  const headingRef = useRef(null);
  const gridRef = useRef(null);

  // Heading scroll reveal
  useEffect(() => {
    if (!headingRef.current) return;
    gsap.fromTo(
      headingRef.current.children,
      { opacity: 0, y: 20 },
      {
        opacity: 1, y: 0, stagger: 0.12, duration: 0.55, ease: 'power3.out',
        scrollTrigger: { trigger: headingRef.current, start: 'top 85%' },
      }
    );
  }, []);

  // Grid cards stagger reveal
  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll('.gem-card-wrapper');
    gsap.fromTo(cards,
      { opacity: 0, y: 24 },
      {
        opacity: 1, y: 0, stagger: 0.06, duration: 0.45, ease: 'power2.out',
        scrollTrigger: { trigger: gridRef.current, start: 'top 80%' },
      }
    );
  }, []);

  const handleSelect = (gem) => {
    setActive(gem);
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div
      ref={topRef}
      style={{
        backgroundImage: "url('/assets/Gems-bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div>
        {/* Heading */}
        <div ref={headingRef} className="text-center pt-16 pb-6">
          <p className="flex items-center justify-center gap-3 mb-3"
            style={{ fontFamily: "'Glacial Indifference',sans-serif", fontSize: 11, letterSpacing: '0.26em', textTransform: 'uppercase', color: '#b8860b' }}>
            <span style={{ display: 'block', width: 32, height: 1, background: '#b8860b' }} />
            Vedic Gemology
            <span style={{ display: 'block', width: 32, height: 1, background: '#b8860b' }} />
          </p>
          <h2 style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 'clamp(28px,4vw,48px)', fontWeight: 400, color: '#1a1206', lineHeight: 1.1, marginBottom: 10 }}>
            Sacred <em style={{ color: '#b8860b' }}>Gemstones</em> of the Cosmos
          </h2>
          <p style={{ fontFamily: "'Glacial Indifference',sans-serif", fontSize: 15, color: '#9a7b6a', maxWidth: 420, margin: '0 auto' }}>
            Select any gemstone below to explore its cosmic significance, benefits, and how to wear it.
          </p>
        </div>

        {/* Hero */}
        <GemHero gem={active} onBuy={(g) => setPaypalGem(g)} />

        {/* Shop label */}
        <div className="max-w-5xl mx-auto px-8 md:px-16 pt-8">
          <div className="flex items-center gap-4 mb-2">
            <p style={{ fontFamily: "'Glacial Indifference',sans-serif", fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#b8860b', whiteSpace: 'nowrap' }}>
              Healing Crystals &amp; Gemstones
            </p>
            <div style={{ flex: 1, height: 1, background: 'rgba(184,134,11,0.2)' }} />
          </div>
          <p style={{ fontFamily: "'Glacial Indifference',sans-serif", fontSize: 15, color: '#9a7b6a', marginBottom: 20, maxWidth: 520 }}>
            Our shop carries all nine sacred Navaratna gems. Click any to view full details above.
          </p>
        </div>

        {/* Shop grid */}
        <div ref={gridRef} className="max-w-5xl mx-auto px-8 md:px-16 pb-16">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {gems.map((g) => (
              <div key={g.name} className="gem-card-wrapper">
                <GemShopCard
                  gem={g}
                  isActive={active.name === g.name}
                  onClick={() => handleSelect(g)}
                />
              </div>
            ))}
          </div>

          <div className="text-center mt-14">
            <p style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 15, color: '#9a7b6a', marginBottom: 16 }}>
              Unsure which gem is right for you? Let our astrologer recommend one based on your birth chart.
            </p>
            <button
              className="hover:bg-[#b8860b] transition-all duration-300"
              style={{ background: '#1a1206', color: '#f5ede0', fontFamily: "'Glacial Indifference',sans-serif", fontSize: 11, border: '2px dashed white', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '14px 36px', cursor: 'pointer' }}
            >
              Get Gem Recommendation
            </button>
          </div>
        </div>
      </div>

      {/* Fixed Book Consultation FAB */}
      <BookConsultationFixed />

      {/* PayPal Payment Modal */}
      {paypalGem && (
        <PayPalModal gem={paypalGem} onClose={() => setPaypalGem(null)} />
      )}
    </div>
  );
}