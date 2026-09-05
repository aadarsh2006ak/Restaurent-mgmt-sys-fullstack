import React, { useContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthProvider, AdminAuthContext } from './context/AdminAuthContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import AdminOrders from './pages/AdminOrders';
import AdminMenu from './pages/AdminMenu';
import AdminTables from './pages/AdminTables';
import AdminReservations from './pages/AdminReservations';
import Login from './pages/Login';
import { Menu, ShieldCheck } from 'lucide-react';

// Protected Route wrapper with responsive mobile drawer support
const ProtectedRoute = ({ children }) => {
  const { adminUser, loading } = useContext(AdminAuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-primary)'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          border: '2px solid rgba(197, 168, 128, 0.1)',
          borderTopColor: 'var(--color-gold)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
    );
  }

  if (!adminUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="admin-layout">
      {/* Mobile Sticky Topbar */}
      <header className="admin-mobile-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-gold)' }}>
          <ShieldCheck size={20} />
          <span style={{ fontWeight: 'bold', fontSize: '1.05rem', letterSpacing: '0.5px' }}>L'AURA PANEL</span>
        </div>
        <button
          onClick={() => setSidebarOpen(true)}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--border-color)',
            borderRadius: '6px',
            color: 'var(--color-gold)',
            padding: '7px 10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          aria-label="Open Navigation Menu"
        >
          <Menu size={18} />
        </button>
      </header>

      {/* Backdrop overlay for mobile drawer */}
      {sidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar (Desktop docked, Mobile off-canvas drawer) */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <AdminAuthProvider>
      <Router>
        <Routes>
          {/* Public Auth Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Board Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <AdminOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/menu"
            element={
              <ProtectedRoute>
                <AdminMenu />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tables"
            element={
              <ProtectedRoute>
                <AdminTables />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reservations"
            element={
              <ProtectedRoute>
                <AdminReservations />
              </ProtectedRoute>
            }
          />

          {/* Fallback redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AdminAuthProvider>
  );
}

export default App;
