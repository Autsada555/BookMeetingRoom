import React, { useEffect, useState } from 'react';

type Booking = {
  room: string;
  date: string;
  startTime: string;
  endTime: string;
};

type User = {
  name: string;
  email: string;
  position: string;
};

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User>({
    name: '',
    email: '',
    position: ''
  });
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    // mock user info
    setUser({ name: 'สมชาย รักจอง', email: 'somchai@company.com', position: 'เจ้าหน้าที่' });

    // mock bookings (จาก backend จริงควรใช้ email ของ user)
    fetch('/api/bookings')
      .then(res => res.json())
      .then(data => {
        const myBookings = data.filter((b: any) => b.bookedBy === 'สมชาย รักจอง');
        setBookings(myBookings);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const saveProfile = () => {
    alert('โปรไฟล์ถูกบันทึกแล้ว ✅');
    // fetch('/api/user/update', ...) เป็นต้น
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold text-primary mb-6">โปรไฟล์ผู้ใช้</h2>

      <div className="grid gap-4 mb-6">
        <div>
          <label className="block font-medium mb-1">ชื่อ-สกุล</label>
          <input
            name="name"
            value={user.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">อีเมล</label>
          <input
            name="email"
            value={user.email}
            disabled
            className="w-full border px-3 py-2 rounded bg-gray-100 text-gray-500"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">ตำแหน่ง</label>
          <input
            name="position"
            value={user.position}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button
          onClick={saveProfile}
          className="bg-primary hover:bg-primary-dark text-white py-2 rounded mt-2 w-full"
        >
          บันทึกโปรไฟล์
        </button>
      </div>

      <h3 className="text-xl font-semibold text-primary mt-8 mb-2">ประวัติการจองห้องประชุม</h3>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-primary text-white">
            <tr>
              <th className="px-4 py-2 border">ห้อง</th>
              <th className="px-4 py-2 border">วันที่</th>
              <th className="px-4 py-2 border">เริ่ม</th>
              <th className="px-4 py-2 border">สิ้นสุด</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4">ยังไม่มีประวัติการจอง</td>
              </tr>
            ) : (
              bookings.map((b, idx) => (
                <tr key={idx} className="hover:bg-blue-50 text-center">
                  <td className="px-4 py-2 border">{b.room}</td>
                  <td className="px-4 py-2 border">{b.date}</td>
                  <td className="px-4 py-2 border">{b.startTime}</td>
                  <td className="px-4 py-2 border">{b.endTime}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserProfile;
