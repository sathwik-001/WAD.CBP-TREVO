import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppFooter from '../components/AppFooter.jsx';

const initialForm = {
  name: '',
  phone: '',
  email: '',
  travelStyle: '',
  dob: '',
  city: '',
  password: '',
  confirmPassword: '',
  terms: false,
};

const autofillForm = {
  name: 'Likith',
  phone: '9876543210',
  email: 'traveler@trevo.com',
  travelStyle: 'adventure',
  dob: '2003-05-14',
  city: 'Hyderabad',
  password: 'trevo123',
  confirmPassword: 'trevo123',
  terms: true,
};

function SignupPage() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAutofill = () => {
    setForm({ ...autofillForm });
    setErrors({});
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = {};
    const phonePattern = /^[0-9]{10}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.name.trim()) {
      nextErrors.name = 'Please enter your full name.';
    }

    if (!phonePattern.test(form.phone.trim())) {
      nextErrors.phone = 'Please enter a valid 10-digit phone number.';
    }

    if (!emailPattern.test(form.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }

    if (!form.dob) {
      nextErrors.dob = 'Please select your Date of Birth.';
    }

    if (!form.city.trim()) {
      nextErrors.city = 'Please enter your City or State.';
    }

    if (form.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters long.';
    }

    if (form.confirmPassword !== form.password) {
      nextErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!form.terms) {
      nextErrors.terms = 'You must agree to the terms.';
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      navigate('/home');
    }
  };

  return (
    <div className="signup-page signup-bg">
      <div className="overlay" />

      <div className="container d-flex flex-column flex-grow-1 position-relative">
        <div className="flex-grow-1 d-flex align-items-center justify-content-center w-100 py-4">
          <div className="card signup-card p-4 p-md-5 shadow-lg">
            <div className="text-center mb-4">
              <h2 className="fw-bold text-white tracking-wide">TREVO</h2>
              <p className="text-white-50">Join the adventure today</p>
              <button
                type="button"
                className="btn btn-sm btn-outline-light rounded-pill px-3 mt-2"
                onClick={handleAutofill}
              >
                Autofill
              </button>
            </div>

            <form onSubmit={handleSubmit} noValidate autoComplete="on">
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="form-floating">
                    <input
                      type="text"
                      className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                      id="floatingName"
                      name="name"
                      placeholder="Full Name"
                      value={form.name}
                      onChange={handleChange}
                      autoComplete="name"
                    />
                    <label htmlFor="floatingName">Full Name</label>
                    {errors.name ? (
                      <div className="invalid-feedback text-start text-white">{errors.name}</div>
                    ) : null}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-floating">
                    <input
                      type="tel"
                      className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                      id="floatingPhone"
                      name="phone"
                      placeholder="Phone Number"
                      value={form.phone}
                      onChange={handleChange}
                      autoComplete="tel"
                    />
                    <label htmlFor="floatingPhone">Phone Number</label>
                    {errors.phone ? (
                      <div className="invalid-feedback text-start text-white">{errors.phone}</div>
                    ) : null}
                  </div>
                </div>

                <div className="col-12">
                  <div className="form-floating">
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      id="floatingEmail"
                      name="email"
                      placeholder="name@example.com"
                      value={form.email}
                      onChange={handleChange}
                      autoComplete="email"
                    />
                    <label htmlFor="floatingEmail">Email Address</label>
                    {errors.email ? (
                      <div className="invalid-feedback text-start text-white">{errors.email}</div>
                    ) : null}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-floating">
                    <select
                      className="form-select"
                      id="floatingTravelStyle"
                      name="travelStyle"
                      value={form.travelStyle}
                      onChange={handleChange}
                    >
                      <option value="">Choose your vibe...</option>
                      <option value="solo">Solo Explorer</option>
                      <option value="adventure">Adventure & Trekking</option>
                      <option value="luxury">Luxury & Relax</option>
                      <option value="budget">Budget Backpacker</option>
                      <option value="family">Family Trip</option>
                    </select>
                    <label htmlFor="floatingTravelStyle">Travel Style</label>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-floating">
                    <input
                      type="date"
                      className={`form-control ${errors.dob ? 'is-invalid' : ''}`}
                      id="floatingDOB"
                      name="dob"
                      placeholder="Date of Birth"
                      value={form.dob}
                      onChange={handleChange}
                      autoComplete="bday"
                    />
                    <label htmlFor="floatingDOB">Date of Birth</label>
                    {errors.dob ? (
                      <div className="invalid-feedback text-start text-white">{errors.dob}</div>
                    ) : null}
                  </div>
                </div>

                <div className="col-12">
                  <div className="form-floating">
                    <input
                      type="text"
                      className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                      id="floatingCity"
                      name="city"
                      placeholder="City/State"
                      value={form.city}
                      onChange={handleChange}
                      autoComplete="address-level2"
                    />
                    <label htmlFor="floatingCity">Home City / State</label>
                    {errors.city ? (
                      <div className="invalid-feedback text-start text-white">{errors.city}</div>
                    ) : null}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-floating">
                    <input
                      type="password"
                      className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                      id="floatingPassword"
                      name="password"
                      placeholder="Password"
                      value={form.password}
                      onChange={handleChange}
                      autoComplete="new-password"
                    />
                    <label htmlFor="floatingPassword">Password</label>
                    {errors.password ? (
                      <div className="invalid-feedback text-start text-white">{errors.password}</div>
                    ) : null}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-floating">
                    <input
                      type="password"
                      className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                      id="floatingConfirm"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      autoComplete="new-password"
                    />
                    <label htmlFor="floatingConfirm">Confirm Password</label>
                    {errors.confirmPassword ? (
                      <div className="invalid-feedback text-start text-white">{errors.confirmPassword}</div>
                    ) : null}
                  </div>
                </div>

                <div className="col-12">
                  <div className="form-check mt-2">
                    <input
                      className={`form-check-input ${errors.terms ? 'is-invalid' : ''}`}
                      type="checkbox"
                      id="invalidCheck"
                      name="terms"
                      checked={form.terms}
                      onChange={handleChange}
                    />
                    <label className="form-check-label text-white small" htmlFor="invalidCheck">
                      I agree to all{' '}
                      <a href="#" className="text-blue text-decoration-none">
                        Terms & Conditions
                      </a>
                    </label>
                    {errors.terms ? (
                      <div className="invalid-feedback d-block text-start text-white">{errors.terms}</div>
                    ) : null}
                  </div>
                </div>

                <div className="col-12 mt-4">
                  <button className="btn btn-orange w-100 py-3 fw-bold" type="submit">
                    Sign Up
                  </button>
                </div>

                <div className="col-12 text-center mt-3">
                  <span className="text-white-50 small">Already have an account? </span>
                  <Link to="/login" className="text-blue fw-bold text-decoration-none small">
                    Login
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <AppFooter />
    </div>
  );
}

export default SignupPage;
