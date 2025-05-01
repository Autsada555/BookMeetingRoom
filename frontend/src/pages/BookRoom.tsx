import React, { useState } from 'react';

const BookRoom: React.FC = () => {
  const [room, setRoom] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  const checkAvailability = async () => {
    const res = await fetch(`/api/check?room=${room}&date=${date}&start=${startTime}&end=${endTime}`);
    const data = await res.json();
    setIsAvailable(data.available);
  };

  const bookRoom = async () => {
    const res = await fetch('/api/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ room, date, startTime, endTime }),
    });
    const data = await res.json();
    alert(data.message);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded mt-10">
      <h2 className="text-2xl font-bold text-primary mb-4">จองห้องประชุม</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">เลือกห้อง</label>
        <select value={room} onChange={e => setRoom(e.target.value)} className="mt-1 w-full border rounded px-3 py-2">
          <option value="">-- เลือกห้อง --</option>
          <option value="A">ห้องประชุม A</option>
          <option value="B">ห้องประชุม B</option>
          <option value="C">ห้องประชุม C</option>
          <option value="D">ห้องประชุม D</option>
          <option value="E">ห้องประชุม E</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">วันที่</label>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" />
      </div>

      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">เวลาเริ่ม</label>
          <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">เวลาสิ้นสุด</label>
          <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" />
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <button onClick={checkAvailability} className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded">
          ตรวจสอบคิว
        </button>
        {isAvailable !== null && (
          <span className={isAvailable ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
            {isAvailable ? '✔ ห้องว่าง' : '✖ ห้องไม่ว่าง'}
          </span>
        )}
      </div>

      <button
        disabled={!isAvailable}
        onClick={bookRoom}
        className={`w-full py-2 rounded text-white ${isAvailable ? 'bg-primary hover:bg-primary-dark' : 'bg-gray-400 cursor-not-allowed'}`}
      >
        ยืนยันการจอง
      </button>
    </div>
  );
};

export default BookRoom;
