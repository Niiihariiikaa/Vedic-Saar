import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const dropdowns = {
  Predictions:      ['Vedic Astrology', 'K P Astrology', 'Numerology', 'Prashna', 'Yearly Prediction'],
  'Life Solutions': ['Love & Marriage', 'Career', 'Finance', 'Health', 'Foreign Travel'],
  Remedies:         ['Pooja', 'Lal Kitab', 'Gemstone', 'Mantra'],
}

// Map nav items to their routes
const navRoutes = {
  'Home':         '/',
  'Predictions':  '/predictions',
  'Life Solutions': '/life-solutions',
  'Vaastu':       '/vaastu',
  'Rudraksha':    '/rudraksha',
  'Therapy':      '/therapy',
  'Remedies':     '/remedies',
  'Yogas':        '/yogas',
  'Blogs':        '/blogs',
  'Ask Question': '/ask-question',
  'Angel Reading':'/angel-reading',
  'Testimonials': '/testimonials',
  'About':        '/about',
  'Consultation': '/consultation',
}

// Map dropdown sub-items to their routes
const subRoutes = {
  // Predictions
  'Vedic Astrology':    '/predictions/vedic-astrology',
  'K P Astrology':      '/predictions/kp-astrology',
  'Numerology':         '/predictions/numerology',
  'Prashna':            '/predictions/prashna',
  'Yearly Prediction':  '/predictions/yearly-prediction',
  // Life Solutions
  'Love & Marriage':    '/life-solutions/love-marriage',
  'Career':             '/life-solutions/career',
  'Finance':            '/life-solutions/finance',
  'Health':             '/life-solutions/health',
  'Foreign Travel':     '/life-solutions/foreign-travel',
  // Remedies
  'Pooja':              '/remedies/pooja',
  'Lal Kitab':          '/remedies/lal-kitab',
  'Gemstone':           '/gemstones',
  'Mantra':             '/remedies/mantra',
}

const navItems = [
  'Home', 'Predictions', 'Life Solutions', 'Vaastu', 'Rudraksha',
  'Therapy', 'Remedies', 'Yogas', 'Blogs', 'Ask Question',
  'Angel Reading', 'Testimonials', 'About', 'Consultation',
]

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(null)

  return (
    <div style={{ fontFamily: "'Cormorant Garamond', serif" }}>

      {/* ── TOP BAR WITH VIDEO ── */}
      <div className="relative h-[72px] overflow-hidden flex items-center justify-between px-6 bg-[#0e0e0e]">
        <video
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-100 pointer-events-none"
          style={{ objectPosition: '50% 20%' }}
        >
          <source src="/assets/navvid.mp4" type="video/mp4" />
        </video>

        {/* Left links */}
        <div className="relative z-10 flex gap-3 text-xs tracking-widest text-white/70">
          <span className="hover:text-white cursor-pointer transition-colors">Conditions</span>
          <span className="opacity-40">·</span>
          <span className="hover:text-white cursor-pointer transition-colors">Quality</span>
          <span className="opacity-40">·</span>
          <span className="hover:text-white cursor-pointer transition-colors">Stay Connected</span>
        </div>

        {/* Centre logo — links to home */}
        <Link
          to="/"
          className="absolute left-1/2 -translate-x-1/2 z-10 text-3xl tracking-[0.14em] text-white no-underline"
          style={{ fontFamily: 'Georgia, serif', textDecoration: 'none' }}
        >
          Vedic <span className="text-[#b8860b]">Saar</span>
        </Link>

        {/* Right social */}
        <div className="relative z-10 flex gap-3 text-xs tracking-widest text-white/70">
          <span className="hover:text-white cursor-pointer transition-colors">Facebook</span>
          <span className="opacity-40">·</span>
          <span className="hover:text-white cursor-pointer transition-colors">Twitter</span>
          <span className="opacity-40">·</span>
          <span className="hover:text-white cursor-pointer transition-colors">Instagram</span>
        </div>
      </div>

      {/* ── NAV LINKS ── */}
      <nav className="bg-white border-b border-[#e8e0d0] px-6 py-2 flex items-center justify-center">
        <ul className="flex flex-wrap items-center list-none m-0 p-0">
          {navItems.map((item) => (
            <li
              key={item}
              className="relative"
              onMouseEnter={() => dropdowns[item] && setOpenMenu(item)}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <Link
                to={navRoutes[item] || '/'}
                style={{ textDecoration: 'none' }}
                className="block px-2 py-2 text-[11.5px] text-[#3a2e1e] tracking-wide cursor-pointer whitespace-nowrap hover:text-[#b8860b] transition-colors"
              >
                {item}
                {dropdowns[item] && <span className="text-[9px] opacity-50 ml-0.5">▾</span>}
              </Link>

              {dropdowns[item] && openMenu === item && (
                <ul className="absolute top-full left-0 bg-white border border-[#ddd5c0] border-t-2 border-t-[#b8860b] min-w-[160px] z-50 py-1.5 list-none shadow-lg">
                  {dropdowns[item].map((sub) => (
                    <li key={sub}>
                      <Link
                        to={subRoutes[sub] || '/'}
                        style={{ textDecoration: 'none' }}
                        className="block px-4 py-2 text-xs text-[#3a2e1e] cursor-pointer hover:bg-[#fdf6e8] transition-colors"
                      >
                        {sub}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        <Link to="/consultation" style={{ textDecoration: 'none' }}>
          <button className="ml-4 border border-[#b8860b] text-[#b8860b] px-4 py-2 text-xs tracking-widest whitespace-nowrap hover:bg-[#b8860b] hover:text-white transition-all duration-200">
            Book Reading
          </button>
        </Link>
      </nav>
    </div>
  )
}