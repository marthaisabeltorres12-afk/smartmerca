import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import { productService } from '../../services/productService';

const CashierDashboard = () => {
  const { token, user } = useAuth();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    productService.getAll(token).then(setProducts).catch(console.error);
  }, [token]);

  const lowStock = products.filter(p => p.stock <= 5);

  return (
    <div className="main-layout">
      <Navbar />
      <main className="main-content">
        <h1 className="page-title">🏠 Panel del Cajero</h1>
        <p style={{color:'#8892a4',marginBottom:'24px'}}>Hola, <strong style={{color:'#e0e6f0'}}>{user?.name}</strong> 👋</p>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div><div className="stat-value">{products.length}</div><div className="stat-label">Productos disponibles</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚠️</div>
            <div><div className="stat-value" style={{color:'#ef5350'}}>{lowStock.length}</div><div className="stat-label">Con stock bajo</div></div>
          </div>
        </div>

        <div className="card" style={{marginTop:'8px',marginBottom:'20px'}}>
          <Link to="/cajero/productos" className="btn btn-primary" style={{textDecoration:'none'}}>
            🔍 Consultar Productos
          </Link>
        </div>

        {lowStock.length > 0 && (
          <div className="table-card">
            <div className="table-header"><h2>⚠️ Productos con stock bajo</h2></div>
            <table className="dark-table">
              <thead><tr><th>Nombre</th><th>Stock</th><th>Precio</th></tr></thead>
              <tbody>
                {lowStock.map(p => (
                  <tr key={p.id}>
                    <td><strong>{p.name}</strong></td>
                    <td style={{color:'#ef5350',fontWeight:700}}>{p.stock} ⚠️</td>
                    <td style={{color:'#66BB6A'}}>${parseFloat(p.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};
export default CashierDashboard;
