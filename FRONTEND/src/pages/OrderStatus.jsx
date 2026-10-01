import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Clock,
  RefreshCw,
  ChevronLeft,
  MapPin,
  Coffee,
  CheckCircle,
  XCircle,
  CreditCard,
  QrCode,
  Building,
  FileText,
  Printer,
  X,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import PaymentModal from '../components/PaymentModal';
import { API_BASE_URL } from '../config/api';

const OrderStatus = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Cancel Order Modal State
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('Placed order by mistake');
  const [cancelNote, setCancelNote] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState('');

  // Online Payment Modal State
  const [showPayModal, setShowPayModal] = useState(false);

  // Invoice / Bill Modal State
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/${id}`);
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

  const handleCancelSubmit = async (e) => {
    e.preventDefault();
    setCancelling(true);
    setCancelError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/${id}/cancel-user`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          reason: cancelReason,
          note: cancelNote
        })
      });

      const data = await response.json();
      if (data.success) {
        setOrder(data.data);
        setShowCancelModal(false);
      } else {
        setCancelError(data.message || 'Failed to cancel order');
      }
    } catch (err) {
      setCancelError('Connection error. Could not reach server.');
    } finally {
      setCancelling(false);
    }
  };


  const handlePrintInvoice = () => {
    window.print();
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
        <RefreshCw className="spin" size={32} style={{ color: 'var(--color-gold)' }} />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="fade-in page-wrapper" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold)', marginBottom: '16px' }}>Oops!</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>{error || 'We could not load your order details.'}</p>
        <Link to="/menu" className="btn btn-primary">Go back to Menu</Link>
      </div>
    );
  }

  // Statuses: 'Pending', 'Preparing', 'Ready', 'Completed'
  const statusSteps = ['Pending', 'Preparing', 'Ready', 'Completed'];
  const currentStepIndex = statusSteps.indexOf(order.status);
  const canCancel = ['Pending', 'Preparing'].includes(order.status);

  return (
    <div className="fade-in page-wrapper" style={{ maxWidth: '850px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <Link to="/menu" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', color: 'var(--color-gold)' }}>
          <ChevronLeft size={16} /> Back to Menu
        </Link>
        <Link to="/orders" style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          View All Orders
        </Link>
      </div>

      <div className="order-status-layout" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px' }}>
        <div>
          {/* Order Status Tracking Box */}
          <div className="glass-panel" style={{ padding: 'clamp(18px, 4vw, 30px)', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ORDER ID: #{order._id.substring(18)}</span>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.4rem, 3vw, 1.8rem)', marginTop: '2px' }}>Track Your Order</h2>
              </div>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <span className={`badge badge-${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
                <span className={`badge badge-${order.paymentStatus.toLowerCase()}`}>
                  {order.paymentStatus}
                </span>
              </div>
            </div>

            {/* Stepper Timeline */}
            {order.status !== 'Cancelled' ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', margin: '36px 0 20px' }}>
                {/* Connector line */}
                <div style={{
                  position: 'absolute',
                  top: '18px',
                  left: '20px',
                  right: '20px',
                  height: '2px',
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  zIndex: 1
                }} />
                {/* Active connector fill */}
                <div style={{
                  position: 'absolute',
                  top: '18px',
                  left: '20px',
                  width: `${Math.max(0, (currentStepIndex / 3) * 88)}%`,
                  height: '2px',
                  backgroundColor: 'var(--color-gold)',
                  zIndex: 2,
                  transition: 'width 0.5s ease'
                }} />

                {statusSteps.map((step, idx) => {
                  const isActive = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;

                  return (
                    <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 3, position: 'relative', width: '25%' }}>
                      <div className="stepper-circle" style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: isCurrent ? 'var(--color-gold)' : isActive ? '#1f2833' : '#0b0c10',
                        border: `2px solid ${isActive ? 'var(--color-gold)' : 'var(--border-color)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isCurrent ? 'var(--bg-primary)' : isActive ? 'var(--color-gold)' : 'var(--text-muted)',
                        transition: 'var(--transition-smooth)'
                      }}>
                        {idx === 0 && <Clock size={15} />}
                        {idx === 1 && <Coffee size={15} />}
                        {idx === 2 && <MapPin size={15} />}
                        {idx === 3 && <CheckCircle size={15} />}
                      </div>
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: isActive ? 600 : 500,
                        color: isActive ? 'var(--color-gold)' : 'var(--text-muted)',
                        marginTop: '8px',
                        textAlign: 'center',
                        textTransform: 'uppercase',
                        letterSpacing: '0.4px',
                        wordBreak: 'break-word'
                      }}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ padding: '16px', borderRadius: '10px', border: '1px solid rgba(231,76,60,0.3)', backgroundColor: 'rgba(231,76,60,0.08)', color: '#e74c3c', marginTop: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                  <XCircle size={18} /> Order Cancelled
                </div>
                <p style={{ fontSize: '0.86rem', marginTop: '6px', color: '#f5f5f7' }}>
                  <strong>Reason:</strong> {order.cancellationReason || 'Cancelled upon request.'}
                </p>
              </div>
            )}

            {/* Cancel Button if eligible */}
            {canCancel && (
              <div style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="btn btn-danger btn-sm"
                  style={{ gap: '6px', padding: '8px 16px' }}
                >
                  <XCircle size={14} /> Cancel Order
                </button>
              </div>
            )}
          </div>

          {/* Items Summary */}
          <div className="glass-panel" style={{ padding: 'clamp(18px, 4vw, 24px)' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--color-gold)', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              Items Summary
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {order.items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                  <div>
                    <h4 style={{ fontWeight: 600, fontSize: '0.95rem' }}>{item.menuItem?.name || 'Dish Item'}</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Qty: {item.quantity} × ₹{item.price.toFixed(2)}</span>
                  </div>
                  <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>₹{(item.quantity * item.price).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Billing Details Panel */}
        <div>
          <div className="glass-panel" style={{ padding: 'clamp(18px, 4vw, 24px)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--color-gold)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              Billing Details
            </h3>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Dining Mode</span>
              <p style={{ fontWeight: 600, fontSize: '0.98rem', marginTop: '2px' }}>
                {order.orderType} {order.tableNumber && `(Table ${order.tableNumber})`}
              </p>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Placed By</span>
              <p style={{ fontWeight: 600, fontSize: '0.98rem', marginTop: '2px' }}>
                {order.user?.name || order.guestName || 'Walk-in Guest'}
              </p>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Payment Mode</span>
              <p style={{ fontWeight: 600, fontSize: '0.92rem', marginTop: '2px' }}>
                {order.paymentMethod || 'Cash / Counter'} {order.transactionId && `(${order.transactionId})`}
              </p>
            </div>

            {/* Price breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.88rem', color: 'var(--text-muted)', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal:</span>
                <span>₹{(order.subtotalAmount || (order.totalAmount / 1.05)).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>GST / Tax (5%):</span>
                <span>₹{(order.taxAmount || (order.totalAmount - (order.totalAmount / 1.05))).toFixed(2)}</span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.05rem', fontWeight: 600 }}>Total Amount:</span>
              <span style={{ color: 'var(--color-gold)', fontSize: '1.35rem', fontWeight: 'bold' }}>₹{order.totalAmount.toFixed(2)}</span>
            </div>

            {/* Pay Online Button if Unpaid */}
            {order.paymentStatus === 'Unpaid' && order.status !== 'Cancelled' && (
              <button
                onClick={() => setShowPayModal(true)}
                className="btn btn-primary"
                style={{ width: '100%', gap: '6px', padding: '11px', fontSize: '0.9rem' }}
              >
                <CreditCard size={16} /> Pay Online Now (₹{order.totalAmount.toFixed(2)})
              </button>
            )}

            {/* View Invoice / Bill Button */}
            <button
              onClick={() => setShowInvoiceModal(true)}
              className="btn btn-secondary"
              style={{ width: '100%', gap: '6px', padding: '10px', fontSize: '0.85rem' }}
            >
              <FileText size={15} /> View Full Bill / Tax Invoice
            </button>

            <div style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>
              Live real-time operational status updates automatically.
            </div>
          </div>
        </div>
      </div>

      {/* User Cancellation Modal */}
      {showCancelModal && (
        <div
          className="cancel-modal-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={() => setShowCancelModal(false)}
        >
          <div
            className="glass-panel fade-in"
            style={{
              maxWidth: '460px',
              width: '100%',
              padding: '26px',
              borderRadius: '16px',
              border: '1px solid #e74c3c',
              backgroundColor: 'rgba(20, 24, 32, 0.98)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#e74c3c' }}>
                <AlertTriangle size={22} />
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: '#f5f5f7' }}>Cancel Food Order</h3>
              </div>
              <button onClick={() => setShowCancelModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '18px' }}>
              Please select the reason for cancelling your order. Your reserved table will also be released.
            </p>

            {cancelError && (
              <div style={{ color: '#e63946', backgroundColor: 'rgba(230, 57, 70, 0.1)', padding: '10px', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '16px', border: '1px solid rgba(230, 57, 70, 0.2)' }}>
                {cancelError}
              </div>
            )}

            <form onSubmit={handleCancelSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
                {[
                  'Placed order by mistake',
                  'Want to change items or quantities',
                  'Wait time is taking too long',
                  'Changed dining preference / plans',
                  'Other reason'
                ].map((reasonOption) => (
                  <label
                    key={reasonOption}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      backgroundColor: cancelReason === reasonOption ? 'rgba(231, 76, 60, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                      border: cancelReason === reasonOption ? '1px solid #e74c3c' : '1px solid var(--border-color)',
                      cursor: 'pointer',
                      fontSize: '0.88rem'
                    }}
                  >
                    <input
                      type="radio"
                      name="cancelReason"
                      value={reasonOption}
                      checked={cancelReason === reasonOption}
                      onChange={(e) => setCancelReason(e.target.value)}
                      style={{ accentColor: '#e74c3c' }}
                    />
                    <span>{reasonOption}</span>
                  </label>
                ))}
              </div>

              {cancelReason === 'Other reason' && (
                <div className="form-group">
                  <label className="form-label" htmlFor="cancel-note">Additional Note (Optional)</label>
                  <textarea
                    id="cancel-note"
                    rows={2}
                    placeholder="Tell us what happened..."
                    value={cancelNote}
                    onChange={(e) => setCancelNote(e.target.value)}
                    className="form-input"
                    style={{ resize: 'none' }}
                  />
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setShowCancelModal(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1, padding: '10px' }}
                >
                  Keep Order
                </button>
                <button
                  type="submit"
                  disabled={cancelling}
                  className="btn btn-danger"
                  style={{ flex: 1, padding: '10px' }}
                >
                  {cancelling ? 'Cancelling...' : 'Confirm Cancel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Online Payment Modal */}
      <PaymentModal
        isOpen={showPayModal}
        onClose={() => setShowPayModal(false)}
        order={order}
        onPaymentSuccess={(updatedOrder) => {
          setOrder(updatedOrder);
          setShowPayModal(false);
        }}
        customerInfo={{
          name: order.user?.name || order.guestName,
          email: order.user?.email,
          phone: order.user?.phone
        }}
      />

      {/* Bill / Tax Invoice Modal */}
      {showInvoiceModal && (
        <div
          className="invoice-modal-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={() => setShowInvoiceModal(false)}
        >
          <div
            className="glass-panel fade-in printable-invoice-card"
            style={{
              maxWidth: '680px',
              width: '100%',
              padding: '22px 26px',
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              backgroundColor: '#0d1117',
              maxHeight: '92vh',
              overflowY: 'auto',
              boxShadow: '0 25px 60px rgba(0,0,0,0.9)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Actions Header (Hidden in Print) */}
            <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={18} style={{ color: 'var(--color-gold)' }} />
                <span style={{ fontWeight: 600, fontSize: '0.98rem', color: 'var(--text-primary)' }}>Official Tax Invoice (1 Page Layout)</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  onClick={handlePrintInvoice}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', fontSize: '0.82rem' }}
                >
                  <Printer size={14} /> Print Bill (1 Page)
                </button>
                <button onClick={() => setShowInvoiceModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px', display: 'flex' }}>
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Print Container (Self-contained 1 page printable layout) */}
            <div className="invoice-print-container" style={{ padding: '2px 0' }}>
              {/* Restaurant Header */}
              <div style={{ textAlign: 'center', marginBottom: '12px', borderBottom: '2px solid rgba(197, 168, 128, 0.4)', paddingBottom: '10px' }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold)', fontSize: '1.55rem', margin: '0 0 2px 0', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                  L'AURA GASTRONOMY
                </h2>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-primary)', fontWeight: 600, letterSpacing: '0.5px' }}>
                  Haute Cuisine & Fine Dining Experience
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  GSTIN: 07AAACL1234F1Z5 • FSSAI Lic. No: 10018011000123
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  104 Heritage Boulevard, Fine Dining District • Ph: +1 (555) 019-2834
                </div>
                <div style={{ marginTop: '6px' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '2px 10px',
                    borderRadius: '12px',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    letterSpacing: '0.8px',
                    textTransform: 'uppercase',
                    backgroundColor: 'rgba(197, 168, 128, 0.15)',
                    color: 'var(--color-gold)',
                    border: '1px solid rgba(197, 168, 128, 0.3)'
                  }}>
                    Official Tax Invoice / Cash Receipt
                  </span>
                </div>
              </div>

              {/* Invoice Metadata - Balanced 2-column info */}
              <div
                className="invoice-info-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.05fr 0.95fr',
                  gap: '10px 18px',
                  fontSize: '0.82rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.06)',
                  marginBottom: '12px'
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '5px 10px', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Invoice No:</span>
                  <strong style={{ color: 'var(--color-gold)', letterSpacing: '0.3px' }}>{order.invoiceNumber || `INV-${new Date().getFullYear()}-${order._id.substring(18).toUpperCase()}`}</strong>

                  <span style={{ color: 'var(--text-muted)' }}>Order Ref:</span>
                  <strong>#{order._id.substring(18)}</strong>

                  <span style={{ color: 'var(--text-muted)' }}>Date & Time:</span>
                  <span>{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>

                  <span style={{ color: 'var(--text-muted)' }}>Dining Mode:</span>
                  <strong>{order.orderType} {order.tableNumber && `(Table ${order.tableNumber})`}</strong>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '5px 10px', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Billed To:</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{order.user?.name || order.guestName || 'Walk-in Guest'}</strong>

                  <span style={{ color: 'var(--text-muted)' }}>Customer:</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{order.user?.email || 'Registered Guest'}</span>

                  <span style={{ color: 'var(--text-muted)' }}>Payment Mode:</span>
                  <strong>{order.paymentMethod || 'Cash / Counter'}</strong>

                  <span style={{ color: 'var(--text-muted)' }}>Status:</span>
                  <div>
                    <span style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      backgroundColor: order.paymentStatus === 'Paid' ? 'rgba(46, 204, 113, 0.15)' : 'rgba(231, 76, 60, 0.15)',
                      color: order.paymentStatus === 'Paid' ? '#2ecc71' : '#e74c3c',
                      border: `1px solid ${order.paymentStatus === 'Paid' ? 'rgba(46, 204, 113, 0.3)' : 'rgba(231, 76, 60, 0.3)'}`
                    }}>
                      {order.paymentStatus === 'Paid' ? 'PAID' : 'UNPAID'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Structured Itemized Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', marginBottom: '12px' }}>
                <thead>
                  <tr style={{ borderBottom: '1.5px solid var(--border-color)', backgroundColor: 'rgba(197, 168, 128, 0.08)' }}>
                    <th style={{ textAlign: 'center', padding: '6px 4px', color: 'var(--color-gold)', width: '8%' }}>#</th>
                    <th style={{ textAlign: 'left', padding: '6px 8px', color: 'var(--color-gold)', width: '50%' }}>Item Description</th>
                    <th style={{ textAlign: 'center', padding: '6px 4px', color: 'var(--color-gold)', width: '12%' }}>Qty</th>
                    <th style={{ textAlign: 'right', padding: '6px 6px', color: 'var(--color-gold)', width: '15%' }}>Rate (₹)</th>
                    <th style={{ textAlign: 'right', padding: '6px 6px', color: 'var(--color-gold)', width: '15%' }}>Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((it, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ textAlign: 'center', padding: '6px 4px', color: 'var(--text-muted)' }}>{idx + 1}</td>
                      <td style={{ padding: '6px 8px', color: 'var(--text-primary)' }}>
                        <div style={{ fontWeight: 600 }}>{it.menuItem?.name || 'Dish Item'}</div>
                        {it.menuItem?.category && (
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{it.menuItem.category}</div>
                        )}
                      </td>
                      <td style={{ textAlign: 'center', padding: '6px 4px', fontWeight: 600 }}>{it.quantity}</td>
                      <td style={{ textAlign: 'right', padding: '6px 6px' }}>₹{it.price?.toFixed(2)}</td>
                      <td style={{ textAlign: 'right', padding: '6px 6px', fontWeight: 600 }}>₹{(it.quantity * it.price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Price Calculations & Tax Summary (Balanced 2-column bottom) */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1.1fr 0.9fr',
                gap: '12px',
                alignItems: 'start',
                borderTop: '1px dashed var(--border-color)',
                paddingTop: '10px',
                marginBottom: '10px'
              }}>
                {/* Notes & GST Terms */}
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '3px' }}>GST & Tax Terms:</div>
                  <div>• 5% Composite Dining GST applicable (2.5% CGST + 2.5% SGST).</div>
                  <div>• Items once ordered and prepared cannot be refunded.</div>
                </div>

                {/* Totals Breakdown */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.82rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                    <span>Food Subtotal:</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>₹{(order.subtotalAmount || (order.totalAmount / 1.05)).toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                    <span>CGST (2.5%):</span>
                    <span style={{ color: 'var(--text-primary)' }}>₹{((order.taxAmount || (order.totalAmount - (order.totalAmount / 1.05))) / 2).toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                    <span>SGST (2.5%):</span>
                    <span style={{ color: 'var(--text-primary)' }}>₹{((order.taxAmount || (order.totalAmount - (order.totalAmount / 1.05))) / 2).toFixed(2)}</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    borderTop: '1.5px solid var(--border-color)',
                    paddingTop: '6px',
                    marginTop: '2px'
                  }}>
                    <span>Grand Total:</span>
                    <span style={{ color: 'var(--color-gold)' }}>₹{order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Official Receipt Footer */}
              <div style={{
                textAlign: 'center',
                fontSize: '0.72rem',
                color: 'var(--text-muted)',
                borderTop: '1px dashed var(--border-color)',
                paddingTop: '8px'
              }}>
                <p style={{ fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 2px 0' }}>
                  Thank you for dining with L'AURA! Please visit us again.
                </p>
                <p style={{ margin: 0, fontSize: '0.68rem' }}>Computer Generated Tax Receipt • No physical signature required.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 800px) {
          .order-status-layout {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 540px) {
          .invoice-info-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media print {
          html, body {
            background: #ffffff !important;
            color: #000000 !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body * {
            visibility: hidden;
          }
          .invoice-modal-overlay,
          .printable-invoice-card,
          .invoice-print-container,
          .invoice-print-container * {
            visibility: visible;
          }
          .invoice-modal-overlay {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: auto !important;
            background: none !important;
            padding: 0 !important;
            margin: 0 !important;
            display: block !important;
          }
          .printable-invoice-card {
            box-shadow: none !important;
            border: 1px solid #111111 !important;
            background: #ffffff !important;
            color: #000000 !important;
            max-width: 100% !important;
            width: 100% !important;
            padding: 8mm 12mm !important;
            margin: 0 auto !important;
            page-break-inside: avoid !important;
            page-break-after: avoid !important;
            max-height: none !important;
            border-radius: 0 !important;
          }
          .invoice-print-container * {
            color: #000000 !important;
            border-color: #333333 !important;
          }
          .no-print {
            display: none !important;
          }
          @page {
            size: A4 portrait;
            margin: 6mm 10mm;
          }
        }
      `}</style>
    </div>
  );
};

export default OrderStatus;
