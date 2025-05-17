import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import { useToast } from "@/components/ui/use-toast";
import { toast } from 'sonner';
import { LogOutUser } from '@/services/https/User';

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // const { toast } = useToast()
  const navigate = useNavigate();

  const LogOut = async () => {
    try {
      const res = await LogOutUser(`${window.localStorage.getItem("userType")}`);
      if (res.status) {
        toast.success("Logged out!", {
          description: "ออกจากระบบเสร็จสิ้น",
        });

        localStorage.removeItem("token");
        localStorage.removeItem('userId');
        localStorage.removeItem('userTypeId');
        localStorage.removeItem('userType');
        // setTimeout(() => {
        // }, 3000)
        window.location.reload();
        navigate("/login", { replace: true });
        window.location.reload();   
      } else {
        toast.error("ออกจากระบบไม่สำเร็จ", {
          description: "มีบางอย่างผิดปกติทำให้ออกจากระบบไม่ได้",
        });
      }

    } catch (error) {
      console.log("Error", error);
    }
  }

  return (
    <nav className="bg-slate-200 border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="/src/assets/logo RVD.png" className="h-8" alt="Ravindra" />
          <h1 className="self-center text-2xl font-semibold whitespace-nowrap text-blue-900">
            Ravindra Resort & Spa
          </h1>
        </Link>

        {/* Profile & Mobile Toggle */}
        <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          {/* Profile */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
            >
              <span className="sr-only">Open user menu</span>
              <img className="w-8 h-8 rounded-full" src="/src/assets/pexels-people.jpg" alt="user" />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg z-50">
                <div className="px-4 py-3">
                  <span className="block text-sm text-gray-900 dark:text-white">Anonymus</span>
                  <span className="block text-sm text-gray-500 truncate dark:text-gray-400">name@xxxx.com</span>
                </div>
                <ul className="py-2">
                  <li><Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">Profile</Link></li>
                  <li className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600" onClick={LogOut}>Sign out</li>
                </ul>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <div className={`${menuOpen ? 'block' : 'hidden'} items-center justify-between w-full md:flex md:w-auto md:order-1`} id="navbar-user">
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li><Link to="/dashboard" className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0">Dashboard</Link></li>
            <li><Link to="/check" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500">Check Daily</Link></li>
            <li><Link to="/book" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500">Booking M</Link></li>
            {/* <li><Link to="/admindashboard" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500">Admin Dashboard</Link></li> */}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
