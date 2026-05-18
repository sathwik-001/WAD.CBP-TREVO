import { Navigate, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import HomePage from './pages/HomePage.jsx';
import IdeasPage from './pages/IdeasPage.jsx';
import CatalogPage from './pages/CatalogPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import TodoPage from './pages/TodoPage.jsx';
import ItineraryPage from './pages/ItineraryPage.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/ideas" element={<IdeasPage />} />
      <Route path="/catalog" element={<CatalogPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/todo" element={<TodoPage />} />
      <Route path="/itinerary" element={<ItineraryPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
