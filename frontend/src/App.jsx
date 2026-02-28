import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import ProfileSetup from './pages/ProfileSetup';
import BookingPage from './pages/BookingPage';
import RequestsPage from './pages/RequestsPage';
import MyBookingsPage from './pages/MyBookingsPage';
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
            <Route path="/book/:guideId" element={<BookingPage />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
