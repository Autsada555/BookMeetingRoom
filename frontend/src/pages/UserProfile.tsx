import { User } from '@/interfaces/Index';
import { GetUserByID, UpdateUser } from '@/services/https/User';
import React, { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState({ FirstName: '', LastName: '', Password: '', GenderID: 0, UserTypeID: 0 });
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const idStr = window.localStorage.getItem("userId");
        if (!idStr) {
          setUser(null);
          setLoading(false);
          return;
        }
        const id = Number(idStr);
        setUserId(id);
        const res = await GetUserByID(id);
        console.log("User Profile Data:", res); // Debugging line
        setUser(res);
        setEditData({
          FirstName: res.FirstName || '',
          LastName: res.LastName || '',
          Password: '',
          GenderID: res.GenderID || 0,
          UserTypeID: res.UserTypeID || 0,
        });
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const saveProfile = async () => {
    if (!userId) return;
    const updateRes = await UpdateUser(editData as User, userId);
    if (updateRes.status) {
      setUser((prev) => prev ? { ...prev, ...editData } : null);
      alert('บันทึกโปรไฟล์สำเร็จ');
    } else {
      alert('เกิดข้อผิดพลาด: ' + updateRes.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow rounded text-center text-red-600">
        ไม่พบข้อมูลผู้ใช้
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white shadow-lg rounded-lg">
      <div className="flex flex-col items-center mb-8">
        <FaUserCircle className="text-7xl text-blue-400 mb-2" />
        <h2 className="text-3xl font-bold text-blue-800 mb-1">{user.FirstName} {user.LastName}</h2>
        <span className="text-gray-500">{user.Email}</span>
      </div>

      <div className="grid gap-6">
        <div>
          <label className="block font-medium mb-1 text-blue-700">ชื่อ</label>
          <input
            name="FirstName"
            value={editData.FirstName}
            onChange={handleChange}
            className="w-full border border-blue-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <div>
          <label className="block font-medium mb-1 text-blue-700">นามสกุล</label>
          <input
            name="LastName"
            value={editData.LastName}
            onChange={handleChange}
            className="w-full border border-blue-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <div>
          <label className="block font-medium mb-1 text-blue-700">อีเมล</label>
          <input
            name="Email"
            value={user.Email}
            disabled
            className="w-full border px-3 py-2 rounded bg-gray-100 text-gray-500"
          />
        </div>
        <div>
          <label className="block font-medium mb-1 text-blue-700">รหัสผ่าน (เปลี่ยนรหัสผ่านใหม่)</label>
          <input
            name="Password"
            type="password"
            value={editData.Password}
            onChange={handleChange}
            className="w-full border border-blue-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="********"
          />
        </div>
        <div>
          <label className="block font-medium mb-1 text-blue-700">เพศ</label>
          <input
            name="Gender"
            value={user.Gender?.Name || ''}
            disabled
            className="w-full border px-3 py-2 rounded bg-gray-100 text-gray-500"
          />
        </div>
        <div>
          <label className="block font-medium mb-1 text-blue-700">ประเภทผู้ใช้</label>
          <input
            name="UserType"
            value={user.UserType?.Name || ''}
            disabled
            className="w-full border px-3 py-2 rounded bg-gray-100 text-gray-500"
          />
        </div>
        <button
          onClick={saveProfile}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded mt-2 w-full font-semibold transition"
        >
          บันทึกโปรไฟล์
        </button>
      </div>
    </div>
  );
};

export default UserProfile;