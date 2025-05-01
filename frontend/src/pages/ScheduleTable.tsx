import React, { useEffect, useState } from 'react';

type Booking = {
  room: string;
  date: string;
  startTime: string;
  endTime: string;
  bookedBy?: string;
};

const ScheduleTable: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filterRoom, setFilterRoom] = useState('');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    fetch('/api/bookings')
      .then(res => res.json())
      .then(data => setBookings(data));
  }, []);

  const filtered = bookings.filter(b =>
    (!filterRoom || b.room === filterRoom) &&
    (!filterDate || b.date === filterDate)
  );

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold text-primary mb-4">ตารางการใช้งานห้องประชุม</h2>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <select value={filterRoom} onChange={e => setFilterRoom(e.target.value)} className="border rounded px-3 py-2">
          <option value="">-- เลือกห้อง --</option>
          <option value="A">ห้องประชุม A</option>
          <option value="B">ห้องประชุม B</option>
          <option value="C">ห้องประชุม C</option>
          <option value="D">ห้องประชุม D</option>
          <option value="E">ห้องประชุม E</option>
        </select>
        <input
          type="date"
          value={filterDate}
          onChange={e => setFilterDate(e.target.value)}
          className="border rounded px-3 py-2"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-primary text-white">
            <tr>
              <th className="px-4 py-2 border">ห้อง</th>
              <th className="px-4 py-2 border">วันที่</th>
              <th className="px-4 py-2 border">เวลาเริ่ม</th>
              <th className="px-4 py-2 border">เวลาสิ้นสุด</th>
              <th className="px-4 py-2 border">ผู้จอง</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4">ไม่มีการจอง</td>
              </tr>
            ) : (
              filtered.map((b, index) => (
                <tr key={index} className="hover:bg-blue-50">
                  <td className="px-4 py-2 border text-center">{b.room}</td>
                  <td className="px-4 py-2 border text-center">{b.date}</td>
                  <td className="px-4 py-2 border text-center">{b.startTime}</td>
                  <td className="px-4 py-2 border text-center">{b.endTime}</td>
                  <td className="px-4 py-2 border text-center">{b.bookedBy ?? '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScheduleTable;
