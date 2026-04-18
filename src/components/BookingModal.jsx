import { useState, useEffect, useRef } from "react";

const SERVICE_TYPES = [
  { group: "Specialties", items: ["Numerology", "Vastu", "Vedic Astrology", "Birth Time Rectification", "Love Compatibility Check", "Gemstone Recommendation", "Mantra Guide"] },
  { group: "Life Areas", items: ["Love & Marriage", "Business & Career", "Wealth & Finance", "Education", "Health (Medical Astrology)", "Progeny & Children", "House & Property", "Litigation (Court Matters)", "Relationship & Compatibility", "Investment Astrology (Stock Market / Real Estate)", "Foreign Travel", "Love & Romance"] },
];

export default function BookingModal({ isOpen, onClose, preselectedService = "" }) {
  const [step, setStep] = useState(1); // 1 = form, 2 = success
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const overlayRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    dob: "",
    birthTime: "",
    birthPlace: "",
    serviceType: preselectedService,
    message: "",
  });

  useEffect(() => {
    if (preselectedService) setForm((f) => ({ ...f, serviceType: preselectedService }));
  }, [preselectedService]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setStep(1);
      setError("");
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  };

  const validate = () => {
    if (!form.name.trim()) return "Please enter your full name.";
    if (!/^\+?[\d\s\-]{7,15}$/.test(form.phone)) return "Please enter a valid phone number.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Please enter a valid email address.";
    if (!form.serviceType) return "Please select a service.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong.");
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        .bm-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(10, 7, 2, 0.72);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          backdrop-filter: blur(2px);
        }
        .bm-modal {
          background: #faf6ef;
          width: 100%;
          max-width: 580px;
          max-height: 90vh;
          overflow-y: auto;
          border-radius: 2px;
          position: relative;
          scrollbar-width: thin;
          scrollbar-color: rgba(184,134,11,0.3) transparent;
        }
        .bm-modal::-webkit-scrollbar { width: 4px; }
        .bm-modal::-webkit-scrollbar-thumb { background: rgba(184,134,11,0.3); border-radius: 2px; }
        .bm-header {
          padding: 40px 44px 28px;
          border-bottom: 1px solid rgba(184,134,11,0.18);
          position: sticky;
          top: 0;
          background: #faf6ef;
          z-index: 2;
        }
        .bm-close {
          position: absolute;
          top: 20px;
          right: 20px;
          background: none;
          border: none;
          cursor: pointer;
          color: #9a8c7a;
          padding: 4px;
          line-height: 1;
          transition: color 200ms;
        }
        .bm-close:hover { color: #1a1206; }
        .bm-eyebrow {
          font-family: 'Glacial Indifference', sans-serif;
          font-size: 10px;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: #b8860b;
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }
        .bm-eyebrow-line { display: block; width: 24px; height: 1px; background: #b8860b; }
        .bm-title {
          font-family: 'Ibarra Real Nova', serif;
          font-size: clamp(24px, 3.5vw, 32px);
          font-weight: 400;
          color: #1a1206;
          line-height: 1.1;
          margin: 0;
        }
        .bm-title em { color: #b8860b; font-style: italic; }
        .bm-body { padding: 32px 44px 44px; }
        .bm-field { margin-bottom: 22px; }
        .bm-label {
          display: block;
          font-family: 'Glacial Indifference', sans-serif;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #9a8c7a;
          margin-bottom: 8px;
        }
        .bm-label span { color: #b8860b; margin-left: 2px; }
        .bm-input, .bm-select, .bm-textarea {
          width: 100%;
          box-sizing: border-box;
          background: rgba(255,255,255,0.7);
          border: 1px solid rgba(184,134,11,0.22);
          border-radius: 2px;
          padding: 12px 14px;
          font-family: 'Glacial Indifference', sans-serif;
          font-size: 14px;
          color: #1a1206;
          outline: none;
          transition: border-color 200ms, background 200ms;
          appearance: none;
          -webkit-appearance: none;
        }
        .bm-input:focus, .bm-select:focus, .bm-textarea:focus {
          border-color: #b8860b;
          background: #fff;
        }
        .bm-input::placeholder, .bm-textarea::placeholder { color: #c0b49f; }
        .bm-select { background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23b8860b' stroke-width='1.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; padding-right: 36px; cursor: pointer; }
        .bm-textarea { resize: vertical; min-height: 80px; line-height: 1.6; }
        .bm-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .bm-section-label {
          font-family: 'Glacial Indifference', sans-serif;
          font-size: 9px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #b8a882;
          margin-bottom: 16px;
          margin-top: 28px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .bm-section-label::after { content: ''; flex: 1; height: 1px; background: rgba(184,134,11,0.2); }
        .bm-error {
          background: rgba(180,50,30,0.07);
          border: 1px solid rgba(180,50,30,0.2);
          border-radius: 2px;
          padding: 10px 14px;
          font-family: 'Glacial Indifference', sans-serif;
          font-size: 13px;
          color: #8b2012;
          margin-bottom: 20px;
        }
        .bm-submit {
          width: 100%;
          padding: 15px 20px;
          background: #1a1206;
          border: none;
          border-radius: 2px;
          font-family: 'Glacial Indifference', sans-serif;
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #f5ede0;
          cursor: pointer;
          transition: background 250ms, opacity 250ms;
          margin-top: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .bm-submit:hover:not(:disabled) { background: #b8860b; }
        .bm-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        .bm-spinner {
          width: 14px; height: 14px;
          border: 1.5px solid rgba(245,237,224,0.3);
          border-top-color: #f5ede0;
          border-radius: 50%;
          animation: bm-spin 0.7s linear infinite;
        }
        @keyframes bm-spin { to { transform: rotate(360deg); } }
        .bm-success {
          padding: 60px 44px;
          text-align: center;
        }
        .bm-success-icon {
          width: 56px; height: 56px;
          border: 1px solid rgba(184,134,11,0.4);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          color: #b8860b;
        }
        .bm-success-title {
          font-family: 'Ibarra Real Nova', serif;
          font-size: 26px;
          font-weight: 400;
          color: #1a1206;
          margin-bottom: 12px;
        }
        .bm-success-body {
          font-family: 'Glacial Indifference', sans-serif;
          font-size: 14px;
          color: #6b5d45;
          line-height: 1.7;
          margin-bottom: 32px;
        }
        .bm-success-close {
          background: none;
          border: 1px solid rgba(184,134,11,0.4);
          border-radius: 2px;
          padding: 12px 32px;
          font-family: 'Glacial Indifference', sans-serif;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #b8860b;
          cursor: pointer;
          transition: background 200ms;
        }
        .bm-success-close:hover { background: rgba(184,134,11,0.07); }
        @media (max-width: 540px) {
          .bm-header, .bm-body { padding-left: 24px; padding-right: 24px; }
          .bm-row { grid-template-columns: 1fr; }
          .bm-success { padding: 40px 24px; }
        }
      `}</style>

      <div className="bm-overlay" ref={overlayRef} onClick={handleOverlayClick}>
        <div className="bm-modal" role="dialog" aria-modal="true" aria-label="Book a consultation">

          {step === 1 && (
            <>
              <div className="bm-header">
                <button className="bm-close" onClick={onClose} aria-label="Close">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
                <p className="bm-eyebrow">
                  <span className="bm-eyebrow-line" />
                  Begin Your Journey
                </p>
                <h2 className="bm-title">Book a <em>Consultation</em></h2>
              </div>

              <div className="bm-body">
                <form onSubmit={handleSubmit} noValidate>

                  <p className="bm-section-label">Personal Details</p>

                  <div className="bm-field">
                    <label className="bm-label">Full Name <span>*</span></label>
                    <input className="bm-input" name="name" value={form.name} onChange={handleChange} placeholder="As per birth certificate" autoComplete="name" />
                  </div>

                  <div className="bm-row">
                    <div className="bm-field">
                      <label className="bm-label">Phone <span>*</span></label>
                      <input className="bm-input" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" autoComplete="tel" />
                    </div>
                    <div className="bm-field">
                      <label className="bm-label">Email <span>*</span></label>
                      <input className="bm-input" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" autoComplete="email" />
                    </div>
                  </div>

                  <p className="bm-section-label">Birth Details</p>

                  <div className="bm-row">
                    <div className="bm-field">
                      <label className="bm-label">Date of Birth</label>
                      <input className="bm-input" name="dob" type="date" value={form.dob} onChange={handleChange} />
                    </div>
                    <div className="bm-field">
                      <label className="bm-label">Birth Time</label>
                      <input className="bm-input" name="birthTime" type="time" value={form.birthTime} onChange={handleChange} />
                    </div>
                  </div>

                  <div className="bm-field">
                    <label className="bm-label">Birth Place</label>
                    <input className="bm-input" name="birthPlace" value={form.birthPlace} onChange={handleChange} placeholder="City, Country" />
                  </div>

                  <p className="bm-section-label">Service</p>

                  <div className="bm-field">
                    <label className="bm-label">Type of Consultation <span>*</span></label>
                    <select className="bm-select" name="serviceType" value={form.serviceType} onChange={handleChange}>
                      <option value="">— Select a service —</option>
                      {SERVICE_TYPES.map((group) => (
                        <optgroup key={group.group} label={group.group}>
                          {group.items.map((item) => (
                            <option key={item} value={item}>{item}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>

                  <div className="bm-field">
                    <label className="bm-label">Message / Questions</label>
                    <textarea className="bm-textarea" name="message" value={form.message} onChange={handleChange} placeholder="Share what's on your mind or any specific concerns..." rows={3} />
                  </div>

                  {error && <div className="bm-error">{error}</div>}

                  <button className="bm-submit" type="submit" disabled={loading}>
                    {loading ? <><span className="bm-spinner" /> Sending...</> : "Request Consultation"}
                  </button>
                </form>
              </div>
            </>
          )}

          {step === 2 && (
            <div className="bm-success">
              <div className="bm-success-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h2 className="bm-success-title">Request Received</h2>
              <p className="bm-success-body">
                Thank you, {form.name.split(" ")[0]}. Your consultation request has been sent.<br />
                You'll receive a confirmation at <strong>{form.email}</strong> shortly.
              </p>
              <button className="bm-success-close" onClick={onClose}>Close</button>
            </div>
          )}

        </div>
      </div>
    </>
  );
}