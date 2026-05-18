import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import AuthenticatedNavbar from '../components/AuthenticatedNavbar.jsx';
import AppFooter from '../components/AppFooter.jsx';
import { useIdeas } from '../context/IdeasContext.jsx';

const CITIES = ['Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Surat', 'Jaipur', 'Lucknow', 'Kanpur'];
const DESTINATION_OPTIONS = ['Goa', 'Jaipur', 'Manali', 'Kerala', 'Agra', 'Udaipur', 'Shimla', 'Ooty', 'Pondicherry', 'Darjeeling', 'Munnar', 'Varanasi', 'Rishikesh', 'Andaman', 'Ladakh'];

function MultiSelectDestination({ value, onChange, disabled }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedList = value ? value.split(',').map(s => s.trim()).filter(Boolean) : [];

  const toggleOption = (opt) => {
    if (disabled) return;
    let nextList;
    if (selectedList.includes(opt)) {
      nextList = selectedList.filter(item => item !== opt);
    } else {
      nextList = [...selectedList, opt];
    }
    onChange(nextList.join(', '));
  };

  return (
    <div className={`hp-multi-select ${disabled ? 'opacity-50' : ''}`} onClick={(e) => e.stopPropagation()}>
      <div 
        className={`hp-multi-select-header ${selectedList.length ? 'has-value' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
      >
        {selectedList.length > 0 ? (
          <div className="hp-multi-select-tags">
            {selectedList.map(s => <span key={s} className="mini-tag">{s}</span>)}
          </div>
        ) : (
          <span className="placeholder-text text-muted" style={{ fontWeight: 400 }}>Select destinations...</span>
        )}
        <i className="bi bi-chevron-down" />
      </div>

      {isOpen && !disabled && (
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

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/react-input-data';

// Build a natural language message from the structured form — backend stays unchanged
function buildMessage({ from, to, date, duration, travelers, budget }) {
  const destList = to.trim() || 'a popular destination';
  const datePart = date ? `starting from ${date}` : 'starting next Friday';
  const durationPart = duration ? `for ${duration} days` : '';
  const travelersPart = travelers ? `${travelers} ${parseInt(travelers) === 1 ? 'person' : 'people'}` : '2 people';
  const budgetPart = budget ? `with a budget of ₹${Number(budget).toLocaleString('en-IN')}` : '';

  return `I am from ${from || 'India'}. I want to visit ${destList}. ${datePart}${durationPart ? ', ' + durationPart : ''}, for ${travelersPart} ${budgetPart}.`.trim();
}

const PIPELINE_STEPS = [
  { icon: 'bi-cpu', label: 'Parsing your travel request with AI...' },
  { icon: 'bi-geo-alt', label: 'Discovering & expanding your itinerary...' },
  { icon: 'bi-building', label: 'Finding the best hotels for your stay...' },
  { icon: 'bi-camera', label: 'Fetching attractions & restaurants nearby...' },
];

const PROMO_FARES = [
  { label: 'Regular', sub: 'Regular fares', active: true },
  { label: 'Student', sub: 'Extra discounts' },
  { label: 'Senior Citizen', sub: 'Up to ₹600 off' },
  { label: 'Group Travel', sub: '5+ travelers' },
  { label: 'Weekend Escape', sub: 'Short trips' },
];

const PROMO_BANNERS = [
  { icon: 'bi-shield-check', title: 'Free Cancellation', desc: 'On select hotels — cancel up to 24 hrs before', color: '#22c55e' },
  { icon: 'bi-stars', title: 'AI-Curated Picks', desc: 'Gemini AI adds top hidden gems to your itinerary', color: '#fbbf24' },
  { icon: 'bi-graph-down-arrow', title: 'Best Price Promise', desc: 'Live prices from Booking.com, sorted by rating', color: '#60a5fa' },
  { icon: 'bi-lightning-charge', title: 'Instant Planning', desc: 'Full itinerary with hotels & dining in ~30 seconds', color: '#fb923c' },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

function TripOverview({ data, onReset }) {
  const { source, destinations, start_date, duration, members, expenditure } = data;
  return (
    <div className="itin-overview-card">
      <div className="itin-overview-header">
        <div>
          <span className="itin-section-eyebrow">Trip Summary</span>
          <h2 className="itin-section-title">Here's what we understood</h2>
        </div>
        <button type="button" className="btn itin-reset-btn" onClick={onReset}>
          <i className="bi bi-arrow-counterclockwise me-2" />
          New Search
        </button>
      </div>
      <div className="itin-overview-pills">
        {source && (
          <div className="itin-pill">
            <i className="bi bi-geo-alt" />
            <span><strong>Departing from</strong> {source}</span>
          </div>
        )}
        {destinations?.length > 0 && (
          <div className="itin-pill">
            <i className="bi bi-flag" />
            <span><strong>Destinations</strong> {destinations.join(', ')}</span>
          </div>
        )}
        {start_date && (
          <div className="itin-pill">
            <i className="bi bi-calendar3" />
            <span><strong>Start Date</strong> {start_date}</span>
          </div>
        )}
        {duration && (
          <div className="itin-pill">
            <i className="bi bi-clock" />
            <span><strong>Duration</strong> {duration} days</span>
          </div>
        )}
        {members && (
          <div className="itin-pill">
            <i className="bi bi-people" />
            <span><strong>Travelers</strong> {members} {members === 1 ? 'person' : 'people'}</span>
          </div>
        )}
        {expenditure && (
          <div className="itin-pill">
            <i className="bi bi-wallet2" />
            <span><strong>Budget</strong> ₹{Number(expenditure).toLocaleString('en-IN')}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function HotelCard({ hotel, onSave, isSaved }) {
  const [imgFailed, setImgFailed] = useState(false);
  return (
    <div className="hotel-card h-100">
      <div className="hotel-card-img-wrap">
        {hotel.image_url && !imgFailed ? (
          <img src={hotel.image_url} alt={hotel.name} className="hotel-card-img" onError={() => setImgFailed(true)} />
        ) : (
          <div className="hotel-card-img-fallback"><i className="bi bi-building" /></div>
        )}
      </div>
      <div className="hotel-card-body">
        <div className="d-flex justify-content-between align-items-start gap-2 mb-2 flex-wrap">
          <h3 className="hotel-name w-75">{hotel.name}</h3>
          <span className="hotel-rating"><i className="bi bi-star-fill" /> {hotel.rating}</span>
        </div>
        <div className="hotel-price">{hotel.price}<span className="hotel-per-night"> / night</span></div>
        <div className="hotel-meta">
          <span><i className="bi bi-geo-alt" /> {hotel.location}</span>
          {hotel.review_count > 0 && <span><i className="bi bi-chat-square" /> {hotel.review_count.toLocaleString()} reviews</span>}
        </div>
        {hotel.perks && <div className="hotel-perks">{hotel.perks}</div>}
        <div className="d-flex gap-2 mt-3">
          <a href={hotel.url} target="_blank" rel="noopener noreferrer" className="btn hotel-book-btn flex-grow-1">
            <i className="bi bi-box-arrow-up-right me-2" />View Booking
          </a>
          <button
            type="button"
            className={`btn btn-outline-danger`}
            style={{ borderRadius: '12px' }}
            title={isSaved ? "Saved to Ideas" : "Save to Ideas"}
            onClick={() => onSave(hotel, 'hotel')}
            disabled={isSaved}
          >
            <i className={`bi ${isSaved ? 'bi-heart-fill' : 'bi-heart'}`} />
          </button>
        </div>
      </div>
    </div>
  );
}

function AttractionCard({ place, onSave, isSaved }) {
  const fallbackImg = 'https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&q=80&w=800';
  return (
    <div className="attraction-card h-100">
      <div className="attraction-img-wrap">
        <img src={place.image_url || fallbackImg} alt={place.name} className="attraction-img" onError={(e) => { e.target.src = fallbackImg; }} />
        <div className="attraction-overlay-badges">
          {place.status === 'original'
            ? <span className="badge-original"><i className="bi bi-pin-map-fill me-1" />Your Pick</span>
            : <span className="badge-suggested"><i className="bi bi-stars me-1" />AI Suggested</span>}
        </div>
      </div>
      <div className="attraction-body">
        <span className="attraction-city-tag">{place.city}</span>
        <div className="d-flex justify-content-between align-items-start gap-2 mb-1 flex-wrap">
          <h3 className="attraction-name w-75">{place.name}</h3>
          {place.rating && place.rating !== 'N/A' && (
            <span className="attraction-rating"><i className="bi bi-star-fill" /> {place.rating}</span>
          )}
        </div>
        {place.type && <span className="attraction-type-tag">{place.type}</span>}
        {place.description && <p className="attraction-desc">{place.description}</p>}
        <div className="d-flex gap-2 mt-auto pt-3">
          <a href={place.google_maps_link1} target="_blank" rel="noopener noreferrer" className="btn attraction-maps-btn flex-grow-1">
            <i className="bi bi-map me-2" />Open Maps
          </a>
          <button
            type="button"
            className={`btn btn-outline-danger`}
            style={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}
            title={isSaved ? "Saved to Ideas" : "Save to Ideas"}
            onClick={() => onSave(place, 'attraction')}
            disabled={isSaved}
          >
            <i className={`bi ${isSaved ? 'bi-heart-fill' : 'bi-heart'}`} />
          </button>
        </div>
      </div>
    </div>
  );
}

function RestaurantCard({ resto, onSave, isSaved }) {
  const fallbackImg = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=500';
  return (
    <div className="restaurant-card h-100">
      <div className="restaurant-img-wrap">
        <img src={resto.image_url || fallbackImg} alt={resto.name} className="restaurant-img" onError={(e) => { e.target.src = fallbackImg; }} />
      </div>
      <div className="restaurant-body">
        <div className="d-flex justify-content-between align-items-start gap-2 mb-1 flex-wrap">
          <h4 className="restaurant-name w-75">{resto.name}</h4>
          <button
            type="button"
            className="btn btn-sm btn-outline-danger p-1 px-2 border-0"
            title={isSaved ? "Saved to Ideas" : "Save to Ideas"}
            onClick={() => onSave(resto, 'restaurant')}
            disabled={isSaved}
          >
            <i className={`bi ${isSaved ? 'bi-heart-fill' : 'bi-heart'}`} />
          </button>
        </div>
        <div className="restaurant-meta">
          {resto.rating > 0 && <span className="restaurant-rating"><i className="bi bi-star-fill" /> {resto.rating}</span>}
          <span className="restaurant-cuisine">{resto.famous_for}</span>
        </div>
        {resto.distance_from_monument && <div className="restaurant-distance"><i className="bi bi-pin-map" /> {resto.distance_from_monument} away</div>}
        {resto.key_details && <div className="restaurant-rank">{resto.key_details}</div>}
        <div className="d-flex gap-2 mt-3 flex-wrap">
          <a href={resto.google_maps_link1} target="_blank" rel="noopener noreferrer" className="btn restaurant-maps-btn">
            <i className="bi bi-map me-1" /> Maps
          </a>
          {resto.trip_advisor_url && (
            <a href={resto.trip_advisor_url} target="_blank" rel="noopener noreferrer" className="btn restaurant-ta-btn">TripAdvisor</a>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

function ItineraryPage() {
  const location = useLocation();
  const { saveIdea, savedIdeas, confirmedIdeas } = useIdeas();
  const today = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState({
    from: '',
    to: '',
    date: today,
    duration: '5',
    travelers: '2',
    budget: '',
  });
  const [activePromo, setActivePromo] = useState(0);
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [loadingStep, setLoadingStep] = useState(0);

  const resultsRef = useRef(null);
  const stepTimerRef = useRef(null);
  const autoSubmitRef = useRef(false);

  const updateForm = (key, val) => setForm(f => ({ ...f, [key]: val }));

  // ── Auto-fill + auto-submit from HomePage state ──
  useEffect(() => {
    const state = location.state;
    if (state?.prefill && !autoSubmitRef.current) {
      autoSubmitRef.current = true;
      const prefilled = state.prefill;
      setForm(prefilled);
      if (state.autoSubmit) {
        // Give React one tick to apply the state before submitting
        setTimeout(() => {
          triggerSubmit(prefilled);
        }, 80);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startLoadingSteps = () => {
    setLoadingStep(0);
    let step = 0;
    stepTimerRef.current = setInterval(() => {
      step += 1;
      if (step < PIPELINE_STEPS.length) setLoadingStep(step);
      else clearInterval(stepTimerRef.current);
    }, 7000);
  };

  const handleSaveItem = (item, type) => {
    let ideaData = { type };
    if (type === 'hotel') {
      ideaData = {
        ...ideaData,
        id: item.url || item.name,
        name: item.name,
        rating: item.rating,
        price: item.price,
        image_url: item.image_url,
        location: item.location,
        url: item.url,
      };
    } else if (type === 'attraction') {
      ideaData = {
        ...ideaData,
        id: item.google_maps_link1 || item.name,
        name: item.name,
        type_tag: item.type,
        description: item.description,
        image_url: item.image_url,
        url: item.google_maps_link1,
      };
    } else if (type === 'restaurant') {
      ideaData = {
        ...ideaData,
        id: item.trip_advisor_url || item.google_maps_link1 || item.name,
        name: item.name,
        cuisine: item.famous_for,
        rating: item.rating,
        image_url: item.image_url,
        url: item.trip_advisor_url || item.google_maps_link1,
      };
    }
    saveIdea(ideaData);
  };

  const isItemSaved = (id) => savedIdeas.some((i) => i.id === id) || confirmedIdeas.some((i) => i.id === id);

  // Core submit logic — accepts an explicit formData arg so auto-submit can pass prefilled values
  const triggerSubmit = async (formData) => {
    const f = formData || form;
    if (!f.to.trim()) return;

    setStatus('loading');
    setResult(null);
    setErrorMsg('');
    startLoadingSteps();

    const message = buildMessage(f);
    try {
      const res = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      clearInterval(stepTimerRef.current);
      const data = await res.json();
      if (!res.ok || data.status === 'Error') throw new Error(data.errorMessage || `Server returned ${res.status}`);
      setResult(data);
      setStatus('success');
    } catch (err) {
      clearInterval(stepTimerRef.current);
      setErrorMsg(err.message);
      setStatus('error');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    triggerSubmit();
  };

  useEffect(() => {
    if (status === 'success' && resultsRef.current) {
      setTimeout(() => resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200);
    }
  }, [status]);

  useEffect(() => () => clearInterval(stepTimerRef.current), []);

  const handleReset = () => {
    setStatus('idle');
    setResult(null);
    setErrorMsg('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isLoading = status === 'loading';
  const isError = status === 'error';
  const isSuccess = status === 'success';

  const totalHotels = result?.hotels_list?.reduce((s, c) => s + (c.recommendations?.length || 0), 0) || 0;
  const totalAttractions = result?.tourist_list?.length || 0;
  const totalRestaurants = result?.restaurants_list?.reduce((s, g) => s + (g.ans?.length || 0), 0) || 0;

  return (
    <div className="itinerary-page">
      <AuthenticatedNavbar />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="itin-hero">
        <div className="itin-hero-glow" />
        <div className="container">
          <div className="itin-hero-content">

            {/* Headline */}
            <div className="text-center mb-4">
              <span className="itin-kicker"><i className="bi bi-stars me-2" />AI Trip Planner</span>
              <h1 className="itin-hero-title">
                Your Dream Trip,<br />
                <span className="itin-title-highlight">Planned in Seconds.</span>
              </h1>
              <p className="itin-hero-sub">
                Tell us where you want to go — we'll find real hotels, top attractions, and great restaurants for you.
              </p>
              <div className="mt-3">
                <Link to="/ideas" className="btn btn-outline-light rounded-pill px-4">
                  <i className="bi bi-heart me-2" />View My Wishlist
                </Link>
              </div>
            </div>

            {/* ── Booking Form Card ── */}
            <form onSubmit={handleSubmit}>
              <div className="itin-booking-card">

                {/* Fields Row */}
                <div className="itin-fields-row">

                  {/* From */}
                  <div className="itin-field itin-field-from">
                    <label className="itin-field-label">From</label>
                    <select
                      id="itin-from"
                      className="itin-field-input text-white"
                      style={{ background: 'transparent', border: 'none', appearance: 'none', padding: 0 }}
                      value={form.from}
                      onChange={e => updateForm('from', e.target.value)}
                      disabled={isLoading}
                    >
                      <option value="" disabled style={{color: '#000'}}>Select City</option>
                      {CITIES.map(c => <option key={c} value={c} style={{color: '#000'}}>{c}</option>)}
                    </select>
                  </div>

                  <div className="itin-field-divider" />

                  {/* To */}
                  <div className="itin-field itin-field-to" style={{ minWidth: '200px' }} onClick={() => {}}>
                    <label className="itin-field-label">Destination(s)</label>
                    <MultiSelectDestination 
                      value={form.to} 
                      onChange={(val) => updateForm('to', val)} 
                      disabled={isLoading}
                    />
                  </div>

                  <div className="itin-field-divider" />

                  {/* Date */}
                  <div className="itin-field itin-field-date">
                    <label className="itin-field-label">
                      <i className="bi bi-calendar3 me-1" />Departure
                    </label>
                    <input
                      id="itin-date"
                      type="date"
                      className="itin-field-input"
                      value={form.date}
                      min={today}
                      onChange={e => updateForm('date', e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="itin-field-divider" />

                  {/* Duration */}
                  <div className="itin-field itin-field-small">
                    <label className="itin-field-label">
                      <i className="bi bi-moon me-1" />Nights
                    </label>
                    <select
                      id="itin-duration"
                      className="itin-field-input"
                      value={form.duration}
                      onChange={e => updateForm('duration', e.target.value)}
                      disabled={isLoading}
                    >
                      {[1,2,3,4,5,6,7,10,14].map(n => (
                        <option key={n} value={n}>{n} {n === 1 ? 'Night' : 'Nights'}</option>
                      ))}
                    </select>
                  </div>

                  <div className="itin-field-divider" />

                  {/* Travelers */}
                  <div className="itin-field itin-field-small">
                    <label className="itin-field-label">
                      <i className="bi bi-people me-1" />Travelers
                    </label>
                    <select
                      id="itin-travelers"
                      className="itin-field-input"
                      value={form.travelers}
                      onChange={e => updateForm('travelers', e.target.value)}
                      disabled={isLoading}
                    >
                      {[1,2,3,4,5,6,8,10].map(n => (
                        <option key={n} value={n}>{n} {n === 1 ? 'Traveler' : 'Travelers'}</option>
                      ))}
                    </select>
                  </div>

                  <div className="itin-field-divider" />

                  {/* Budget */}
                  <div className="itin-field itin-field-budget">
                    <label className="itin-field-label">
                      <i className="bi bi-wallet2 me-1" />Budget (₹)
                    </label>
                    <input
                      id="itin-budget"
                      type="number"
                      className="itin-field-input"
                      placeholder="50000"
                      value={form.budget}
                      onChange={e => updateForm('budget', e.target.value)}
                      disabled={isLoading}
                      min="0"
                    />
                  </div>
                </div>

                {/* Promo Fares Row */}
                <div className="itin-promo-row">
                  <span className="itin-promo-label">SPECIAL OFFERS</span>
                  <div className="itin-promo-chips">
                    {PROMO_FARES.map((f, i) => (
                      <button
                        key={i}
                        type="button"
                        className={`itin-promo-chip${activePromo === i ? ' itin-promo-chip-active' : ''}`}
                        onClick={() => setActivePromo(i)}
                        disabled={isLoading}
                      >
                        <span className="itin-promo-chip-title">{f.label}</span>
                        <span className="itin-promo-chip-sub">{f.sub}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search Button */}
                <div className="itin-search-row">
                  <button
                    type="submit"
                    id="itin-search-btn"
                    className="btn itin-search-btn"
                    disabled={!form.to.trim() || isLoading}
                  >
                    {isLoading ? (
                      <><span className="spinner-border spinner-border-sm me-2" role="status" />Planning...</>
                    ) : (
                      <><i className="bi bi-search me-2" />SEARCH</>
                    )}
                  </button>
                </div>

              </div>
            </form>

            {/* Trust Strip */}
            {!isLoading && !isSuccess && (
              <div className="itin-trust-strip">
                <span><i className="bi bi-building me-1" />Live prices from Booking.com</span>
                <span className="itin-trust-sep">·</span>
                <span><i className="bi bi-camera me-1" />Attractions from TripAdvisor</span>
                <span className="itin-trust-sep">·</span>
                <span><i className="bi bi-cpu me-1" />Powered by Google Gemini AI</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Promotion Banners ──────────────────────────────────── */}
      {!isSuccess && !isLoading && (
        <section className="itin-promo-section">
          <div className="container">
            <div className="itin-promo-banner-grid">
              {PROMO_BANNERS.map((b, i) => (
                <div key={i} className="itin-promo-banner-card">
                  <div className="itin-promo-banner-icon" style={{ color: b.color }}>
                    <i className={`bi ${b.icon}`} />
                  </div>
                  <div>
                    <div className="itin-promo-banner-title">{b.title}</div>
                    <div className="itin-promo-banner-desc">{b.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Loading ──────────────────────────────────────────── */}
      {isLoading && (
        <section className="itin-loader-section">
          <div className="container">
            <div className="itin-loader-card">
              <div className="itin-spinner-wrap">
                <div className="itin-spinner-ring" />
                <i className="bi bi-stars itin-spinner-icon" />
              </div>
              <h3 className="itin-loader-title">Building your perfect itinerary</h3>
              <p className="itin-loader-sub">This usually takes 20–40 seconds while we call live APIs.</p>
              <div className="itin-steps">
                {PIPELINE_STEPS.map((step, i) => (
                  <div key={i} className={`itin-step${i <= loadingStep ? ' itin-step-active' : ''}${i < loadingStep ? ' itin-step-done' : ''}`}>
                    <div className="itin-step-dot">
                      {i < loadingStep ? <i className="bi bi-check" /> : <i className={step.icon} />}
                    </div>
                    <span>{step.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Error ────────────────────────────────────────────── */}
      {isError && (
        <section className="itin-error-section">
          <div className="container">
            <div className="itin-error-card">
              <i className="bi bi-exclamation-triangle itin-error-icon" />
              <h3>Something went wrong</h3>
              <p className="text-white-50 mb-1">{errorMsg}</p>
              <p className="text-white-50 small mb-4">
                Make sure the backend URL is configured correctly and the server is running.
              </p>
              <button type="button" className="btn itin-submit-btn" onClick={handleReset}>
                <i className="bi bi-arrow-counterclockwise me-2" />Try Again
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ── Results ──────────────────────────────────────────── */}
      {isSuccess && result && (
        <div ref={resultsRef} className="itin-results-shell">

          {/* Stats bar */}
          <div className="itin-stats-bar">
            <div className="container">
              <div className="itin-stats-inner">
                <span className="itin-stat-item"><i className="bi bi-check2-circle" /> Generated {result.generated_at}</span>
                <span className="itin-stat-sep">·</span>
                <span className="itin-stat-item"><i className="bi bi-building" /> {totalHotels} Hotels</span>
                <span className="itin-stat-sep">·</span>
                <span className="itin-stat-item"><i className="bi bi-camera" /> {totalAttractions} Attractions</span>
                <span className="itin-stat-sep">·</span>
                <span className="itin-stat-item"><i className="bi bi-cup-hot" /> {totalRestaurants} Restaurants</span>
              </div>
            </div>
          </div>

          {/* Trip Overview */}
          <section className="itin-section">
            <div className="container">
              <TripOverview data={result.source_data} onReset={handleReset} />
            </div>
          </section>

          {/* Hotels */}
          {result.hotels_list?.length > 0 && (
            <section className="itin-section">
              <div className="container">
                <div className="itin-section-header">
                  <span className="itin-section-eyebrow">Accommodation</span>
                  <h2 className="itin-section-title">Top Hotels Near Your Destinations</h2>
                  <p className="itin-section-sub">Sorted by guest rating. Live prices from Booking.com.</p>
                </div>
                {result.hotels_list.map((cityHotels) => (
                  <div key={cityHotels.city} className="itin-city-block">
                    <div className="itin-city-label"><i className="bi bi-building me-2" />Hotels in {cityHotels.city}</div>
                    <div className="row g-4">
                      {cityHotels.recommendations.map((hotel, i) => {
                        const id = hotel.url || hotel.name;
                        return (
                          <div key={i} className="col-md-6 col-lg-4">
                            <HotelCard 
                              hotel={hotel} 
                              onSave={handleSaveItem} 
                              isSaved={isItemSaved(id)} 
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Attractions */}
          {result.tourist_list?.length > 0 && (
            <section className="itin-section">
              <div className="container">
                <div className="itin-section-header">
                  <span className="itin-section-eyebrow">Sightseeing</span>
                  <h2 className="itin-section-title">Places to Explore</h2>
                  <p className="itin-section-sub">Your picks + AI-suggested additions. Details via TripAdvisor.</p>
                </div>
                <div className="row g-4">
                  {result.tourist_list.map((place, i) => {
                    const id = place.google_maps_link1 || place.name;
                    return (
                      <div key={i} className="col-md-6 col-lg-4">
                        <AttractionCard 
                          place={place} 
                          onSave={handleSaveItem} 
                          isSaved={isItemSaved(id)} 
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          {/* Restaurants */}
          {result.restaurants_list?.length > 0 && (
            <section className="itin-section">
              <div className="container">
                <div className="itin-section-header">
                  <span className="itin-section-eyebrow">Dining</span>
                  <h2 className="itin-section-title">Restaurants Near Each Attraction</h2>
                  <p className="itin-section-sub">Top-rated dining options within walking distance of the places you'll visit.</p>
                </div>
                {result.restaurants_list.map((group, gi) => (
                  <div key={gi} className="itin-restaurant-group">
                    <div className="itin-restaurant-group-label">
                      <i className="bi bi-geo-alt-fill me-2" />Near <strong>{group.tourist_place}</strong>
                      <span className="itin-restaurant-group-city"> · {group.city}</span>
                    </div>
                    <div className="row g-3">
                      {group.ans.map((resto, ri) => {
                        const id = resto.trip_advisor_url || resto.google_maps_link1 || resto.name;
                        return (
                          <div key={ri} className="col-sm-6 col-xl-3">
                            <RestaurantCard 
                              resto={resto} 
                              city={group.city} 
                              onSave={handleSaveItem} 
                              isSaved={isItemSaved(id)} 
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Empty state */}
          {totalHotels === 0 && totalAttractions === 0 && totalRestaurants === 0 && (
            <section className="itin-section">
              <div className="container text-center">
                <div className="itin-empty-results">
                  <i className="bi bi-search itin-empty-icon" />
                  <h3>No results found</h3>
                  <p className="text-white-50">The AI couldn't find enough data. Try a more specific city name or well-known destination.</p>
                  <button type="button" className="btn itin-submit-btn mt-2" onClick={handleReset}>Try Another Destination</button>
                </div>
              </div>
            </section>
          )}

          {/* CTA */}
          <section className="itin-section pb-5">
            <div className="container">
              <div className="itin-cta-card text-center">
                <i className="bi bi-check2-circle itin-cta-icon" />
                <h3>Love what you see? Start planning.</h3>
                <p className="text-white-50 mb-4">Save your favourite destination ideas to your travel board, or start your trip task list.</p>
                <div className="d-flex gap-3 justify-content-center flex-wrap">
                  <Link to="/ideas" className="btn itin-submit-btn"><i className="bi bi-heart me-2" />Open Your Ideas</Link>
                  <Link to="/todo" className="btn itin-outline-btn"><i className="bi bi-list-check me-2" />Go to Todo Board</Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      <AppFooter />
    </div>
  );
}

export default ItineraryPage;
