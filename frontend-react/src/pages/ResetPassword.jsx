import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const ResetPassword = () => {
  const [token, setToken] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPass !== confirm) { setError('Las contraseñas no coinciden'); return; }
    setError(''); setLoading(true);
    try {
      const data = await authService.resetPassword(token, newPass);
      setMsg(data.message);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1> SmartMerca</h1>
        <h2>Restablecer Contraseña</h2>
        {error && <div className="alert alert-error">{error}</div>}
        {msg && <div className="alert alert-success">{msg} — Redirigiendo...</div>}
        {!msg && (
          <form onSubmit={handleSubmit}>
            <input className="dark-input" type="text" placeholder="Token de recuperación"
              value={token} onChange={e => setToken(e.target.value)} required />
            <input className="dark-input" type="password" placeholder="Nueva contraseña"
              value={newPass} onChange={e => setNewPass(e.target.value)} required minLength={6} />
            <input className="dark-input" type="password" placeholder="Confirmar contraseña"
              value={confirm} onChange={e => setConfirm(e.target.value)} required />
            <button type="submit" disabled={loading}>{loading ? 'Guardando...' : 'Restablecer contraseña'}</button>
          </form>
        )}
        <div className="auth-links">
          <Link to="/login">← Volver al inicio de sesión</Link>
        </div>
      </div>
    </div>
  );
};
export default ResetPassword;
