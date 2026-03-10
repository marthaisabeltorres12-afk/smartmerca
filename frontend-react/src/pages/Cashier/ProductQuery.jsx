import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import { productService } from '../../services/productService';

const ProductQuery = () => {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    productService.getAll(token).then(setProducts).catch(console.error);
  }, [token]);

  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.barcode?.includes(search) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="main-layout">
      <Navbar />
      <main className="main-content">
        <h1 className="page-title">🔍 Consultar Productos</h1>
        <div className="search-bar">
          <input className="dark-input" placeholder="Buscar por nombre, código o categoría..."
            value={search} onChange={e => setSearch(e.target.value)} autoFocus />
        </div>
        <div className="table-card">
          <table className="dark-table">
            <thead><tr><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Código</th></tr></thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="5" style={{textAlign:'center',padding:'32px',color:'#8892a4'}}>No se encontraron productos</td></tr>
              ) : filtered.map(p => (
                <tr key={p.id}>
                  <td><strong>{p.name}</strong></td>
                  <td>{p.category || '—'}</td>
                  <td style={{color:'#66BB6A',fontWeight:600}}>${parseFloat(p.price).toFixed(2)}</td>
                  <td style={{color: p.stock <= 5 ? '#ef5350' : '#e0e6f0'}}>
                    {p.stock} {p.stock <= 5 && <span title="Stock bajo">⚠️</span>}
                  </td>
                  <td style={{fontSize:'0.78rem',color:'#8892a4'}}>{p.barcode || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};
export default ProductQuery;
