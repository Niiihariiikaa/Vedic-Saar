import React from 'react'
import Stack from './Stack'

const testimonials = [
  {
    name: "Aneesha Verma",
    
    rating: 5,
    text: "It was a very positive experience to meet Mr. Manish. He takes his work rather seriously and spends due time on preparing and interpreting the astrological chart. His descriptions of personality, behavior, thoughts etc are highly accurate. He makes predictions but also explains the rationale behind them so they seem more believable to the listener. He provides a detailed and comprehensive view of the astrological chart and answers all questions patiently.",
    
    initial: "A",
  },
  {
    name: "Harpreet Kaur",

    rating: 5,
    text: "I had a wonderful experience consulting with Mr. Manish Malhotra. His predictions were remarkably accurate, and the way he explained everything made it easy to understand and follow. He is extremely kind, patient, and genuinely cares about guiding people in the right direction. His calm nature and insightful approach bring a lot of clarity and comfort. I truly appreciate his expertise and highly recommend him to anyone looking for reliable and compassionate astrological guidance.",
  
    initial: "H",
  },
  {
    name: "Veer Anand",

    rating: 5,
    text: "I had a wonderful experience with Astrologer Manish ji. Their analysis was thorough, accurate, and delivered with compassion. They helped me understand both the practical and emotional aspects of my chart. Highly professional and genuinely gifted.",

    initial: "V",
  },

];

const StarRating = ({ count }) => (
  <div className="flex gap-0.5 mb-3">
    {Array.from({ length: count }).map((_, i) => (
      <svg key={i} className="w-3.5 h-3.5 text-[#b8860b]" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969
          0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755
          1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1
          1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0
          00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const TestimonialCard = ({ name, location, rating, text, service, initial }) => (
  <div
    className="w-full h-full flex flex-col justify-between p-8 rounded-2xl"
    style={{
      background: 'linear-gradient(145deg, #fdf8f0 0%, #f5ede0 100%)',
      border: '1px solid rgba(184,134,11,0.25)',
      fontFamily: "'Glacial Indifference', serif",
      boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
    }}
  >
    <div>
      <div className="text-[#b8860b] text-6xl leading-none mb-2" style={{ fontFamily: "'Glacial Indifference', serif" }}>"</div>
      <StarRating count={rating} />
      <p className="text-[#3a2e1e] text-[17px] leading-relaxed ">{text}</p>
    </div>
    <div className="mt-5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-[#f5ede0]"
          style={{ background: '#b8860b' }}
        >
          {initial}
        </div>
        <div>
          <p className="text-[#1a1206] text-[14px] font-semibold tracking-wide leading-tight">{name}</p>
          <p className="text-[#9a7b6a] text-[12px] tracking-wide">{location}</p>
        </div>
      </div>
      <span
        className="text-[10px] tracking-widest uppercase text-[#b8860b] border border-[#b8860b]/40 px-2.5 py-1 rounded-sm"
        style={{ fontFamily: "'Glacial Indifference', sans-serif" }}
      >
        {service}
      </span>
    </div>
  </div>
);

const Testimonials = () => {
  return (
<section
  className="relative w-full overflow-hidden -mt-8 py-24 md:px-16 z-10"
  style={{
    backgroundImage: "url('/assets/Testimonialsbg.png')",
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'top center', 
    marginTop: -38, // 👈 KEY LINE
  }}
>
      {/* dark overlay so text stays readable */}
      <div className="absolute inset-0" />

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16 md:gap-24">

        {/* ── LEFT: text content ── */}
        <div className="flex-1 text-center md:text-left">

          {/* eyebrow */}
          <p
            className="text-[#b8860b] text-[11px] tracking-[0.25em] uppercase mb-4 flex items-center gap-3 justify-center md:justify-start"
            style={{ fontFamily: "'Glacial Indifference', sans-serif" }}
          >
            <span className="block w-8 h-px bg-[#b8860b]" />
            What They Say
            <span className="block w-8 h-px bg-[#b8860b]" />
          </p>

          {/* heading */}
          <h2
            className="text-[clamp(34px,5vw,58px)] font-light leading-[1.1] text-black mb-6"
            style={{ fontFamily: "'Ibarra Real Nova', serif" }}
          >
            Voices of the<br />
            <span className=" text-[#b8860b]">Cosmos</span>
          </h2>

          {/* body */}
          <p
            className="text-[#c9b99a] text-[15px] leading-relaxed max-w-sm mb-8"
            style={{ fontFamily: "'Glacial Indifference', serif" }}
          >
            Thousands have walked the path of self-discovery with us.
            Each reading, each consultation — a step closer to your
            true cosmic purpose.
          </p>

          {/* stat row */}
          <div className="flex gap-10 justify-center md:justify-start mb-10">
            {[
              { num: '10000+', label: 'Readings Done' },
              { num: '20+ yrs', label: 'Experience' },
            ].map(({ num, label }) => (
              <div key={label}>
                <p
                  className="text-[#b8860b] text-[28px] font-light leading-none"
                  style={{ fontFamily: "'Ibarra Real Nova', serif" }}
                >
                  {num}
                </p>
                <p
                  className="text-[#9a8060] text-[11px] tracking-widest uppercase mt-1"
                  style={{ fontFamily: "'Glacial Indifference', serif" }}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            className="border border-dashed  border-[#b8860b]/60 text-[#b8860b] px-8 py-3 text-[11px] tracking-[0.2em] uppercase hover:bg-[#b8860b] hover:text-[#0e0a04] transition-all duration-300"
            style={{ fontFamily: "'Glacial Indifference', sans-serif" }}
          >
            Read All Reviews
          </button>
        </div>

        {/* ── RIGHT: stacked cards ── */}
        <div className="flex-1 flex items-center justify-center">
          <div style={{ width: 620, height: 380 }}>
            <Stack
              randomRotation={true}
              sensitivity={200}
              sendToBackOnClick={true}
              cards={testimonials.map((t, i) => (
                <TestimonialCard key={i} {...t} />
              ))}
              autoplay={true}
              autoplayDelay={3500}
              pauseOnHover={true}
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default Testimonials;