import { useEffect, useRef, useState } from 'react'
import Navbar from '../components/Navbar'

const slides = [
  { src: '/assets/Numerology.png', alt: 'Numerology' },
  { src: '/assets/Vedic.png',      alt: 'Vedic Astrology' },
  { src: '/assets/Vastu.png',      alt: 'Vastu' },
]

export default function Homepage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [glowing, setGlowing]           = useState(false)

  const saturnRef     = useRef(null)
  const crystalRef    = useRef(null)
  const crystal2Ref   = useRef(null)
  const moonRef       = useRef(null)
  const n1Ref         = useRef(null)
  const n2Ref         = useRef(null)
  const n3Ref         = useRef(null)
  const sectionRef    = useRef(null)
  const statsAnimated = useRef(false)
  const rafIds        = useRef([])

  /* ── Parallax scroll — passive + rAF throttle + GPU layers ── */
  useEffect(() => {
    const els = [saturnRef, crystalRef, crystal2Ref, moonRef]
    els.forEach(r => { if (r.current) r.current.style.willChange = 'transform' })

    let ticking = false
    let latestY  = 0

    const update = () => {
      const y = latestY
      if (saturnRef.current)
        saturnRef.current.style.transform = `rotate(${y * 0.15}deg)`
      if (crystalRef.current)
        crystalRef.current.style.transform = `translateX(${y * 0.2}px) rotate(${-y * 0.1}deg)`
      if (crystal2Ref.current)
        crystal2Ref.current.style.transform = `translateY(${y * 0.15}px)`
      if (moonRef.current)
        moonRef.current.style.transform = `translateY(${y * 0.15}px)`
      ticking = false
    }

    const onScroll = () => {
      latestY = window.scrollY
      if (!ticking) { requestAnimationFrame(update); ticking = true }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      els.forEach(r => { if (r.current) r.current.style.willChange = 'auto' })
    }
  }, [])

  /* ── Auto-slide ── */
  useEffect(() => {
    const t = setInterval(() => setCurrentSlide(s => (s + 1) % slides.length), 4000)
    return () => clearInterval(t)
  }, [])

  /* ── Counter animation with cleanup ── */
  const animateCounter = (el, target, suffix) => {
    if (!el) return
    let start = null
    const step = (ts) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / 1800, 1)
      el.textContent = Math.floor(progress * target) + (progress === 1 ? suffix : '')
      if (progress < 1) {
        const id = requestAnimationFrame(step)
        rafIds.current.push(id)
      }
    }
    const id = requestAnimationFrame(step)
    rafIds.current.push(id)
  }

  /* ── Single IntersectionObserver for glow + counters ── */
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setGlowing(true)
        if (!statsAnimated.current) {
          statsAnimated.current = true
          animateCounter(n1Ref.current, 500,  ' +')
          animateCounter(n2Ref.current, 1200, ' +')
          animateCounter(n3Ref.current, 15,   ' yrs')
        }
        obs.disconnect()
      }
    }, { threshold: 0.3 })

    if (sectionRef.current) obs.observe(sectionRef.current)

    return () => {
      obs.disconnect()
      rafIds.current.forEach(id => cancelAnimationFrame(id))
    }
  }, [])

  return (
    <>
     

      <div
        className="relative z-0 bg-cover bg-center bg-no-repeat"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          backgroundImage: "url('/assets/bg.png')",
          
        }}
      >

        {/* ══════════════════════ HERO ══════════════════════ */}
        <section
          className="relative min-h-[600px] overflow-visible items-center grid bg-transparent"
          style={{ gridTemplateColumns: '1.5fr 460px 1.5fr' }}
        >
          {/* Zodiac watermark */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "url('/assets/zodiac-ring.svg')",
              backgroundSize: 'cover',
              opacity: 0.07,
            }}
          />

          {/* ── LEFT ── */}
          <div className="relative z-10 ml-5" style={{ marginRight: '-170px' }}>
            <span className="block italic text-base text-[#8a7a5a] mb-3 tracking-wide">
              Vedic Astrology &amp; Cosmic Guidance
            </span>
            <h1
              className="overflow-visible font-normal text-[#1a1206] leading-[1.1]"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(60px, 7vw, 96px)',
                marginLeft: '100px',
                transform: 'translateX(-80px)',
              }}
            >
              The Secrets of<br />
              <em>
                the{' '}
                <span className="flip-wrap">
                  <span className="flip-word">
                    <span>Cosmos</span>
                    <span>Horoscope</span>
                  </span>
                </span>
              </em>
            </h1>
            <p className="text-sm text-[#6b5d45] leading-[1.7] my-5 max-w-[340px]">
              Step into the mystical world of astrology and uncover the secrets the cosmos holds.
              Let our experienced astrologer guide you through the stars, revealing insights tailored just for you.
            </p>
            <button
              className="border border-[#1a1206] bg-[#1a1206] text-[#f5f0e8] px-6 py-2.5 text-sm tracking-widest hover:bg-[#1a1206] hover:text-[#f5f0e8] transition-all duration-300"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Request a Consultation
            </button>
          </div>

          {/* ── CENTER (slider) ── */}
          <div
            className="relative flex justify-center items-end overflow-visible z-[1]"
            style={{ height: '600px' }}
          >
            {/* Slider capsule */}
            <div
              className="relative overflow-hidden bg-[#c8bfaa]"
              style={{ width: '460px', height: '580px', borderRadius: '230px 230px 0 0' }}
            >
              {slides.map((s, i) => (
                <div
                  key={i}
                  className={`slide-img ${i === currentSlide ? 'active' : ''}`}
                  style={{ borderRadius: '180px 180px 0 0', overflow: 'hidden' }}
                >
                  <img src={s.src} alt={s.alt} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            {/* Saturn planet — top-right of slider */}
            <div
              ref={saturnRef}
              className="absolute pointer-events-none z-10"
              style={{ width: '140px', height: '170px', top: '20px', right: '-30px' }}
            >
              <img src="/assets/planet.png" alt="planet" className="w-full h-full object-contain" />
            </div>

            {/* Crystal stone — bottom-left of slider */}
            <div
              ref={crystalRef}
              className="absolute pointer-events-none z-10"
              style={{ width: '170px', height: '150px', bottom: '0', left: '-80px' }}
            >
              <img src="/assets/stone.png" alt="stone" className="w-full h-full object-contain" />
            </div>

            {/* Slide dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
              {slides.map((_, i) => (
                <span
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`w-2 h-2 rounded-full cursor-pointer transition-colors duration-300 ${
                    i === currentSlide ? 'bg-[#1a1206]' : 'bg-[#c8bfaa]'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div
            className="relative z-10 overflow-visible"
            style={{ marginLeft: '-100px', padding: '60px', marginTop: '100px' }}
          >
            <div
              className="font-normal text-[#1a1206] leading-[1.1] opacity-90"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(48px, 5.5vw, 90px)',
                marginLeft: '-60px',
              }}
            >
              <div>Discover Your</div>
              <div>Destiny</div>
              <div>
                <em>
                  <span className="flip-wrap-big">
                    <span className="flip-big">
                      <span>with Stars</span>
                      <span>with Numbers</span>
                    </span>
                  </span>
                </em>
              </div>
            </div>
            <div className="mt-6">
             
              <div
                className="mt-1 text-[#1a1206]"
                style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px' }}
              >
                Unveil Your Future{' '}
                <span className="flip-wrap-sm">
                  <span className="flip-sm">
                    <span>with Numbers</span>
                    <span>with Stars</span>
                  </span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════ STATS ══════════════════════ */}

        {/* ══════════════════════ SECTION 2 — ABOUT ══════════════════════ */}
        <section
          className="py-20 grid grid-cols-3 gap-10 items-center relative"
          ref={sectionRef}
          style={{
            backgroundImage: "url('/assets/secbg.png')",
            backgroundSize: '600px',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        >
          {/* Left image */}
          <div className="relative">
            <div
              className="overflow-hidden bg-[#c8bfaa]"
              style={{ width: '480px', height: '480px', borderRadius: '0px 300px 300px 0px' }}
            >
              <img src="/assets/sec1.png" alt="Tarot reading" className="w-full h-full object-cover" />
            </div>
            {/* Beige crystal float */}
            <div
              ref={crystal2Ref}
              className="absolute pointer-events-none z-10"
              style={{
                left: '-40px',
                top: '-150px',
                width: '250px',
                height: '250px',
                backgroundImage: "url('/assets/beigecrystal.png')",
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                willChange: 'transform',
              }}
            />
          </div>

          {/* Centre text */}
          <div className="px-4">
            <span className="italic text-base text-[#8a7a5a] block mb-3">WHO WE ARE</span>
            <h2
              className="font-normal text-[#1a1206] leading-[1.2] mb-5"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(36px, 4vw, 54px)',
              }}
            >
              About <strong className="font-bold">Vedic Saar</strong>
            </h2>
            <p className="text-base text-[#6b5d45] leading-[1.8] max-w-[360px]">
              Vedic Saar is dedicated to guiding individuals through the profound sciences of Vedic Astrology,
              Numerology, Vaastu, and Spiritual Remedies. Rooted in ancient traditions and supported by deep
              study and experience, our consultations help individuals gain clarity in life's most important decisions.
              From career and relationships to finances and spiritual growth, Vedic Saar provides insight, guidance,
              and practical remedies to restore harmony and balance in life.
            </p>
            <button
              className="mt-6 border border-[#1a1206] bg-transparent text-[#1a1206] px-6 py-2.5 text-sm tracking-widest hover:bg-[#1a1206] hover:text-[#f5f0e8] transition-all duration-300"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Discover More
            </button>

            {/* Mini stats */}
            <div className="mt-10 grid grid-cols-2 gap-6">
              {[
                { num: '10000 +', label: ' Readings' },
                { num: '20 +', label: 'Years of Experience' },
              ].map((s, i) => (
                <div key={i}>
                  <div
                    className="text-4xl font-normal text-[#1a1206]"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {s.num}
                  </div>
                  <div className="text-sm text-[#8a7a5a] mt-1 pt-2 border-t border-dashed border-[#c8bfaa]">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right image */}
          <div className="relative flex justify-end">
            <div
              className="overflow-hidden bg-[#c8bfaa]"
              style={{ width: '500px', height: '700px', borderRadius: '300px 0px 0px 0px' }}
            >
              <img src="/assets/sec2.png" alt="Crystal ball" className="w-full h-full object-cover" />
            </div>
            {/* Moon float */}
            <div
              ref={moonRef}
              className="absolute pointer-events-none z-10"
              style={{
                top: '-90px',
                right: '10px',
                width: '120px',
                height: '120px',
                backgroundImage: "url('/assets/moon.png')",
                backgroundSize: 'cover',
                willChange: 'transform',
              }}
            />
          </div>

          {/* Purchase Now button */}
          <button
            className={`absolute bottom-8 left-2 bg-[#1a1206] text-[#f5f0e8] px-7 py-3.5 text-sm tracking-widest 
              hover:bg-[#b8860b] transition-all duration-700
              ${glowing ? 'glow-pulse' : ''}`}
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Purchase Now
          </button>

          <button
            className={`absolute bottom-8 right-4 bg-[#1a1206] text-[#f5f0e8] px-7 py-3.5 text-sm tracking-widest 
              hover:bg-[#b8860b] transition-all duration-700
              ${glowing ? 'glow-pulse' : ''}`}
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Birth Time Rectification
          </button>
        </section>

      </div>
    </>
  )
}