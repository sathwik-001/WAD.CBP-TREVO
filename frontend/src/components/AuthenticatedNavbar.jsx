import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler);

const CITIES_MAP = {
  'Hyderabad': { lat: 17.3850, lon: 78.4867 },
  'Delhi': { lat: 28.6139, lon: 77.2090 },
  'Mumbai': { lat: 19.0760, lon: 72.8777 },
  'Chennai': { lat: 13.0827, lon: 80.2707 },
  'Bangalore': { lat: 12.9716, lon: 77.5946 },
  'Kolkata': { lat: 22.5726, lon: 88.3639 }
};

const cities = Object.keys(CITIES_MAP);
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const DEGREE_UNIT = '\u00B0C';

function AuthenticatedNavbar() {
  const { pathname } = useLocation();
  const [isWeatherOpen, setIsWeatherOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Hyderabad');
  const [weather, setWeather] = useState({
    temp: `--${DEGREE_UNIT}`,
    desc: 'Loading...',
    humidity: '--',
    wind: '--',
    historicalDates: [],
    historicalTemps: [],
  });

  const triggerRef = useRef(null);
  const cardRef = useRef(null);
  const travelUpdatesHref = pathname === '/home' ? '#updates' : '/home#updates';

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (!cardRef.current || !triggerRef.current) {
        return;
      }

      if (!cardRef.current.contains(event.target) && !triggerRef.current.contains(event.target)) {
        setIsWeatherOpen(false);
      }
    };

    document.addEventListener('click', closeOnOutsideClick);
    return () => document.removeEventListener('click', closeOnOutsideClick);
  }, []);

  useEffect(() => {
    const loadWeather = async () => {
      try {
        if (!API_KEY) {
          throw new Error('Missing OpenWeather API key');
        }

        const { lat, lon } = CITIES_MAP[selectedCity];

        const owmRes = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&units=metric&appid=${API_KEY}`,
        );

        if (!owmRes.ok) {
          throw new Error('Unable to fetch current weather');
        }

        const data = await owmRes.json();

        // Fetch Historical data (past 7 days)
        const meteoRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max&past_days=7&forecast_days=1&timezone=auto`
        );

        let historicalDates = [];
        let historicalTemps = [];

        if (meteoRes.ok) {
          const meteoData = await meteoRes.json();
          historicalDates = meteoData.daily.time.map(d => {
            const date = new Date(d);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          });
          historicalTemps = meteoData.daily.temperature_2m_max;
        }

        setWeather({
          temp: `${Math.round(data.main.temp)}${DEGREE_UNIT}`,
          desc: data.weather[0].description,
          humidity: `${data.main.humidity}`,
          wind: `${data.wind.speed}`,
          historicalDates,
          historicalTemps,
        });
      } catch {
        setWeather({
          temp: `--${DEGREE_UNIT}`,
          desc: 'Weather unavailable',
          humidity: '--',
          wind: '--',
          historicalDates: [],
          historicalTemps: [],
        });
      }
    };

    loadWeather();
  }, [selectedCity]);

  const hasChartData = weather.historicalDates && weather.historicalDates.length > 0;
  const chartData = {
    labels: weather.historicalDates,
    datasets: [
      {
        label: 'Max Temp (°C)',
        data: weather.historicalTemps,
        borderColor: '#fbbf24',
        backgroundColor: 'rgba(251, 191, 36, 0.2)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      x: { display: true, ticks: { color: 'rgba(255, 255, 255, 0.6)', font: { size: 10 } }, grid: { display: false } },
      y: { display: true, ticks: { color: 'rgba(255, 255, 255, 0.6)', font: { size: 10 } }, grid: { color: 'rgba(255, 255, 255, 0.1)' } }
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg fixed-top navbar-dark app-auth-nav">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/home">
            TREVO
          </Link>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#appNavbar">
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse justify-content-center" id="appNavbar">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className={`nav-link${pathname === '/home' ? ' active' : ''}`} to="/home">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link${pathname === '/ideas' ? ' active' : ''}`} to="/ideas">
                  Your Ideas
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link${pathname === '/catalog' ? ' active' : ''}`} to="/catalog">
                  Subscription
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link${pathname === '/itinerary' ? ' active' : ''} nav-link-ai`} to="/itinerary">
                  <i className="bi bi-stars me-1" />
                  AI Planner
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link${pathname === '/todo' ? ' active' : ''}`} to="/todo">
                  Todo Board
                </Link>
              </li>
              <li className="nav-item">
                <a className="nav-link" href={travelUpdatesHref}>
                  Travel Updates
                </a>
              </li>
            </ul>
          </div>

          <div className="d-flex align-items-center">
            <button
              type="button"
              className={`nav-action-icon me-4${isWeatherOpen ? ' active' : ''}`}
              title="Check Weather"
              ref={triggerRef}
              onClick={(event) => {
                event.stopPropagation();
                setIsWeatherOpen((prev) => !prev);
              }}
            >
              <i className="bi bi-cloud-sun" />
            </button>
            <Link
              to="/profile"
              className={`nav-action-icon${pathname === '/profile' ? ' active' : ''}`}
              aria-label="Profile"
            >
              <i className="bi bi-person-circle" />
            </Link>
          </div>
        </div>
      </nav>

      <div ref={cardRef} className={`app-weather-card ${isWeatherOpen ? 'active' : ''}`}>
        <select
          className="form-select mb-2"
          value={selectedCity}
          onChange={(event) => setSelectedCity(event.target.value)}
        >
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>

        <div className="app-weather-header">
          <div>
            <h5 className="mb-0">{selectedCity}</h5>
            <small className="text-white-50">Today</small>
          </div>
          <i className="bi bi-cloud-sun-fill text-warning fs-3" />
        </div>

        <div className="app-weather-body text-center py-3">
          <h1 className="display-4 fw-bold mb-0">{weather.temp}</h1>
          <p className="lead text-capitalize">{weather.desc}</p>
        </div>

        <div className="app-weather-footer d-flex justify-content-between text-white-50">
          <small>
            <i className="bi bi-droplet" /> {weather.humidity}%
          </small>
          <small>
            <i className="bi bi-wind" /> {weather.wind} km/h
          </small>
        </div>

        {hasChartData && (
          <div className="mt-3 border-top border-secondary pt-3">
            <p className="small text-white-50 mb-2 text-start">7-Day Max Temperatures</p>
            <div style={{ height: '120px', position: 'relative' }}>
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default AuthenticatedNavbar;
