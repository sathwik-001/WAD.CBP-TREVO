import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthenticatedNavbar from '../components/AuthenticatedNavbar.jsx';
import AppFooter from '../components/AppFooter.jsx';

const initialProfile = {
  fullName: 'Trevo Traveler',
  email: 'traveler@trevo.com',
  phone: '9876543210',
  city: 'Hyderabad',
  dob: '2003-05-14',
  travelStyle: 'Adventure & Trekking',
  bio: 'Always ready for scenic train rides, sunrise viewpoints, and a good itinerary.',
};

const initialPasswordForm = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

function ProfilePage() {
  const [profile, setProfile] = useState(initialProfile);
  const [profileMessage, setProfileMessage] = useState('');
  const [passwordForm, setPasswordForm] = useState(initialPasswordForm);
  const [passwordFeedback, setPasswordFeedback] = useState({ type: '', message: '' });

  const initials =
    profile.fullName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join('') || 'TT';

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfile((prev) => ({ ...prev, [name]: value }));

    if (profileMessage) {
      setProfileMessage('');
    }
  };

  const handleProfileSubmit = (event) => {
    event.preventDefault();
    setProfileMessage('Personal details updated successfully.');
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));

    if (passwordFeedback.message) {
      setPasswordFeedback({ type: '', message: '' });
    }
  };

  const handlePasswordSubmit = (event) => {
    event.preventDefault();

    if (!passwordForm.currentPassword.trim()) {
      setPasswordFeedback({ type: 'error', message: 'Enter your current password to continue.' });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordFeedback({ type: 'error', message: 'New password must be at least 6 characters.' });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordFeedback({ type: 'error', message: 'New password and confirmation must match.' });
      return;
    }

    setPasswordFeedback({ type: 'success', message: 'Password changed successfully.' });
    setPasswordForm(initialPasswordForm);
  };

  return (
    <div className="profile-page">
      <AuthenticatedNavbar />

      <main className="profile-shell">
        <div className="container">
          <section className="profile-card profile-hero p-4 p-lg-5 mb-4">
            <div className="row g-4 align-items-center">
              <div className="col-lg-8">
                <div className="d-flex align-items-center gap-3 flex-wrap">
                  <div className="profile-avatar">{initials}</div>

                  <div>
                    <span className="profile-badge d-inline-block mb-2">Traveler Profile</span>
                    <h1 className="display-6 fw-bold mb-2">{profile.fullName}</h1>
                    <p className="text-white-50 mb-0">
                      Manage your details, security settings, and travel history from one place.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="profile-summary-grid">
                  <div className="summary-pill">
                    <span>Membership</span>
                    <strong>Regular</strong>
                  </div>
                  <div className="summary-pill">
                    <span>Home Base</span>
                    <strong>{profile.city}</strong>
                  </div>
                  <div className="summary-pill">
                    <span>Travel Style</span>
                    <strong>{profile.travelStyle}</strong>
                  </div>
                  <div className="summary-pill">
                    <span>Status</span>
                    <strong>Ready to Explore</strong>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="row g-4">
            <div className="col-lg-7">
              <section className="profile-card p-4 h-100">
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-4">
                  <div>
                    <h2 className="h4 mb-1">Personal Details</h2>
                    <p className="text-white-50 mb-0">
                      Keep your contact information and travel preferences up to date.
                    </p>
                  </div>
                  <span className="section-chip">Editable</span>
                </div>

                <form onSubmit={handleProfileSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label" htmlFor="profileFullName">
                        Full Name
                      </label>
                      <input
                        id="profileFullName"
                        name="fullName"
                        type="text"
                        className="form-control"
                        value={profile.fullName}
                        onChange={handleProfileChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label" htmlFor="profileEmail">
                        Email Address
                      </label>
                      <input
                        id="profileEmail"
                        name="email"
                        type="email"
                        className="form-control"
                        value={profile.email}
                        onChange={handleProfileChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label" htmlFor="profilePhone">
                        Phone Number
                      </label>
                      <input
                        id="profilePhone"
                        name="phone"
                        type="tel"
                        className="form-control"
                        value={profile.phone}
                        onChange={handleProfileChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label" htmlFor="profileCity">
                        City / State
                      </label>
                      <input
                        id="profileCity"
                        name="city"
                        type="text"
                        className="form-control"
                        value={profile.city}
                        onChange={handleProfileChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label" htmlFor="profileDob">
                        Date of Birth
                      </label>
                      <input
                        id="profileDob"
                        name="dob"
                        type="date"
                        className="form-control"
                        value={profile.dob}
                        onChange={handleProfileChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label" htmlFor="profileTravelStyle">
                        Travel Style
                      </label>
                      <select
                        id="profileTravelStyle"
                        name="travelStyle"
                        className="form-select"
                        value={profile.travelStyle}
                        onChange={handleProfileChange}
                      >
                        <option>Solo Explorer</option>
                        <option>Adventure & Trekking</option>
                        <option>Luxury & Relax</option>
                        <option>Budget Backpacker</option>
                        <option>Family Trip</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="form-label" htmlFor="profileBio">
                        Travel Bio
                      </label>
                      <textarea
                        id="profileBio"
                        name="bio"
                        className="form-control"
                        rows="4"
                        value={profile.bio}
                        onChange={handleProfileChange}
                      />
                    </div>
                  </div>

                  <div className="d-flex align-items-center flex-wrap gap-3 mt-4">
                    {profileMessage ? <div className="feedback-success">{profileMessage}</div> : null}

                    <button className="btn btn-orange rounded-pill px-4 ms-sm-auto" type="submit">
                      Save Details
                    </button>
                  </div>
                </form>
              </section>
            </div>

            <div className="col-lg-5">
              <section className="profile-card p-4 mb-4">
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-4">
                  <div>
                    <h2 className="h4 mb-1">Account Overview</h2>
                    <p className="text-white-50 mb-0">A quick snapshot of the profile currently loaded.</p>
                  </div>
                  <span className="section-chip">Summary</span>
                </div>

                <div className="info-list">
                  <div className="info-row">
                    <span className="info-label">Current Plan</span>
                    <span className="info-value">Regular</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Preferred Contact</span>
                    <span className="info-value">{profile.email}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Mobile</span>
                    <span className="info-value">{profile.phone}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Favorite Style</span>
                    <span className="info-value">{profile.travelStyle}</span>
                  </div>
                </div>
              </section>

              <section className="profile-card p-4">
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-4">
                  <div>
                    <h2 className="h4 mb-1">Change Password</h2>
                    <p className="text-white-50 mb-0">Use this section whenever you want to refresh your login.</p>
                  </div>
                  <span className="section-chip">Security</span>
                </div>

                <form onSubmit={handlePasswordSubmit}>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="currentPassword">
                      Current Password
                    </label>
                    <input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      className="form-control"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label" htmlFor="newPassword">
                      New Password
                    </label>
                    <input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      className="form-control"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label" htmlFor="confirmNewPassword">
                      Confirm New Password
                    </label>
                    <input
                      id="confirmNewPassword"
                      name="confirmPassword"
                      type="password"
                      className="form-control"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>

                  {passwordFeedback.message ? (
                    <div
                      className={
                        passwordFeedback.type === 'success' ? 'feedback-success mb-4' : 'feedback-error mb-4'
                      }
                    >
                      {passwordFeedback.message}
                    </div>
                  ) : null}

                  <button className="btn btn-outline-light rounded-pill px-4" type="submit">
                    Update Password
                  </button>
                </form>
              </section>
            </div>
          </div>

          <section className="profile-card p-4 mt-4">
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-4">
              <div>
                <h2 className="h4 mb-1">Past Trips</h2>
                <p className="text-white-50 mb-0">
                  Completed journeys will show up here once trips are saved in the app.
                </p>
              </div>
              <span className="section-chip">Coming Soon</span>
            </div>

            <div className="empty-trips text-center p-4 p-md-5">
              <div className="empty-icon">
                <i className="bi bi-airplane-engines" />
              </div>
              <h3 className="h5 fw-semibold mb-2">No past trips yet</h3>
              <p className="text-white-50 mb-4">
                Your completed adventures will appear here once you start planning and finishing journeys.
              </p>
              <Link to="/home" className="btn btn-orange rounded-pill px-4">
                Start Planning
              </Link>
            </div>
          </section>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}

export default ProfilePage;
