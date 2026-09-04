import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AdminAuthContext } from '../context/AdminAuthContext';
import {
  LayoutDashboard,
  ClipboardList,
  Utensils,
  Grid,
  CalendarDays,
  LogOut,
  ShieldCheck
} from 'lucide-react';

const Sidebar = () => {
  const { adminUser, adminLogout } = useContext(AdminAuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    adminLogout();
    navigate('/login');
  };

  return (
    <aside className="admin-sidebar">
      {/* Brand Header */}
      <div style={{ marginBottom: '32px', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-gold)' }}>
          <ShieldCheck size={24} />
          <span style={{ fontWeight: 'bold', fontSize: '1.25rem', letterSpacing: '1px' }}>L'AURA PANEL</span>
        </div>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
          Management Board
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        <NavLink
          to="/"
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '6px',
            fontSize: '0.95rem',
            color: isActive ? 'var(--color-gold)' : 'var(--text-primary)',
            backgroundColor: isActive ? 'rgba(197, 168, 128, 0.08)' : 'transparent',
            transition: 'var(--transition-smooth)'
          })}
          className="sidebar-link"
        >
          <LayoutDashboard size={18} /> Dashboard
        </NavLink>

        <NavLink
          to="/orders"
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '6px',
            fontSize: '0.95rem',
            color: isActive ? 'var(--color-gold)' : 'var(--text-primary)',
            backgroundColor: isActive ? 'rgba(197, 168, 128, 0.08)' : 'transparent',
            transition: 'var(--transition-smooth)'
          })}
          className="sidebar-link"
        >
          <ClipboardList size={18} /> Orders
        </NavLink>

        <NavLink
          to="/menu"
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '6px',
            fontSize: '0.95rem',
            color: isActive ? 'var(--color-gold)' : 'var(--text-primary)',
            backgroundColor: isActive ? 'rgba(197, 168, 128, 0.08)' : 'transparent',
            transition: 'var(--transition-smooth)'
          })}
          className="sidebar-link"
        >
          <Utensils size={18} /> Menu Setup
        </NavLink>

        <NavLink
          to="/tables"
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '6px',
            fontSize: '0.95rem',
            color: isActive ? 'var(--color-gold)' : 'var(--text-primary)',
            backgroundColor: isActive ? 'rgba(197, 168, 128, 0.08)' : 'transparent',
            transition: 'var(--transition-smooth)'
          })}
          className="sidebar-link"
        >
          <Grid size={18} /> Physical Tables
        </NavLink>

        <NavLink
          to="/reservations"
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '6px',
            fontSize: '0.95rem',
            color: isActive ? 'var(--color-gold)' : 'var(--text-primary)',
            backgroundColor: isActive ? 'rgba(197, 168, 128, 0.08)' : 'transparent',
            transition: 'var(--transition-smooth)'
          })}
          className="sidebar-link"
        >
          <CalendarDays size={18} /> Reservations
        </NavLink>
      </nav>

      {/* Footer / User Details & Logout */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{adminUser?.name}</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {adminUser?.role} Account
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="btn btn-secondary"
          style={{
            width: '100%',
            gap: '8px',
            justifyContent: 'center',
            padding: '8px',
            fontSize: '0.85rem'
          }}
        >
          <LogOut size={14} /> Sign Out
        </button>
      </div>

      <style>{`
        .sidebar-link:hover {
          color: var(--color-gold-hover) !important;
          background-color: rgba(197, 168, 128, 0.04);
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
