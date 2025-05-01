import React, { useState, useEffect } from 'react';

const CalendarView: React.FC = () => {
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const res = await fetch('/api/bookings');
      const data = await res.json();
      setBookings(data);
    };
    fetchBookings();
  }, []);

  const renderCalendar = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();

    const calendar: any[] = [];
    let week: any[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDay = new Date(currentYear, currentMonth, day);
      const dayOfWeek = currentDay.getDay();

      if (day === 1) {
        for (let i = 0; i < dayOfWeek; i++) {
          week.push(null);
        }
      }

      week.push(day);

      if (dayOfWeek === 6 || day === daysInMonth) {
        calendar.push(week);
        week = [];
      }
    }

    return calendar;
  };

  const getBookingStatus = (day: number) => {
    const booking = bookings.find((b) => new Date(b.date).getDate() === day);
    return booking ? 'bg-red-500' : 'bg-green-500';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded mt-10">
      <h2 className="text-2xl font-bold text-primary mb-4">ตารางการจองห้องประชุม</h2>
      <div className="grid grid-cols-7 gap-2 text-center">
        {['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'].map((day) => (
          <div key={day} className="font-semibold">{day}</div>
        ))}
        {renderCalendar().map((week, index) => (
          <React.Fragment key={index}>
            {week.map((day, idx) => (
              <div key={idx} className={`p-2 border ${day ? getBookingStatus(day) : ''}`}>
                {day && <span className="text-white">{day}</span>}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CalendarView;
