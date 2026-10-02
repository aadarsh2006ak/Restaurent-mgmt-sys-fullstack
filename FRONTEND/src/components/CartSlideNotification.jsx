import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { ShoppingBag, ArrowRight, X, Check } from 'lucide-react';

const CartSlideNotification = () => {
  const { lastAddedItem, dismissNotification, getCartCount, getCartTotal } = useContext(CartContext);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (lastAddedItem) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        dismissNotification();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [lastAddedItem]);

  if (!visible || !lastAddedItem) return null;

  const handleGoToCart = (e) => {
    e.stopPropagation();
    setVisible(false);
    dismissNotification();
    navigate('/cart');
  };

  return (
    <div
      className="cart-slide-toast"
      onClick={handleGoToCart}
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        maxWidth: '380px',
        width: 'calc(100% - 32px)',
        cursor: 'pointer',
        animation: 'slideUpToast 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}
    >
      <div
        className="glass-panel"
        style={{
          padding: '14px 16px',
          borderRadius: '16px',
          border: '1px solid var(--color-gold)',
          backgroundColor: 'rgba(20, 24, 33, 0.96)',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 16px 36px rgba(0, 0, 0, 0.6), 0 0 15px rgba(197, 168, 128, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}
      >
        {/* Header row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#2ecc71', fontSize: '0.8rem', fontWeight: 600 }}>
            <span style={{ backgroundColor: 'rgba(46, 204, 113, 0.15)', padding: '2px', borderRadius: '50%', display: 'flex' }}>
              <Check size={12} />
            </span>
            <span>Added to Cart!</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setVisible(false);
              dismissNotification();
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Close notification"
          >
            <X size={16} />
          </button>
        </div>

        {/* Item details row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src={lastAddedItem.imageUrl || 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=120&auto=format&fit=crop&q=80'}
            alt={lastAddedItem.name}
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '10px',
              objectFit: 'cover',
              border: '1px solid var(--border-color)',
              flexShrink: 0
            }}
          />

          <div style={{ flex: 1, minWidth: 0 }}>
            <h4 style={{
              fontSize: '0.9rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {lastAddedItem.name}
            </h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
              <span style={{ color: 'var(--color-gold)', fontWeight: 'bold', fontSize: '0.92rem' }}>
                ₹{lastAddedItem.price?.toFixed(2)}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {getCartCount()} {getCartCount() === 1 ? 'item' : 'items'} in cart
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleGoToCart}
          className="btn btn-primary"
          style={{
            width: '100%',
            padding: '9px 14px',
            fontSize: '0.85rem',
            gap: '6px',
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(197, 168, 128, 0.25)'
          }}
        >
          <ShoppingBag size={15} /> View Cart (₹{getCartTotal().toFixed(2)}) <ArrowRight size={15} />
        </button>
      </div>

      <style>{`
        @keyframes slideUpToast {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @media (max-width: 768px) {
          .cart-slide-toast {
            bottom: 74px !important;
            right: 16px !important;
            left: 16px !important;
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CartSlideNotification;
