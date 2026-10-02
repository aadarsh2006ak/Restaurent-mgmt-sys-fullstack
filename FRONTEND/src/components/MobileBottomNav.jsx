import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, UtensilsCrossed, Calendar, ClipboardList, ShoppingCart, User } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const MobileBottomNav = () => {
  const location = useLocation();
  const { getCartCount, getCartTotal } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const cartCount = getCartCount();
  const cartTotal = getCartTotal();

  const navItems = [
    {
      to: '/',
      label: 'Home',
      icon: Home,
      active: location.pathname === '/'
    },
    {
      to: '/menu',
      label: 'Menu',
      icon: UtensilsCrossed,
      active: location.pathname === '/menu'
    },
    {
      to: '/book',
      label: 'Reserve',
      icon: Calendar,
      active: location.pathname === '/book'
    },
    {
      to: user ? '/orders' : '/login',
      label: user ? 'Orders' : 'Account',
      icon: user ? ClipboardList : User,
      active: location.pathname.startsWith('/orders') || (!user && location.pathname === '/login')
    },
    {
      to: '/cart',
      label: 'Cart',
      icon: ShoppingCart,
      active: location.pathname === '/cart',
      badge: cartCount > 0 ? cartCount : null
    }
  ];

  return (
    <>
      <nav className="mobile-bottom-navigation">
        <div className="mobile-bottom-nav-inner">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.active;

            return (
              <Link
                key={item.label}
                to={item.to}
                className={`mobile-nav-tab ${isActive ? 'active' : ''}`}
                aria-label={item.label}
              >
                <div className="mobile-nav-icon-wrap">
                  <Icon size={20} className="mobile-nav-icon" />
                  {item.badge && (
                    <span className="mobile-nav-badge">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                  {isActive && <span className="mobile-nav-indicator" />}
                </div>
                <span className="mobile-nav-label">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Embedded CSS for Mobile Bottom Nav */}
      <style>{`
        .mobile-bottom-navigation {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 900;
          background: rgba(11, 12, 16, 0.92);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-top: 1px solid var(--border-color);
          box-shadow: 0 -8px 24px rgba(0, 0, 0, 0.5);
          padding-bottom: env(safe-area-inset-bottom, 0px);
        }

        .mobile-bottom-nav-inner {
          display: flex;
          align-items: center;
          justify-content: space-around;
          height: 60px;
          max-width: 540px;
          margin: 0 auto;
          padding: 0 8px;
        }

        .mobile-nav-tab {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex: 1;
          height: 100%;
          color: var(--text-muted);
          text-decoration: none;
          transition: all 0.2s ease;
          position: relative;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }

        .mobile-nav-icon-wrap {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 24px;
        }

        .mobile-nav-icon {
          transition: transform 0.2s ease, color 0.2s ease;
        }

        .mobile-nav-label {
          font-size: 0.68rem;
          font-weight: 500;
          margin-top: 2px;
          letter-spacing: 0.3px;
          transition: color 0.2s ease, font-weight 0.2s ease;
        }

        .mobile-nav-tab.active {
          color: var(--color-gold);
        }

        .mobile-nav-tab.active .mobile-nav-icon {
          transform: translateY(-2px) scale(1.08);
          color: var(--color-gold);
        }

        .mobile-nav-tab.active .mobile-nav-label {
          color: var(--color-gold);
          font-weight: 700;
        }

        .mobile-nav-indicator {
          position: absolute;
          bottom: -4px;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background-color: var(--color-gold);
          box-shadow: 0 0 8px var(--color-gold);
        }

        .mobile-nav-badge {
          position: absolute;
          top: -6px;
          right: -8px;
          background-color: var(--color-gold);
          color: #0b0c10;
          font-size: 0.62rem;
          font-weight: 800;
          min-width: 17px;
          height: 17px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.6);
          animation: badgePulse 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        @keyframes badgePulse {
          0% { transform: scale(0.6); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }

        @media (max-width: 768px) {
          .mobile-bottom-navigation {
            display: block !important;
          }
        }
      `}</style>
    </>
  );
};

export default MobileBottomNav;
