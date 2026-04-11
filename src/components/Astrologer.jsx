import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function KnowYourAstrologer() {
  const sectionRef  = useRef(null);
  const sunburstRef = useRef(null);
  const chartBgRef  = useRef(null);
  const contentRef  = useRef(null);
  const photoRef    = useRef(null);
  const marqueeRef  = useRef(null);
  const blueOrbRef  = useRef(null);
  const brownOrbRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // Sunburst rotates on scroll
      gsap.to(sunburstRef.current, {
        rotation: 360,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
      });

      // Zodiac wheel counter-rotates
      gsap.to(chartBgRef.current, {
        rotation: -200,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2.9,
        },
      });

      // Marquee scrolls left as page scrolls down
      gsap.to(marqueeRef.current, {
        x: '-40%',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });

      // Blue orb top-right: rotates + slight parallax down
      gsap.to(blueOrbRef.current, {
        rotation: 360,
        y: 80,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2,
        },
      });

      // Brown orb bottom-left: moves right horizontally
      gsap.to(brownOrbRef.current, {
        x: 170,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0,
        },
      });

      // Content slides in from right
      gsap.fromTo(contentRef.current,
        { opacity: 0, x: 50 },
        {
          opacity: 1, x: 0, duration: 0.6, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' },
        }
      );

      // Photo pops in
      gsap.fromTo(photoRef.current,
        { opacity: 0, scale: 0.82 },
        {
          opacity: 1, scale: 1, duration: 1.2, ease: 'back.out(1.3)',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 68%' },
        }
      );

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const rays = Array.from({ length: 48 }, (_, i) => ({
    angle: i * (360 / 48),
    isLong: i % 2 === 0,
  }));

  const marqueeWords = ['Destiny', '·', 'Future', '·', 'Wisdom', '·', 'Karma', '·', 'Cosmos', '·', 'Dharma', '·', 'Destiny', '·', 'Future', '·', 'Wisdom', '·', 'Karma', '·', 'Cosmos', '·', 'Dharma', '·'];

  return (
    <section
      ref={sectionRef}
      className="relative w-full flex flex-col"
      style={{ background: '#f2ede4', minHeight: '100vh' }}
    >
      {/* ── MARQUEE STRIP top ── */}
      <div
        className="relative w-full overflow-hidden py-3 z-10"
        style={{ borderBottom: '1px solid rgba(180,160,120,0.2)' }}
      >
        <div
          ref={marqueeRef}
          className="flex items-center gap-10 whitespace-nowrap"
          style={{ willChange: 'transform' }}
        >
          {marqueeWords.map((word, i) => (
            <span
              key={i}
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(38px, 5vw, 68px)',
                fontWeight: 300,
                color: word === '·' ? '#b8860b' : 'rgba(26,18,6,0.15)',
                letterSpacing: word === '·' ? '0' : '-0.02em',
                lineHeight: 1,
                fontStyle: word === '·' ? 'normal' : 'italic',
              }}
            >
              {word}
            </span>
          ))}
        </div>
      </div>

      {/* ── BLUE ORB — top right, rotates + drifts down ── */}
      <div
        ref={blueOrbRef}
        className="absolute pointer-events-none z-10"
        style={{ top: -190, right: -30, width: 190, height: 320 }}
      >
        <img
          src="/assets/blue.png"
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>

      {/* ── BROWN ORB — bottom left, moves right ── */}
      <div
        ref={brownOrbRef}
        className="absolute pointer-events-none z-0"
        style={{ bottom: -60, left: -80, width: 180, height: 280 }}
      >
        <img
          src="/assets/brown.png"
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>

      {/* ── MAIN ROW ── */}
      <div className="relative z-10 flex flex-1 items-center">

        {/* Faint zodiac wheel BG */}
        <div
          ref={chartBgRef}
          className="absolute pointer-events-none select-none"
          style={{ left: '-8%', top: '50%', transform: 'translateY(-50%)', width: 720, height: 720, opacity: 0.2 }}
        >
          <svg viewBox="0 0 720 720" xmlns="http://www.w3.org/2000/svg">
            {[320, 260, 190, 120, 55].map((r, i) => (
              <circle key={i} cx="360" cy="360" r={r} fill="none" stroke="#5a4020" strokeWidth={i === 0 ? 1.5 : 0.9} />
            ))}
            {Array.from({ length: 12 }, (_, i) => {
              const a = (i * 30) * Math.PI / 180;
              return <line key={i} x1={360 + 55 * Math.cos(a)} y1={360 + 55 * Math.sin(a)}
                x2={360 + 320 * Math.cos(a)} y2={360 + 320 * Math.sin(a)}
                stroke="#5a4020" strokeWidth="0.7" />;
            })}
            {['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'].map((s, i) => {
              const a = (i * 30 - 75) * Math.PI / 180;
              return <text key={i} x={360 + 290 * Math.cos(a)} y={360 + 290 * Math.sin(a)}
                textAnchor="middle" dominantBaseline="middle" fontSize="20"
                fill="#5a4020" fontFamily="serif">{s}</text>;
            })}
            {['ARIES','TAURUS','GEMINI','CANCER','LEO','VIRGO','LIBRA','SCORPIO','SAGITTARIUS','CAPRICORN','AQUARIUS','PISCES'].map((s, i) => {
              const a = (i * 30 - 60) * Math.PI / 180;
              return <text key={i} x={360 + 340 * Math.cos(a)} y={360 + 340 * Math.sin(a)}
                textAnchor="middle" dominantBaseline="middle" fontSize="9"
                fill="#5a4020" fontFamily="sans-serif" letterSpacing="1">{s}</text>;
            })}
          </svg>
        </div>

        {/* ── LEFT: sunburst + photo ── */}
        <div
          ref={photoRef}
          className="relative flex-shrink-0 flex items-center justify-center"
          style={{ width: '48%', minWidth: 420, height: '85vh' }}
        >
          {/* Sunburst */}
          <div
            ref={sunburstRef}
            className="absolute flex items-center justify-center pointer-events-none"
            style={{ width: 580, height: 580 }}
          >
            <svg viewBox="0 0 580 580" xmlns="http://www.w3.org/2000/svg"
              style={{ width: '100%', height: '100%' }}>
              {rays.map(({ angle, isLong }, i) => {
                const rad    = angle * Math.PI / 180;
                const innerR = 152;
                const outerR = isLong ? 278 : 248;
                const w      = isLong ? 5 : 3.5;
                const x1 = 290 + innerR * Math.cos(rad);
                const y1 = 290 + innerR * Math.sin(rad);
                const x2 = 290 + outerR * Math.cos(rad);
                const y2 = 290 + outerR * Math.sin(rad);
                return (
                  <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke={isLong ? '#b0b8c4' : '#c5cdd6'}
                    strokeWidth={w}
                    strokeLinecap="round"
                    opacity={isLong ? 0.9 : 0.65}
                  />
                );
              })}
              <circle cx="290" cy="290" r="152" fill="none" stroke="#c0c8d0" strokeWidth="1.2" opacity="0.5"/>
            </svg>
          </div>

          {/* Circular photo */}
          <div
            className="relative rounded-full overflow-hidden z-10"
            style={{
              width: 290, height: 290,
              border: '3px solid rgba(180,190,200,0.35)',
              boxShadow: '0 8px 48px rgba(0,0,0,0.12)',
              background: '#d8dce0',
            }}
          >
            <img
              src="/assets/astrologer.png"
              alt="Manish Malhotra"
              className="w-full h-full object-cover object-top"
            />
          </div>

          {/* 20+ Years badge */}
          <div
            className="absolute z-20 flex flex-col items-center justify-center rounded-full"
            style={{
              width: 88, height: 88,
              bottom: '14%', right: '16%',
              background: '#1a1206',
              border: '2px solid rgba(201,169,110,0.5)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
            }}
          >
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: '#b8860b', lineHeight: 1 }}>20+</span>
            <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 9, color: '#c9a96e', letterSpacing: '0.12em', textTransform: 'uppercase', textAlign: 'center', marginTop: 3, lineHeight: 1.3 }}>Years Exp.</span>
          </div>
        </div>

        {/* ── RIGHT: content ── */}
        <div
          ref={contentRef}
          className="flex-1 py-16 pr-14 pl-4 max-w-2xl"
          style={{ opacity: 0 }}
        >
          {/* Badge */}
          <span
            className="inline-block border border-[#c9a96e]/50 text-[#9a7b3a] px-4 py-1.5 mb-7"
            style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase' }}
          >
            Know Your Astrologer
          </span>

          {/* Heading */}
          <h2
            className="text-[#1a1206] leading-[1.08] mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(34px, 4vw, 54px)', fontWeight: 400 }}
          >
            Unlocking the Mysteries of<br />
            <em className="text-[#b8860b]">Your Life Path</em> to Fulfillment
          </h2>

          <div className="w-12 h-px mb-6" style={{ background: '#b8860b' }} />

          {/* Body */}
          <p
            className="text-[#6b5a40] leading-[1.85] mb-8"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16 }}
          >
            Manish Malhotra is an experienced Vedic astrologer dedicated to helping
            individuals gain clarity and direction through the timeless wisdom of
            astrology. With years of study and practical consulting experience, he
            carefully analyzes birth charts, planetary alignments, and cosmic cycles
            to provide meaningful insights into life's most important areas — including
            career, relationships, health, and personal growth. His approach combines
            traditional astrological principles with thoughtful guidance, helping
            clients make confident and informed decisions about their future.
          </p>

          {/* Tags */}
          <div className="flex items-center gap-7 mb-8 flex-wrap">
            {[
              { icon: '🖐', label: 'Palmistry' },
              { icon: '✳', label: 'Numerology' },
              { icon: '☽', label: 'Spiritual Growth' },
            ].map(({ icon, label }) => (
              <span key={label} className="flex items-center gap-2 text-[#6b5a40]"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15 }}>
                <span style={{ color: '#b8860b' }}>{icon}</span> {label}
              </span>
            ))}
          </div>

          <div className="w-full h-px mb-7" style={{ background: 'rgba(201,169,110,0.2)' }} />

          {/* Author + CTA */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="rounded-full overflow-hidden flex-shrink-0"
                style={{ width: 56, height: 56, border: '2px solid rgba(201,169,110,0.4)' }}>
                <img src="/assets/astrologer.png" alt="Manish Malhotra"
                  className="w-full h-full object-cover" />
              </div>
              <div>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: '#1a1206' }}>
                  Manish Malhotra
                </p>
                <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, color: '#9a8060', letterSpacing: '0.05em' }}>
                  Vedic Astrologer · 20+ Years Experience
                </p>
              </div>
            </div>

            <button
              className="flex-shrink-0 hover:bg-[#b8860b] transition-all duration-300"
              style={{
                background: '#1a1206',
                color: '#f5ede0',
                fontFamily: "'Jost', sans-serif",
                fontSize: 11,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                padding: '14px 32px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Schedule a Session
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}