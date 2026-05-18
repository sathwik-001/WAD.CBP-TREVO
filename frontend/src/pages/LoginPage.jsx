import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppFooter from '../components/AppFooter.jsx';

const initialForm = {
  email: '',
  password: '',
};

const autofillForm = {
  email: 'traveler@trevo.com',
  password: 'trevo123',
};

function LoginPage() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAutofill = () => {
    setForm({ ...autofillForm });
    setErrors({});
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(form.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }

    if (!form.password.trim()) {
      nextErrors.password = 'Please enter your password.';
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      navigate('/home');
    }
  };

  return (
    <div className="login-page login-bg">
      <div className="overlay" />

      <div className="container d-flex flex-column flex-grow-1 position-relative">
        <div className="flex-grow-1 d-flex align-items-center justify-content-center w-100">
          <div className="card login-card p-4 p-md-5 text-center shadow-lg">
            <div className="mb-4">
              <h2 className="fw-bold text-white tracking-wide">TREVO</h2>
              <p className="text-white-50">Welcome back, Traveler!</p>
              <button
                type="button"
                className="btn btn-sm btn-outline-light rounded-pill px-3 mt-2"
                onClick={handleAutofill}
              >
                Autofill
              </button>
            </div>

            <form onSubmit={handleSubmit} noValidate autoComplete="on">
              <div className="form-floating mb-3">
                <input
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  id="floatingInput"
                  name="email"
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
                <label htmlFor="floatingInput">Email address</label>
                {errors.email ? (
                  <div className="invalid-feedback text-start text-white">{errors.email}</div>
                ) : null}
              </div>

              <div className="form-floating mb-4">
                <input
                  type="password"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  id="floatingPassword"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
                <label htmlFor="floatingPassword">Password</label>
                {errors.password ? (
                  <div className="invalid-feedback text-start text-white">{errors.password}</div>
                ) : null}
              </div>

              <button className="btn btn-orange w-100 py-3 fw-bold mb-3" type="submit">
                Login
              </button>

              <div className="d-flex justify-content-between text-small">
                <a href="#" className="text-white-50 text-decoration-none">
                  Forgot Password?
                </a>
                <Link to="/signup" className="text-blue fw-bold text-decoration-none">
                  Create Account
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      <AppFooter />
    </div>
  );
}

export default LoginPage;
