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
  ShieldCheck,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { adminUser, adminLogout } = useContext(AdminAuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    adminLogout();
    if (onClose) onClose();
    navigate('/login');
  };

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  return (
    <aside className={`admin-sidebar ${isOpen ? 'sidebar-open' : ''}`}>
      {/* Brand Header */}
      <div style={{ marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-gold)' }}>
            <ShieldCheck size={22} />
            <span style={{ fontWeight: 'bold', fontSize: '1.2rem', letterSpacing: '1px' }}>L'AURA PANEL</span>
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
            Management Board
          </div>
        </div>

        {/* Mobile Close Button */}
        <button
          onClick={onClose}
          className="sidebar-close-btn"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '6px',
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          aria-label="Close Sidebar"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation Links */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
        <NavLink
          to="/"
          onClick={handleLinkClick}
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '11px 14px',
            borderRadius: '6px',
            fontSize: '0.92rem',
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
          onClick={handleLinkClick}
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '11px 14px',
            borderRadius: '6px',
            fontSize: '0.92rem',
            color: isActive ? 'var(--color-gold)' : 'var(--text-primary)',
            backgroundColor: isActive ? 'rgba(197, 168, 128, 0.08)' : 'transparent',
            transition: 'var(--transition-smooth)'
          })}
          className="sidebar-link"
        >
          <ClipboardList size={18} /> Orders Board
        </NavLink>

        <NavLink
          to="/menu"
          onClick={handleLinkClick}
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '11px 14px',
            borderRadius: '6px',
            fontSize: '0.92rem',
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
          onClick={handleLinkClick}
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '11px 14px',
            borderRadius: '6px',
            fontSize: '0.92rem',
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
          onClick={handleLinkClick}
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '11px 14px',
            borderRadius: '6px',
            fontSize: '0.92rem',
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
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{adminUser?.name}</span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
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
            fontSize: '0.82rem'
          }}
        >
          <LogOut size={13} /> Sign Out
        </button>
      </div>

      <style>{`
        .sidebar-link:hover {
          color: var(--color-gold-hover) !important;
          background-color: rgba(197, 168, 128, 0.04);
        }
        @media (max-width: 1023px) {
          .sidebar-close-btn {
            display: flex !important;
          }
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
