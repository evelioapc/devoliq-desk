import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al iniciar sesión');
      localStorage.setItem('token', data.token);
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 360, margin: '4rem auto', padding: 24 }}>
      <h1 style={{ marginBottom: 24 }}>Devoliq Desk — Login</h1>
      <form onSubmit={handleSubmit}>
        {error && <p style={{ color: '#f87171', marginBottom: 12 }}>{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ display: 'block', width: '100%', marginBottom: 12, padding: 10 }}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ display: 'block', width: '100%', marginBottom: 12, padding: 10 }}
        />
        <button type="submit" style={{ padding: '10px 20px' }}>Entrar</button>
      </form>
      <p style={{ marginTop: 16, fontSize: 14, color: '#94a3b8' }}>
        API: {API_URL}
      </p>
    </div>
  );
}

function Dashboard() {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/" replace />;

  return (
    <div style={{ maxWidth: 800, margin: '2rem auto', padding: 24 }}>
      <h1>Dashboard — Devoliq Desk SaaS</h1>
      <p>Frontend SaaS en apps/desk-web (Vite + React).</p>
      <p><a href="/" style={{ color: '#93c5fd' }}>Volver al login</a></p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
