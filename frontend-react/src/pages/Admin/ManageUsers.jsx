import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';

const EMPTY = { name:'', email:'', password:'', role:'cajero', is_active: true };

const ManageUsers = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const load = async () => {
    try { setUsers(await userService.getAll(token)); }
    catch (e) { showAlert('error', e.message); }
  };
  useEffect(() => { load(); }, [token]);

  const showAlert = (type, msg) => { setAlert({type,msg}); setTimeout(() => setAlert(null), 3500); };

  const openAdd = () => { setEditing(null); setForm(EMPTY); setShowModal(true); };
  const openEdit = (u) => {
    setEditing(u);
    setForm({ name: u.name, email: u.email, password: '', role: u.role, is_active: u.is_active });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault(); setLoading(true);
    const payload = { name: form.name, email: form.email, role: form.role, is_active: form.is_active };
    if (form.password) payload.password = form.password;
    try {
      if (editing) {
        await userService.update(editing.id, payload, token);
        showAlert('success', 'Usuario actualizado');
      } else {
        if (!form.password) { showAlert('error', 'La contraseña es requerida'); setLoading(false); return; }
        payload.password = form.password;
        await userService.create(payload, token);
        showAlert('success', 'Usuario creado');
      }
      setShowModal(false); load();
    } catch (e) { showAlert('error', e.message); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    try { await userService.delete(id, token); showAlert('success', 'Usuario eliminado'); setConfirmDelete(null); load(); }
    catch (e) { showAlert('error', e.message); }
  };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const roleBadge = (role) => {
    if (role === 'admin_tecnico') return 'badge badge-admin_tecnico';
    if (role === 'admin') return 'badge badge-admin';
    return 'badge badge-cajero';
  };
  const roleLabel = (role) => {
    if (role === 'admin_tecnico') return 'Adm. Técnico';
    if (role === 'admin') return 'Adm. Tienda';
    return 'Cajero';
  };

  return (
    <div className="main-layout">
      <Navbar />
      <main className="main-content">
        <h1 className="page-title">👥 Gestión de Usuarios</h1>
        {alert && <div className={`alert alert-${alert.type === 'error' ? 'error' : 'success'}`}>{alert.msg}</div>}
        <div className="search-bar">
          <input className="dark-input" placeholder="🔍 Buscar usuario..." value={search} onChange={e => setSearch(e.target.value)} />
          <button className="btn btn-primary" onClick={openAdd}>+ Nuevo Usuario</button>
        </div>
        <div className="table-card">
          <table className="dark-table">
            <thead><tr><th>#</th><th>Nombre</th><th>Correo</th><th>Rol</th><th>Estado</th><th>Creado</th><th>Acciones</th></tr></thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="7" style={{textAlign:'center',padding:'32px',color:'#8892a4'}}>No hay usuarios</td></tr>
              ) : filtered.map((u, i) => (
                <tr key={u.id}>
                  <td>{i+1}</td>
                  <td><strong>{u.name}</strong></td>
                  <td style={{color:'#8892a4',fontSize:'0.85rem'}}>{u.email}</td>
                  <td><span className={roleBadge(u.role)}>{roleLabel(u.role)}</span></td>
                  <td><span className={u.is_active ? 'badge badge-active' : 'badge badge-inactive'}>{u.is_active ? 'Activo' : 'Inactivo'}</span></td>
                  <td style={{fontSize:'0.78rem',color:'#8892a4'}}>{u.created_at?.slice(0,10)}</td>
                  <td>
                    <button className="btn btn-warning btn-sm" onClick={() => openEdit(u)} style={{marginRight:6}}>✏️</button>
                    <button className="btn btn-danger btn-sm" onClick={() => setConfirmDelete(u)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <h3>{editing ? '✏️ Editar Usuario' : '+ Nuevo Usuario'}</h3>
              <form onSubmit={handleSave}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Nombre *</label>
                    <input className="dark-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label>Correo *</label>
                    <input className="dark-input" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label>{editing ? 'Nueva contraseña (dejar en blanco para no cambiar)' : 'Contraseña *'}</label>
                    <input className="dark-input" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} minLength={editing ? 0 : 6} required={!editing} />
                  </div>
                  <div className="form-group">
                    <label>Rol</label>
                    <select className="dark-input" value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                      <option value="cajero">Cajero</option>
                      <option value="admin">Administrador de Tienda</option>
                      <option value="admin_tecnico">Administrador Técnico</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Estado</label>
                    <select className="dark-input" value={form.is_active} onChange={e => setForm({...form, is_active: e.target.value === 'true'})}>
                      <option value="true">Activo</option>
                      <option value="false">Inactivo</option>
                    </select>
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Guardando...' : editing ? 'Actualizar' : 'Crear Usuario'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {confirmDelete && (
          <div className="modal-overlay">
            <div className="modal" style={{maxWidth:'360px',textAlign:'center'}}>
              <div style={{fontSize:'2.5rem',marginBottom:'12px'}}>⚠️</div>
              <h3>¿Eliminar usuario?</h3>
              <p style={{color:'#8892a4',margin:'12px 0'}}>Se eliminará a <strong style={{color:'#e0e6f0'}}>{confirmDelete.name}</strong>.</p>
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
export default ManageUsers;
