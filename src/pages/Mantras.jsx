import { useState, useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────────────────────
// MANTRA DATA
// ─────────────────────────────────────────────────────────────────────────────
const mantras = [
  {
    id: 'gayatri',
    name: 'Gayatri Mantra',
    deity: 'Surya · Sun',
    planet: 'Sun',
    color: '#c8860a',
    accent: '#f5c842',
    sanskrit: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्',
    transliteration: 'Om Bhur Bhuvah Svah | Tat Savitur Varenyam | Bhargo Devasya Dheemahi | Dhiyo Yo Nah Prachodayat',
    meaning: 'We meditate on the divine light of the Sun, who illuminates all realms. May that sacred effulgence awaken and guide our intellect.',
    benefits: ['Clarity of mind', 'Solar energy', 'Wisdom & intellect', 'Spiritual awakening'],
    chantCount: '108×',
    bestTime: 'Sunrise & Sunset',
    audio: '/assets/mantras/Gayatri-Mantra.mp3',
  },
  {
    id: 'mahamrityunjaya',
    name: 'Mahamrityunjaya',
    deity: 'Shiva · Mars & Moon',
    planet: 'Mars',
    color: '#8b2020',
    accent: '#e85a5a',
    sanskrit: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् उर्वारुकमिव बन्धनान् मृत्योर्मुक्षीय मामृतात्',
    transliteration: 'Om Tryambakam Yajamahe | Sugandhim Pushtivardhanam | Urvarukamiva Bandhanan | Mrityor Mukshiya Maamritat',
    meaning: 'We worship the three-eyed Lord Shiva, the fragrant, the nourisher of all. Like a cucumber freed from its vine, liberate us from the bondage of death.',
    benefits: ['Protection & healing', 'Removes fear of death', 'Mangal dosha relief', 'Victory over illness'],
    chantCount: '108×',
    bestTime: 'Monday dawn, Pradosha',
    audio: '/assets/mantras/mahamriyunjaya.mp3',
  },
  {
    id: 'hanuman-chalisa',
    name: 'Hanuman Chalisa',
    deity: 'Hanuman · Saturn',
    planet: 'Saturn',
    color: '#b05a10',
    accent: '#f07830',
    sanskrit: 'श्रीगुरु चरन सरोज रज, निज मनु मुकुरु सुधारि। बरनउँ रघुबर बिमल जसु, जो दायकु फल चारि॥',
    transliteration: 'Shri Guru Charan Saroj Raj | Nij Manu Mukuru Sudhari | Barnau Raghubar Bimal Jasu | Jo Dayaku Phal Chari',
    meaning: 'Cleansing the mirror of my mind with the dust of the lotus feet of the Guru, I describe the pure glory of Raghuvara, which bestows the four fruits of life.',
    benefits: ['Saturn dosha relief', 'Courage & strength', 'Protection from evil', 'Removes obstacles'],
    chantCount: '7× or 40 days',
    bestTime: 'Tuesday & Saturday',
    audio: '/assets/audio/hanuman-chalisa.mp3',
  },
  {
    id: 'navagraha',
    name: 'Navagraha Mantra',
    deity: 'Nine Planets',
    planet: 'All',
    color: '#2c5f8a',
    accent: '#5ab0f0',
    sanskrit: 'ॐ ब्रह्मा मुरारिस्त्रिपुरान्तकारी भानुः शशी भूमिसुतो बुधश्च। गुरुश्च शुक्रः शनिराहुकेतवः कुर्वन्तु सर्वे मम सुप्रभातम्॥',
    transliteration: 'Om Brahma Muraris Tripurantakari | Bhanuh Shashi Bhumisuto Budhascha | Gurush cha Shukrah Shani Rahu Ketavah | Kurvanto Sarve Mama Suprabhatam',
    meaning: 'May Brahma, Vishnu, Shiva, Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu and Ketu bestow upon me an auspicious dawn.',
    benefits: ['Harmonizes all planets', 'Balances birth chart', 'All-round protection', 'Cosmic alignment'],
    chantCount: '27× or 108×',
    bestTime: 'Sunday sunrise',
    audio: '/assets/audio/navagraha.mp3',
  },
  {
    id: 'lakshmi',
    name: 'Lakshmi Mantra',
    deity: 'Lakshmi · Venus',
    planet: 'Venus',
    color: '#7a4f8a',
    accent: '#c890e8',
    sanskrit: 'ॐ श्रीं ह्रीं श्रीं कमले कमलालये प्रसीद प्रसीद ॐ श्रीं ह्रीं श्रीं महालक्ष्म्यै नमः',
    transliteration: 'Om Shreem Hreem Shreem | Kamale Kamalalaye Praseed Praseed | Om Shreem Hreem Shreem | Mahalakshmyai Namah',
    meaning: 'O Lotus-dwelling Goddess Lakshmi, I invoke your grace. Grant me prosperity, abundance, and the divine blessings of Venus.',
    benefits: ['Wealth & prosperity', 'Venus energy boost', 'Love & harmony', 'Luxury & beauty'],
    chantCount: '108×',
    bestTime: 'Friday evening',
    audio: '/assets/audio/lakshmi.mp3',
  },
  {
    id: 'budha',
    name: 'Budha (Mercury) Mantra',
    deity: 'Mercury · Intellect',
    planet: 'Mercury',
    color: '#2d7a57',
    accent: '#4ec890',
    sanskrit: 'ॐ बुं बुधाय नमः। ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः',
    transliteration: 'Om Bum Budhaya Namah | Om Braam Breem Braum Sah Budhaya Namah',
    meaning: 'Salutations to Mercury, the planet of intellect, communication, and commerce. May you bless me with clarity of thought and the power of eloquent expression.',
    benefits: ['Sharp intellect', 'Communication skills', 'Business success', 'Mercury dosha relief'],
    chantCount: '108×',
    bestTime: 'Wednesday morning',
    audio: '/assets/audio/budha.mp3',
  },
  {
    id: 'shani',
    name: 'Shani Mantra',
    deity: 'Shani Dev · Saturn',
    planet: 'Saturn',
    color: '#3a3060',
    accent: '#7870d0',
    sanskrit: 'ॐ शं शनैश्चराय नमः। ॐ प्राम् प्रीम् प्रौम् सः शनैश्चराय नमः',
    transliteration: 'Om Sham Shanaischaraya Namah | Om Praam Preem Praum Sah Shanaischaraya Namah',
    meaning: 'Salutations to Shani, the slow-moving one. O Saturn, lord of karma and discipline, please remove all obstacles from my path.',
    benefits: ['Saturn sade sati relief', 'Karma purification', 'Discipline & focus', 'Removes delays'],
    chantCount: '108× or 23,000×',
    bestTime: 'Saturday dusk',
    audio: '/assets/audio/shani.mp3',
  },
  {
    id: 'rahu-ketu',
    name: 'Rahu–Ketu Mantra',
    deity: 'Shadow Planets',
    planet: 'Rahu & Ketu',
    color: '#4a3010',
    accent: '#c89050',
    sanskrit: 'ॐ रां राहवे नमः। ॐ कें केतवे नमः',
    transliteration: 'Om Ram Rahave Namah | Om Kem Ketave Namah',
    meaning: 'Salutations to Rahu, the ascending lunar node. Salutations to Ketu, the descending node. May the shadow planets grant liberation.',
    benefits: ['Rahu–Ketu axis relief', 'Removes confusion', 'Spiritual liberation', 'Ancestral karma'],
    chantCount: '108×',
    bestTime: 'Saturday night',
    audio: '/assets/audio/rahu-ketu.mp3',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// PARALLAX FLOATING IMAGES
// ─────────────────────────────────────────────────────────────────────────────
function ParallaxImages() {
  const stoneRef = useRef(null);
  const crystalRef = useRef(null);

  useEffect(() => {
    // stone — top right, drifts DOWN and rotates clockwise on scroll
    gsap.to(stoneRef.current, {
      y: 240,
      rotation: 150,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
      },
    });

    // beigecrystal — mid left, drifts UP and rotates counter-clockwise
    gsap.to(crystalRef.current, {
      y: -200,
      rotation: -100,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.9,
      },
    });
  }, []);

  return (
    <>
      {/* stone.png — top right */}
      <div
        ref={stoneRef}
        style={{
          position: 'fixed',
          top: 50,
          right: -20,
          width: 230,
          height: 230,
          pointerEvents: 'none',
          zIndex: 2,
          willChange: 'transform',
        }}
      >
        <img
          src="/assets/stone.png"
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'contain', opacity: 0.85 }}
        />
      </div>

      {/* beigecrystal.png — mid left */}
      <div
        ref={crystalRef}
        style={{
          position: 'fixed',
          top: '44%',
          left: -35,
          width: 290,
          height: 290,
          pointerEvents: 'none',
          zIndex: 2,
          willChange: 'transform',
        }}
      >
        <img
          src="/assets/beigecrystal.png"
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'contain', opacity: 0.78 }}
        />
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCROLL-DRIVEN MARQUEE  (moves ONLY on scroll, not auto-play)
// ─────────────────────────────────────────────────────────────────────────────
function ScrollMarquee({ color }) {
  const trackRef = useRef(null);

  useEffect(() => {
    // Moves from x=0 to x=-50% as the full page scrolls
    gsap.fromTo(
      trackRef.current,
      { x: '0%' },
      {
        x: '-50%',
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
        },
      }
    );
  }, []);

  const items = [
    'Hanuman Chalisa', 'ॐ', 'Navagraha', 'ॐ', 'Lakshmi', 'ॐ',
    'Shani', 'ॐ', 'Rahu Ketu', 'ॐ', 'Gayatri', 'ॐ', 'Mahamrityunjaya', 'ॐ',
  ];

  return (
    <div
      style={{
        overflow: 'hidden',

        padding: '13px 0',
        background: 'transparent',
        backdropFilter: 'blur(4px)',
        
      }}
    >
      <div
        ref={trackRef}
        style={{ display: 'flex', gap: 44, whiteSpace: 'nowrap', width: 'max-content' }}
      >
        {/* 4 copies so the band never empties at any scroll depth */}
        {[...items, ...items, ...items, ...items].map((item, i) => (
          <span
            key={i}
            style={{
              fontFamily:
                item === 'ॐ'
                  ? "'Noto Serif Devanagari', serif"
                  : "'Cormorant Garamond', serif",
              fontSize: item === '✦' || item === 'ॐ' ? 44 : 40,
              fontStyle: item === '✦' || item === 'ॐ' ? 'normal' : 'italic',
              color: item === '✦' || item === 'ॐ' ? color : '#1a1206',
              letterSpacing: '0.04em',
              fontWeight: 300,
              transition: 'color 0.8s ease',
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROTATING WHEEL
// ─────────────────────────────────────────────────────────────────────────────
function MantraWheel({ activeColor }) {
  const wheelRef = useRef(null);
  const glowRef = useRef(null);
  const rotRef = useRef(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const animate = () => {
      rotRef.current += 0.12;
      if (wheelRef.current)
        wheelRef.current.style.transform = `rotate(${rotRef.current}deg)`;
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => {
    if (glowRef.current) {
      gsap.to(glowRef.current, {
        boxShadow: `0 0 80px 24px ${activeColor}30, 0 0 160px 60px ${activeColor}12`,
        duration: 1.2,
        ease: 'power2.inOut',
      });
    }
  }, [activeColor]);

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div
        ref={glowRef}
        style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', pointerEvents: 'none' }}
      />
      <div ref={wheelRef} style={{ width: 500, height: 600, willChange: 'transform' }}>
        <img
          src="/assets/mantra-wheel.png"
          alt="Vedic Mantra Wheel"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            filter: `drop-shadow(0 0 18px ${activeColor}50)`,
            transition: 'filter 1s ease',
          }}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 150,
          height: 150,
          
          borderRadius: '50%',
          background: 'rgba(20,12,2,0.88)',
          border: `2px solid ${activeColor}65`,
          backdropFilter: 'blur(8px)',
          transition: 'border-color 0.8s ease',
        }}
      >
        <span
          style={{
            fontFamily: "'Noto Serif Devanagari', serif",
            fontSize: 30,
            color: activeColor,
            transition: 'color 0.8s ease',
            lineHeight: 1,
          }}
        >
          ॐ
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AUDIO PLAYER
// ─────────────────────────────────────────────────────────────────────────────
function AudioPlayer({ mantra, isPlaying, onToggle, progress, onSeek }) {
  const barRef = useRef(null);

  const handleBarClick = (e) => {
    const rect = barRef.current.getBoundingClientRect();
    onSeek(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)));
  };

  return (
    <div
      style={{
        background: 'rgba(18,12,3,1)',
        border: `1px solid ${mantra.color}45`,
        borderRadius: 27,
        padding: '20px 24px',
        backdropFilter: 'blur(30px)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: mantra.accent, marginBottom: 3 }}>
            Now Playing
          </p>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 400, color: '#f5ede0', margin: 0 }}>
            {mantra.name}
          </h3>
        </div>
        <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: mantra.color, background: `${mantra.color}22`, padding: '3px 10px', borderRadius: 2 }}>
          {mantra.planet}
        </span>
      </div>

      {/* Seekable progress bar */}
      <div
        ref={barRef}
        onClick={handleBarClick}
        style={{ position: 'relative', height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, cursor: 'pointer', marginBottom: 10 }}
      >
        <div style={{ width: `${progress * 100}%`, height: '100%', background: `linear-gradient(90deg, ${mantra.color}, ${mantra.accent})`, borderRadius: 2, transition: 'width 0.1s linear' }} />
        <div style={{ position: 'absolute', top: '50%', left: `${progress * 100}%`, transform: 'translate(-50%,-50%)', width: 10, height: 10, borderRadius: '50%', background: mantra.accent }} />
      </div>

      {/* Play / Pause */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 12 }}>
        <button
          onClick={onToggle}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
          style={{
            width: 52, height: 52, borderRadius: '50%',
            background: `linear-gradient(135deg, ${mantra.color}, ${mantra.accent})`,
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 4px 20px ${mantra.color}55`,
            transition: 'transform 0.15s ease',
          }}
        >
          {isPlaying ? (
            <svg width={18} height={18} viewBox="0 0 18 18" fill="none">
              <rect x="3" y="3" width="4" height="12" rx="1" fill="white" />
              <rect x="11" y="3" width="4" height="12" rx="1" fill="white" />
            </svg>
          ) : (
            <svg width={18} height={18} viewBox="0 0 18 18" fill="none">
              <path d="M5 3.5L15 9L5 14.5V3.5Z" fill="white" />
            </svg>
          )}
        </button>
      </div>

      <div style={{ display: 'flex', gap: 24, marginTop: 14, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 8, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#9a8060', marginBottom: 2 }}>Chant Count</p>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, color: mantra.accent, margin: 0 }}>{mantra.chantCount}</p>
        </div>
        <div>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 8, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#9a8060', marginBottom: 2 }}>Best Time</p>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, color: '#d4c4a0', margin: 0 }}>{mantra.bestTime}</p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MANTRA CARD
// ─────────────────────────────────────────────────────────────────────────────
function MantraCard({ mantra, isActive, isPlaying, onClick, onPlay }) {
  const cardRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: cardRef.current, start: 'top 88%' } }
    );
  }, []);

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      style={{
        position: 'relative',
        background: isActive ? 'rgba(18,12,3,1)' : 'rgba(253,248,240,0.9)',
        backdropFilter: 'blur(560px)',
        border: isActive ? `1.5px solid ${mantra.color}65` : '1px solid rgba(200,185,160,0.3)',
        borderRadius: 27, padding: '20px', cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: isActive ? `0 8px 64px ${mantra.color}25` : '0 2px 8px rgba(0,0,0,0.04)',
        overflow: 'hidden',
      }}
    >
      {isActive && (
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: `linear-gradient(180deg, ${mantra.color}, ${mantra.accent})`, borderRadius: '6px 0 0 6px' }} />
      )}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase', color: isActive ? mantra.accent : mantra.color, marginBottom: 4 }}>
            {mantra.deity}
          </p>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 400, color: isActive ? '#f5ede0' : '#1a1206', margin: '0 0 6px', lineHeight: 1.2 }}>
            {mantra.name}
          </h3>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 12, color: isActive ? '#9a8060' : '#8a7060', fontStyle: 'italic', margin: 0, lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {mantra.transliteration.split('|')[0].trim()}...
          </p>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onClick(); onPlay(); }}
          style={{
            width: 38, height: 38, borderRadius: '50%',
            background: isActive && isPlaying ? `linear-gradient(135deg, ${mantra.color}, ${mantra.accent})` : `${mantra.color}20`,
            border: `1px solid ${mantra.color}50`,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, transition: 'all 0.2s ease',
          }}
        >
          {isActive && isPlaying ? (
            <svg width={14} height={14} viewBox="0 0 14 14" fill="none">
              <rect x="2" y="2" width="3.5" height="10" rx="1" fill="white" />
              <rect x="8.5" y="2" width="3.5" height="10" rx="1" fill="white" />
            </svg>
          ) : (
            <svg width={14} height={14} viewBox="0 0 14 14" fill="none">
              <path d="M4 2.5L12 7L4 11.5V2.5Z" fill={isActive ? mantra.accent : mantra.color} />
            </svg>
          )}
        </button>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 12 }}>
        {mantra.benefits.slice(0, 2).map(b => (
          <span key={b} style={{
            fontFamily: "'Jost', sans-serif", fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase',
            color: isActive ? mantra.accent : mantra.color,
            background: isActive ? `${mantra.color}20` : `${mantra.color}10`,
            border: `1px solid ${mantra.color}25`,
            padding: '3px 8px', borderRadius: 2,
          }}>
            {b}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DETAIL PANEL
// ─────────────────────────────────────────────────────────────────────────────
function MantraDetail({ mantra }) {
  const panelRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(panelRef.current, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.45, ease: 'power2.out' });
  }, [mantra.id]);

  return (
    <div ref={panelRef}>
      <div style={{ background: 'rgba(18,12,3,0.9)', border: `1px solid ${mantra.color}30`, borderRadius: 27, padding: '24px', marginBottom: 16, backdropFilter: 'blur(12px)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -10, top: -10, fontFamily: "'Noto Serif Devanagari', serif", fontSize: 120, color: `${mantra.color}08`, lineHeight: 1, pointerEvents: 'none', userSelect: 'none' }}>ॐ</div>
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: mantra.accent, marginBottom: 12 }}>Sanskrit</p>
        <p style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: 'clamp(14px,2vw,17px)', color: '#f5ede0', lineHeight: 2, marginBottom: 16 }}>{mantra.sanskrit}</p>
        <div style={{ height: 1, background: `${mantra.color}20`, marginBottom: 14 }} />
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9a8060', marginBottom: 8 }}>Transliteration</p>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, fontStyle: 'italic', color: '#d4c4a0', lineHeight: 1.8 }}>{mantra.transliteration}</p>
      </div>
      <div style={{ background: 'rgba(253,248,240,0.52)', border: `1px solid ${mantra.color}20`, borderRadius: 6, padding: '20px', marginBottom: 16, backdropFilter: 'blur(8px)' }}>
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: mantra.color, marginBottom: 8 }}>Meaning</p>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, color: '#4a3820', lineHeight: 1.85, margin: 0 }}>{mantra.meaning}</p>
      </div>
      <div style={{ background: 'rgba(253,248,240,0.52)', border: `1px solid ${mantra.color}20`, borderRadius: 6, padding: '20px', backdropFilter: 'blur(8px)' }}>
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: mantra.color, marginBottom: 12 }}>Cosmic Benefits</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {mantra.benefits.map(b => (
            <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: mantra.accent, fontSize: 10, flexShrink: 0 }}>✦</span>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, color: '#4a3820' }}>{b}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function MantrasPage() {
  const [active, setActive] = useState(mantras[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);
  const headingRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(headingRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.2 });
  }, []);

  // Rebuild Audio object whenever the selected mantra changes
  useEffect(() => {
    const audio = new Audio(active.audio);
    audioRef.current = audio;
    audio.addEventListener('ended', () => { setIsPlaying(false); setProgress(0); });
    audio.addEventListener('timeupdate', () => {
      if (audio.duration) setProgress(audio.currentTime / audio.duration);
    });
    return () => { audio.pause(); audio.src = ''; };
  }, [active.id]);

  const handleToggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) { audio.pause(); setIsPlaying(false); }
    else { audio.play().catch(() => {}); setIsPlaying(true); }
  }, [isPlaying]);

  const handleSeek = useCallback((pct) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    audio.currentTime = pct * audio.duration;
    setProgress(pct);
  }, []);

  const handleSelect = (mantra) => {
    if (audioRef.current) audioRef.current.pause();
    setIsPlaying(false);
    setProgress(0);
    setActive(mantra);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: "url('/assets/Mantra-bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        position: 'relative',
      }}
    >
      {/* Radial beige gradient overlay */}


      {/* Scroll-parallax stone & crystal */}
      <ParallaxImages />

      <div style={{ position: 'relative', zIndex: 3 }}>

        {/* HERO */}
        <div style={{ textAlign: 'center', padding: '72px 32px 0' }}>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#b8860b', marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <span style={{ display: 'block', width: 32, height: 1, background: '#b8860b' }} />
            Vedic Mantra Sadhana
            <span style={{ display: 'block', width: 32, height: 1, background: '#b8860b' }} />
          </p>
          <div ref={headingRef}>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(38px,6vw,72px)', fontWeight: 300, color: '#1a1206', lineHeight: 1, marginBottom: 4, letterSpacing: '-0.01em' }}>
              Sacred <em style={{ color: '#b8860b' }}>Mantras</em>
            </h1>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(38px,6vw,72px)', fontWeight: 300, color: '#1a1206', lineHeight: 1, marginBottom: 20, letterSpacing: '-0.01em' }}>
              of the{' '}
              <em style={{ color: active.accent, transition: 'color 0.8s ease' }}>Cosmos</em>
            </h1>
          </div>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, color: '#9a7b6a', maxWidth: 520, margin: '0 auto 40px', lineHeight: 1.75 }}>
            Ancient Vedic sound vibrations aligned to the nine planetary forces. Each mantra carries the resonance of its ruling deity — chant with devotion to harmonize your cosmic energy.
          </p>
        </div>

        {/* SCROLL MARQUEE */}
        <ScrollMarquee color={active.color} />

        {/* WHEEL + PLAYER */}
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '56px 32px 40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 48, alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>
            <MantraWheel activeColor={active.color} />
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: active.accent, marginBottom: 4, transition: 'color 0.8s ease' }}>
                Currently Selected
              </p>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 400, color: '#1a1206', margin: 0 }}>
                {active.name}
              </h2>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, fontStyle: 'italic', color: '#9a8060', margin: '4px 0 0' }}>
                {active.deity}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AudioPlayer mantra={active} isPlaying={isPlaying} onToggle={handleToggle} progress={progress} onSeek={handleSeek} />
            <MantraDetail mantra={active} />
          </div>
        </div>

        {/* MANTRA GRID */}
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '8px 32px 80px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#b8860b', whiteSpace: 'nowrap' }}>All Mantras</p>
            <div style={{ flex: 1, height: 1, background: 'rgba(184,134,11,0.2)' }} />
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, color: '#9a8060', whiteSpace: 'nowrap' }}>{mantras.length} sacred hymns</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
            {mantras.map((m) => (
              <MantraCard key={m.id} mantra={m} isActive={active.id === m.id} isPlaying={isPlaying && active.id === m.id} onClick={() => handleSelect(m)} onPlay={handleToggle} />
            ))}
          </div>
        </div>

        {/* BOTTOM CTA */}
        <div style={{ textAlign: 'center', padding: '0 32px 80px' }}>
          <div style={{ display: 'inline-block', background: 'rgba(253,248,240,0.72)', border: '1px solid rgba(184,134,11,0.22)', borderRadius: 6, padding: '40px 48px', backdropFilter: 'blur(10px)', maxWidth: 560 }}>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#b8860b', marginBottom: 10 }}>✦ Personalized Sadhana</p>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 400, color: '#1a1206', marginBottom: 12, lineHeight: 1.2 }}>
              Which Mantra is <em style={{ color: '#b8860b' }}>Right for You?</em>
            </h3>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, color: '#6b5a40', lineHeight: 1.75, marginBottom: 20 }}>
              Our Vedic astrologers will analyze your birth chart and prescribe the exact mantras, japa count, and timing aligned to your planetary placements.
            </p>
            <button
              onMouseEnter={e => { e.currentTarget.style.background = '#b8860b'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#1a1206'; }}
              style={{ background: '#1a1206', color: '#f5ede0', fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '14px 36px', border: 'none', cursor: 'pointer', borderRadius: 2, transition: 'background 0.3s ease' }}
            >
              Book Mantra Consultation
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}