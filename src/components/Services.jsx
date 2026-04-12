// MysticalServices.jsx
import { useEffect, useRef } from "react";

const services = [
  {
    tag: "Astrology",
    title: "Vedic\nAstrology",
    body: "Discover the ancient science of Jyotish Shastra. Our detailed birth chart analysis reveals the cosmic influences shaping your personality, relationships, career, and spiritual journey.",
    img: "/assets/Vedic.png",
    delay: "delay-[0ms]",
  },
  {
    tag: "Numbers",
    title: "Numerology",
    body: "Numbers hold the key to understanding your life's purpose. Through Vedic numerology, uncover hidden patterns in your name and birth date that influence your destiny.",
    img: "/assets/Numerology.png",
    delay: "delay-[120ms]",
  },
  {
    tag: "Architecture",
    title: "Vastu\nShastra",
    body: "Harmonize your living and working spaces with the ancient science of Vastu. Align your environment with cosmic energies to attract abundance, health, and happiness.",
    img: "/assets/Vastu.png",
    delay: "delay-[240ms]",
  },
];

export default function MysticalServices() {
  const cardRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("opacity-100", "translate-y-0");
        });
      },
      { threshold: 0.15 }
    );
    cardRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
  className=" px-10 relative z-10 -mt-20"
  style={{
    backgroundImage: "url('/assets/Services-bg.png')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}
>
      {/* Heading */}
      <h2
        className="text-center font-light text-[clamp(28px,4vw,46px)] text-[#1a1a1a] mb-14 tracking-tight mt-20"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
      >
        Our Mystical Services
      </h2>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto -mt-10">
        {services.map((s, i) => (
          <div
            key={i}
            ref={(el) => (cardRefs.current[i] = el)}
            className={`group relative overflow-hidden rounded-sm aspect-[3/4] cursor-pointer
              opacity-0 translate-y-10 transition-all duration-700 ease-out ${s.delay}`}
          >
            {/* Image */}
            <img
              src={s.img}
              alt={s.tag}
              className="absolute inset-0 w-full h-full object-cover
                transition-opacity duration-500 group-hover:opacity-20"
            />

            {/* Always-on gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/50
              group-hover:opacity-0 transition-opacity duration-400 pointer-events-none" />

            {/* Default: title at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-5 z-10
              transition-opacity duration-400 group-hover:opacity-0">
              <p
                className="text-[10px] tracking-[0.16em] uppercase text-white/75 mb-1.5
                  flex items-center gap-2 before:block before:w-4 before:h-px before:bg-white/60
                  after:block after:w-4 after:h-px after:bg-white/60"
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                {s.tag}
              </p>
              <h3
                className="text-[clamp(22px,2.5vw,30px)] font-normal text-white leading-tight whitespace-pre-line"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {s.title}
              </h3>
            </div>

            {/* Hover: full content overlay */}
            <div
              className="absolute inset-0 bg-[rgba(245,240,235,0.97)] flex flex-col justify-center
                px-7 py-8 z-20 opacity-0 transition-opacity duration-400 group-hover:opacity-100"
            >
              <p
                className="text-[10px] tracking-[0.18em] uppercase text-[#9a7b6a] mb-3"
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                {s.tag}
              </p>
              <h3
                className="text-[clamp(24px,2.6vw,32px)] font-normal text-[#1a1a1a] leading-tight whitespace-pre-line mb-4"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {s.title}
              </h3>
              <p
                className="text-[13.5px] font-light leading-loose text-[#555] mb-6"
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                {s.body}
              </p>
              <button
                className="flex items-center gap-2 text-[11px] font-medium tracking-[0.14em]
                  uppercase text-[#1a1a1a] bg-transparent border-none p-0 cursor-pointer
                  after:block after:w-7 after:h-px after:bg-[#1a1a1a]
                  hover:after:w-11 after:transition-all after:duration-300"
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                Learn More
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}