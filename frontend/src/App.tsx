import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import BookRoom from './pages/BookRoom';
import CalendarView from './pages/CalendarView'

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<BookRoom/>} />
        <Route path="/calendarview" element={<CalendarView/>} />
      </Routes>
    </Router>
  );
};

export default App;
