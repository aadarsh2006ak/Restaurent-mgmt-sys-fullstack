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
  Building,
  FileText,
  Printer,
  X,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Utensils
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
      <div className="fade-in page-wrapper" style={{ maxWidth: '600px', margin: '40px auto', textAlign: 'center' }}>
        <div className="glass-panel" style={{ padding: '36px 20px', borderRadius: '18px' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold)', marginBottom: '12px' }}>Order Not Found</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '0.9rem' }}>{error || 'We could not load your order details.'}</p>
          <Link to="/menu" className="btn btn-primary">Go back to Menu</Link>
        </div>
      </div>
    );
  }

  // Statuses: 'Pending', 'Preparing', 'Ready', 'Completed'
  const statusSteps = ['Pending', 'Preparing', 'Ready', 'Completed'];
  const currentStepIndex = statusSteps.indexOf(order.status);
  const canCancel = ['Pending', 'Preparing'].includes(order.status);

  return (
    <div className="fade-in page-wrapper" style={{ maxWidth: '880px', margin: '0 auto' }}>
      {/* Top Header Row */}
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <Link to="/menu" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--color-gold)', fontWeight: 600 }}>
          <ChevronLeft size={16} /> Back to Menu
        </Link>
        <Link to="/orders" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          View All Orders
        </Link>
      </div>

      <div className="order-status-responsive-grid">
        {/* Left Column: Live Stepper & Items */}
        <div>
          {/* Order Status Tracking Box */}
          <div className="glass-panel" style={{ padding: 'clamp(18px, 4vw, 28px)', marginBottom: '20px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>ORDER ID: #{order._id.substring(18)}</span>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.4rem, 3.5vw, 1.8rem)', marginTop: '2px' }}>Track Order</h2>
              </div>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
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
              <div className="order-stepper-container">
                {/* Background Track */}
                <div className="stepper-track-bg" />
                
                {/* Active Progress Fill */}
                <div
                  className="stepper-track-fill"
                  style={{
                    width: `${Math.max(0, (currentStepIndex / 3) * 82)}%`
                  }}
                />

                {statusSteps.map((step, idx) => {
                  const isActive = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;

                  return (
                    <div key={step} className="stepper-step-item">
                      <div className={`stepper-node-circle ${isCurrent ? 'current' : isActive ? 'active' : 'inactive'}`}>
                        {idx === 0 && <Clock size={14} />}
                        {idx === 1 && <Coffee size={14} />}
                        {idx === 2 && <MapPin size={14} />}
                        {idx === 3 && <CheckCircle size={14} />}
                      </div>
                      <span className={`stepper-step-label ${isActive ? 'active' : 'inactive'}`}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ padding: '14px', borderRadius: '10px', border: '1px solid rgba(231,76,60,0.3)', backgroundColor: 'rgba(231,76,60,0.08)', color: '#e74c3c', marginTop: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: '0.95rem' }}>
                  <XCircle size={18} /> Order Cancelled
                </div>
                <p style={{ fontSize: '0.84rem', marginTop: '4px', color: '#f5f5f7' }}>
                  <strong>Reason:</strong> {order.cancellationReason || 'Cancelled upon request.'}
                </p>
              </div>
            )}

            {/* Cancel Button if eligible */}
            {canCancel && (
              <div style={{ marginTop: '18px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '14px', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="btn btn-danger btn-sm"
                  style={{ gap: '6px' }}
                >
                  <XCircle size={14} /> Cancel Order
                </button>
              </div>
            )}
          </div>

          {/* Items Summary Card */}
          <div className="glass-panel" style={{ padding: 'clamp(16px, 3.5vw, 24px)', borderRadius: '16px' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--color-gold)', marginBottom: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              Ordered Items ({order.items.reduce((acc, i) => acc + i.quantity, 0)})
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: idx !== order.items.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                      <span style={{ color: 'var(--color-gold)', marginRight: '6px' }}>{item.quantity}×</span>
                      {item.menuItem?.name || 'Dish Item'}
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      ₹{(item.price || 0).toFixed(2)} each
                    </span>
                  </div>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                    ₹{((item.price || 0) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary, Invoicing & Actions */}
        <div>
          <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--color-gold)', marginBottom: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              Order Details
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.86rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Dining Type:</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{order.orderType}</span>
              </div>
              {order.tableNumber && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Table Number:</span>
                  <span style={{ color: 'var(--color-gold)', fontWeight: 700 }}>Table {order.tableNumber}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Order Time:</span>
                <span style={{ color: 'var(--text-primary)' }}>{new Date(order.createdAt).toLocaleTimeString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Payment Mode:</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{order.paymentMethod || 'Cash'}</span>
              </div>

              {/* Price Breakdown */}
              <div style={{ borderTop: '1px dashed rgba(255,255,255,0.08)', paddingTop: '10px', marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Subtotal:</span>
                  <span>₹{(order.subtotalAmount || (order.totalAmount / 1.05)).toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>GST & Tax (5%):</span>
                  <span>₹{(order.taxAmount || (order.totalAmount - (order.totalAmount / 1.05))).toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 'bold', borderTop: '1px solid var(--border-color)', paddingTop: '8px', color: 'var(--color-gold)' }}>
                  <span>Grand Total:</span>
                  <span>₹{order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div style={{ marginTop: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* Pay Now Button if Unpaid */}
              {order.paymentStatus === 'Unpaid' && order.status !== 'Cancelled' && (
                <button
                  onClick={() => setShowPayModal(true)}
                  className="btn btn-primary"
                  style={{ width: '100%', gap: '6px', padding: '11px', fontSize: '0.88rem' }}
                >
                  <CreditCard size={15} /> Pay Bill Online (₹{order.totalAmount.toFixed(2)})
                </button>
              )}

              {/* Tax Invoice / Receipt Button */}
              <button
                onClick={() => setShowInvoiceModal(true)}
                className="btn btn-secondary"
                style={{ width: '100%', gap: '6px', padding: '10px', fontSize: '0.84rem' }}
              >
                <FileText size={15} /> View Tax Invoice / Bill
              </button>
            </div>
          </div>
        </div>
      </div>

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
          name: order.guestName || 'Valued Guest'
        }}
      />

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div
          className="order-modal-backdrop fade-in"
          onClick={() => setShowCancelModal(false)}
        >
          <div
            className="glass-panel order-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: '#e74c3c', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertTriangle size={18} /> Cancel Order
              </h3>
              <button onClick={() => setShowCancelModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}>
                <X size={18} />
              </button>
            </div>

            {cancelError && (
              <div style={{ color: '#e63946', backgroundColor: 'rgba(230, 57, 70, 0.1)', padding: '10px', borderRadius: '6px', fontSize: '0.84rem', marginBottom: '12px' }}>
                {cancelError}
              </div>
            )}

            <form onSubmit={handleCancelSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="cancel-reason">Reason for Cancellation</label>
                <select
                  id="cancel-reason"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="form-input"
                  style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                >
                  <option value="Placed order by mistake">Placed order by mistake</option>
                  <option value="Changed dining preference">Changed dining preference</option>
                  <option value="Wait time too long">Wait time too long</option>
                  <option value="Want to change ordered dishes">Want to change ordered dishes</option>
                  <option value="Other reason">Other reason</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="cancel-note">Additional Note (Optional)</label>
                <textarea
                  id="cancel-note"
                  rows={2}
                  placeholder="Tell our staff why..."
                  value={cancelNote}
                  onChange={(e) => setCancelNote(e.target.value)}
                  className="form-input"
                  style={{ resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setShowCancelModal(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1, padding: '9px' }}
                >
                  Keep Order
                </button>
                <button
                  type="submit"
                  disabled={cancelling}
                  className="btn btn-danger"
                  style={{ flex: 1, padding: '9px' }}
                >
                  {cancelling ? 'Cancelling...' : 'Confirm Cancel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tax Invoice Modal */}
      {showInvoiceModal && (
        <div
          className="order-modal-backdrop fade-in invoice-modal-overlay"
          onClick={() => setShowInvoiceModal(false)}
        >
          <div
            className="glass-panel printable-invoice-card"
            style={{
              maxWidth: '680px',
              width: '100%',
              padding: '22px 24px',
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              backgroundColor: '#0d1117',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 60px rgba(0,0,0,0.9)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Actions Header (Hidden in Print) */}
            <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileText size={16} style={{ color: 'var(--color-gold)' }} />
                <span style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-primary)' }}>Customer Tax Invoice</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  onClick={handlePrintInvoice}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', fontSize: '0.82rem' }}
                >
                  <Printer size={13} /> Print Bill
                </button>
                <button onClick={() => setShowInvoiceModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px', display: 'flex' }}>
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Print Container */}
            <div className="invoice-print-container">
              {/* Restaurant Header */}
              <div style={{ textAlign: 'center', marginBottom: '12px', borderBottom: '2px solid rgba(197, 168, 128, 0.4)', paddingBottom: '10px' }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold)', fontSize: '1.5rem', margin: '0 0 2px 0', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                  L'AURA GASTRONOMY
                </h2>
                <p style={{ margin: '0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Fine Indian & Chinese Fine Dining Experience
                </p>
                <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  GSTIN: <strong>07AAAAA0000A1Z5</strong> • FSSAI Lic No: <strong>10020011000123</strong>
                </p>
              </div>

              {/* Invoice Meta Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
                fontSize: '0.8rem',
                backgroundColor: 'rgba(255,255,255,0.02)',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.05)',
                marginBottom: '12px'
              }} className="invoice-info-grid">
                <div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Invoice No:</span> <strong style={{ color: 'var(--color-gold)' }}>{order.invoiceNumber || `INV-${order._id.substring(18)}`}</strong></div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Date:</span> {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}</div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Dining Type:</span> {order.orderType} {order.tableNumber && `(Table ${order.tableNumber})`}</div>
                </div>
                <div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Customer:</span> <strong>{order.user?.name || order.guestName || 'Valued Guest'}</strong></div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Payment Mode:</span> {order.paymentMethod || 'Cash'}</div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Payment Status:</span> <strong style={{ color: order.paymentStatus === 'Paid' ? '#2ecc71' : '#e74c3c' }}>{order.paymentStatus}</strong></div>
                </div>
              </div>

              {/* Items Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', marginBottom: '12px' }}>
                <thead>
                  <tr style={{ borderBottom: '1.5px solid var(--border-color)', color: 'var(--color-gold)' }}>
                    <th style={{ textAlign: 'left', padding: '6px 4px' }}>Item Description</th>
                    <th style={{ textAlign: 'center', padding: '6px 4px' }}>Qty</th>
                    <th style={{ textAlign: 'right', padding: '6px 4px' }}>Rate</th>
                    <th style={{ textAlign: 'right', padding: '6px 4px' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '6px 4px' }}>
                        <div style={{ fontWeight: 600 }}>{item.menuItem?.name || 'Dish Item'}</div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{item.menuItem?.category || 'Culinary'}</span>
                      </td>
                      <td style={{ textAlign: 'center', padding: '6px 4px' }}>{item.quantity}</td>
                      <td style={{ textAlign: 'right', padding: '6px 4px' }}>₹{(item.price || 0).toFixed(2)}</td>
                      <td style={{ textAlign: 'right', padding: '6px 4px', fontWeight: 600 }}>₹{((item.price || 0) * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Price Calculations & Tax Summary */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                alignItems: 'start',
                borderTop: '1px dashed var(--border-color)',
                paddingTop: '8px',
                marginBottom: '10px'
              }} className="invoice-info-grid">
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>GST & Tax Terms:</div>
                  <div>• 5% Composite Dining GST (2.5% CGST + 2.5% SGST).</div>
                  <div>• Computer generated tax receipt.</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '0.82rem' }}>
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
                    fontSize: '1.05rem',
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

              {/* Receipt Footer */}
              <div style={{
                textAlign: 'center',
                fontSize: '0.72rem',
                color: 'var(--text-muted)',
                borderTop: '1px dashed var(--border-color)',
                paddingTop: '6px'
              }}>
                <p style={{ fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                  Thank you for dining with L'AURA! Please visit us again.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .order-status-responsive-grid {
          display: grid;
          grid-template-columns: 1.35fr 1fr;
          gap: 20px;
          align-items: start;
        }

        .order-stepper-container {
          display: flex;
          justify-content: space-between;
          position: relative;
          margin: 32px 0 16px;
        }

        .stepper-track-bg {
          position: absolute;
          top: 18px;
          left: 20px;
          right: 20px;
          height: 2px;
          background-color: rgba(255,255,255,0.08);
          z-index: 1;
        }

        .stepper-track-fill {
          position: absolute;
          top: 18px;
          left: 20px;
          height: 2px;
          background-color: var(--color-gold);
          z-index: 2;
          transition: width 0.5s ease;
        }

        .stepper-step-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 3;
          position: relative;
          width: 25%;
        }

        .stepper-node-circle {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition-smooth);
        }

        .stepper-node-circle.current {
          background-color: var(--color-gold);
          border: 2px solid var(--color-gold);
          color: var(--bg-primary);
          box-shadow: 0 0 14px rgba(197, 168, 128, 0.6);
        }

        .stepper-node-circle.active {
          background-color: #1f2833;
          border: 2px solid var(--color-gold);
          color: var(--color-gold);
        }

        .stepper-node-circle.inactive {
          background-color: #0b0c10;
          border: 2px solid var(--border-color);
          color: var(--text-muted);
        }

        .stepper-step-label {
          font-size: 0.72rem;
          margin-top: 6px;
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .stepper-step-label.active {
          color: var(--color-gold);
          font-weight: 700;
        }

        .stepper-step-label.inactive {
          color: var(--text-muted);
          font-weight: 500;
        }

        .order-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(8px);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }

        .order-modal-box {
          max-width: 440px;
          width: 100%;
          padding: 22px;
          border-radius: 16px;
          border: 1px solid var(--border-color);
          background: rgba(20, 24, 33, 0.96);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8);
        }

        @media (max-width: 768px) {
          .order-status-responsive-grid {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 480px) {
          .stepper-node-circle {
            width: 30px;
            height: 30px;
          }
          .stepper-track-bg, .stepper-track-fill {
            top: 15px;
          }
          .stepper-step-label {
            font-size: 0.65rem;
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
