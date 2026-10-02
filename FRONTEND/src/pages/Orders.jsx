import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Calendar, ShoppingBag, Eye, DollarSign, FileText, CheckCircle2, XCircle, Clock, Utensils, ArrowRight } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

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
        const resOrders = await fetch(`${API_BASE_URL}/api/orders/my-orders`, { headers });
        const ordersData = await resOrders.json();

        // Fetch Spending Stats
        const resStats = await fetch(`${API_BASE_URL}/api/orders/user-spending`, { headers });
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
    <div className="fade-in page-wrapper" style={{ maxWidth: '920px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '22px', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.7rem, 4vw, 2.4rem)', color: 'var(--color-gold)' }}>
            Your Dining Dashboard
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>
            Track food spending, view tax receipts, and monitor live kitchen orders.
          </p>
        </div>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem', backgroundColor: 'rgba(255,255,255,0.04)', padding: '4px 10px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          {user?.email}
        </span>
      </div>

      {error && (
        <div style={{ color: '#e63946', backgroundColor: 'rgba(230, 57, 70, 0.1)', padding: '12px', borderRadius: '6px', fontSize: '0.88rem', marginBottom: '18px' }}>
          {error}
        </div>
      )}

      {/* Customer Spending Analytics Banner */}
      <div className="spending-metrics-grid">
        {/* Total Spent */}
        <div className="glass-panel spending-metric-card">
          <div style={{ backgroundColor: 'rgba(197, 168, 128, 0.12)', padding: '12px', borderRadius: '10px', color: 'var(--color-gold)', display: 'flex', flexShrink: 0 }}>
            <DollarSign size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Spend</span>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 'bold', color: 'var(--color-gold)', marginTop: '2px' }}>
              ₹{spendingStats.totalSpent.toFixed(2)}
            </h3>
          </div>
        </div>

        {/* Total Orders */}
        <div className="glass-panel spending-metric-card">
          <div style={{ backgroundColor: 'rgba(52, 152, 219, 0.12)', padding: '12px', borderRadius: '10px', color: '#3498db', display: 'flex', flexShrink: 0 }}>
            <Utensils size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Orders</span>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 'bold', marginTop: '2px' }}>
              {spendingStats.totalOrders}
            </h3>
          </div>
        </div>

        {/* Active Orders */}
        <div className="glass-panel spending-metric-card">
          <div style={{ backgroundColor: 'rgba(243, 156, 18, 0.12)', padding: '12px', borderRadius: '10px', color: '#f39c12', display: 'flex', flexShrink: 0 }}>
            <Clock size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active Orders</span>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 'bold', marginTop: '2px', color: spendingStats.activeOrders > 0 ? '#f39c12' : 'inherit' }}>
              {spendingStats.activeOrders}
            </h3>
          </div>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="glass-panel" style={{ padding: 'clamp(36px, 8vw, 60px) 20px', textAlign: 'center', borderRadius: '18px' }}>
          <ShoppingBag size={44} style={{ color: 'var(--color-gold)', opacity: 0.4, marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', fontFamily: 'var(--font-serif)' }}>No orders placed yet</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '0.88rem' }}>Order your favorite Indian or Chinese dishes to track them live.</p>
          <Link to="/menu" className="btn btn-primary" style={{ gap: '6px' }}>
            <Utensils size={15} /> Browse Master Menu
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--color-gold)', marginBottom: '2px' }}>
            Order History & Tax Invoices
          </h2>
          {orders.map((order) => (
            <div
              key={order._id}
              className="glass-panel order-history-card-item"
              onClick={() => navigate(`/orders/${order._id}`)}
            >
              <div style={{ flex: '1 1 240px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '0.98rem' }}>Order #{order._id.substring(18)}</span>
                  <span className={`badge badge-${order.status.toLowerCase()}`}>{order.status}</span>
                  <span className={`badge badge-${order.paymentStatus.toLowerCase()}`}>{order.paymentStatus}</span>
                  {order.invoiceNumber && (
                    <span style={{ fontSize: '0.7rem', backgroundColor: 'rgba(197, 168, 128, 0.1)', color: 'var(--color-gold)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--border-color)', fontWeight: 600 }}>
                      {order.invoiceNumber}
                    </span>
                  )}
                </div>
                
                <div style={{ display: 'flex', gap: '12px', marginTop: '6px', fontSize: '0.8rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={12} /> {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                  <span>
                    Type: <strong>{order.orderType}</strong> {order.tableNumber && `(T-${order.tableNumber})`}
                  </span>
                  <span>
                    Items: <strong>{order.items.reduce((total, item) => total + item.quantity, 0)}</strong>
                  </span>
                  <span>
                    Pay: <strong>{order.paymentMethod || 'Cash'}</strong>
                  </span>
                </div>

                {order.status === 'Cancelled' && order.cancellationReason && (
                  <div style={{ fontSize: '0.78rem', color: '#e74c3c', marginTop: '4px' }}>
                    <strong>Cancelled:</strong> {order.cancellationReason}
                  </div>
                )}
              </div>

              <div className="order-card-right-group">
                <div style={{ textAlign: 'right' }}>
                  <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)' }}>Total Amount</span>
                  <span style={{ fontWeight: 800, color: 'var(--color-gold)', fontSize: '1.15rem' }}>₹{order.totalAmount.toFixed(2)}</span>
                </div>
                <div className="eye-action-circle" title="Track Live Status">
                  <Eye size={16} style={{ color: 'var(--color-gold)' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .spending-metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 180px), 1fr));
          gap: 14px;
          margin-bottom: 24px;
        }

        .spending-metric-card {
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 14px;
          border-radius: 14px;
        }

        .order-history-card-item {
          padding: 16px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          transition: var(--transition-smooth);
          border-left: 4px solid var(--color-gold);
          border-radius: 14px;
          flex-wrap: wrap;
          gap: 14px;
        }

        .order-history-card-item:hover {
          transform: translateY(-2px);
          border-color: var(--color-gold-hover);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
        }

        .order-card-right-group {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-left: auto;
        }

        .eye-action-circle {
          background-color: rgba(255,255,255,0.03);
          padding: 8px;
          border-radius: 50%;
          border: 1px solid var(--border-color);
          display: flex;
          transition: background-color 0.2s;
        }

        .order-history-card-item:hover .eye-action-circle {
          background-color: rgba(197, 168, 128, 0.2);
        }

        @media (max-width: 480px) {
          .order-history-card-item {
            padding: 12px 14px;
          }
          .order-card-right-group {
            width: 100%;
            justify-content: space-between;
            padding-top: 8px;
            border-top: 1px solid rgba(255,255,255,0.04);
            margin-top: 4px;
          }
        }
      `}</style>
    </div>
  );
};

export default Orders;
