import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, RefreshCw, ChevronLeft, MapPin, CheckSquare, Coffee, CheckCircle } from 'lucide-react';

const OrderStatus = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrder = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${id}`);
      const data = await response.json();
      if (data.success) {
        setOrder(data.data);
      } else {
        setError(data.message || 'Order not found');
      }
    } catch (err) {
      console.error('Error fetching order', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();

    // Auto-refresh order status every 5 seconds
    const interval = setInterval(() => {
      fetchOrder();
    }, 5000);

    return () => clearInterval(interval);
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
        <RefreshCw className="spin" size={32} style={{ color: 'var(--color-gold)' }} />
        <style>{`
          .spin { animation: spin 1.5s linear infinite; }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="fade-in" style={{ padding: '0 24px 60px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold)', marginBottom: '16px' }}>Oops!</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>{error || 'We could not load your order details.'}</p>
        <Link to="/menu" className="btn btn-primary">Go back to Menu</Link>
      </div>
    );
  }

  // Determine progress step index
  // Statuses: 'Pending', 'Preparing', 'Ready', 'Completed'
  const statusSteps = ['Pending', 'Preparing', 'Ready', 'Completed'];
  const currentStepIndex = statusSteps.indexOf(order.status);

  return (
    <div className="fade-in" style={{ padding: '0 24px 60px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link to="/menu" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: 'var(--color-gold)' }}>
          <ChevronLeft size={16} /> Continue Shopping
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '30px' }}>
        <div>
          {/* Order Status Tracking Box */}
          <div className="glass-panel" style={{ padding: '30px', marginBottom: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ORDER ID: #{order._id.substring(18)}</span>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginTop: '4px' }}>Track Your Order</h2>
              </div>
              <span className={`badge badge-${order.status.toLowerCase()}`}>
                {order.status}
              </span>
            </div>

            {/* Stepper Timeline */}
            {order.status !== 'Cancelled' ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', margin: '40px 0' }}>
                {/* Connector line */}
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  left: '30px',
                  right: '30px',
                  height: '2px',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  zIndex: 1
                }} />
                {/* Active connector fill */}
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  left: '30px',
                  width: `${(currentStepIndex / 3) * 90}%`,
                  height: '2px',
                  backgroundColor: 'var(--color-gold)',
                  zIndex: 2,
                  transition: 'width 0.5s ease'
                }} />

                {statusSteps.map((step, idx) => {
                  const isActive = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;

                  return (
                    <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 3, position: 'relative', width: '60px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: isCurrent ? 'var(--color-gold)' : isActive ? '#1f2833' : '#0b0c10',
                        border: `2px solid ${isActive ? 'var(--color-gold)' : 'var(--border-color)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isCurrent ? 'var(--bg-primary)' : isActive ? 'var(--color-gold)' : 'var(--text-muted)',
                        transition: 'var(--transition-smooth)'
                      }}>
                        {idx === 0 && <Clock size={16} />}
                        {idx === 1 && <Coffee size={16} />}
                        {idx === 2 && <MapPin size={16} />}
                        {idx === 3 && <CheckCircle size={16} />}
                      </div>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: isActive ? 600 : 500,
                        color: isActive ? 'var(--color-gold)' : 'var(--text-muted)',
                        marginTop: '10px',
                        textAlign: 'center',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', border: '1px solid rgba(231,76,60,0.3)', borderRadius: '8px', backgroundColor: 'rgba(231,76,60,0.05)', color: '#e74c3c' }}>
                This order has been cancelled. Please contact the staff for further details.
              </div>
            )}
          </div>

          {/* Items Summary */}
          <div className="glass-panel" style={{ padding: '30px' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--color-gold)', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>Items Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {order.items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontWeight: 600 }}>{item.menuItem?.name || 'Deleted Dish'}</h4>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Qty: {item.quantity} × ${item.price.toFixed(2)}</span>
                  </div>
                  <span style={{ fontWeight: 600 }}>${(item.quantity * item.price).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Details Panel */}
        <div>
          <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--color-gold)', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>Billing Details</h3>

            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Dining Mode</span>
              <p style={{ fontWeight: 600, fontSize: '1.05rem', marginTop: '4px' }}>
                {order.orderType} {order.tableNumber && `(Table ${order.tableNumber})`}
              </p>
            </div>

            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Placed By</span>
              <p style={{ fontWeight: 600, fontSize: '1.05rem', marginTop: '4px' }}>
                {order.user?.name || order.guestName || 'Walk-in Guest'}
              </p>
            </div>

            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Payment Status</span>
              <div style={{ marginTop: '4px' }}>
                <span className={`badge badge-${order.paymentStatus.toLowerCase()}`}>
                  {order.paymentStatus}
                </span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>Total Paid:</span>
              <span style={{ color: 'var(--color-gold)', fontSize: '1.5rem', fontWeight: 'bold' }}>${order.totalAmount.toFixed(2)}</span>
            </div>

            <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
              This page will automatically update as the kitchen processes your request.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderStatus;
