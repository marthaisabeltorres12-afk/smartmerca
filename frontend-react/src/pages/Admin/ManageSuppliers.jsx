import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import { supplierService } from '../../services/supplierService';

const EMPTY = { name:'', contact_name:'', email:'', phone:'', address:'' };

const ManageSuppliers = () => {
  const { token } = useAuth();
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const load = async () => {
    try { setSuppliers(await supplierService.getAll(token)); }
    catch (e) { showAlert('error', e.message); }
  };
  useEffect(() => { load(); }, [token]);

  const showAlert = (type, msg) => { setAlert({type,msg}); setTimeout(() => setAlert(null), 3500); };
  const openAdd = () => { setEditing(null); setForm(EMPTY); setShowModal(true); };
  const openEdit = (s) => { setEditing(s); setForm({name:s.name||'',contact_name:s.contact_name||'',email:s.email||'',phone:s.phone||'',address:s.address||''}); setShowModal(true); };

  const handleSave = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      if (editing) { await supplierService.update(editing.id, form, token); showAlert('success','Proveedor actualizado'); }
      else { await supplierService.create(form, token); showAlert('success','Proveedor creado'); }
      setShowModal(false); load();
    } catch (e) { showAlert('error', e.message); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    try { await supplierService.delete(id, token); showAlert('success','Proveedor eliminado'); setConfirmDelete(null); load(); }
    catch (e) { showAlert('error', e.message); }
  };

  const filtered = suppliers.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.contact_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="main-layout">
      <Navbar />
      <main className="main-content">
        <h1 className="page-title">🏭 Gestión de Proveedores</h1>
        {alert && <div className={`alert alert-${alert.type === 'error' ? 'error' : 'success'}`}>{alert.msg}</div>}
        <div className="search-bar">
          <input className="dark-input" placeholder="🔍 Buscar proveedor..." value={search} onChange={e => setSearch(e.target.value)} />
          <button className="btn btn-primary" onClick={openAdd}>+ Nuevo Proveedor</button>
        </div>
        <div className="table-card">
          <table className="dark-table">
            <thead><tr><th>#</th><th>Nombre</th><th>Contacto</th><th>Email</th><th>Teléfono</th><th>Dirección</th><th>Acciones</th></tr></thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="7" style={{textAlign:'center',padding:'32px',color:'#8892a4'}}>No hay proveedores</td></tr>
              ) : filtered.map((s, i) => (
                <tr key={s.id}>
                  <td>{i+1}</td><td><strong>{s.name}</strong></td>
                  <td>{s.contact_name||'—'}</td><td style={{color:'#8892a4',fontSize:'0.82rem'}}>{s.email||'—'}</td>
                  <td>{s.phone||'—'}</td><td style={{fontSize:'0.8rem',color:'#8892a4'}}>{s.address||'—'}</td>
                  <td>
                    <button className="btn btn-warning btn-sm" onClick={() => openEdit(s)} style={{marginRight:6}}>✏️</button>
                    <button className="btn btn-danger btn-sm" onClick={() => setConfirmDelete(s)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <h3>{editing ? '✏️ Editar Proveedor' : '+ Nuevo Proveedor'}</h3>
              <form onSubmit={handleSave}>
                <div className="form-grid">
                  {[['name','Nombre *',true],['contact_name','Contacto',false],['email','Email',false],['phone','Teléfono',false]].map(([k,lbl,req]) => (
                    <div key={k} className="form-group">
                      <label>{lbl}</label>
                      <input className="dark-input" value={form[k]} onChange={e => setForm({...form,[k]:e.target.value})} required={req} />
                    </div>
                  ))}
                </div>
                <div className="form-group" style={{marginTop:'12px'}}>
                  <label>Dirección</label>
                  <textarea className="dark-input" rows={2} value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Guardando...' : editing ? 'Actualizar' : 'Crear'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {confirmDelete && (
          <div className="modal-overlay">
            <div className="modal" style={{maxWidth:'360px',textAlign:'center'}}>
              <div style={{fontSize:'2.5rem',marginBottom:'12px'}}>🗑️</div>
              <h3>¿Eliminar proveedor?</h3>
              <p style={{color:'#8892a4',margin:'12px 0'}}>Se eliminará <strong style={{color:'#e0e6f0'}}>{confirmDelete.name}</strong>.</p>
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
export default ManageSuppliers;
