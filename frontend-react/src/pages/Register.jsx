import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'cajero' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await authService.register(form.name, form.email, form.password, form.role);
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1> SmartMerca</h1>
        <h2>Registros</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Nombre completo" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input type="email" placeholder="Correo electrónico" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input type="password" placeholder="Contraseña" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="cajero">Cajero</option>
            <option value="admin">Administrador</option>
          </select>
          <button type="submit">Registrarse</button>
        </form>
        <p>¿Ya tienes cuenta? <Link to="/login">Inicia Sesión</Link></p>
      </div>
    </div>
  );
};

export default Register;
