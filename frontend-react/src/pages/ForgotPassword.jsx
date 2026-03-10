import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const data = await authService.forgotPassword(email);
      setMsg(data.message);
      if (data.reset_token) setToken(data.reset_token);
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>🛒 SmartMerca</h1>
        <h2>Recuperar Contraseña</h2>
        {error && <div className="alert alert-error">{error}</div>}
        {msg && (
          <div className="alert alert-success">
            <p>{msg}</p>
            {token && (
              <div style={{marginTop:'10px'}}>
                <p style={{fontSize:'0.8rem',marginBottom:'6px'}}>Token de recuperación:</p>
                <code style={{background:'#1a1f2e',padding:'6px 10px',borderRadius:'4px',fontSize:'0.78rem',wordBreak:'break-all'}}>{token}</code>
                <p style={{fontSize:'0.75rem',marginTop:'8px',color:'#8892a4'}}>Copia este token y úsalo en la pantalla de restablecer contraseña.</p>
              </div>
            )}
          </div>
        )}
        {!msg && (
          <form onSubmit={handleSubmit}>
            <input className="dark-input" type="email" placeholder="Tu correo electrónico"
              value={email} onChange={e => setEmail(e.target.value)} required />
            <button type="submit" disabled={loading}>{loading ? 'Enviando...' : 'Solicitar recuperación'}</button>
          </form>
        )}
        <div className="auth-links">
          <Link to="/login">← Volver al inicio de sesión</Link>
          <Link to="/reset-password">Tengo un token, restablecer contraseña →</Link>
        </div>
      </div>
    </div>
  );
};
export default ForgotPassword;
