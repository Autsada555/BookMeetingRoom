import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { v4 as uuidv4 } from 'uuid';

interface Booking {
  id: string;
  title: string;
  start: string;
  end: string;
  room: string;
}

const CalendarBooking: React.FC = () => {
  const [events, setEvents] = useState<Booking[]>([  
    {
      id: uuidv4(),
      title: 'John - Room A',
      start: '2025-05-03T10:00:00',
      end: '2025-05-03T11:00:00',
      room: 'Room A',
    }
  ]);

  const handleDateClick = (info: DateClickArg) => {
    const room = prompt('Enter room (Room A, B, C, D, E):');
    const name = prompt('Enter your name:');
    if (room && name) {
      const title = `${name} - ${room}`;
      const end = new Date(new Date(info.date).getTime() + 60 * 60 * 1000).toISOString();
      setEvents([...events, { id: uuidv4(), title, start: info.dateStr, end, room }]);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-900 mb-4">Meeting Room Booking Calendar</h1>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        selectable={true}
        events={events}
        dateClick={handleDateClick}
        allDaySlot={false}
        slotMinTime="08:00:00"
        slotMaxTime="18:00:00"
        height="auto"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
      />
    </div>
  );
};

export default CalendarBooking;
