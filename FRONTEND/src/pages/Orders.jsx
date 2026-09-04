import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Calendar, ShoppingBag, Eye, DollarSign } from 'lucide-react';

const Orders = () => {
  const { token, user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchMyOrders = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/orders/my-orders', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (data.success) {
          setOrders(data.data);
        } else {
          setError(data.message || 'Could not fetch your orders');
        }
      } catch (err) {
        setError('Could not connect to the server');
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [token, navigate]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
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

  return (
    <div className="fade-in" style={{ padding: '0 24px 60px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: 'var(--color-gold)' }}>Your Orders</h1>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Logged in as: {user?.email}</span>
      </div>

      {error && (
        <div style={{ color: '#e63946', backgroundColor: 'rgba(230, 57, 70, 0.1)', padding: '12px', borderRadius: '6px', fontSize: '0.9rem', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center' }}>
          <ShoppingBag size={40} style={{ color: 'var(--color-gold)', opacity: 0.5, marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>No orders found</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>You haven't placed any orders yet.</p>
          <Link to="/menu" className="btn btn-primary">Browse Menu</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map((order) => (
            <div
              key={order._id}
              className="glass-panel order-history-card"
              style={{
                padding: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'var(--transition-smooth)',
                borderLeft: '4px solid var(--color-gold)'
              }}
              onClick={() => navigate(`/orders/${order._id}`)}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '1.05rem' }}>Order #{order._id.substring(18)}</span>
                  <span className={`badge badge-${order.status.toLowerCase()}`}>{order.status}</span>
                </div>
                
                <div style={{ display: 'flex', gap: '20px', marginTop: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={14} /> {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                  <span>
                    Type: {order.orderType} {order.tableNumber && `(Table ${order.tableNumber})`}
                  </span>
                  <span>
                    Items: {order.items.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Amount</span>
                  <span style={{ fontWeight: 'bold', color: 'var(--color-gold)', fontSize: '1.2rem' }}>${order.totalAmount.toFixed(2)}</span>
                </div>
                <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '50%', border: '1px solid var(--border-color)', display: 'flex' }} className="eye-btn">
                  <Eye size={16} style={{ color: 'var(--color-gold)' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .order-history-card {
          transition: transform 0.2s ease, border-color 0.2s ease;
        }
        .order-history-card:hover {
          transform: translateY(-2px);
          border-color: var(--color-gold-hover);
        }
        .order-history-card:hover .eye-btn {
          background-color: rgba(197, 168, 128, 0.15);
        }
      `}</style>
    </div>
  );
};

export default Orders;
