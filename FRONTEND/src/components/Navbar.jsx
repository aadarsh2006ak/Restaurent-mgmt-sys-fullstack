import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import {
  ShoppingCart,
  User as UserIcon,
  LogOut,
  Calendar,
  UtensilsCrossed,
  Home as HomeIcon,
  X,
  ClipboardList,
  Menu as MenuIcon,
  Sparkles
} from 'lucide-react';

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

  const cartCount = getCartCount();

  return (
    <header className="navbar-header-sticky">
      <nav className="glass-panel navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="brand-link">
          <span className="brand-logo-text">L'AURA</span>
          <span className="brand-subtitle">GASTRONOMY</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="nav-desktop-links">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active-nav' : ''}`}>
            <HomeIcon size={15} /> Home
          </Link>
          <Link to="/menu" className={`nav-link ${location.pathname === '/menu' ? 'active-nav' : ''}`}>
            <UtensilsCrossed size={15} /> Menu
          </Link>
          <Link to="/book" className={`nav-link ${location.pathname === '/book' ? 'active-nav' : ''}`}>
            <Calendar size={15} /> Reserve Table
          </Link>
          {user && (
            <Link to="/orders" className={`nav-link ${location.pathname.startsWith('/orders') ? 'active-nav' : ''}`}>
              <ClipboardList size={15} /> My Orders
            </Link>
          )}
        </div>

        {/* Action Controls (Cart & Auth) */}
        <div className="nav-actions-group">
          {/* Cart Button */}
          <Link
            to="/cart"
            className="navbar-cart-btn"
            aria-label="View Dining Cart"
          >
            <ShoppingCart size={18} style={{ color: 'var(--color-gold)' }} />
            {cartCount > 0 && (
              <span className="cart-badge-count">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>

          {/* Desktop Auth Controls */}
          <div className="nav-desktop-auth">
            {user ? (
              <div className="user-pill-container">
                <span className="user-greeting-name">
                  {user.name.split(' ')[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '6px 12px', fontSize: '0.78rem', gap: '5px' }}
                >
                  <LogOut size={13} /> Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="btn btn-primary"
                style={{ padding: '7px 16px', fontSize: '0.84rem', gap: '6px' }}
              >
                <UserIcon size={14} /> Sign In
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <button
            className="mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
          >
            {mobileMenuOpen ? <X size={20} /> : <MenuIcon size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Dropdown Menu */}
      {mobileMenuOpen && (
        <>
          <div
            className="mobile-drawer-backdrop"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="glass-panel mobile-dropdown-drawer fade-in">
            <div className="mobile-drawer-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-gold)' }}>
                <Sparkles size={16} />
                <span style={{ fontWeight: 700, fontSize: '0.95rem', letterSpacing: '0.5px' }}>
                  L'AURA GASTRONOMY
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mobile-drawer-links">
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
                <UtensilsCrossed size={18} /> Master Menu
              </Link>
              <Link
                to="/book"
                onClick={() => setMobileMenuOpen(false)}
                className={`mobile-nav-link ${location.pathname === '/book' ? 'active-nav' : ''}`}
              >
                <Calendar size={18} /> Reserve a Table
              </Link>
              {user && (
                <Link
                  to="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`mobile-nav-link ${location.pathname.startsWith('/orders') ? 'active-nav' : ''}`}
                >
                  <ClipboardList size={18} /> My Orders & Invoices
                </Link>
              )}
            </div>

            <div className="mobile-drawer-footer">
              {user ? (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Signed in as</span>
                    <span style={{ fontWeight: 600, color: 'var(--color-gold)', fontSize: '0.92rem' }}>{user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="btn btn-secondary btn-sm"
                    style={{ gap: '6px' }}
                  >
                    <LogOut size={13} /> Sign Out
                  </button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn btn-primary"
                    style={{ fontSize: '0.85rem', padding: '10px' }}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.85rem', padding: '10px' }}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Embedded CSS for responsive navbar */}
      <style>{`
        .navbar-header-sticky {
          position: sticky;
          top: 0;
          z-index: 1000;
          width: 100%;
        }

        .navbar-container {
          margin: 12px var(--page-padding, 16px);
          padding: 12px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: 14px;
          position: relative;
        }

        .brand-link {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .brand-logo-text {
          font-family: var(--font-serif);
          font-size: clamp(1.2rem, 3.5vw, 1.45rem);
          font-weight: 700;
          color: var(--color-gold);
          letter-spacing: 1px;
        }

        .brand-subtitle {
          font-size: 0.62rem;
          border: 1px solid var(--color-gold);
          padding: 2px 5px;
          borderRadius: 4px;
          letterSpacing: 1.5px;
          color: var(--color-gold);
          font-weight: 600;
        }

        .nav-desktop-links {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-primary);
          transition: var(--transition-smooth);
        }

        .nav-link:hover, .nav-link.active-nav {
          color: var(--color-gold-hover);
        }

        .nav-actions-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .navbar-cart-btn {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background-color: rgba(255,255,255,0.04);
          border: 1px solid var(--border-color);
          transition: var(--transition-smooth);
        }

        .navbar-cart-btn:hover {
          background-color: rgba(197, 168, 128, 0.15);
          border-color: var(--color-gold);
        }

        .cart-badge-count {
          position: absolute;
          top: -3px;
          right: -3px;
          background-color: var(--color-gold);
          color: var(--bg-primary);
          border-radius: 50%;
          min-width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.68rem;
          font-weight: bold;
          padding: 0 3px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.6);
        }

        .nav-desktop-auth {
          display: flex;
          align-items: center;
        }

        .user-pill-container {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .user-greeting-name {
          font-size: 0.85rem;
          color: var(--text-primary);
          font-weight: 500;
          max-width: 100px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .mobile-toggle-btn {
          display: none;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          color: var(--color-gold);
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .mobile-toggle-btn:hover {
          background: rgba(197, 168, 128, 0.1);
        }

        .mobile-drawer-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(4px);
          z-index: 998;
        }

        .mobile-dropdown-drawer {
          position: fixed;
          top: 72px;
          left: var(--page-padding, 16px);
          right: var(--page-padding, 16px);
          z-index: 999;
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          border-radius: 16px;
          border: 1px solid var(--border-color-active);
          background: rgba(15, 18, 25, 0.96);
          box-shadow: 0 16px 40px rgba(0,0,0,0.7);
        }

        .mobile-drawer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding-bottom: 10px;
        }

        .mobile-drawer-links {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .mobile-nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 8px;
          font-size: 0.92rem;
          font-weight: 500;
          color: var(--text-primary);
          background-color: rgba(255, 255, 255, 0.02);
          transition: var(--transition-smooth);
        }

        .mobile-nav-link:hover, .mobile-nav-link.active-nav {
          color: var(--color-gold);
          background-color: rgba(197, 168, 128, 0.1);
        }

        .mobile-drawer-footer {
          border-top: 1px solid rgba(255,255,255,0.06);
          padding-top: 12px;
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

        @media (max-width: 400px) {
          .brand-subtitle {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
