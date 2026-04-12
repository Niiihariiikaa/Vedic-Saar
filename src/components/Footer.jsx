import Galaxy from './Galaxy';

const footerLinks = {
  Services: [
    'Vedic Astrology',
    'Numerology',
    'Vastu Shastra',
  ],
  Explore: [
    'About VedicSaar',
    'Testimonials',
    'Upcoming Events',
  ],
  Connect: [
    'Book a Session',
    'Contact Us',
    'WhatsApp Consult',
    'Instagram'
    
  ],
};

export default function Footer() {
  return (
    <footer className="relative w-full overflow-hidden" style={{ minHeight: 560 }}>

      {/* Galaxy background — fills entire footer */}
      <div className="absolute inset-0 z-0">
        <Galaxy
          mouseRepulsion
          mouseInteraction
          density={1.2}
          glowIntensity={0.35}
          saturation={0.1}
          hueShift={140}
          twinkleIntensity={0.4}
          rotationSpeed={0.08}
          repulsionStrength={2}
          autoCenterRepulsion={0}
          starSpeed={0.4}
          speed={0.8}
          transparent={false}
        />
      </div>

      {/* Dark overlay so text is readable */}
      <div className="absolute inset-0 z-[1] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-8 md:px-16 pt-20 pb-10">

        {/* Top row: brand + links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

          {/* Brand column */}
          <div className="md:col-span-1">
            {/* Logo */}
            <p
              className="mb-1"
              style={{
                fontFamily: "'Lathusca', sans-serif",
                fontSize: 34,
                fontWeight: 400,
                letterSpacing: '-0.01em',
                lineHeight: 1,
              }}
            >
              <span style={{ color: '#f5ede0' }}>Vedic</span><span style={{ color: '#c9a96e' }}>Saar</span>
            </p>
            <p
              className="mb-6"
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: 10,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#9a8060',
              }}
            >
              Ancient Wisdom · Modern Clarity
            </p>

            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 15,
                color: '#9a8060',
                lineHeight: 1.8,
              }}
            >
              Guiding souls through the timeless science of Vedic astrology, numerology, and Vastu.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <p
                className="mb-5"
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: 10,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: '#b8860b',
                }}
              >
                {title}
              </p>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="transition-colors duration-200 hover:text-[#b8860b]"
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: 15,
                        color: 'rgba(245,237,224,0.6)',
                        textDecoration: 'none',
                      }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Prediction email strip */}
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-6 py-8 mb-10"
          style={{ borderTop: '1px solid rgba(201,169,110,0.15)', borderBottom: '1px solid rgba(201,169,110,0.15)' }}
        >
          <div>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 20,
                color: '#f5ede0',
                fontWeight: 400,
              }}
            >
              Receive your <em style={{ color: '#b8860b' }}>cosmic prediction</em> through email
            </p>
            <p
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: 11,
                color: '#9a8060',
                letterSpacing: '0.04em',
                marginTop: 4,
              }}
            >
              Enter your email and get a personalised Vedic prediction delivered to you.
            </p>
          </div>
          <div className="flex items-stretch gap-0 flex-shrink-0">
         
            <button
              style={{
                background: '#b8860b',
                color: '#0e0a04',
                fontFamily: "'Jost', sans-serif",
                fontSize: 10,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                padding: '12px 24px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              Get Prediction
            </button>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <p
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: 11,
              color: 'rgba(154,128,96,0.7)',
              letterSpacing: '0.04em',
            }}
          >
            © {new Date().getFullYear()} VedicSaar. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {['Privacy Policy', 'Terms of Service', 'Disclaimer'].map((item) => (
              <a
                key={item}
                href="#"
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: 11,
                  color: 'rgba(154,128,96,0.7)',
                  textDecoration: 'none',
                  letterSpacing: '0.04em',
                }}
              >
                {item}
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}