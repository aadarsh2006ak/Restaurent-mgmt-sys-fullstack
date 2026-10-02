import React, { useState, useEffect, useContext } from 'react';
import { AdminAuthContext } from '../context/AdminAuthContext';
import { API_BASE_URL } from '../config/api';
import { RefreshCw, Clipboard, CreditCard, Clock, FileText, Printer, X, Check, AlertCircle } from 'lucide-react';

const AdminOrders = () => {
  const { adminToken } = useContext(AdminAuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [updatingId, setUpdatingId] = useState(null);

  // Invoice modal state
  const [invoiceOrder, setInvoiceOrder] = useState(null);
  const [generatingInvoice, setGeneratingInvoice] = useState(false);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
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
      const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await response.json();
      if (data.success) {
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
      const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/payment`, {
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

  const handleGenerateInvoice = async (order) => {
    setGeneratingInvoice(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/${order._id}/generate-invoice`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${adminToken}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o._id === order._id ? data.data : o))
        );
        setInvoiceOrder(data.data);
      }
    } catch (err) {
      console.error('Error generating invoice', err);
    } finally {
      setGeneratingInvoice(false);
    }
  };

  const filteredOrders = filterStatus === 'All'
    ? orders
    : orders.filter((order) => order.status === filterStatus);

  const statuses = ['All', 'Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'];

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', color: 'var(--color-gold)' }}>
            Live Orders Board
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>
            Manage kitchen dispatch, print GST tax invoices, and track payments.
          </p>
        </div>
        <button
          onClick={() => { setLoading(true); fetchOrders(); }}
          className="btn btn-secondary btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <RefreshCw size={13} className={loading ? 'spin' : ''} /> Sync Board
        </button>
      </div>

      {/* Tabs with smooth horizontal touch scroll */}
      <div
        className="hide-scrollbar"
        style={{
          display: 'flex',
          gap: '6px',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '10px',
          marginBottom: '18px',
          overflowX: 'auto',
          maxWidth: '100%',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {statuses.map((status) => {
          const isActive = filterStatus === status;
          const count = status === 'All' ? orders.length : orders.filter(o => o.status === status).length;

          return (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-secondary'}`}
              style={{
                textTransform: 'uppercase',
                letterSpacing: '0.4px',
                flexShrink: 0,
                fontSize: '0.78rem',
                padding: '5px 12px'
              }}
            >
              {status} ({count})
            </button>
          );
        })}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <div className="spin" style={{
            width: '32px',
            height: '32px',
            border: '2px solid rgba(197, 168, 128, 0.1)',
            borderTopColor: 'var(--color-gold)',
            borderRadius: '50%'
          }} />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="glass-panel" style={{ padding: '48px 20px', textAlign: 'center', borderRadius: '14px' }}>
          <Clipboard size={36} style={{ color: 'var(--color-gold)', opacity: 0.5, marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.15rem', color: 'var(--text-muted)' }}>No orders in this status currently.</h3>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredOrders.map((order) => (
            <div key={order._id} className="glass-panel" style={{ padding: 'clamp(14px, 3vw, 20px)', borderRadius: '14px' }}>
              {/* Card Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px', marginBottom: '12px' }}>
                <div style={{ flex: '1 1 240px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>Order #{order._id.substring(18)}</span>
                    <span className={`badge badge-${order.status.toLowerCase()}`}>{order.status}</span>
                    <span className={`badge badge-${order.paymentStatus.toLowerCase()}`}>{order.paymentStatus}</span>
                    {order.paymentGateway && order.paymentGateway !== 'None' && (
                      <span style={{ fontSize: '0.68rem', backgroundColor: 'rgba(52, 152, 219, 0.15)', color: '#3498db', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(52, 152, 219, 0.3)', fontWeight: 600 }}>
                        {order.paymentGateway}
                      </span>
                    )}
                    {order.invoiceNumber && (
                      <span style={{ fontSize: '0.68rem', backgroundColor: 'rgba(197, 168, 128, 0.12)', color: 'var(--color-gold)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--border-color)', fontWeight: 600 }}>
                        {order.invoiceNumber}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '6px', fontSize: '0.8rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                    <span>
                      Type: <strong>{order.orderType}</strong> {order.tableNumber && `(Table ${order.tableNumber})`}
                    </span>
                    <span>
                      Customer: <strong>{order.user?.name || order.guestName || 'Walk-in Guest'}</strong>
                    </span>
                    <span>
                      Payment: <strong>{order.paymentMethod || 'Cash'}</strong>
                    </span>
                    {order.transactionId && (
                      <span>
                        Txn ID: <strong style={{ color: 'var(--color-gold)' }}>{order.transactionId}</strong>
                      </span>
                    )}
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} /> {new Date(order.createdAt).toLocaleTimeString()}
                    </span>
                  </div>

                  {/* Customer Cancellation Reason Banner */}
                  {order.status === 'Cancelled' && (
                    <div style={{ marginTop: '8px', padding: '8px 10px', borderRadius: '6px', backgroundColor: 'rgba(231, 76, 60, 0.1)', border: '1px solid rgba(231, 76, 60, 0.3)', color: '#e74c3c', fontSize: '0.8rem' }}>
                      <strong>Cancellation Note ({order.cancelledBy || 'User'}):</strong> {order.cancellationReason || 'No specific reason provided.'}
                    </div>
                  )}
                </div>
                
                <div style={{ textAlign: 'right', marginLeft: 'auto' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Total Bill</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-gold)' }}>₹{order.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Items List */}
              <div style={{ marginBottom: '14px' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                  Dish Items ({order.items.reduce((acc, i) => acc + i.quantity, 0)})
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 180px), 1fr))', gap: '8px' }}>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={{ padding: '7px 10px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '0.84rem' }}>
                      <strong>{item.quantity}×</strong> {item.menuItem?.name || 'Dish Item'}
                      <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {item.menuItem?.category || 'Culinary'} • ₹{(item.price || 0).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons Responsive Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '12px' }}>
                {/* Kitchen Status triggers */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
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
                      Cancel
                    </button>
                  )}
                </div>

                {/* Billing & Cashier actions */}
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginLeft: 'auto', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => {
                      if (order.invoiceNumber) {
                        setInvoiceOrder(order);
                      } else {
                        handleGenerateInvoice(order);
                      }
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ gap: '4px' }}
                  >
                    <FileText size={12} /> {order.invoiceNumber ? 'View Invoice' : 'Generate Bill'}
                  </button>

                  {order.paymentStatus === 'Unpaid' ? (
                    <button
                      onClick={() => updatePayment(order._id, 'Paid')}
                      disabled={updatingId === order._id}
                      className="btn btn-secondary btn-sm"
                      style={{ color: '#2ecc71', borderColor: 'rgba(46,204,113,0.3)', gap: '4px' }}
                    >
                      <CreditCard size={12} /> Mark as Paid
                    </button>
                  ) : (
                    <button
                      onClick={() => updatePayment(order._id, 'Unpaid')}
                      disabled={updatingId === order._id}
                      className="btn btn-secondary btn-sm"
                      style={{ color: '#e74c3c', borderColor: 'rgba(231,76,60,0.3)', gap: '4px' }}
                    >
                      <CreditCard size={12} /> Mark as Unpaid
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Admin Invoice Preview & Print Modal */}
      {invoiceOrder && (
        <div
          className="admin-invoice-modal-overlay"
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
          onClick={() => setInvoiceOrder(null)}
        >
          <div
            className="glass-panel fade-in printable-invoice-card"
            style={{
              maxWidth: '660px',
              width: '100%',
              padding: '20px 24px',
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
                <span style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-primary)' }}>Customer Tax Invoice (A4 1-Page)</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  onClick={() => window.print()}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 12px', fontSize: '0.8rem' }}
                >
                  <Printer size={13} /> Print Bill
                </button>
                <button onClick={() => setInvoiceOrder(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px', display: 'flex' }}>
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Print Container */}
            <div className="invoice-print-container">
              {/* Restaurant Header */}
              <div style={{ textAlign: 'center', marginBottom: '10px', borderBottom: '2px solid rgba(197, 168, 128, 0.4)', paddingBottom: '8px' }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold)', fontSize: '1.5rem', margin: '0 0 2px 0', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                  L'AURA GASTRONOMY
                </h2>
                <p style={{ margin: '0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Fine Indian & Chinese Culinary Destination
                </p>
                <p style={{ margin: '2px 0 0', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  GSTIN: <strong>07AAAAA0000A1Z5</strong> • FSSAI Lic No: <strong>10020011000123</strong>
                </p>
              </div>

              {/* Invoice Meta Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                fontSize: '0.8rem',
                backgroundColor: 'rgba(255,255,255,0.02)',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.05)',
                marginBottom: '10px'
              }} className="invoice-info-grid">
                <div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Invoice No:</span> <strong style={{ color: 'var(--color-gold)' }}>{invoiceOrder.invoiceNumber || `INV-${invoiceOrder._id.substring(18)}`}</strong></div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Date:</span> {new Date(invoiceOrder.createdAt).toLocaleDateString()} {new Date(invoiceOrder.createdAt).toLocaleTimeString()}</div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Dining Type:</span> {invoiceOrder.orderType} {invoiceOrder.tableNumber && `(Table ${invoiceOrder.tableNumber})`}</div>
                </div>
                <div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Customer:</span> <strong>{invoiceOrder.user?.name || invoiceOrder.guestName || 'Valued Guest'}</strong></div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Payment:</span> {invoiceOrder.paymentMethod || 'Cash'}</div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Payment Status:</span> <strong style={{ color: invoiceOrder.paymentStatus === 'Paid' ? '#2ecc71' : '#e74c3c' }}>{invoiceOrder.paymentStatus}</strong></div>
                </div>
              </div>

              {/* Items Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', marginBottom: '10px' }}>
                <thead>
                  <tr style={{ borderBottom: '1.5px solid var(--border-color)', color: 'var(--color-gold)' }}>
                    <th style={{ textAlign: 'left', padding: '6px 4px' }}>Item Description</th>
                    <th style={{ textAlign: 'center', padding: '6px 4px' }}>Qty</th>
                    <th style={{ textAlign: 'right', padding: '6px 4px' }}>Rate</th>
                    <th style={{ textAlign: 'right', padding: '6px 4px' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceOrder.items.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '6px 4px' }}>
                        <div style={{ fontWeight: 600 }}>{item.menuItem?.name || 'Dish Item'}</div>
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{item.menuItem?.category || 'Culinary'}</span>
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
                gap: '10px',
                alignItems: 'start',
                borderTop: '1px dashed var(--border-color)',
                paddingTop: '8px',
                marginBottom: '8px'
              }} className="invoice-info-grid">
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>GST & Tax Terms:</div>
                  <div>• 5% Composite Dining GST (2.5% CGST + 2.5% SGST).</div>
                  <div>• Computer generated tax receipt.</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '0.82rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                    <span>Food Subtotal:</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>₹{(invoiceOrder.subtotalAmount || (invoiceOrder.totalAmount / 1.05)).toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                    <span>CGST (2.5%):</span>
                    <span style={{ color: 'var(--text-primary)' }}>₹{((invoiceOrder.taxAmount || (invoiceOrder.totalAmount - (invoiceOrder.totalAmount / 1.05))) / 2).toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                    <span>SGST (2.5%):</span>
                    <span style={{ color: 'var(--text-primary)' }}>₹{((invoiceOrder.taxAmount || (invoiceOrder.totalAmount - (invoiceOrder.totalAmount / 1.05))) / 2).toFixed(2)}</span>
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
                    <span style={{ color: 'var(--color-gold)' }}>₹{invoiceOrder.totalAmount.toFixed(2)}</span>
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
    </div>
  );
};

export default AdminOrders;
