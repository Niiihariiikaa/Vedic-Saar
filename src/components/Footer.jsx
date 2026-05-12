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
          className="flex flex-col md:flex-row items-center justify-between gap-6 py-8 mb-0"
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

        {/* ── Full-width address band ── */}
        <div
          style={{
            borderBottom: '1px solid rgba(201,169,110,0.15)',
            padding: '36px 0',
            marginBottom: 28,
            display: 'flex',
            alignItems: 'stretch',
            gap: 48,
            flexWrap: 'wrap',
          }}
        >
          {/* Left — label + address text */}
          <div style={{ flex: '1 1 260px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: 10,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#b8860b',
              marginBottom: 16,
            }}>
              Visit Us
            </p>

            <a
              href="https://maps.google.com/?q=A1%2F293+Paschim+Vihar+Top+Floor+New+Delhi+Delhi+110063"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                textDecoration: 'none',
                color: '#f5ede0',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#c9a96e'}
              onMouseLeave={e => e.currentTarget.style.color = '#f5ede0'}
            >
              <svg width="22" height="28" viewBox="0 0 13 16" fill="none" style={{ flexShrink: 0, marginTop: 4 }}>
                <path d="M6.5 0C3.467 0 1 2.467 1 5.5c0 4.125 5.5 10.5 5.5 10.5S12 9.625 12 5.5C12 2.467 9.533 0 6.5 0Zm0 7.5a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z" fill="#c9a96e"/>
              </svg>
              <span style={{
                fontFamily: "'Ibarra Real Nova', serif",
                fontSize: 28,
                lineHeight: 1.4,
                fontWeight: 400,
              }}>
                A1/293, Paschim Vihar,<br />
                <span style={{ fontSize: 22, color: 'rgba(245,237,224,0.7)' }}>Top Floor, New Delhi, Delhi 110063</span>
              </span>
            </a>
          </div>

          {/* Right — map */}
          <a
            href="https://maps.google.com/?q=A1%2F293+Paschim+Vihar+Top+Floor+New+Delhi+Delhi+110063"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: '1 1 340px',
              display: 'block',
              borderRadius: 10,
              overflow: 'hidden',
              border: '1px solid rgba(201,169,110,0.3)',
              minHeight: 180,
            }}
          >
            <iframe
              title="VedicSaar Location"
              src="https://maps.google.com/maps?q=A1%2F293%2C+Paschim+Vihar%2C+New+Delhi%2C+Delhi+110063&output=embed&z=15"
              width="100%"
              height="180"
              style={{ display: 'block', border: 'none', filter: 'grayscale(0.25) contrast(1.05)' }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </a>
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
