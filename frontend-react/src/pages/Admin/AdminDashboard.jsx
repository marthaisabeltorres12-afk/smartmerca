import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import { productService } from '../../services/productService';
import { userService } from '../../services/userService';
import { supplierService } from '../../services/supplierService';

const AdminDashboard = () => {
  const { token, user } = useAuth();
  const [stats, setStats] = useState({ products: 0, lowStock: 0, users: 0, suppliers: 0 });
  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [products, users, suppliers] = await Promise.all([
          productService.getAll(token),
          userService.getAll(token),
          supplierService.getAll(token)
        ]);
        setStats({
          products: products.length,
          lowStock: products.filter(p => p.stock <= 5).length,
          users: users.length,
          suppliers: suppliers.length
        });
        setRecentProducts(products.slice(0, 6));
      } catch (e) { console.error(e); }
    };
    load();
  }, [token]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches';

  return (
    <div className="main-layout">
      <Navbar />
      <main className="main-content">
        <h1 className="page-title">📊 Dashboard</h1>
        <p style={{color:'#8892a4',marginBottom:'24px'}}>{greeting}, <strong style={{color:'#e0e6f0'}}>{user?.name}</strong> 👋</p>

        <div className="stats-grid">
          {[
            { icon: '📦', value: stats.products, label: 'Total Productos', color: '#42A5F5' },
            { icon: '⚠️', value: stats.lowStock, label: 'Stock Bajo (≤5)', color: '#ef5350' },
            { icon: '👥', value: stats.users, label: 'Usuarios', color: '#66BB6A' },
            { icon: '🏭', value: stats.suppliers, label: 'Proveedores', color: '#FFA726' },
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

        <div className="table-card">
          <div className="table-header"><h2>📋 Productos recientes</h2></div>
          <table className="dark-table">
            <thead><tr><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Stock</th></tr></thead>
            <tbody>
              {recentProducts.map(p => (
                <tr key={p.id}>
                  <td><strong>{p.name}</strong></td>
                  <td>{p.category || '—'}</td>
                  <td style={{color:'#66BB6A'}}>${parseFloat(p.price).toFixed(2)}</td>
                  <td style={{color: p.stock <= 5 ? '#ef5350' : '#e0e6f0'}}>{p.stock} {p.stock <= 5 && '⚠️'}</td>
                </tr>
              ))}
              {recentProducts.length === 0 && (
                <tr><td colSpan="4" style={{textAlign:'center',padding:'24px',color:'#8892a4'}}>Sin productos aún</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};
export default AdminDashboard;
