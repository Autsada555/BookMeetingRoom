import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import BookRoom from './pages/BookRoom';
import CalendarView from './pages/CalendarView'
import ScheduleTable from './pages/ScheduleTable';
import UserProfile from './pages/UserProfile';
import LoginPage from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/book" element={<BookRoom />} />
        <Route path="/calendarview" element={<CalendarView />} />
        <Route path="/schedule" element={<ScheduleTable />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/admin" element={<AdminDashboard />} />
        
      </Routes>
    </Router>
  );
};

export default App;
