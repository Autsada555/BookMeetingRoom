// import React, { useEffect, useState } from 'react';

// type User = {
//   name: string;
//   email: string;
//   position: string;
//   role: string;
// };

// const AdminDashboard: React.FC = () => {
//   const [users, setUsers] = useState<User[]>([]);
//   const token = localStorage.getItem('token');

//   useEffect(() => {
//     fetch('/api/admin/users', {
//       headers: { Authorization: `Bearer ${token}` },
//     })
//       .then(res => res.json())
//       .then(data => setUsers(data));
//   }, []);

//   const changeRole = async (email: string, newRole: string) => {
//     const res = await fetch('/api/admin/update-role', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ email, role: newRole }),
//     });

//     const data = await res.json();
//     if (res.ok) {
//       alert(data.message);
//       setUsers(users.map(u => u.email === email ? { ...u, role: newRole } : u));
//     } else {
//       alert(data.message);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto mt-10 bg-white p-6 shadow rounded">
//       <h2 className="text-2xl font-bold text-primary mb-4">จัดการผู้ใช้งาน</h2>
//       <table className="w-full table-auto border-collapse border border-gray-300">
//         <thead className="bg-primary text-white">
//           <tr>
//             <th className="border px-4 py-2">ชื่อ</th>
//             <th className="border px-4 py-2">อีเมล</th>
//             <th className="border px-4 py-2">ตำแหน่ง</th>
//             <th className="border px-4 py-2">สิทธิ์</th>
//             <th className="border px-4 py-2">การกระทำ</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users.map((u, i) => (
//             <tr key={i} className="text-center hover:bg-blue-50">
//               <td className="border px-4 py-2">{u.name}</td>
//               <td className="border px-4 py-2">{u.email}</td>
//               <td className="border px-4 py-2">{u.position}</td>
//               <td className="border px-4 py-2">{u.role}</td>
//               <td className="border px-4 py-2">
//                 {u.role === 'user' ? (
//                   <button
//                     className="bg-blue-500 text-white px-3 py-1 rounded"
//                     onClick={() => changeRole(u.email, 'admin')}
//                   >
//                     ตั้งเป็นแอดมิน
//                   </button>
//                 ) : (
//                   <button
//                     className="bg-gray-500 text-white px-3 py-1 rounded"
//                     onClick={() => changeRole(u.email, 'user')}
//                   >
//                     ยกเลิกแอดมิน
//                   </button>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default AdminDashboard;
