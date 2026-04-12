const services = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
    title: "Love & Marriage",
    body: "Find cosmic compatibility, auspicious timing for marriage, and remedies to strengthen bonds with your life partner.",
    img: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=600&auto=format",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/>
      </svg>
    ),
    title: "Business & Career",
    body: "Identify favorable periods for career shifts, business ventures, and professional growth aligned with your planetary positions.",
    img: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&auto=format",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="8"/><path d="M12 6v6l4 2"/><path d="M2 12h2M20 12h2M12 2v2M12 20v2"/>
      </svg>
    ),
    title: "Wealth & Finance",
    body: "Understand the cosmic patterns governing your financial destiny and discover pathways to prosperity and abundance.",
    img: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=600&auto=format",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: "Children & Progeny",
    body: "Gain insights into the timing and blessings related to children, their well-being, and your bond with them.",
    img: "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=600&auto=format",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
    ),
    title: "Education",
    body: "Discover the ideal fields of study, favorable academic periods, and planetary support for intellectual growth.",
    img: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&auto=format",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/><polyline points="9 21 9 12 15 12 15 21"/>
      </svg>
    ),
    title: "House & Property",
    body: "Align property decisions with auspicious planetary transits for acquiring land, building homes, or real estate investments.",
    img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&auto=format",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    ),
    title: "Health",
    body: "Identify health vulnerabilities through your birth chart and adopt preventive measures with Vedic remedies.",
    img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
    title: "Foreign Travel",
    body: "Know the planetary combinations that favor international opportunities, relocations, and successful overseas ventures.",
    img: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&auto=format",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
      </svg>
    ),
    title: "Court & Litigation",
    body: "Navigate legal matters with astrological guidance on favorable timings and outcomes for court cases and disputes.",
    img: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format",
  },
];

function ServiceCard({ icon, title, body, img }) {
  return (
    <div className="group relative rounded-2xl overflow-hidden cursor-pointer h-[200px] border border-[rgba(184,134,11,0.18)] bg-[#fdf8f0] transition-transform duration-250 ease-out hover:-translate-y-1 hover:shadow-xl">

      {/* Image */}
      <img
        src={img}
        alt={title}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />

      {/* Scrim */}
      <div className="absolute inset-0 bg-transparent group-hover:bg-[rgba(20,12,2,0.68)] transition-colors duration-300 pointer-events-none z-10" />

      {/* Content */}
      <div className="relative z-20 flex flex-col p-6 h-full">
        {/* Icon */}
        <div className="text-[#b8860b] mb-3 group-hover:text-[#c9a96e] transition-colors duration-250">
          {icon}
        </div>

        <h3
          className="font-normal leading-snug mb-2.5 text-[#1a1206] group-hover:text-[#f5ede0] transition-colors duration-250"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(17px, 1.5vw, 21px)',
          }}
        >
          {title}
        </h3>

        <div className="w-7 h-px bg-[#b8860b]/50 mb-2.5" />

        <p
          className="leading-relaxed text-[#f0e8d8] opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-75"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(13px, 1.1vw, 15px)',
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
      <div className="absolute inset-0 z-[1] bg-[#faf6ef]/70 pointer-events-none" />

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
            className="text-[#000000] text-[15px] mt-3 max-w-lg mx-auto"
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