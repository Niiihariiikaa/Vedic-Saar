import { useState, useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Encode audio path so spaces & special chars work as URLs
function audioSrc(path) {
  const parts = path.split('/');
  const filename = parts.pop();
  return [...parts, encodeURIComponent(filename)].join('/');
}

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
    image: '/assets/mantras/mantra-img/Om.png',
    beejMantra: 'ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः',
    sanskrit: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्',
    transliteration: 'Om Bhur Bhuvah Svah | Tat Savitur Varenyam | Bhargo Devasya Dheemahi | Dhiyo Yo Nah Prachodayat',
    meaning: 'We meditate on the divine light of the Sun, who illuminates all realms. May that sacred effulgence awaken and guide our intellect.',
    benefits: ['Clarity of mind', 'Solar energy', 'Wisdom & intellect', 'Spiritual awakening'],
    chantCount: '108×',
    bestTime: 'Sunrise & Sunset',
    audio: '/assets/mantras/Gayatri-Mantra.mp3',
  },
  {
    id: 'chandra',
    name: 'Chandra Mantra',
    deity: 'Chandra · Moon',
    planet: 'Moon',
    color: '#4a6080',
    accent: '#a0c8e8',
    image: '/assets/mantras/mantra-img/Chandra.png',
    sanskrit: 'ॐ सों सोमाय नमः। ॐ श्रां श्रीं श्रौं सः चंद्रमसे नमः',
    transliteration: 'Om Som Somaya Namah | Om Shraam Shreem Shraum Sah Chandramase Namah',
    meaning: 'Salutations to Chandra, the luminous Moon. May the divine Moon bless me with peace, emotional harmony, and the nectar of divine grace.',
    benefits: ['Emotional balance', 'Mental peace', 'Chandra dosha relief', 'Intuition & creativity'],
    chantCount: '108×',
    bestTime: 'Monday evening, Purnima',
    audio: '/assets/mantras/Chandra-Mantra.mp3',
  },
  {
    id: 'mangal',
    name: 'Mangal Mantra',
    deity: 'Mangal · Mars',
    planet: 'Mars',
    color: '#9b2c1a',
    accent: '#f07050',
    image: '/assets/mantras/mantra-img/Mangal.png',
    beejMantra: 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः',
    sanskrit: 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः। ॐ अं अंगारकाय नमः',
    transliteration: 'Om Kraam Kreem Kraum Sah Bhaumaya Namah | Om Am Angarakaya Namah',
    meaning: 'Salutations to Mangal, the fiery Mars. O red planet, lord of courage and valor, remove all obstacles and bless me with strength and vitality.',
    benefits: ['Courage & vitality', 'Mangal dosha relief', 'Victory over enemies', 'Strength & stamina'],
    chantCount: '108×',
    bestTime: 'Tuesday sunrise',
    audio: '/assets/mantras/Mangal Mantra MP3.mp3',
  },
  {
    id: 'budha',
    name: 'Budha Mantra',
    deity: 'Budha · Mercury',
    planet: 'Mercury',
    color: '#2d7a57',
    accent: '#4ec890',
    image: '/assets/mantras/mantra-img/Budhha.png',
    beejMantra: 'ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः',
    sanskrit: 'ॐ बुं बुधाय नमः। ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः',
    transliteration: 'Om Bum Budhaya Namah | Om Braam Breem Braum Sah Budhaya Namah',
    meaning: 'Salutations to Mercury, the planet of intellect, communication, and commerce. May you bless me with clarity of thought and the power of eloquent expression.',
    benefits: ['Sharp intellect', 'Communication skills', 'Business success', 'Mercury dosha relief'],
    chantCount: '108×',
    bestTime: 'Wednesday morning',
    audio: '/assets/mantras/Om Bram Breem Broum Sah Budhaya Namah 108 Times Fast _ Budh Beej Mantra.mp3',
  },
  {
    id: 'brihaspati',
    name: 'Brihaspati Mantra',
    deity: 'Brihaspati · Jupiter',
    planet: 'Jupiter',
    color: '#7a5a18',
    accent: '#e8b84a',
    image: '/assets/mantras/mantra-img/Brahspati.png',
    beejMantra: 'ॐ ग्रां ग्रीं ग्रौं सः गुरुवे नमः',
    sanskrit: 'ॐ बृं बृहस्पतये नमः। ॐ ग्रां ग्रीं ग्रौं सः गुरुवे नमः',
    transliteration: 'Om Brim Brihaspataye Namah | Om Graam Greem Graum Sah Gurave Namah',
    meaning: 'Salutations to Brihaspati, the divine Guru. O Jupiter, lord of wisdom and dharma, bless me with knowledge, prosperity, and spiritual growth.',
    benefits: ['Wisdom & knowledge', 'Guru dosha relief', 'Prosperity & luck', 'Spiritual growth'],
    chantCount: '108× or 19,000×',
    bestTime: 'Thursday morning',
    audio: '/assets/mantras/Brihaspati Mantra 108 Times.mp3',
  },
  {
    id: 'shukra',
    name: 'Shukra Mantra',
    deity: 'Shukra · Venus',
    planet: 'Venus',
    color: '#7a4f8a',
    accent: '#c890e8',
    image: '/assets/mantras/mantra-img/shukr.png',
    beejMantra: 'ॐ द्रां द्रीं द्रौं सः शुक्राय नमः',
    sanskrit: 'ॐ द्रां द्रीं द्रौं सः शुक्राय नमः। ॐ शुं शुक्राय नमः',
    transliteration: 'Om Draam Dreem Draum Sah Shukraya Namah | Om Shum Shukraya Namah',
    meaning: 'Salutations to Shukra, the radiant Venus. O planet of beauty and love, bless me with artistic expression, romantic harmony, and material comforts.',
    benefits: ['Love & relationships', 'Artistic talents', 'Beauty & luxury', 'Shukra dosha relief'],
    chantCount: '108×',
    bestTime: 'Friday morning',
    audio: '/assets/mantras/Shukra Mantra.mp3',
  },
  {
    id: 'shani',
    name: 'Shani Mantra',
    deity: 'Shani Dev · Saturn',
    planet: 'Saturn',
    color: '#3a3060',
    accent: '#7870d0',
    image: '/assets/mantras/mantra-img/Shani.png',
    beejMantra: 'ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः',
    sanskrit: 'ॐ शं शनैश्चराय नमः। ॐ प्राम् प्रीम् प्रौम् सः शनैश्चराय नमः',
    transliteration: 'Om Sham Shanaischaraya Namah | Om Praam Preem Praum Sah Shanaischaraya Namah',
    meaning: 'Salutations to Shani, the slow-moving one. O Saturn, lord of karma and discipline, please remove all obstacles from my path.',
    benefits: ['Saturn sade sati relief', 'Karma purification', 'Discipline & focus', 'Removes delays'],
    chantCount: '108× or 23,000×',
    bestTime: 'Saturday dusk',
    audio: '/assets/mantras/Om Sham Shanicharaya Namah _ 108 Times in 5 Minutes _ Shani Mantra Fast.mp3',
  },
  {
    id: 'rahu',
    name: 'Rahu Mantra',
    deity: 'Rahu · North Node',
    planet: 'Rahu',
    color: '#4a3010',
    accent: '#c89050',
    image: '/assets/mantras/mantra-img/Rahu.png',
    beejMantra: 'ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः',
    sanskrit: 'ॐ रां राहवे नमः। ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः',
    transliteration: 'Om Ram Rahave Namah | Om Bhraam Bhreem Bhraum Sah Rahave Namah',
    meaning: 'Salutations to Rahu, the ascending lunar node. O shadow planet of illusion and transformation, grant me clarity, wisdom and liberation from confusion.',
    benefits: ['Rahu dosha relief', 'Removes confusion', 'Worldly success', 'Hidden knowledge'],
    chantCount: '108×',
    bestTime: 'Saturday night',
    audio: '/assets/mantras/Om Ram Rahave Namah 108 Times in 5 Minutes _ Rahu Mantra Fast.mp3',
  },
  {
    id: 'ketu',
    name: 'Ketu Mantra',
    deity: 'Ketu · South Node',
    planet: 'Ketu',
    color: '#2e4a30',
    accent: '#70b878',
    image: '/assets/mantras/mantra-img/Ketu.png',
    beejMantra: 'ॐ स्रां स्रीं स्रौं सः केतवे नमः',
    sanskrit: 'ॐ कें केतवे नमः। ॐ स्रां स्रीं स्रौं सः केतवे नमः',
    transliteration: 'Om Kem Ketave Namah | Om Sraam Sreem Sraum Sah Ketave Namah',
    meaning: 'Salutations to Ketu, the descending lunar node. O shadow planet of moksha and liberation, guide me toward spiritual awakening and freedom from ancestral karma.',
    benefits: ['Ketu dosha relief', 'Spiritual liberation', 'Ancestral karma', 'Psychic intuition'],
    chantCount: '108×',
    bestTime: 'Saturday night',
    audio: '/assets/mantras/Om Kem Ketave Namah 108 Times in 5 Minutes _ Ketu Mantra _ Fast.mp3',
  },
  {
    id: 'mahamrityunjaya',
    name: 'Mahamrityunjaya',
    deity: 'Shiva · Healer',
    planet: 'Mars & Moon',
    color: '#8b2020',
    accent: '#e85a5a',
    image: '/assets/mantras/mantra-img/Shiva.png',
    beejMantra: 'ॐ ह्रौं जूं सः ॐ भूर्भुवः स्वः',
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
    deity: 'Hanuman · Protector',
    planet: 'Saturn',
    color: '#b05a10',
    accent: '#f07830',
    image: '/assets/mantras/mantra-img/Hanuman.png',
    beejMantra: 'ॐ ऐं भ्रीं हनुमते रामदूताय नमः',
    sanskrit: 'श्रीगुरु चरन सरोज रज, निज मनु मुकुरु सुधारि। बरनउँ रघुबर बिमल जसु, जो दायकु फल चारि॥',
    transliteration: 'Shri Guru Charan Saroj Raj | Nij Manu Mukuru Sudhari | Barnau Raghubar Bimal Jasu | Jo Dayaku Phal Chari',
    meaning: 'Cleansing the mirror of my mind with the dust of the lotus feet of the Guru, I describe the pure glory of Raghuvara, which bestows the four fruits of life.',
    benefits: ['Saturn dosha relief', 'Courage & strength', 'Protection from evil', 'Removes obstacles'],
    chantCount: '7× or 40 days',
    bestTime: 'Tuesday & Saturday',
    audio: '/assets/mantras/Hanuman Chalisa - DjBaap.mp3',
  },
  {
    id: 'lakshmi',
    name: 'Lakshmi Mantra',
    deity: 'Lakshmi · Venus',
    planet: 'Venus',
    color: '#8a3a6a',
    accent: '#e890c8',
    image: '/assets/mantras/mantra-img/Lakshmi.png',
    beejMantra: 'ॐ श्रीं ह्रीं महालक्ष्म्यै नमः',
    sanskrit: 'ॐ श्रीं ह्रीं श्रीं कमले कमलालये प्रसीद प्रसीद ॐ श्रीं ह्रीं श्रीं महालक्ष्म्यै नमः',
    transliteration: 'Om Shreem Hreem Shreem | Kamale Kamalalaye Praseed Praseed | Om Shreem Hreem Shreem | Mahalakshmyai Namah',
    meaning: 'O Lotus-dwelling Goddess Lakshmi, I invoke your grace. Grant me prosperity, abundance, and the divine blessings of Venus.',
    benefits: ['Wealth & prosperity', 'Venus energy boost', 'Love & harmony', 'Luxury & beauty'],
    chantCount: '108×',
    bestTime: 'Friday evening',
    audio: '/assets/mantras/Maha Laxmi Mantra _ Om Shreem Mahalakshmiyei Namaha _ 108 Times _ Fast.mp3',
  },

];

// ─────────────────────────────────────────────────────────────────────────────
// PARALLAX FLOATING IMAGES
// ─────────────────────────────────────────────────────────────────────────────
function ParallaxImages() {
  const stoneRef = useRef(null);
  const crystalRef = useRef(null);
  useEffect(() => {
    gsap.to(stoneRef.current, { y: 240, rotation: 150, ease: 'none', scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 1.5 } });
    gsap.to(crystalRef.current, { y: -200, rotation: -100, ease: 'none', scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 1.9 } });
  }, []);
  return (
    <>
      <div ref={stoneRef} style={{ position: 'fixed', top: 50, right: -20, width: 230, height: 230, pointerEvents: 'none', zIndex: 2, willChange: 'transform' }}>
        <img src="/assets/stone.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', opacity: 0.85 }} />
      </div>
      <div ref={crystalRef} style={{ position: 'fixed', top: '44%', left: -35, width: 290, height: 290, pointerEvents: 'none', zIndex: 2, willChange: 'transform' }}>
        <img src="/assets/beigecrystal.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', opacity: 0.78 }} />
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCROLL MARQUEE
// ─────────────────────────────────────────────────────────────────────────────
function ScrollMarquee({ color }) {
  const trackRef = useRef(null);
  useEffect(() => {
    gsap.fromTo(trackRef.current, { x: '0%' }, { x: '-50%', ease: 'none', scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.5 } });
  }, []);
  const items = ['Hanuman Chalisa', 'ॐ', 'Navagraha', 'ॐ', 'Lakshmi', 'ॐ', 'Shani', 'ॐ', 'Rahu Ketu', 'ॐ', 'Gayatri', 'ॐ', 'Mahamrityunjaya', 'ॐ'];
  return (
    <div style={{ overflow: 'hidden', padding: '13px 0' }}>
      <div ref={trackRef} style={{ display: 'flex', gap: 44, whiteSpace: 'nowrap', width: 'max-content' }}>
        {[...items, ...items, ...items, ...items].map((item, i) => (
          <span key={i} style={{ fontFamily: item === 'ॐ' ? "'Noto Serif Devanagari', serif" : "'Cormorant Garamond', serif", fontSize: item === 'ॐ' ? 44 : 40, fontStyle: item === 'ॐ' ? 'normal' : 'italic', color: item === 'ॐ' ? color : '#1a1206', letterSpacing: '0.04em', fontWeight: 300, transition: 'color 0.8s ease' }}>{item}</span>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DEITY ORB — rotating rings + colored inner fill + deity image overflowing
// ─────────────────────────────────────────────────────────────────────────────
function DeityOrb({ mantra }) {
  const ring1Ref    = useRef(null);
  const ring2Ref    = useRef(null);
  const ring3Ref    = useRef(null);
  const glowRef     = useRef(null);
  const orbFillRef  = useRef(null);   // ← colored inner fill
  const imgRef      = useRef(null);
  const prevIdRef   = useRef(mantra.id);
  const rafRef      = useRef(null);

  // Continuous ring rotation via rAF
  useEffect(() => {
    const rot = { r1: 0, r2: 0, r3: 0 };
    const tick = () => {
      rot.r1 += 0.18; rot.r2 -= 0.11; rot.r3 += 0.07;
      if (ring1Ref.current) ring1Ref.current.style.transform = `rotate(${rot.r1}deg)`;
      if (ring2Ref.current) ring2Ref.current.style.transform = `rotate(${rot.r2}deg)`;
      if (ring3Ref.current) ring3Ref.current.style.transform = `rotate(${rot.r3}deg)`;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // GSAP color + image transition on mantra change
  useEffect(() => {
    if (glowRef.current) {
      gsap.to(glowRef.current, { boxShadow: `0 0 100px 40px ${mantra.color}45, 0 0 200px 90px ${mantra.color}18`, duration: 1.2, ease: 'power2.inOut' });
    }
    // Animate the colored inner orb fill
    if (orbFillRef.current) {
      gsap.to(orbFillRef.current, {
        background: `radial-gradient(circle at 38% 32%, ${mantra.accent}70 0%, ${mantra.color}55 38%, ${mantra.color}25 65%, ${mantra.color}08 100%)`,
        duration: 1.0, ease: 'power2.inOut',
      });
    }
    if (imgRef.current && prevIdRef.current !== mantra.id) {
      gsap.fromTo(imgRef.current, { opacity: 0, scale: 0.85, y: 14 }, { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: 'power3.out' });
    }
    prevIdRef.current = mantra.id;
  }, [mantra]);

  const outerDots = Array.from({ length: 16 }, (_, i) => (i * 360) / 16);
  const midDots   = Array.from({ length: 10 }, (_, i) => (i * 360) / 10);
  const innerDots = Array.from({ length: 6  }, (_, i) => (i * 360) / 6);

  return (
    <div style={{ position: 'relative', width: 380, height: 430, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

      {/* Ambient glow */}
      <div ref={glowRef} style={{ position: 'absolute', width: 180, height: 180, borderRadius: '50%', pointerEvents: 'none', zIndex: 0 }} />

      {/* Ring 1 — outer, clockwise */}
      <div ref={ring1Ref} style={{ position: 'absolute', width: 358, height: 358, borderRadius: '50%', border: `1.5px solid ${mantra.color}35`, willChange: 'transform', zIndex: 1 }}>
        {outerDots.map((angle, i) => (
          <div key={i} style={{
            position: 'absolute', top: '50%', left: '50%',
            width: i % 4 === 0 ? 7 : i % 2 === 0 ? 5 : 3,
            height: i % 4 === 0 ? 7 : i % 2 === 0 ? 5 : 3,
            borderRadius: '50%',
            background: i % 4 === 0 ? mantra.accent : i % 2 === 0 ? `${mantra.color}90` : `${mantra.color}50`,
            transform: `rotate(${angle}deg) translateX(178px) translateY(-50%)`,
            transition: 'background 0.8s ease',
          }} />
        ))}
      </div>

      {/* Ring 2 — mid, counter-clockwise dashed */}
      <div ref={ring2Ref} style={{ position: 'absolute', width: 286, height: 286, borderRadius: '50%', border: `1px dashed ${mantra.color}40`, willChange: 'transform', zIndex: 1 }}>
        {midDots.map((angle, i) => (
          <div key={i} style={{
            position: 'absolute', top: '50%', left: '50%',
            width: i % 2 === 0 ? 5 : 3, height: i % 2 === 0 ? 5 : 3,
            borderRadius: '50%',
            background: i % 2 === 0 ? `${mantra.accent}85` : `${mantra.color}65`,
            transform: `rotate(${angle}deg) translateX(142px) translateY(-50%)`,
            transition: 'background 0.8s ease',
          }} />
        ))}
      </div>

      {/* Ring 3 — inner, slow clockwise */}
      <div ref={ring3Ref} style={{ position: 'absolute', width: 228, height: 228, borderRadius: '50%', border: `1px solid ${mantra.accent}30`, willChange: 'transform', zIndex: 1 }}>
        {innerDots.map((angle, i) => (
          <div key={i} style={{
            position: 'absolute', top: '50%', left: '50%',
            width: 4, height: 4, borderRadius: '50%',
            background: `${mantra.accent}90`,
            transform: `rotate(${angle}deg) translateX(113px) translateY(-50%)`,
            transition: 'background 0.8s ease',
          }} />
        ))}
      </div>

      {/* Central orb sphere */}
      <div ref={orbFillRef}  style={{
        position: 'relative',
        width: 212, height: 212,
        borderRadius: '50%',
        border: `2px solid ${mantra.color}60`,
        boxShadow: `0 0 32px ${mantra.color}35, inset 0 0 28px ${mantra.color}18`,
        zIndex: 2,
        overflow: 'visible',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'border-color 0.8s ease, box-shadow 0.8s ease',
      }}>

        {/* ★ Colored inner fill — changes with each mantra ★ */}
        <div ref={orbFillRef} style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          background: `radial-gradient(circle at 38% 32%, ${mantra.accent}70 0%, ${mantra.color}55 38%, ${mantra.color}25 65%, ${mantra.color}08 100%)`,
          transition: 'background 0.8s ease',
          zIndex: 0,
        }} />

        {/* Bottom glow */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '45%',
          background: `radial-gradient(ellipse at bottom, ${mantra.color}55 0%, transparent 70%)`,
          borderRadius: '0 0 50% 50%',
          pointerEvents: 'none', zIndex: 1,
          transition: 'background 0.8s ease',
        }} />

        {/* Deity image — overflows orb upward for dramatic presence */}
        <img
          ref={imgRef}
          src={mantra.image}
          alt={mantra.deity}
          style={{
  position: 'absolute',
  bottom: '-20px',
  left: '50%',
  transform: 'translateX(-50%)',

  width: '120%',          // 🔥 scales with container
  maxWidth: '900px',      // prevents overflow
  height: '200%',         // 🔥 scales with container

  objectFit: 'contain',
  objectPosition: 'center bottom',


  zIndex: 3,
  pointerEvents: 'none',
}}
        />
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
    <div style={{ background: 'rgba(18,12,3,1)', border: `1px solid ${mantra.color}45`, borderRadius: 27, padding: '20px 24px', backdropFilter: 'blur(30px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: mantra.accent, marginBottom: 3 }}>Now Playing</p>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 400, color: '#f5ede0', margin: 0 }}>{mantra.name}</h3>
        </div>
        <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: mantra.color, background: `${mantra.color}22`, padding: '3px 10px', borderRadius: 2 }}>{mantra.planet}</span>
      </div>
      <div ref={barRef} onClick={handleBarClick} style={{ position: 'relative', height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, cursor: 'pointer', marginBottom: 10 }}>
        <div style={{ width: `${progress * 100}%`, height: '100%', background: `linear-gradient(90deg, ${mantra.color}, ${mantra.accent})`, borderRadius: 2, transition: 'width 0.1s linear' }} />
        <div style={{ position: 'absolute', top: '50%', left: `${progress * 100}%`, transform: 'translate(-50%,-50%)', width: 10, height: 10, borderRadius: '50%', background: mantra.accent }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 12 }}>
        <button onClick={onToggle} onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
          style={{ width: 52, height: 52, borderRadius: '50%', background: `linear-gradient(135deg, ${mantra.color}, ${mantra.accent})`, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 20px ${mantra.color}55`, transition: 'transform 0.15s ease' }}>
          {isPlaying ? (
            <svg width={18} height={18} viewBox="0 0 18 18" fill="none"><rect x="3" y="3" width="4" height="12" rx="1" fill="white" /><rect x="11" y="3" width="4" height="12" rx="1" fill="white" /></svg>
          ) : (
            <svg width={18} height={18} viewBox="0 0 18 18" fill="none"><path d="M5 3.5L15 9L5 14.5V3.5Z" fill="white" /></svg>
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
// MANTRA CARD — fixed: 64×64 colored orb thumbnail, image fills it properly
// ─────────────────────────────────────────────────────────────────────────────
function MantraCard({ mantra, isActive, isPlaying, onClick, onPlay }) {
  const cardRef = useRef(null);
  useEffect(() => {
    gsap.fromTo(cardRef.current, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: cardRef.current, start: 'top 88%' } });
  }, []);

  return (
    <div ref={cardRef} onClick={onClick} style={{
      position: 'relative',
      background: isActive ? 'rgba(18,12,3,1)' : 'rgba(253,248,240,0.9)',
      backdropFilter: 'blur(560px)',
      border: isActive ? `1.5px solid ${mantra.color}65` : '1px solid rgba(200,185,160,0.3)',
      borderRadius: 27, padding: '20px', cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: isActive ? `0 8px 64px ${mantra.color}25` : '0 2px 8px rgba(0,0,0,0.04)',
      overflow: 'hidden',
    }}>
      {isActive && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: `linear-gradient(180deg, ${mantra.color}, ${mantra.accent})`, borderRadius: '6px 0 0 6px' }} />}

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>

        {/* Colored orb thumbnail — 64×64 circle with gradient matching mantra color */}
        <div style={{
          width: 64, height: 64, borderRadius: '50%', flexShrink: 0,
          position: 'relative',
          background: `radial-gradient(circle at 38% 32%, ${mantra.accent}60 0%, ${mantra.color}45 40%, ${mantra.color}18 100%)`,
          border: `1.5px solid ${mantra.color}55`,
          boxShadow: `0 0 16px ${mantra.color}35, 0 0 6px ${mantra.accent}25`,
          overflow: 'visible',
          transition: 'box-shadow 0.4s ease',
        }}>
          <img
            src={mantra.image}
            alt={mantra.deity}
            style={{
              position: 'absolute',
              top: '-37%',
              bottom: -10,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '80px',
              height: '88px',
              objectFit: 'contain',
              objectPosition: 'center bottom',
              mixBlendMode: 'multiply',
            }}
          />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase', color: isActive ? mantra.accent : mantra.color, marginBottom: 3 }}>{mantra.deity}</p>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 400, color: isActive ? '#f5ede0' : '#1a1206', margin: 0, lineHeight: 1.2 }}>{mantra.name}</h3>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); onPlay(); }}
          style={{
            width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
            background: isActive && isPlaying ? `linear-gradient(135deg, ${mantra.color}, ${mantra.accent})` : `${mantra.color}20`,
            border: `1px solid ${mantra.color}50`,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s ease',
          }}
        >
          {isActive && isPlaying ? (
            <svg width={13} height={13} viewBox="0 0 14 14" fill="none"><rect x="2" y="2" width="3.5" height="10" rx="1" fill="white" /><rect x="8.5" y="2" width="3.5" height="10" rx="1" fill="white" /></svg>
          ) : (
            <svg width={13} height={13} viewBox="0 0 14 14" fill="none"><path d="M4 2.5L12 7L4 11.5V2.5Z" fill={isActive ? mantra.accent : mantra.color} /></svg>
          )}
        </button>
      </div>

      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 11, color: isActive ? '#9a8060' : '#8a7060', fontStyle: 'italic', margin: '0 0 10px', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
        {mantra.transliteration.split('|')[0].trim()}...
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {mantra.benefits.slice(0, 2).map(b => (
          <span key={b} style={{ fontFamily: "'Jost', sans-serif", fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', color: isActive ? mantra.accent : mantra.color, background: isActive ? `${mantra.color}20` : `${mantra.color}10`, border: `1px solid ${mantra.color}25`, padding: '3px 8px', borderRadius: 2 }}>{b}</span>
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
// MAIN PAGE — single persistent <audio> element, never recreated
// ─────────────────────────────────────────────────────────────────────────────
export default function MantrasPage() {
  const [active, setActive]       = useState(mantras[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress]   = useState(0);
  const audioRef  = useRef(null);
  const activeRef = useRef(active);   // always up-to-date active without stale closure
  activeRef.current = active;
  const headingRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(headingRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.2 });
  }, []);

  // ── Create ONE audio element on mount, wire events, never recreate ──
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audioRef.current = audio;

    const onEnded      = ()  => { setIsPlaying(false); setProgress(0); };
    const onTimeUpdate = ()  => { if (audio.duration) setProgress(audio.currentTime / audio.duration); };
    const onError      = (e) => console.warn('Audio error:', audio.error, e);

    audio.addEventListener('ended',      onEnded);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('error',      onError);

    // Preload first track
    audio.src = audioSrc(mantras[0].audio);
    audio.load();

    return () => {
      audio.pause();
      audio.removeEventListener('ended',      onEnded);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('error',      onError);
      audio.src = '';
    };
  }, []); // ← runs once only

  // ── Swap src whenever the selected mantra changes ──
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.src = audioSrc(active.audio);
    audio.load();
    setIsPlaying(false);
    setProgress(0);
  }, [active.id]); // ← only when id changes, not on every render

  // ── Toggle play/pause using audio.paused (avoids stale state) ──
  const handleToggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.warn('Play blocked:', err));
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, []);

  const handleSeek = useCallback((pct) => {
    const audio = audioRef.current;
    if (!audio) return;
    const doSeek = () => { if (audio.duration) { audio.currentTime = pct * audio.duration; setProgress(pct); } };
    if (audio.readyState >= 1) { doSeek(); }
    else { audio.addEventListener('loadedmetadata', doSeek, { once: true }); }
  }, []);

  // Select without playing
  const handleSelect = useCallback((mantra) => { setActive(mantra); }, []);

  // Card play button: select + play
  const handleCardPlay = useCallback((mantra) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (activeRef.current.id === mantra.id) {
      handleToggle();
    } else {
      audio.pause();
      audio.src = audioSrc(mantra.audio);
      audio.load();
      setProgress(0);
      setActive(mantra);
      audio.addEventListener('canplay', () => {
        audio.play().then(() => setIsPlaying(true)).catch(() => {});
      }, { once: true });
    }
  }, [handleToggle]);

  return (
    <div style={{ minHeight: '100vh', backgroundImage: "url('/assets/Mantra-bg.png')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed', position: 'relative' }}>
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
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(38px,6vw,72px)', fontWeight: 300, color: '#1a1206', lineHeight: 1, marginBottom: 4, letterSpacing: '-0.01em' }}>Sacred <em style={{ color: '#b8860b' }}>Mantras</em></h1>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(38px,6vw,72px)', fontWeight: 300, color: '#1a1206', lineHeight: 1, marginBottom: 20, letterSpacing: '-0.01em' }}>of the <em style={{ color: active.accent, transition: 'color 0.8s ease' }}>Cosmos</em></h1>
          </div>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, color: '#9a7b6a', maxWidth: 520, margin: '0 auto 40px', lineHeight: 1.75 }}>
            Ancient Vedic sound vibrations aligned to the nine planetary forces. Each mantra carries the resonance of its ruling deity — chant with devotion to harmonize your cosmic energy.
          </p>
        </div>

        <ScrollMarquee color={active.color} />

        {/* ORB + PLAYER */}
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '56px 32px 40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 48, alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
            <DeityOrb mantra={active} />
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: active.accent, marginBottom: 4, transition: 'color 0.8s ease' }}>Currently Selected</p>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 400, color: '#1a1206', margin: 0 }}>{active.name}</h2>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, fontStyle: 'italic', color: '#9a8060', margin: '4px 0 0' }}>{active.deity}</p>
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
              <MantraCard
                key={m.id} mantra={m}
                isActive={active.id === m.id}
                isPlaying={isPlaying && active.id === m.id}
                onClick={() => handleSelect(m)}
                onPlay={() => handleCardPlay(m)}
              />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', padding: '0 32px 80px' }}>
          <div style={{ display: 'inline-block', background: 'rgba(253,248,240,0.72)', border: '1px solid rgba(184,134,11,0.22)', borderRadius: 6, padding: '40px 48px', backdropFilter: 'blur(10px)', maxWidth: 560 }}>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#b8860b', marginBottom: 10 }}>✦ Personalized Sadhana</p>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 400, color: '#1a1206', marginBottom: 12, lineHeight: 1.2 }}>Which Mantra is <em style={{ color: '#b8860b' }}>Right for You?</em></h3>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, color: '#6b5a40', lineHeight: 1.75, marginBottom: 20 }}>Our Vedic astrologers will analyze your birth chart and prescribe the exact mantras, japa count, and timing aligned to your planetary placements.</p>
            <button
              onMouseEnter={e => { e.currentTarget.style.background = '#b8860b'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#1a1206'; }}
              style={{ background: '#1a1206', color: '#f5ede0', fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '14px 36px', border: 'none', cursor: 'pointer', borderRadius: 2, transition: 'background 0.3s ease' }}
            >Book Mantra Consultation</button>
          </div>
        </div>

      </div>
    </div>
  );
}