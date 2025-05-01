import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav style={{ padding: '10px', background: '#005BBB', color: '#fff' }}>
      <ul style={{ display: 'flex', listStyle: 'none', gap: '20px' }}>
        <li><Link style={{ color: 'white' }} to="/">หน้าแรก</Link></li>
        <li><Link style={{ color: 'white' }} to="/book">จองห้องประชุม</Link></li>
        <li><Link style={{ color: 'white' }} to="/schedule">ตารางการใช้งาน</Link></li>
        <li><Link style={{ color: 'white' }} to="/profile">โปรไฟล์ของฉัน</Link></li>
        <li><Link style={{ color: 'white' }} to="/logout">ออกจากระบบ</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
