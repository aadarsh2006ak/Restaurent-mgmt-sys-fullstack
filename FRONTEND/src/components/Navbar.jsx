import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { ShoppingCart, User as UserIcon, LogOut, Calendar, Menu as MenuIcon, Home as HomeIcon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { getCartCount } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="glass-panel" style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      margin: '20px 24px',
      padding: '16px 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid var(--border-color)',
      borderRadius: '16px',
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.6rem',
          fontWeight: 700,
          color: 'var(--color-gold)',
          letterSpacing: '1px'
        }}>L'AURA</span>
        <span style={{ fontSize: '0.75rem', border: '1px solid var(--color-gold)', padding: '2px 6px', borderRadius: '4px', letterSpacing: '2px', color: 'var(--color-gold)' }}>GASTRONOMY</span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.95rem', fontWeight: 500, transition: 'var(--transition-smooth)' }} className="nav-link">
          <HomeIcon size={16} /> Home
        </Link>
        <Link to="/menu" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.95rem', fontWeight: 500, transition: 'var(--transition-smooth)' }} className="nav-link">
          <MenuIcon size={16} /> Menu
        </Link>
        <Link to="/book" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.95rem', fontWeight: 500, transition: 'var(--transition-smooth)' }} className="nav-link">
          <Calendar size={16} /> Reserve Table
        </Link>
        {user && (
          <Link to="/orders" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.95rem', fontWeight: 500, transition: 'var(--transition-smooth)' }} className="nav-link">
            My Orders
          </Link>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <Link to="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center', padding: '8px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)', transition: 'var(--transition-smooth)' }} className="cart-btn">
          <ShoppingCart size={20} style={{ color: 'var(--color-gold)' }} />
          {getCartCount() > 0 && (
            <span style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              backgroundColor: 'var(--color-gold)',
              color: 'var(--bg-primary)',
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.7rem',
              fontWeight: 'bold'
            }}>
              {getCartCount()}
            </span>
          )}
        </Link>

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500 }}>
              Hello, {user.name.split(' ')[0]}
            </span>
            <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        ) : (
          <Link to="/login" className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <UserIcon size={14} /> Sign In
          </Link>
        )}
      </div>

      {/* Embedded CSS for nav hover state */}
      <style>{`
        .nav-link:hover {
          color: var(--color-gold-hover);
        }
        .cart-btn:hover {
          background-color: rgba(197, 168, 128, 0.15);
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
