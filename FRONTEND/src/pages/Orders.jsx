import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Calendar, ShoppingBag, Eye, DollarSign, FileText, CheckCircle2, XCircle, Clock, Utensils } from 'lucide-react';

const Orders = () => {
  const { token, user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [spendingStats, setSpendingStats] = useState({
    totalSpent: 0,
    totalOrders: 0,
    activeOrders: 0,
    completedOrders: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchOrdersAndSpending = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch My Orders
        const resOrders = await fetch('http://localhost:5000/api/orders/my-orders', { headers });
        const ordersData = await resOrders.json();

        // Fetch Spending Stats
        const resStats = await fetch('http://localhost:5000/api/orders/user-spending', { headers });
        const statsData = await resStats.json();

        if (ordersData.success) {
          setOrders(ordersData.data);
        } else {
          setError(ordersData.message || 'Could not fetch your orders');
        }

        if (statsData.success) {
          setSpendingStats(statsData.data);
        }
      } catch (err) {
        setError('Could not connect to the server');
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersAndSpending();
  }, [token, navigate]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
        <div style={{
          width: '36px',
          height: '36px',
          border: '3px solid rgba(197, 168, 128, 0.15)',
          borderTopColor: 'var(--color-gold)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
    );
  }

  return (
    <div className="fade-in page-wrapper" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: 'var(--color-gold)' }}>Your Dining Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Track food spending, view tax invoices, and manage live orders.</p>
        </div>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Account: {user?.email}</span>
      </div>

      {error && (
        <div style={{ color: '#e63946', backgroundColor: 'rgba(230, 57, 70, 0.1)', padding: '12px', borderRadius: '6px', fontSize: '0.9rem', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {/* Customer Spending Analytics Banner */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
        gap: '14px',
        marginBottom: '28px'
      }}>
        {/* Total Spent */}
        <div className="glass-panel" style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ backgroundColor: 'rgba(197, 168, 128, 0.12)', padding: '12px', borderRadius: '10px', color: 'var(--color-gold)', display: 'flex', flexShrink: 0 }}>
            <DollarSign size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Food Spend</span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--color-gold)', marginTop: '2px' }}>
              ${spendingStats.totalSpent.toFixed(2)}
            </h3>
          </div>
        </div>

        {/* Total Orders */}
        <div className="glass-panel" style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ backgroundColor: 'rgba(52, 152, 219, 0.12)', padding: '12px', borderRadius: '10px', color: '#3498db', display: 'flex', flexShrink: 0 }}>
            <Utensils size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Orders</span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginTop: '2px' }}>
              {spendingStats.totalOrders}
            </h3>
          </div>
        </div>

        {/* Active Orders */}
        <div className="glass-panel" style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ backgroundColor: 'rgba(243, 156, 18, 0.12)', padding: '12px', borderRadius: '10px', color: '#f39c12', display: 'flex', flexShrink: 0 }}>
            <Clock size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active Orders</span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginTop: '2px' }}>
              {spendingStats.activeOrders}
            </h3>
          </div>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="glass-panel" style={{ padding: '48px 20px', textAlign: 'center' }}>
          <ShoppingBag size={40} style={{ color: 'var(--color-gold)', opacity: 0.5, marginBottom: '14px' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>No orders found</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '0.9rem' }}>You haven't placed any orders yet.</p>
          <Link to="/menu" className="btn btn-primary">Browse Menu</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--color-gold)', marginBottom: '4px' }}>
            Order History & Tax Invoices
          </h2>
          {orders.map((order) => (
            <div
              key={order._id}
              className="glass-panel order-history-card"
              style={{
                padding: '18px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'var(--transition-smooth)',
                borderLeft: order.status === 'Cancelled' ? '4px solid #e74c3c' : '4px solid var(--color-gold)',
                flexWrap: 'wrap',
                gap: '16px'
              }}
              onClick={() => navigate(`/orders/${order._id}`)}
            >
              <div style={{ flex: '1 1 260px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>Order #{order._id.substring(18)}</span>
                  <span className={`badge badge-${order.status.toLowerCase()}`}>{order.status}</span>
                  <span className={`badge badge-${order.paymentStatus.toLowerCase()}`}>{order.paymentStatus}</span>
                  {order.invoiceNumber && (
                    <span style={{ fontSize: '0.72rem', backgroundColor: 'rgba(197, 168, 128, 0.1)', color: 'var(--color-gold)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                      {order.invoiceNumber}
                    </span>
                  )}
                </div>
                
                <div style={{ display: 'flex', gap: '14px', marginTop: '6px', fontSize: '0.82rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={13} /> {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                  <span>
                    Type: {order.orderType} {order.tableNumber && `(T-${order.tableNumber})`}
                  </span>
                  <span>
                    Items: {order.items.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                  <span>
                    Pay: {order.paymentMethod || 'Cash'}
                  </span>
                </div>

                {order.status === 'Cancelled' && order.cancellationReason && (
                  <div style={{ fontSize: '0.78rem', color: '#e74c3c', marginTop: '4px' }}>
                    <strong>Cancelled:</strong> {order.cancellationReason}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: 'auto' }}>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Amount</span>
                  <span style={{ fontWeight: 'bold', color: 'var(--color-gold)', fontSize: '1.15rem' }}>${order.totalAmount.toFixed(2)}</span>
                </div>
                <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '8px', borderRadius: '50%', border: '1px solid var(--border-color)', display: 'flex' }} className="eye-btn">
                  <Eye size={16} style={{ color: 'var(--color-gold)' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
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
