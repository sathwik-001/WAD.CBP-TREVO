import { Link } from 'react-router-dom';
import AppFooter from '../components/AppFooter.jsx';

const featureCards = [
  {
    icon: 'bi bi-stars',
    title: 'Personalized Trip Ideas',
    description:
      'Trevo helps travelers discover destinations, activities, and routes that actually match their mood, pace, and budget.',
  },
  {
    icon: 'bi bi-map',
    title: 'Smarter Itinerary Planning',
    description:
      'Turn scattered travel ideas into a clear plan with suggested stops, timing help, and a more organized journey.',
  },
  {
    icon: 'bi bi-wallet2',
    title: 'Better Travel Decisions',
    description:
      'Compare options faster, stay budget-aware, and choose plans that feel practical as well as exciting.',
  },
];

const supportPoints = [
  {
    icon: 'bi bi-compass',
    title: 'Discover where to go next',
    text: 'Get inspiration for weekend escapes, family vacations, and dream destinations without endless searching.',
  },
  {
    icon: 'bi bi-calendar-check',
    title: 'Plan with more confidence',
    text: 'Trevo helps shape your route, timing, and trip flow so the journey feels smoother from day one.',
  },
  {
    icon: 'bi bi-collection',
    title: 'Keep everything in one place',
    text: 'Profile, subscriptions, travel preferences, and trip history can all live together inside the app.',
  },
];

const benefitCards = [
  {
    value: 'Tailored',
    label: 'Plans that feel matched to the traveler, not copied from a generic list.',
  },
  {
    value: 'Flexible',
    label: 'Useful for solo travel, family trips, short getaways, and bigger adventures.',
  },
  {
    value: 'Focused',
    label: 'Less time browsing random ideas and more time moving toward an actual trip.',
  },
  {
    value: 'Growing',
    label: 'Trevo is designed to become your central place for planning and revisiting journeys.',
  },
];

function LandingPage() {
  return (
    <section className="landing-page">
      <div className="bg-overlay" />

      <header className="container landing-header">
        <div className="landing-brand">
          <span className="landing-brand-mark tracking-wide">TREVO</span>
          <span className="landing-brand-tag">Plan smarter. Travel deeper.</span>
        </div>

        <div className="landing-auth-actions">
          <Link to="/login" className="btn btn-login btn-sm px-4 rounded-pill">
            Login
          </Link>
          <Link to="/signup" className="btn btn-signup btn-sm px-4 rounded-pill">
            Sign Up
          </Link>
        </div>
      </header>

      <main className="container landing-main">
        <section className="landing-hero row g-4 g-xl-5 align-items-center">
          <div className="col-lg-7 text-white">
            <span className="landing-kicker">Your AI Travel Planner</span>
            <h1 className="landing-title">
              Trevo helps travelers turn ideas into memorable, well-planned journeys.
            </h1>
            <p className="landing-subtitle">
              Whether you are looking for a quick getaway, a family vacation, or a more ambitious
              adventure, Trevo helps you discover options, shape a better plan, and travel with less
              stress.
            </p>
            <p className="landing-description">
              We built Trevo for people who want travel planning to feel exciting instead of
              overwhelming. From finding the right destination to organizing the experience, Trevo is
              designed to guide users toward trips they genuinely want to take.
            </p>

            <div className="landing-hero-actions">
              <Link to="/signup" className="btn btn-login btn-lg px-5 rounded-pill">
                Start With Trevo
              </Link>
              <a href="#landing-features" className="btn btn-outline-light btn-lg px-5 rounded-pill">
                Explore Features
              </a>
            </div>

            <div className="row g-3 landing-proof-grid">
              <div className="col-sm-4">
                <div className="landing-proof-card">
                  <strong>Discover</strong>
                  <span>Find trip ideas that fit your travel vibe.</span>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="landing-proof-card">
                  <strong>Plan</strong>
                  <span>Build journeys with more clarity and direction.</span>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="landing-proof-card">
                  <strong>Travel Better</strong>
                  <span>Make choices with more confidence and less guesswork.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="landing-panel">
              <span className="landing-panel-label">What Trevo Will Do</span>
              <h2 className="landing-panel-title">Travel planning that feels guided, personal, and useful.</h2>

              <div className="landing-support-list">
                {supportPoints.map((point) => (
                  <article key={point.title} className="landing-support-item">
                    <div className="landing-icon-wrap">
                      <i className={point.icon} />
                    </div>

                    <div>
                      <h3>{point.title}</h3>
                      <p>{point.text}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="landing-features" className="landing-section">
          <div className="landing-section-header text-center text-white">
            <span className="landing-kicker">Why Trevo</span>
            <h2>Features designed to make users want to keep planning here.</h2>
            <p>
              Trevo is more than a landing screen and a login. It is positioned to become the place
              where travelers explore, plan, and manage the details of their next trip.
            </p>
          </div>

          <div className="row g-4">
            {featureCards.map((feature) => (
              <div key={feature.title} className="col-md-4">
                <article className="landing-feature-card h-100">
                  <div className="landing-icon-wrap">
                    <i className={feature.icon} />
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </article>
              </div>
            ))}
          </div>
        </section>

        <section className="landing-section">
          <div className="row g-4 align-items-stretch">
            <div className="col-lg-6">
              <article className="landing-panel landing-about-panel h-100">
                <span className="landing-panel-label">About Us</span>
                <h2 className="landing-panel-title">
                  Trevo is built to make trip planning feel inspiring, organized, and approachable.
                </h2>
                <p>
                  Many users know they want to travel but do not know where to start. Trevo bridges
                  that gap by helping users move from inspiration to an actual plan with better
                  structure, clearer choices, and less decision fatigue.
                </p>
                <p>
                  The goal is simple: help people spend less time struggling with planning and more
                  time feeling excited about the journey ahead.
                </p>

                <div className="landing-topic-tags">
                  <span>Destination Discovery</span>
                  <span>AI Planning Support</span>
                  <span>Budget Awareness</span>
                  <span>Travel Profiles</span>
                </div>
              </article>
            </div>

            <div className="col-lg-6">
              <div className="row g-4">
                {benefitCards.map((benefit) => (
                  <div key={benefit.value} className="col-sm-6">
                    <article className="landing-benefit-card h-100">
                      <strong>{benefit.value}</strong>
                      <p>{benefit.label}</p>
                    </article>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="landing-cta-band text-center text-white">
          <span className="landing-kicker">Start Your Journey</span>
          <h2>Join Trevo and make your next trip easier to imagine and easier to plan.</h2>
          <p>
            Create an account to begin shaping travel ideas into journeys you will actually want to take.
          </p>
          <div className="landing-hero-actions justify-content-center">
            <Link to="/signup" className="btn btn-login btn-lg px-5 rounded-pill">
              Create Account
            </Link>
            <Link to="/login" className="btn btn-signup btn-lg px-5 rounded-pill">
              Login
            </Link>
          </div>
        </section>
      </main>

      <AppFooter className="landing-footer" />
    </section>
  );
}

export default LandingPage;
