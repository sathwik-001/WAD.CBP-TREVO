import { Link } from 'react-router-dom';
import AuthenticatedNavbar from '../components/AuthenticatedNavbar.jsx';
import AppFooter from '../components/AppFooter.jsx';
import { useIdeas } from '../context/IdeasContext.jsx';

function TypeIcon({ type }) {
  if (type === 'hotel') return <i className="bi bi-building me-2 text-primary" />;
  if (type === 'attraction') return <i className="bi bi-camera me-2 text-warning" />;
  if (type === 'restaurant') return <i className="bi bi-cup-hot me-2 text-danger" />;
  return <i className="bi bi-geo-alt me-2 text-success" />;
}

function IdeaCardContent({ idea }) {
  if (idea.type === 'hotel') {
    return (
      <>
        <div className="d-flex justify-content-between mb-2">
          <h3 className="h5 mb-0 w-75"><TypeIcon type={idea.type} />{idea.name}</h3>
          <span className="badge bg-primary">Hotel</span>
        </div>
        <p className="idea-summary mb-2">{idea.location}</p>
        <div className="idea-vibe mb-3">Rating: {idea.rating} • Price: {idea.price}</div>
        {idea.url && (
          <a href={idea.url} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-light mb-3">
            <i className="bi bi-box-arrow-up-right me-2" />View on Booking.com
          </a>
        )}
      </>
    );
  }

  if (idea.type === 'attraction') {
    return (
      <>
        <div className="d-flex justify-content-between mb-2">
          <h3 className="h5 mb-0 w-75"><TypeIcon type={idea.type} />{idea.name}</h3>
          <span className="badge bg-warning text-dark">Attraction</span>
        </div>
        <p className="idea-summary mb-2">{idea.description || idea.type_tag}</p>
        {idea.url && (
          <a href={idea.url} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-light mb-3">
            <i className="bi bi-map me-2" />Open Maps
          </a>
        )}
      </>
    );
  }

  if (idea.type === 'restaurant') {
    return (
      <>
        <div className="d-flex justify-content-between mb-2">
          <h3 className="h5 mb-0 w-75"><TypeIcon type={idea.type} />{idea.name}</h3>
          <span className="badge bg-danger">Restaurant</span>
        </div>
        <p className="idea-summary mb-2">{idea.cuisine}</p>
        <div className="idea-vibe mb-3">Rating: {idea.rating}</div>
        {idea.url && (
          <a href={idea.url} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-light mb-3">
            <i className="bi bi-compass me-2" />View Details
          </a>
        )}
      </>
    );
  }

  // Default Destination idea (from home page)
  return (
    <>
      <div className="d-flex justify-content-between mb-2">
        <h3 className="h5 mb-0 w-75"><TypeIcon type={idea.type} />{idea.destination}</h3>
        <span className="badge bg-success">Destination</span>
      </div>
      <p className="idea-summary mb-2">{idea.summary}</p>
      <div className="idea-vibe mb-3">{idea.vibe} • {idea.duration}</div>
    </>
  );
}

function IdeasPage() {
  const { savedIdeas, confirmedIdeas, confirmIdea, removeSavedIdea, removeConfirmedIdea } = useIdeas();

  return (
    <div className="ideas-page">
      <AuthenticatedNavbar />

      <main className="ideas-shell">
        <div className="container">
          <section className="ideas-hero ideas-card p-4 p-lg-5 mb-4">
            <div className="row g-4 align-items-center">
              <div className="col-lg-8">
                <span className="ideas-badge">Your Travel Board</span>
                <h1 className="display-6 fw-bold mb-3">Keep travel ideas organized from wishlist to confirmed plan.</h1>
                <p className="text-white-50 mb-0">
                  Save recommendations that look interesting, then confirm the ones you actually want
                  to move forward with. This page works like a simple travel wishlist and shortlist in one place.
                </p>
              </div>

              <div className="col-lg-4">
                <div className="ideas-summary-grid">
                  <div className="ideas-summary-pill">
                    <span>Saved Ideas</span>
                    <strong>{savedIdeas.length}</strong>
                  </div>
                  <div className="ideas-summary-pill">
                    <span>Confirmed Ideas</span>
                    <strong>{confirmedIdeas.length}</strong>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="row g-4">
            <div className="col-lg-6">
              <section className="ideas-card p-4 h-100">
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-4">
                  <div>
                    <h2 className="h4 mb-1">Saved Ideas</h2>
                    <p className="text-white-50 mb-0">
                      These are the ideas you saved from recommendations, similar to a wishlist.
                    </p>
                  </div>
                  <span className="ideas-section-chip">Wishlist</span>
                </div>

                {savedIdeas.length > 0 ? (
                  <div className="ideas-list">
                    {savedIdeas.map((idea) => (
                      <article key={idea.id} className="idea-item">
                        <div className="d-flex justify-content-end mb-3">
                          <span className="idea-status idea-status-saved">Saved</span>
                        </div>

                        <IdeaCardContent idea={idea} />

                        <div className="idea-actions mt-auto">
                          <p className="idea-actions-label mb-2">
                            Confirm this idea to move it into your shortlisted plans.
                          </p>

                          <div className="d-flex flex-wrap gap-2">
                          <button
                            type="button"
                            className="btn btn-orange rounded-pill px-4"
                            onClick={() => confirmIdea(idea.id)}
                          >
                            <i className="bi bi-check2-circle me-2" />
                            Confirm and Move
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-light rounded-pill px-4"
                            onClick={() => removeSavedIdea(idea.id)}
                          >
                            Remove
                          </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="ideas-empty-state">
                    <div className="ideas-empty-icon">
                      <i className="bi bi-heart" />
                    </div>
                    <h3 className="h5 fw-semibold mb-2">No saved ideas yet</h3>
                    <p className="text-white-50 mb-4">
                      Save ideas from the Home page recommendations and they will appear here.
                    </p>
                    <Link to="/home#recommendations" className="btn btn-orange rounded-pill px-4">
                      Browse Recommendations
                    </Link>
                  </div>
                )}
              </section>
            </div>

            <div className="col-lg-6">
              <section className="ideas-card p-4 h-100">
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-4">
                  <div>
                    <h2 className="h4 mb-1">Confirmed Ideas</h2>
                    <p className="text-white-50 mb-0">
                      Once you confirm an idea, it moves here as a stronger candidate for your next trip.
                    </p>
                  </div>
                  <span className="ideas-section-chip">Shortlist</span>
                </div>

                {confirmedIdeas.length > 0 ? (
                  <div className="ideas-list">
                    {confirmedIdeas.map((idea) => (
                      <article key={idea.id} className="idea-item idea-item-confirmed">
                        <div className="d-flex justify-content-end mb-3">
                          <span className="idea-status idea-status-confirmed">Confirmed</span>
                        </div>

                        <IdeaCardContent idea={idea} />

                        <div className="d-flex flex-wrap gap-2 mt-auto pt-4">
                          <Link to="/itinerary" className="btn btn-orange rounded-pill px-4">
                            Planner
                          </Link>
                          <button
                            type="button"
                            className="btn btn-outline-light rounded-pill px-4"
                            onClick={() => removeConfirmedIdea(idea.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="ideas-empty-state">
                    <div className="ideas-empty-icon">
                      <i className="bi bi-check2-square" />
                    </div>
                    <h3 className="h5 fw-semibold mb-2">No confirmed ideas yet</h3>
                    <p className="text-white-50 mb-4">
                      When you click confirm on a saved idea, it will move here automatically.
                    </p>
                    <Link to="/home" className="btn btn-outline-light rounded-pill px-4">
                      Back to Home
                    </Link>
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}

export default IdeasPage;
