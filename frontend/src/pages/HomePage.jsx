import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthenticatedNavbar from '../components/AuthenticatedNavbar.jsx';
import AppFooter from '../components/AppFooter.jsx';
import { useIdeas } from '../context/IdeasContext.jsx';

// ── Data ─────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { icon: 'bi-stars',         label: 'AI Planner',    to: '/itinerary',  color: '#fbbf24' },
  { icon: 'bi-heart',         label: 'My Ideas',       to: '/ideas',      color: '#f87171' },
  { icon: 'bi-list-check',    label: 'Todo Board',     to: '/todo',       color: '#34d399' },
  { icon: 'bi-gem',           label: 'Trevo Pro',      to: '/catalog',    color: '#60a5fa' },
  { icon: 'bi-person-circle', label: 'My Profile',     to: '/profile',    color: '#c084fc' },
  { icon: 'bi-globe2',        label: 'Travel Updates', to: '#updates',    color: '#fb923c' },
];

const DESTINATIONS = [
  {
    name: 'Goa',
    tag: 'Beaches & Nightlife',
    duration: '4 Days',
    img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=600',
    badge: 'Trending',
    badgeColor: '#22c55e',
  },
  {
    name: 'Rajasthan',
    tag: 'Palaces & Heritage',
    duration: '7 Days',
    img: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&q=80&w=600',
    badge: 'Popular',
    badgeColor: '#3b82f6',
  },
  {
    name: 'Manali',
    tag: 'Mountains & Snow',
    duration: '5 Days',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=600',
    badge: 'Scenic',
    badgeColor: '#8b5cf6',
  },
  {
    name: 'Kerala',
    tag: 'Backwaters & Spice',
    duration: '6 Days',
    img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=600',
    badge: 'Relaxing',
    badgeColor: '#10b981',
  },
  {
    name: 'Agra',
    tag: 'Taj Mahal & Forts',
    duration: '2 Days',
    img: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=600',
    badge: 'Iconic',
    badgeColor: '#f59e0b',
  },
  {
    name: 'Coorg',
    tag: 'Coffee & Forests',
    duration: '3 Days',
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=600',
    badge: 'Hidden Gem',
    badgeColor: '#06b6d4',
  },
];

const DEALS = [
  { title: 'Weekend Getaway', desc: 'Short 2–3 day trips starting Friday', icon: 'bi-moon-stars', color: 'linear-gradient(135deg,#1e3a5f,#2563eb)' },
  { title: 'Hill Station Special', desc: 'Manali · Shimla · Ooty · Coorg', icon: 'bi-snow', color: 'linear-gradient(135deg,#1e4038,#059669)' },
  { title: 'Heritage Circuit', desc: 'Rajasthan · Agra · Hampi', icon: 'bi-bank2', color: 'linear-gradient(135deg,#4c1d24,#dc2626)' },
  { title: 'Coastal Escape', desc: 'Goa · Pondicherry · Vizag', icon: 'bi-water', color: 'linear-gradient(135deg,#1a3561,#0ea5e9)' },
];

const WHY_TREVO = [
  { icon: 'bi-cpu', color: '#fbbf24', title: 'AI-Powered Planning', desc: 'Gemini AI understands your request in plain English and builds a full itinerary instantly.' },
  { icon: 'bi-building', color: '#60a5fa', title: 'Live Hotel Prices', desc: 'Real-time prices from Booking.com sorted by guest rating — not paid placements.' },
  { icon: 'bi-camera2', color: '#34d399', title: 'TripAdvisor Attractions', desc: 'Curated descriptions, ratings and photos for every landmark you want to visit.' },
  { icon: 'bi-shop', color: '#fb923c', title: 'Restaurants by Location', desc: 'Top-rated dining near each attraction found using real GPS coordinates.' },
];

const REVIEWS = [
  { name: 'Priya S.', city: 'Bengaluru', stars: 5, text: '"Trevo planned my entire Rajasthan trip in 30 seconds. The hotel suggestions were spot-on."' },
  { name: 'Arjun M.', city: 'Mumbai', stars: 5, text: '"Finally a travel planner that actually understands what I want. The AI is impressively good."' },
  { name: 'Rhea K.', city: 'Delhi', stars: 4, text: '"The restaurant-near-monument feature is genius. Found amazing places to eat near the Taj!"' },
];

// ── Full Search Widget (passes all fields to AI Planner) ─────────────────────

const QUICK_PICKS = [
  { label: 'Goa · 4N', from: 'Delhi', to: 'Goa', duration: '4', travelers: '2', budget: '30000' },
  { label: 'Manali · 5N', from: 'Delhi', to: 'Manali', duration: '5', travelers: '2', budget: '40000' },
  { label: 'Jaipur · 3N', from: 'Mumbai', to: 'Jaipur', duration: '3', travelers: '2', budget: '25000' },
  { label: 'Kerala · 6N', from: 'Bengaluru', to: 'Kerala', duration: '6', travelers: '4', budget: '80000' },
  { label: 'Ooty · 3N', from: 'Chennai', to: 'Ooty', duration: '3', travelers: '2', budget: '20000' },
];

const CITIES = ['Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Surat', 'Jaipur', 'Lucknow', 'Kanpur'];
const DESTINATION_OPTIONS = ['Goa', 'Jaipur', 'Manali', 'Kerala', 'Agra', 'Udaipur', 'Shimla', 'Ooty', 'Pondicherry', 'Darjeeling', 'Munnar', 'Varanasi', 'Rishikesh', 'Andaman', 'Ladakh'];

// Custom Multi-Select component for Destinations
function MultiSelectDestination({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  
  // value is a comma separated string
  const selectedList = value ? value.split(',').map(s => s.trim()).filter(Boolean) : [];

  const toggleOption = (opt) => {
    let nextList;
    if (selectedList.includes(opt)) {
      nextList = selectedList.filter(item => item !== opt);
    } else {
      nextList = [...selectedList, opt];
    }
    onChange(nextList.join(', '));
  };

  return (
    <div className="hp-multi-select" onClick={(e) => e.stopPropagation()}>
      <div 
        className={`hp-multi-select-header ${selectedList.length ? 'has-value' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedList.length > 0 ? (
          <div className="hp-multi-select-tags">
            {selectedList.map(s => <span key={s} className="mini-tag">{s}</span>)}
          </div>
        ) : (
          <span className="placeholder-text">Select destinations...</span>
        )}
        <i className="bi bi-chevron-down" />
      </div>

      {isOpen && (
        <div className="hp-multi-select-dropdown">
          <div className="hp-multi-select-grid">
            {DESTINATION_OPTIONS.map(opt => {
              const isSelected = selectedList.includes(opt);
              return (
                <label key={opt} className={`hp-multi-option ${isSelected ? 'selected' : ''}`}>
                  <input 
                    type="checkbox" 
                    checked={isSelected} 
                    onChange={() => toggleOption(opt)} 
                  />
                  <span>{opt}</span>
                </label>
              );
            })}
          </div>
          <button type="button" className="btn btn-sm btn-dark w-100 mt-2" onClick={() => setIsOpen(false)}>Done</button>
        </div>
      )}
    </div>
  );
}

function MiniSearchWidget() {
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState({
    from: '',
    to: '',
    date: today,
    duration: '5',
    travelers: '2',
    budget: '',
  });

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSearch = (e) => {
    e.preventDefault();
    if (!form.to.trim()) return;
    // Navigate to AI Planner and pass the form as location state
    navigate('/itinerary', { state: { prefill: form, autoSubmit: true } });
  };

  const applyQuickPick = (pick) => {
    const next = { ...form, ...pick, date: form.date };
    setForm(next);
    navigate('/itinerary', { state: { prefill: next, autoSubmit: true } });
  };

  return (
    <form className="hp-search-widget" onSubmit={handleSearch}>
      {/* Row 1: fields */}
      <div className="hp-fw-card">
        <div className="hp-fw-fields">

          {/* From */}
          <div className="hp-fw-field hp-fw-field-from">
            <label className="hp-fw-label"><i className="bi bi-geo-alt me-1"/>From</label>
            <select
              className="hp-fw-input"
              value={form.from}
              onChange={e => update('from', e.target.value)}
            >
              <option value="" disabled>Select City</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="hp-fw-sep" />

          {/* To */}
          <div className="hp-fw-field hp-fw-field-to" onClick={() => {
            // Close multiselect if clicked outside, handled globally mostly, but putting component isolates it
          }}>
            <label className="hp-fw-label"><i className="bi bi-flag me-1"/>Destination(s)</label>
            <MultiSelectDestination 
              value={form.to} 
              onChange={(val) => update('to', val)} 
            />
          </div>

          <div className="hp-fw-sep" />

          {/* Date */}
          <div className="hp-fw-field hp-fw-field-date">
            <label className="hp-fw-label"><i className="bi bi-calendar3 me-1"/>Departure</label>
            <input
              type="date"
              className="hp-fw-input"
              value={form.date}
              min={today}
              onChange={e => update('date', e.target.value)}
            />
          </div>

          <div className="hp-fw-sep" />

          {/* Nights */}
          <div className="hp-fw-field hp-fw-field-sm">
            <label className="hp-fw-label"><i className="bi bi-moon me-1"/>Nights</label>
            <select className="hp-fw-input" value={form.duration} onChange={e => update('duration', e.target.value)}>
              {[1,2,3,4,5,6,7,10,14].map(n => (
                <option key={n} value={n}>{n} {n===1?'Night':'Nights'}</option>
              ))}
            </select>
          </div>

          <div className="hp-fw-sep" />

          {/* Travelers */}
          <div className="hp-fw-field hp-fw-field-sm">
            <label className="hp-fw-label"><i className="bi bi-people me-1"/>Travelers</label>
            <select className="hp-fw-input" value={form.travelers} onChange={e => update('travelers', e.target.value)}>
              {[1,2,3,4,5,6,8,10].map(n => (
                <option key={n} value={n}>{n} {n===1?'Person':'People'}</option>
              ))}
            </select>
          </div>

          <div className="hp-fw-sep" />

          {/* Budget */}
          <div className="hp-fw-field hp-fw-field-budget">
            <label className="hp-fw-label"><i className="bi bi-wallet2 me-1"/>Budget (₹)</label>
            <input
              type="number"
              className="hp-fw-input"
              placeholder="50000"
              value={form.budget}
              onChange={e => update('budget', e.target.value)}
              min="0"
            />
          </div>
        </div>

        {/* Search Button */}
        <button type="submit" className="btn hp-fw-search-btn" disabled={!form.to.trim()}>
          <i className="bi bi-search me-2" />SEARCH
        </button>
      </div>

      {/* Quick Picks */}
      <div className="hp-search-tags">
        <span className="hp-search-tags-label">Quick picks:</span>
        {QUICK_PICKS.map(pick => (
          <button
            key={pick.label}
            type="button"
            className="hp-search-tag"
            onClick={() => applyQuickPick(pick)}
          >
            {pick.label}
          </button>
        ))}
      </div>
    </form>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

function HomePage() {
  const { savedIdeas, confirmedIdeas, saveIdea } = useIdeas();
  const navigate = useNavigate();

  const isIdeaSaved = (id) => savedIdeas.some(i => i.id === id);
  const isIdeaConfirmed = (id) => confirmedIdeas.some(i => i.id === id);

  return (
    <div className="home-page">
      <AuthenticatedNavbar />

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="hp-hero">
        <div className="hp-hero-overlay" />
        <div className="container hp-hero-content">
          <div className="text-center mb-4">
            <span className="hp-hero-kicker">
              <i className="bi bi-stars me-2" />India's AI Travel Planner
            </span>
            <h1 className="hp-hero-title">
              Plan your perfect trip<br />
              <span className="hp-hero-highlight">with AI in seconds.</span>
            </h1>
            <p className="hp-hero-sub">
              Tell us where you want to go — Trevo finds real hotels, attractions & restaurants.
            </p>
          </div>
          <MiniSearchWidget />
        </div>
      </section>

      {/* ── Category Nav ───────────────────────────────────── */}
      <section className="hp-categories-section">
        <div className="container">
          <div className="hp-categories-grid">
            {CATEGORIES.map((cat) => (
              <Link key={cat.label} to={cat.to} className="hp-category-card">
                <div className="hp-category-icon" style={{ color: cat.color }}>
                  <i className={`bi ${cat.icon}`} />
                </div>
                <span className="hp-category-label">{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Best Deals ─────────────────────────────────────── */}
      <section className="hp-section" id="updates">
        <div className="container">
          <div className="hp-section-header">
            <div>
              <span className="hp-eyebrow">Trip Collections</span>
              <h2 className="hp-section-title">Handpicked Itinerary Ideas</h2>
            </div>
            <Link to="/itinerary" className="hp-see-all">Try AI Planner <i className="bi bi-arrow-right ms-1" /></Link>
          </div>
          <div className="row g-3">
            {DEALS.map((deal, i) => (
              <div key={i} className="col-md-6 col-lg-3">
                <Link to="/itinerary" className="hp-deal-card" style={{ background: deal.color }}>
                  <i className={`bi ${deal.icon} hp-deal-icon`} />
                  <div className="hp-deal-title">{deal.title}</div>
                  <div className="hp-deal-desc">{deal.desc}</div>
                  <span className="hp-deal-cta">Plan Now <i className="bi bi-arrow-right" /></span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Top Destinations ───────────────────────────────── */}
      <section className="hp-section" id="recommendations">
        <div className="container">
          <div className="hp-section-header">
            <div>
              <span className="hp-eyebrow">Top Destinations</span>
              <h2 className="hp-section-title">Where Will You Go Next?</h2>
            </div>
            <Link to="/itinerary" className="hp-see-all">Explore All <i className="bi bi-arrow-right ms-1" /></Link>
          </div>
          <div className="row g-4">
            {DESTINATIONS.map((dest) => {
              const ideaItem = { id: dest.name.toLowerCase().replace(/\s/g, '-'), destination: dest.name, vibe: dest.tag, duration: dest.duration, summary: dest.tag };
              const saved = isIdeaSaved(ideaItem.id);
              const confirmed = isIdeaConfirmed(ideaItem.id);
              return (
                <div key={dest.name} className="col-md-4 col-lg-4 col-xl-2-custom">
                  <div className="hp-dest-card">
                    <div className="hp-dest-img-wrap">
                      <img src={dest.img} alt={dest.name} className="hp-dest-img" loading="lazy" />
                      <span className="hp-dest-badge" style={{ background: dest.badgeColor }}>{dest.badge}</span>
                    </div>
                    <div className="hp-dest-body">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <div className="hp-dest-name">{dest.name}</div>
                          <div className="hp-dest-tag">{dest.tag}</div>
                        </div>
                        <span className="hp-dest-duration">{dest.duration}</span>
                      </div>
                      <div className="d-flex gap-2 mt-3">
                        <button 
                          className="btn hp-dest-plan-btn flex-grow-1"
                          onClick={() => {
                            const prefill = {
                              from: 'Delhi',
                              to: dest.name,
                              date: new Date().toISOString().split('T')[0],
                              duration: dest.duration.split(' ')[0] || '3',
                              travelers: '2',
                              budget: '25000'
                            };
                            navigate('/itinerary', { state: { prefill, autoSubmit: true } });
                          }}
                        >
                          <i className="bi bi-stars me-1" /> Plan Trip
                        </button>
                        <button
                          type="button"
                          className={`btn hp-dest-save-btn${saved || confirmed ? ' hp-dest-save-btn-active' : ''}`}
                          onClick={() => saveIdea(ideaItem)}
                          disabled={saved || confirmed}
                          title={confirmed ? 'Confirmed' : saved ? 'Saved' : 'Save to Ideas'}
                        >
                          <i className={`bi ${confirmed ? 'bi-check2-circle' : saved ? 'bi-heart-fill' : 'bi-heart'}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Why Trevo ──────────────────────────────────────── */}
      <section className="hp-section hp-why-section">
        <div className="container">
          <div className="text-center mb-5">
            <span className="hp-eyebrow">Why Trevo</span>
            <h2 className="hp-section-title">Everything You Need, Nothing You Don't</h2>
            <p className="hp-section-sub">Unlike generic travel sites, Trevo uses live data and AI to give you a real, personalized plan.</p>
          </div>
          <div className="row g-4">
            {WHY_TREVO.map((w, i) => (
              <div key={i} className="col-md-6 col-lg-3">
                <div className="hp-why-card">
                  <div className="hp-why-icon" style={{ color: w.color }}>
                    <i className={`bi ${w.icon}`} />
                  </div>
                  <h3 className="hp-why-title">{w.title}</h3>
                  <p className="hp-why-desc">{w.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Bar ──────────────────────────────────────── */}
      <section className="hp-stats-section">
        <div className="container">
          <div className="hp-stats-bar">
            {[
              { val: '500+', label: 'Destinations Supported' },
              { val: '30s', label: 'Avg. Itinerary Time' },
              { val: '3 APIs', label: 'Live Data Sources' },
              { val: '100%', label: 'AI-Personalized' },
            ].map((s, i) => (
              <div key={i} className="hp-stat-item">
                <div className="hp-stat-val">{s.val}</div>
                <div className="hp-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Reviews ────────────────────────────────────────── */}
      <section className="hp-section">
        <div className="container">
          <div className="text-center mb-5">
            <span className="hp-eyebrow">Traveler Stories</span>
            <h2 className="hp-section-title">Loved by Real Travelers</h2>
          </div>
          <div className="row g-4">
            {REVIEWS.map((r, i) => (
              <div key={i} className="col-md-4">
                <div className="hp-review-card">
                  <div className="hp-review-stars">
                    {Array.from({ length: 5 }, (_, j) => (
                      <i key={j} className={`bi ${j < r.stars ? 'bi-star-fill' : 'bi-star'}`} />
                    ))}
                  </div>
                  <p className="hp-review-text">{r.text}</p>
                  <div className="hp-review-author">
                    <div className="hp-review-avatar">{r.name[0]}</div>
                    <div>
                      <div className="hp-review-name">{r.name}</div>
                      <div className="hp-review-city">{r.city}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────────────── */}
      <section className="hp-section pb-5">
        <div className="container">
          <div className="hp-cta-banner">
            <div className="hp-cta-glow" />
            <div className="row align-items-center g-4">
              <div className="col-lg-8">
                <span className="hp-eyebrow">Start Now — It's Free</span>
                <h2 className="hp-cta-title">Plan your next trip with Trevo AI</h2>
                <p className="hp-cta-sub">
                  Type where you want to go, how many people, and your budget — we'll handle the rest.
                </p>
              </div>
              <div className="col-lg-4 d-flex flex-column gap-3 align-items-lg-end">
                <Link to="/itinerary" className="btn hp-cta-btn-primary">
                  <i className="bi bi-stars me-2" />Generate Itinerary
                </Link>
                <Link to="/ideas" className="btn hp-cta-btn-outline">
                  <i className="bi bi-heart me-2" />View Saved Ideas
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AppFooter />
    </div>
  );
}

export default HomePage;
