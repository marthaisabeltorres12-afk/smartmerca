import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === 'admin_tecnico') navigate('/tecnico');
      else if (user.role === 'admin') navigate('/admin');
      else navigate('/cajero');
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1> SmartMerca</h1>
        <h2>Iniciar Sesión</h2>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input className="dark-input" type="email" placeholder="Correo electrónico"
            value={email} onChange={e => setEmail(e.target.value)} required />
          <input className="dark-input" type="password" placeholder="Contraseña"
            value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit" disabled={loading}>{loading ? 'Ingresando...' : 'Ingresar'}</button>
        </form>
        <div className="auth-links">
          <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
          <span>¿No tienes cuenta? <Link to="/Register">Regístrate</Link></span>
        </div>
      </div>
    </div>
  );
};
export default Login;
