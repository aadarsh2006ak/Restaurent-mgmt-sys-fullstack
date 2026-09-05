import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { ShoppingCart, User as UserIcon, LogOut, Calendar, Menu as MenuIcon, Home as HomeIcon, X, ClipboardList } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { getCartCount } = useContext(CartContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 1000, width: '100%' }}>
      <nav
        className="glass-panel"
        style={{
          margin: '14px var(--page-padding, 16px)',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-color)',
          borderRadius: '16px',
          position: 'relative'
        }}
      >
        {/* Brand Logo */}
        <Link
          to="/"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}
        >
          <span
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.45rem',
              fontWeight: 700,
              color: 'var(--color-gold)',
              letterSpacing: '1px'
            }}
          >
            L'AURA
          </span>
          <span
            className="brand-subtitle"
            style={{
              fontSize: '0.65rem',
              border: '1px solid var(--color-gold)',
              padding: '2px 6px',
              borderRadius: '4px',
              letterSpacing: '1.5px',
              color: 'var(--color-gold)'
            }}
          >
            GASTRONOMY
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="nav-desktop-links" style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active-nav' : ''}`}>
            <HomeIcon size={16} /> Home
          </Link>
          <Link to="/menu" className={`nav-link ${location.pathname === '/menu' ? 'active-nav' : ''}`}>
            <MenuIcon size={16} /> Menu
          </Link>
          <Link to="/book" className={`nav-link ${location.pathname === '/book' ? 'active-nav' : ''}`}>
            <Calendar size={16} /> Reserve Table
          </Link>
          {user && (
            <Link to="/orders" className={`nav-link ${location.pathname.startsWith('/orders') ? 'active-nav' : ''}`}>
              <ClipboardList size={16} /> My Orders
            </Link>
          )}
        </div>

        {/* Action Controls (Cart & Auth) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Cart Button */}
          <Link
            to="/cart"
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border-color)',
              transition: 'var(--transition-smooth)'
            }}
            className="cart-btn"
            aria-label="View Dining Cart"
          >
            <ShoppingCart size={18} style={{ color: 'var(--color-gold)' }} />
            {getCartCount() > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  backgroundColor: 'var(--color-gold)',
                  color: 'var(--bg-primary)',
                  borderRadius: '50%',
                  width: '19px',
                  height: '19px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.72rem',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.5)'
                }}
              >
                {getCartCount()}
              </span>
            )}
          </Link>

          {/* Desktop Auth Controls */}
          <div className="nav-desktop-auth">
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: 500, maxWidth: '120px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user.name.split(' ')[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="btn btn-secondary"
                  style={{ padding: '7px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <LogOut size={13} /> Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="btn btn-primary"
                style={{ padding: '8px 16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <UserIcon size={14} /> Sign In
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <button
            className="mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            style={{
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              color: 'var(--color-gold)',
              cursor: 'pointer'
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <MenuIcon size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Dropdown Menu */}
      {mobileMenuOpen && (
        <div
          className="glass-panel mobile-dropdown-drawer fade-in"
          style={{
            margin: '0 var(--page-padding, 16px)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            borderRadius: '16px',
            border: '1px solid var(--border-color-active)',
            boxShadow: '0 12px 32px rgba(0,0,0,0.6)'
          }}
        >
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`mobile-nav-link ${location.pathname === '/' ? 'active-nav' : ''}`}
          >
            <HomeIcon size={18} /> Home
          </Link>
          <Link
            to="/menu"
            onClick={() => setMobileMenuOpen(false)}
            className={`mobile-nav-link ${location.pathname === '/menu' ? 'active-nav' : ''}`}
          >
            <MenuIcon size={18} /> Master Menu
          </Link>
          <Link
            to="/book"
            onClick={() => setMobileMenuOpen(false)}
            className={`mobile-nav-link ${location.pathname === '/book' ? 'active-nav' : ''}`}
          >
            <Calendar size={18} /> Reserve Table
          </Link>
          {user && (
            <Link
              to="/orders"
              onClick={() => setMobileMenuOpen(false)}
              className={`mobile-nav-link ${location.pathname.startsWith('/orders') ? 'active-nav' : ''}`}
            >
              <ClipboardList size={18} /> My Orders
            </Link>
          )}

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '14px', marginTop: '4px' }}>
            {user ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Signed in as</span>
                  <span style={{ fontWeight: 600, color: 'var(--color-gold)' }}>{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn btn-secondary"
                  style={{ padding: '8px 14px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-primary"
                  style={{ width: '100%', fontSize: '0.85rem', padding: '10px' }}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-secondary"
                  style={{ width: '100%', fontSize: '0.85rem', padding: '10px' }}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Embedded CSS for responsive navbar */}
      <style>{`
        .nav-link {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.92rem;
          font-weight: 500;
          color: var(--text-primary);
          transition: var(--transition-smooth);
        }
        .nav-link:hover, .nav-link.active-nav {
          color: var(--color-gold-hover);
        }
        .mobile-nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--text-primary);
          background-color: rgba(255, 255, 255, 0.02);
          transition: var(--transition-smooth);
        }
        .mobile-nav-link:hover, .mobile-nav-link.active-nav {
          color: var(--color-gold);
          background-color: rgba(197, 168, 128, 0.1);
        }
        .cart-btn:hover {
          background-color: rgba(197, 168, 128, 0.15);
        }
        @media (max-width: 860px) {
          .nav-desktop-links,
          .nav-desktop-auth {
            display: none !important;
          }
          .mobile-toggle-btn {
            display: flex !important;
          }
        }
        @media (max-width: 420px) {
          .brand-subtitle {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
