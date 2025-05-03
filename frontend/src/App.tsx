import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import BookRoom from './pages/CalendarBooking';
import UserProfile from './pages/UserProfile';
import LoginPage from './pages/Login';
// import AdminDashboard from './pages/admin/AdminDashboard';
import DailyCheckForm from './pages/CheckCCTV';
import Dashboard from './pages/DashBoard';
import CCTVDataViewer from './pages/CCTVDataViewer';

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/book" element={<BookRoom />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/cctvdataviwer" element={<CCTVDataViewer />} />
        <Route path="/checkcctv" element={<DailyCheckForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
      </Routes>
    </Router>
  );
};

export default App;
