import AuthenticatedNavbar from '../components/AuthenticatedNavbar.jsx';
import AppFooter from '../components/AppFooter.jsx';

function CatalogPage() {
  return (
    <div className="catalog-page">
      <AuthenticatedNavbar />

      <section className="catalog-section d-flex align-items-center">
        <div className="container">
          <div className="text-center mb-5">
            <h1 className="fw-bold text-dark">Choose Your Journey</h1>
            <p className="text-muted">Unlock the full potential of your travel planning</p>
          </div>

          <div className="row justify-content-center g-5">
            <div className="col-md-5 col-lg-4">
              <div className="card plan-card regular-card h-100">
                <div className="card-body text-center d-flex flex-column">
                  <h2 className="card-title fw-bold mb-4">Regular</h2>
                  <div className="display-1 mb-4 text-white-50">
                    <i className="bi bi-person" />
                  </div>

                  <ul className="list-unstyled flex-grow-1 text-start mx-auto feature-list">
                    <li className="mb-3">
                      <i className="bi bi-check-circle-fill me-2" />Max 1 trips per 2 months
                    </li>
                    <li className="mb-3">
                      <i className="bi bi-check-circle-fill me-2" />Basic Suggestions
                    </li>
                    <li className="mb-3 text-white-50">
                      <i className="bi bi-x-circle me-2" />No AI Trip Generator
                    </li>
                    <li className="mb-3 text-white-50">
                      <i className="bi bi-x-circle me-2" />No Coupons
                    </li>
                  </ul>

                  <button className="btn btn-light btn-lg rounded-pill w-100 mt-auto fw-bold text-primary" type="button">
                    Current Plan
                  </button>
                </div>
              </div>
            </div>

            <div className="col-md-5 col-lg-4">
              <div className="card plan-card pro-card h-100 shadow-lg scale-hover">
                <span className="badge bg-danger position-absolute top-0 start-50 translate-middle rounded-pill px-3 py-2">
                  BEST VALUE
                </span>

                <div className="card-body text-center d-flex flex-column">
                  <h2 className="card-title fw-bold mb-4">Pro Version</h2>
                  <div className="display-1 mb-4 text-white-50">
                    <i className="bi bi-stars" />
                  </div>

                  <ul className="list-unstyled text-start mx-auto feature-list mb-4">
                    <li className="mb-3">
                      <i className="bi bi-check-circle-fill me-2" />
                      <strong>Unlimited</strong> trips
                    </li>
                    <li className="mb-3">
                      <i className="bi bi-check-circle-fill me-2" />Suggestions + AI Generator
                    </li>
                    <li className="mb-3">
                      <i className="bi bi-check-circle-fill me-2" />Exclusive Coupons
                    </li>
                  </ul>

                  <button
                    className="btn btn-offer w-100 mb-3 text-start d-flex justify-content-between align-items-center"
                    type="button"
                  >
                    <div>
                      <span className="d-block small">6 Months</span>
                      <span className="fw-bold fs-5">?799</span>
                    </div>
                    <div className="text-end">
                      <span className="text-decoration-line-through text-white-50 small">?1499</span>
                      <span className="badge bg-warning text-dark ms-2">SAVE 47%</span>
                    </div>
                  </button>

                  <button
                    className="btn btn-offer w-100 mt-auto text-start d-flex justify-content-between align-items-center"
                    type="button"
                  >
                    <div>
                      <span className="d-block small">1 Year</span>
                      <span className="fw-bold fs-5">?999</span>
                    </div>
                    <div className="text-end">
                      <span className="text-decoration-line-through text-white-50 small">?2000</span>
                      <span className="badge bg-warning text-dark ms-2">HOT DEAL</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AppFooter className="app-footer-light" />
    </div>
  );
}

export default CatalogPage;
