import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import ProfileSetup from './pages/ProfileSetup';
import BookingPage from './pages/BookingPage';
import RequestsPage from './pages/RequestsPage';
import MyBookingsPage from './pages/MyBookingsPage';
import MyTripsPage from './pages/MyTripsPage';
import TripPostDetail from './pages/TripPostDetail';
import GuideProfileDetail from './pages/GuideProfileDetail';
import WhyTravelMate from './pages/WhyTravelMate';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<ProfileSetup />} />
            <Route path="/requests" element={<RequestsPage />} />
            <Route path="/my-bookings" element={<MyBookingsPage />} />
            <Route path="/my-trips" element={<MyTripsPage />} />
            <Route path="/post/:id" element={<TripPostDetail />} />
            <Route path="/guide/:id" element={<GuideProfileDetail />} />
            <Route path="/book/:guideId" element={<BookingPage />} />
            <Route path="/why-travelmate" element={<WhyTravelMate />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
