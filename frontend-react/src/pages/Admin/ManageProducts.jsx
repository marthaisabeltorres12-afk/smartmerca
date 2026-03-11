import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import { productService } from '../../services/productService';
import { supplierService } from '../../services/supplierService';

const EMPTY = { name:'', description:'', price:'', stock:'', category:'', barcode:'', supplier_id:'' };

const ManageProducts = () => {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const load = async () => {
    try {
      const [p, s] = await Promise.all([productService.getAll(token), supplierService.getAll(token)]);
      setProducts(p); setSuppliers(s);
    } catch (e) { showAlert('error', e.message); }
  };

  useEffect(() => { load(); }, [token]);

  const showAlert = (type, msg) => {
    setAlert({ type, msg });
    setTimeout(() => setAlert(null), 3500);
  };

  const openAdd = () => { setEditing(null); setForm(EMPTY); setShowModal(true); };
  const openEdit = (p) => {
    setEditing(p);
    setForm({ name: p.name||'', description: p.description||'', price: p.price||'',
      stock: p.stock||'', category: p.category||'', barcode: p.barcode||'', supplier_id: p.supplier_id||'' });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault(); setLoading(true);
    const payload = {
      name: form.name, description: form.description,
      price: parseFloat(form.price), stock: parseInt(form.stock)||0,
      category: form.category, supplier_id: form.supplier_id ? parseInt(form.supplier_id) : null,
    };
    if (form.barcode) payload.barcode = form.barcode;
    try {
      if (editing) {
        await productService.update(editing.id, payload, token);
        showAlert('success', 'Producto actualizado');
      } else {
        await productService.create(payload, token);
        showAlert('success', 'Producto creado');
      }
      setShowModal(false); load();
    } catch (e) { showAlert('error', e.message); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    try {
      await productService.delete(id, token);
      showAlert('success', 'Producto eliminado');
      setConfirmDelete(null); load();
    } catch (e) { showAlert('error', e.message); }
  };

  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase()) ||
    p.barcode?.includes(search)
  );

  return (
    <div className="main-layout">
      <Navbar />
      <main className="main-content">
        <h1 className="page-title">📦 Gestión de Productos</h1>
        {alert && <div className={`alert alert-${alert.type === 'error' ? 'error' : 'success'}`}>{alert.msg}</div>}
        <div className="search-bar">
          <input className="dark-input" placeholder="Buscar por nombre, categoría o código..."
            value={search} onChange={e => setSearch(e.target.value)} />
          <button className="btn btn-primary" onClick={openAdd}>+ Nuevo Producto</button>
        </div>
        <div className="table-card">
          <table className="dark-table">
            <thead><tr>
              <th>#</th><th>Nombre</th><th>Categoría</th><th>Precio</th>
              <th>Stock</th><th>Código</th><th>Proveedor</th><th>Acciones</th>
            </tr></thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="8" style={{textAlign:'center',padding:'32px',color:'#8892a4'}}>No hay productos</td></tr>
              ) : filtered.map((p, i) => (
                <tr key={p.id}>
                  <td>{i+1}</td>
                  <td><strong>{p.name}</strong>{p.description && <span style={{display:'block',fontSize:'0.75rem',color:'#8892a4'}}>{p.description.slice(0,40)}...</span>}</td>
                  <td>{p.category || <span style={{color:'#8892a4'}}>—</span>}</td>
                  <td style={{color:'#66BB6A',fontWeight:600}}>${parseFloat(p.price).toFixed(2)}</td>
                  <td>
                    <span style={{color: p.stock <= 5 ? '#ef5350' : p.stock <= 15 ? '#FFA726' : '#e0e6f0', fontWeight: p.stock <= 5 ? 700 : 400}}>
                      {p.stock} {p.stock <= 5 && '⚠️'}
                    </span>
                  </td>
                  <td style={{fontSize:'0.78rem',color:'#8892a4'}}>{p.barcode || '—'}</td>
                  <td style={{fontSize:'0.82rem'}}>{p.supplier || '—'}</td>
                  <td>
                    <button className="btn btn-warning btn-sm" onClick={() => openEdit(p)} style={{marginRight:6}}>✏️</button>
                    <button className="btn btn-danger btn-sm" onClick={() => setConfirmDelete(p)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <h3>{editing ? '✏️ Editar Producto' : '+ Nuevo Producto'}</h3>
              <form onSubmit={handleSave}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Nombre *</label>
                    <input className="dark-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label>Categoría</label>
                    <input className="dark-input" value={form.category} onChange={e => setForm({...form, category: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Precio *</label>
                    <input className="dark-input" type="number" step="0.01" min="0" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label>Stock</label>
                    <input className="dark-input" type="number" min="0" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Código de barras</label>
                    <input className="dark-input" value={form.barcode} onChange={e => setForm({...form, barcode: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Proveedor</label>
                    <select className="dark-input" value={form.supplier_id} onChange={e => setForm({...form, supplier_id: e.target.value})}>
                      <option value="">— Sin proveedor —</option>
                      {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group" style={{marginTop:'12px'}}>
                  <label>Descripción</label>
                  <textarea className="dark-input" rows={2} value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Guardando...' : editing ? 'Actualizar' : 'Crear Producto'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Confirm Delete */}
        {confirmDelete && (
          <div className="modal-overlay">
            <div className="modal" style={{maxWidth:'360px',textAlign:'center'}}>
              <div style={{fontSize:'2.5rem',marginBottom:'12px'}}>🗑️</div>
              <h3>¿Eliminar producto?</h3>
              <p style={{color:'#8892a4',margin:'12px 0'}}>Se eliminará <strong style={{color:'#e0e6f0'}}>{confirmDelete.name}</strong>. Esta acción no se puede deshacer.</p>
              <div className="modal-actions" style={{justifyContent:'center'}}>
                <button className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>Cancelar</button>
                <button className="btn btn-danger" onClick={() => handleDelete(confirmDelete.id)}>Sí, eliminar</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
export default ManageProducts;
