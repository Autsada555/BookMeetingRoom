import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginUser } from '../services/https/User';
import { toast } from 'sonner';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedPassword = localStorage.getItem('rememberedPassword');
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async () => {
    const res = await LoginUser({ Email: email, password });

    if (res.status) {
      toast.success("Logged in!", {
        description: "เข้าสู่ระบบสำเร็จ",
      });
      // window.location.reload();
      // setTimeout(() => {
      // },3000)
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
        localStorage.setItem('rememberedPassword', password);
      } else {
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberedPassword');
      }

      localStorage.setItem('token', res.token);
      localStorage.setItem('userId', res.userid);
      localStorage.setItem('userTypeId', res.usertypeid);
      localStorage.setItem('userType', res.usertype);
      navigate('/dashboard');
      window.location.reload();
    } else {
      toast.error("เข้าสู่ระบบไม่สำเร็จ", {
        description: "มีบางอย่างผิดปกติทำให้เข้าสู่ระบบไม่ได้",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-xl">
        <h2 className="text-3xl font-bold text-blue-700 text-center mb-6">เข้าสู่ระบบ</h2>

        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

        <input
          type="text"
          placeholder="อีเมลหรือชื่อผู้ใช้"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border border-blue-300 focus:ring-2 focus:ring-blue-500 focus:outline-none rounded px-4 py-2 mb-4"
        />

        <div className="relative mb-6">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="รหัสผ่าน"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border border-blue-300 focus:ring-2 focus:ring-blue-500 focus:outline-none rounded px-4 py-2 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-2 text-sm text-blue-600 hover:underline"
          >
            {showPassword ? 'ซ่อน' : 'แสดง'}
          </button>
        </div>

        <label className="flex items-center text-sm text-gray-700 mb-4">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={e => setRememberMe(e.target.checked)}
            className="mr-2"
          />
          จำอีเมลและรหัสผ่าน
        </label>

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
        >
          เข้าสู่ระบบ
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
