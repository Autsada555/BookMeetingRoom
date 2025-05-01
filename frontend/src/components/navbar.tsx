import React from 'react';
import { useState } from 'react';
// import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
  
    <nav className="border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
    <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
      <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
        <img src="\src\assets\logo RVD.png" className="h-8" alt="Ravindra" />
        <h1 className="self-center text-2xl font-semibold whitespace-nowrap text-blue-900 ">
          Ravindra Resort & Spa
        </h1>
      </a>
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className="inline-flex items-center justify-center p-2 w-10 h-10 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open main menu</span>
        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M1 1h15M1 7h15M1 13h15"
          />
        </svg>
      </button>
      <div className={`${isOpen ? 'block' : 'hidden'} w-full`} id="navbar-hamburger">
        <ul className="flex flex-col font-medium mt-4 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
          <li>
            <a href="#" className="block py-2 px-3 bg-blue-700 rounded-sm dark:bg-blue-600" aria-current="page">
              Home
            </a>
          </li>
          <li>
            <a href="#" className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
              Services
            </a>
          </li>
          <li>
            <a href="#" className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
              Pricing
            </a>
          </li>
          <li>
            <a href="#" className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
              Contact
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>

    // <nav style={{ padding: '10px', background: '#005BBB', color: '#fff' }}>
    //   <ul style={{ display: 'flex', listStyle: 'none', gap: '20px' }}>
    //     <li><Link style={{ color: 'white' }} to="/">หน้าแรก</Link></li>
    //     <li><Link style={{ color: 'white' }} to="/book">จองห้องประชุม</Link></li>
    //     <li><Link style={{ color: 'white' }} to="/schedule">ตารางการใช้งาน</Link></li>
    //     <li><Link style={{ color: 'white' }} to="/profile">โปรไฟล์ของฉัน</Link></li>
    //     <li><Link style={{ color: 'white' }} to="/logout">ออกจากระบบ</Link></li>
    //   </ul>
    // </nav>
  );
};

export default Navbar;
