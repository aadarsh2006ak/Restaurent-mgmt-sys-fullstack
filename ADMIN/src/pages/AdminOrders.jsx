import React, { useState, useEffect, useContext } from 'react';
import { AdminAuthContext } from '../context/AdminAuthContext';
import { RefreshCw, Clipboard, CreditCard, ChevronDown, CheckSquare, Clock } from 'lucide-react';

const AdminOrders = () => {
  const { adminToken } = useContext(AdminAuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        headers: {
          Authorization: `Bearer ${adminToken}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (err) {
      console.error('Error fetching orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // auto-poll every 10s
    return () => clearInterval(interval);
  }, [adminToken]);

  const updateStatus = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await response.json();
      if (data.success) {
        // Update list locally
        setOrders((prevOrders) =>
          prevOrders.map((order) => (order._id === orderId ? data.data : order))
        );
      }
    } catch (err) {
      console.error('Error updating order status', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const updatePayment = async (orderId, newPaymentStatus) => {
    setUpdatingId(orderId);
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/payment`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ paymentStatus: newPaymentStatus })
      });
      const data = await response.json();
      if (data.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, paymentStatus: data.data.paymentStatus } : order
          )
        );
      }
    } catch (err) {
      console.error('Error updating payment status', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = filterStatus === 'All'
    ? orders
    : orders.filter((order) => order.status === filterStatus);

  const statuses = ['All', 'Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'];

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: 'var(--color-gold)' }}>Live Orders Board</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage incoming and processing food orders. Click buttons to advance statuses.</p>
        </div>
        <button
          onClick={() => { setLoading(true); fetchOrders(); }}
          className="btn btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <RefreshCw size={14} className={loading ? 'spin' : ''} /> Sync Board
        </button>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '10px',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '12px',
        marginBottom: '24px',
        overflowX: 'auto'
      }}>
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className="btn btn-secondary btn-sm"
            style={{
              borderColor: filterStatus === status ? 'var(--color-gold)' : 'transparent',
              color: filterStatus === status ? 'var(--color-gold)' : 'var(--text-muted)',
              backgroundColor: filterStatus === status ? 'rgba(197, 168, 128, 0.05)' : 'transparent',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            {status} ({status === 'All' ? orders.length : orders.filter(o => o.status === status).length})
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <div className="spin" style={{
            width: '32px',
            height: '32px',
            border: '2px solid rgba(197, 168, 128, 0.1)',
            borderTopColor: 'var(--color-gold)',
            borderRadius: '50%',
            animation: 'spin 1.5s linear infinite'
          }} />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center' }}>
          <Clipboard size={36} style={{ color: 'var(--color-gold)', opacity: 0.5, marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>No orders in this status currently.</h3>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filteredOrders.map((order) => (
            <div key={order._id} className="glass-panel" style={{ padding: '24px' }}>
              {/* Card Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px', marginBottom: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Order #{order._id.substring(18)}</span>
                    <span className={`badge badge-${order.status.toLowerCase()}`}>{order.status}</span>
                    <span className={`badge badge-${order.paymentStatus.toLowerCase()}`}>{order.paymentStatus}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <span>
                      Type: <strong>{order.orderType}</strong> {order.tableNumber && `(Table ${order.tableNumber})`}
                    </span>
                    <span>
                      Customer: <strong>{order.user?.name || order.guestName || 'Walk-in Guest'}</strong>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} /> {new Date(order.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Total Bill</span>
                  <span style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--color-gold)' }}>${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Items List */}
              <div style={{ marginBottom: '20px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>Dish Items</span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '0.9rem' }}>
                      <strong>{item.quantity}×</strong> {item.menuItem?.name || 'Deleted Item'}
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Category: {item.menuItem?.category || 'N/A'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                {/* Kitchen Status triggers */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  {order.status === 'Pending' && (
                    <button
                      onClick={() => updateStatus(order._id, 'Preparing')}
                      disabled={updatingId === order._id}
                      className="btn btn-primary btn-sm"
                    >
                      Start Preparing
                    </button>
                  )}
                  {order.status === 'Preparing' && (
                    <button
                      onClick={() => updateStatus(order._id, 'Ready')}
                      disabled={updatingId === order._id}
                      className="btn btn-primary btn-sm"
                      style={{ backgroundColor: '#9b59b6', borderColor: '#9b59b6', color: 'white' }}
                    >
                      Mark Ready
                    </button>
                  )}
                  {order.status === 'Ready' && (
                    <button
                      onClick={() => updateStatus(order._id, 'Completed')}
                      disabled={updatingId === order._id}
                      className="btn btn-primary btn-sm"
                      style={{ backgroundColor: '#2ecc71', borderColor: '#2ecc71', color: 'white' }}
                    >
                      Complete Order
                    </button>
                  )}
                  {['Pending', 'Preparing', 'Ready'].includes(order.status) && (
                    <button
                      onClick={() => updateStatus(order._id, 'Cancelled')}
                      disabled={updatingId === order._id}
                      className="btn btn-danger btn-sm"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>

                {/* Cashier payment triggers */}
                <div>
                  {order.paymentStatus === 'Unpaid' ? (
                    <button
                      onClick={() => updatePayment(order._id, 'Paid')}
                      disabled={updatingId === order._id}
                      className="btn btn-secondary btn-sm"
                      style={{ color: '#2ecc71', borderColor: 'rgba(46,204,113,0.3)', gap: '6px', display: 'flex', alignItems: 'center' }}
                    >
                      <CreditCard size={14} /> Mark as Paid
                    </button>
                  ) : (
                    <button
                      onClick={() => updatePayment(order._id, 'Unpaid')}
                      disabled={updatingId === order._id}
                      className="btn btn-secondary btn-sm"
                      style={{ color: '#e74c3c', borderColor: 'rgba(231,76,60,0.3)', gap: '6px', display: 'flex', alignItems: 'center' }}
                    >
                      <CreditCard size={14} /> Mark as Unpaid
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default AdminOrders;
