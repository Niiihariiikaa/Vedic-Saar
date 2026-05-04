import { Link } from 'react-router-dom';
import { useBooking } from './BookingContext';
import Galaxy from './Galaxy';

const footerLinks = {
  Services: [
    { label: 'Vedic Astrology', to: '/vedic-astrology' },
    { label: 'Numerology', to: '/numerology' },
    { label: 'Vastu Shastra', to: '/vaastu' },
  ],
  Explore: [
    { label: 'About VedicSaar', to: '/about' },
    { label: 'Testimonials', to: '/' },
  ],
  Connect: [
    { label: 'Book a Session', action: 'booking' },
    { label: 'Contact Us', href: 'mailto:info@vedicsaar.com' },
    { label: 'WhatsApp Consult', href: 'https://wa.me/919999999999' },
    { label: 'Instagram', href: 'https://instagram.com/vedicsaar' },
  ],
};

const linkStyle = {
  fontFamily: "'Glacial Indifference', serif",
  fontSize: 15,
  color: 'rgba(245,237,224,0.6)',
  textDecoration: 'none',
};

export default function Footer() {
  const { openBooking } = useBooking();

  return (
    <footer className="relative w-full overflow-hidden" style={{ minHeight: 560 }}>

      {/* Galaxy background */}
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

      <div className="absolute inset-0 z-[1] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-8 md:px-16 pt-20 pb-10">

        {/* Top row: brand + links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

          {/* Brand column */}
          <div className="md:col-span-1">
            <Link to="/" style={{ textDecoration: 'none' }}>
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
                <span style={{ color: '#f5ede0' }}>VEDIC</span><span style={{ color: '#c9a96e' }}>SAAR</span>
              </p>
            </Link>
            <p
              className="mb-6"
              style={{
                fontFamily: "'Glacial Indifference', sans-serif",
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
                fontFamily: "'Glacial Indifference', serif",
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
              <ul className="flex flex-col gap-3 list-none p-0 m-0">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.action === 'booking' ? (
                      <button
                        onClick={() => openBooking()}
                        className="transition-colors duration-200 hover:text-[#b8860b] bg-transparent border-none p-0 cursor-pointer text-left"
                        style={linkStyle}
                      >
                        {link.label}
                      </button>
                    ) : link.href ? (
                      <a
                        href={link.href}
                        target={link.href.startsWith('mailto') ? undefined : '_blank'}
                        rel="noopener noreferrer"
                        className="transition-colors duration-200 hover:text-[#b8860b]"
                        style={linkStyle}
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.to}
                        className="transition-colors duration-200 hover:text-[#b8860b]"
                        style={linkStyle}
                      >
                        {link.label}
                      </Link>
                    )}
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
                fontFamily: "'Ibarra Real Nova', serif",
                fontSize: 20,
                color: '#f5ede0',
                fontWeight: 400,
              }}
            >
              Receive your <em style={{ color: '#b8860b' }}>cosmic prediction</em> through email
            </p>
            <p
              style={{
                fontFamily: "'Glacial Indifference', sans-serif",
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
                background: 'black',
                color: 'white',
                fontFamily: "'Glacial Indifference', sans-serif",
                fontSize: 10,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                padding: '12px 24px',
                border: '2px dashed rgba(201,169,110,0.65)',
                borderRadius: 0,
                cursor: 'pointer',
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
              fontFamily: "'Glacial Indifference', sans-serif",
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
                  fontFamily: "'Glacial Indifference', sans-serif",
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
