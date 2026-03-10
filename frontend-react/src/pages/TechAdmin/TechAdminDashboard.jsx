import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { productService } from '../../services/productService';

const TechAdminDashboard = () => {
  const { token, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    Promise.all([userService.getAll(token), productService.getAll(token)])
      .then(([u, p]) => { setUsers(u); setProducts(p); })
      .catch(console.error);
  }, [token]);

  const roleCount = (role) => users.filter(u => u.role === role).length;

  return (
    <div className="main-layout">
      <Navbar />
      <main className="main-content">
        <h1 className="page-title">🔧 Panel Administrador Técnico</h1>
        <p style={{color:'#8892a4',marginBottom:'24px'}}>Bienvenido, <strong style={{color:'#CE93D8'}}>{user?.name}</strong></p>

        <div className="stats-grid">
          {[
            { icon: '👑', value: roleCount('admin_tecnico'), label: 'Adm. Técnicos', color: '#CE93D8' },
            { icon: '🏪', value: roleCount('admin'), label: 'Adm. Tienda', color: '#42A5F5' },
            { icon: '💼', value: roleCount('cajero'), label: 'Cajeros', color: '#66BB6A' },
            { icon: '📦', value: products.length, label: 'Productos', color: '#FFA726' },
          ].map((s, i) => (
            <div key={i} className="stat-card">
              <div className="stat-icon">{s.icon}</div>
              <div>
                <div className="stat-value" style={{color: s.color}}>{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="card" style={{marginTop:'8px'}}>
          <h2 style={{marginBottom:'16px',fontSize:'1rem'}}>⚙️ Acceso rápido</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:'12px'}}>
            {[
              { href:'/admin/usuarios', icon:'👥', label:'Gestionar Usuarios' },
              { href:'/admin/productos', icon:'📦', label:'Gestionar Productos' },
              { href:'/admin/proveedores', icon:'🏭', label:'Gestionar Proveedores' },
              { href:'/admin', icon:'📊', label:'Ver Dashboard' },
            ].map(l => (
              <a key={l.href} href={l.href} style={{background:'#2d3650',borderRadius:'8px',padding:'16px',textAlign:'center',textDecoration:'none',color:'#e0e6f0',display:'block',transition:'background .2s'}}
                onMouseEnter={e => e.target.style.background='#3a4460'}
                onMouseLeave={e => e.target.style.background='#2d3650'}>
                <div style={{fontSize:'1.8rem',marginBottom:'8px'}}>{l.icon}</div>
                <div style={{fontSize:'0.82rem'}}>{l.label}</div>
              </a>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
export default TechAdminDashboard;
