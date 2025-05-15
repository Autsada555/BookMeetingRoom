import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import BookRoom from './pages/CalendarBooking';
import UserProfile from './pages/UserProfile';
import LoginPage from './pages/Login';
import DailyCheckForm from './pages/DailyCheck';
import Dashboard from './pages/DashBoard';
import DataViewer from './pages/DataViewer';
import { AuthProvider, useAuth } from './context/AuthContext';

const AppRoutes: React.FC = () => {
  const { isLoggedIn } = useAuth();

  return (
    <>
      {isLoggedIn && <Navbar />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/book" element={<BookRoom />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/dataviwer" element={<DataViewer />} />
        <Route path="/check" element={<DailyCheckForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;