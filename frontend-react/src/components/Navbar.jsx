import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate('/login'); };

  const isActive = (path) => location.pathname === path ? 'nav-item active' : 'nav-item';

  const adminLinks = [
    { path: '/admin', icon: '📊', label: 'Dashboard' },
    { path: '/admin/productos', icon: '📦', label: 'Productos' },
    { path: '/admin/proveedores', icon: '🏭', label: 'Proveedores' },
    { path: '/admin/usuarios', icon: '👥', label: 'Usuarios' },
  ];
  const tecnicoLinks = [
    { path: '/tecnico', icon: '🔧', label: 'Panel Técnico' },
    { path: '/admin', icon: '📊', label: 'Dashboard' },
    { path: '/admin/productos', icon: '📦', label: 'Productos' },
    { path: '/admin/proveedores', icon: '🏭', label: 'Proveedores' },
    { path: '/admin/usuarios', icon: '👥', label: 'Usuarios' },
  ];
  const cajeroLinks = [
    { path: '/cajero', icon: '🏠', label: 'Inicio' },
    { path: '/cajero/productos', icon: '🔍', label: 'Consultar Productos' },
  ];

  const links = user?.role === 'admin_tecnico' ? tecnicoLinks
              : user?.role === 'admin' ? adminLinks
              : cajeroLinks;

  const roleBadge = user?.role === 'admin_tecnico' ? 'badge badge-admin_tecnico'
                  : user?.role === 'admin' ? 'badge badge-admin' : 'badge badge-cajero';

  const roleLabel = user?.role === 'admin_tecnico' ? 'Adm. Técnico'
                  : user?.role === 'admin' ? 'Adm. Tienda' : 'Cajero';

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        🛒 SmartMerca
        <span>Sistema de Inventario</span>
      </div>
      <nav className="sidebar-nav">
        {links.map(l => (
          <Link key={l.path} to={l.path} className={isActive(l.path)}>
            <span className="icon">{l.icon}</span> {l.label}
          </Link>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <strong>{user?.name}</strong>
          <span className={roleBadge}>{roleLabel}</span>
        </div>
        <button className="nav-item" onClick={handleLogout} style={{color:'#ef5350'}}>
          <span className="icon">🚪</span> Cerrar sesión
        </button>
      </div>
    </aside>
  );
};
export default Navbar;
