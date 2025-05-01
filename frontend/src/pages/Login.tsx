import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('userName', data.name);
      localStorage.setItem('userEmail', data.email);
      navigate('/profile');
    } else {
      setError(data.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white shadow p-6 rounded">
      <h2 className="text-2xl font-bold text-primary mb-4 text-center">เข้าสู่ระบบ</h2>
      {error && <p className="text-red-600">{error}</p>}
      <input
        type="email"
        placeholder="อีเมล"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full border rounded px-3 py-2 mb-3"
      />
      <input
        type="password"
        placeholder="รหัสผ่าน"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="w-full border rounded px-3 py-2 mb-4"
      />
      <button
        onClick={handleLogin}
        className="w-full bg-primary hover:bg-primary-dark text-white py-2 rounded"
      >
        เข้าสู่ระบบ
      </button>
    </div>
  );
};

export default LoginPage;
