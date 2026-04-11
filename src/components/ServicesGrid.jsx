const services = [
  {
    icon: "♡",
    title: "Love & Marriage",
    body: "Find cosmic compatibility, auspicious timing for marriage, and remedies to strengthen bonds with your life partner.",
    img: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&auto=format",
  },
  {
    icon: "◈",
    title: "Business & Career",
    body: "Identify favorable periods for career shifts, business ventures, and professional growth aligned with your planetary positions.",
    img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&auto=format",
  },
  {
    icon: "◇",
    title: "Wealth & Finance",
    body: "Understand the cosmic patterns governing your financial destiny and discover pathways to prosperity and abundance.",
    img: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500&auto=format",
  },
  {
    icon: "❋",
    title: "Children & Progeny",
    body: "Gain insights into the timing and blessings related to children, their well-being, and your bond with them.",
    img: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=500&auto=format",
  },
  {
    icon: "✦",
    title: "Education",
    body: "Discover the ideal fields of study, favorable academic periods, and planetary support for intellectual growth.",
    img: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=500&auto=format",
  },
  {
    icon: "⌂",
    title: "House & Property",
    body: "Align property decisions with auspicious planetary transits for acquiring land, building homes, or real estate investments.",
    img: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=500&auto=format",
  },
  {
    icon: "☽",
    title: "Health",
    body: "Identify health vulnerabilities through your birth chart and adopt preventive measures with Vedic remedies.",
    img: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=500&auto=format",
  },
  {
    icon: "✈",
    title: "Foreign Travel",
    body: "Know the planetary combinations that favor international opportunities, relocations, and successful overseas ventures.",
    img: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=500&auto=format",
  },
  {
    icon: "⚖",
    title: "Court & Litigation",
    body: "Navigate legal matters with astrological guidance on favorable timings and outcomes for court cases and disputes.",
    img: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=500&auto=format",
  },
];

function ServiceCard({ icon, title, body, img }) {
  return (
    <div className="group relative rounded-2xl overflow-hidden cursor-pointer h-[180px] border border-[rgba(184,134,11,0.18)] bg-[#fdf8f0] transition-transform duration-250 ease-out hover:-translate-y-1 hover:shadow-xl">
      
      {/* Image */}
      <img
        src={img}
        alt={title}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />

      {/* Scrim */}
      <div className="absolute inset-0 bg-transparent group-hover:bg-[rgba(26,18,6,0.58)] transition-colors duration-300 pointer-events-none z-10" />

      {/* Content */}
      <div className="relative z-20 flex flex-col p-5 h-full">
        <div
          className="text-xl text-[#b8860b] mb-2 leading-none"
          style={{ fontFamily: 'serif' }}
        >
          {icon}
        </div>

        <h3
          className="font-normal leading-snug mb-2 text-[#1a1206] group-hover:text-[#f5ede0] transition-colors duration-250"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(15px, 1.4vw, 18px)',
          }}
        >
          {title}
        </h3>

        <div className="w-6 h-px bg-[#b8860b]/50 mb-2" />

        <p
          className="leading-relaxed text-[#f0e8d8] opacity-0 translate-y-1.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-250 delay-75"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(12px, 1.1vw, 13.5px)',
          }}
        >
          {body}
        </p>
      </div>
    </div>
  );
}

export default function ServicesGrid() {
  return (
    <section className="relative w-full overflow-hidden py-20 px-6 md:px-16">

      {/* BG image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/assets/cardbg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 z-[1] bg-[#faf6ef]/60 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">

        {/* Heading */}
        <div className="text-center mb-14">
          <p
            className="text-[#b8860b] text-[11px] tracking-[0.28em] uppercase mb-3 flex items-center justify-center gap-3"
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            <span className="block w-8 h-px bg-[#b8860b]" />
            Explore the Stars
            <span className="block w-8 h-px bg-[#b8860b]" />
          </p>
          <h2
            className="text-[clamp(30px,4.5vw,52px)] font-light text-[#1a1206] leading-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Our <span className="italic text-[#b8860b]">Cosmic</span> Services
          </h2>
          <p
            className="text-[#9a7b6a] text-[15px] mt-3 max-w-lg mx-auto"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Hover over each card to reveal the wisdom within.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {services.map((s, i) => (
            <ServiceCard key={i} {...s} />
          ))}
        </div>

      </div>
    </section>
  );
}