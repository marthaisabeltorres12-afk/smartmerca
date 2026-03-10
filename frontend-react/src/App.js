import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ManageProducts from './pages/Admin/ManageProducts';
import ManageSuppliers from './pages/Admin/ManageSuppliers';
import ManageUsers from './pages/Admin/ManageUsers';
import CashierDashboard from './pages/Cashier/CashierDashboard';
import ProductQuery from './pages/Cashier/ProductQuery';
import TechAdminDashboard from './pages/TechAdmin/TechAdminDashboard';
import './App.css';
import Register from "./pages/Register";

const PrivateRoute = ({ children, roles }) => {
  const { user, token } = useAuth();
  if (!token || !user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
           <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Admin Tienda */}
          <Route path="/admin" element={<PrivateRoute roles={['admin','admin_tecnico']}><AdminDashboard /></PrivateRoute>} />
          <Route path="/admin/productos" element={<PrivateRoute roles={['admin','admin_tecnico']}><ManageProducts /></PrivateRoute>} />
          <Route path="/admin/proveedores" element={<PrivateRoute roles={['admin','admin_tecnico']}><ManageSuppliers /></PrivateRoute>} />
          <Route path="/admin/usuarios" element={<PrivateRoute roles={['admin','admin_tecnico']}><ManageUsers /></PrivateRoute>} />

          {/* Admin Técnico */}
          <Route path="/tecnico" element={<PrivateRoute roles={['admin_tecnico']}><TechAdminDashboard /></PrivateRoute>} />

          {/* Cajero */}
          <Route path="/cajero" element={<PrivateRoute roles={['cajero']}><CashierDashboard /></PrivateRoute>} />
          <Route path="/cajero/productos" element={<PrivateRoute roles={['cajero']}><ProductQuery /></PrivateRoute>} />

          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
