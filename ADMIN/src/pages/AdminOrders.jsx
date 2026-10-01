import React, { useState, useEffect, useContext } from 'react';
import { AdminAuthContext } from '../context/AdminAuthContext';
import { API_BASE_URL } from '../config/api';
import { RefreshCw, Clipboard, CreditCard, Clock, FileText, Printer, X } from 'lucide-react';

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.6rem, 3.5vw, 2.3rem)', color: 'var(--color-gold)' }}>Live Orders Board</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Manage incoming orders, dispatch bills & tax invoices, and track cancellations.</p>
        </div>
        <button
          onClick={() => { setLoading(true); fetchOrders(); }}
          className="btn btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', fontSize: '0.82rem' }}
        >
          <RefreshCw size={13} className={loading ? 'spin' : ''} /> Sync Board
        </button>
      </div>

      {/* Tabs with smooth horizontal touch scroll */}
      <div
        className="status-filter-tabs"
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '12px',
          marginBottom: '20px',
          overflowX: 'auto',
          maxWidth: '100%'
        }}
      >
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className="btn btn-secondary btn-sm"
            style={{
              borderColor: filterStatus === status ? 'var(--color-gold)' : 'transparent',
              color: filterStatus === status ? 'var(--color-gold)' : 'var(--text-muted)',
              backgroundColor: filterStatus === status ? 'rgba(197, 168, 128, 0.08)' : 'transparent',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              flexShrink: 0
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
        <div className="glass-panel" style={{ padding: '48px 20px', textAlign: 'center' }}>
          <Clipboard size={36} style={{ color: 'var(--color-gold)', opacity: 0.5, marginBottom: '14px' }} />
          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>No orders in this status currently.</h3>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredOrders.map((order) => (
            <div key={order._id} className="glass-panel" style={{ padding: 'clamp(16px, 3vw, 24px)' }}>
              {/* Card Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '14px', marginBottom: '14px' }}>
                <div style={{ flex: '1 1 240px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '1.05rem', fontWeight: 'bold' }}>Order #{order._id.substring(18)}</span>
                    <span className={`badge badge-${order.status.toLowerCase()}`}>{order.status}</span>
                    <span className={`badge badge-${order.paymentStatus.toLowerCase()}`}>{order.paymentStatus}</span>
                    {order.paymentGateway && order.paymentGateway !== 'None' && (
                      <span style={{ fontSize: '0.72rem', backgroundColor: 'rgba(52, 152, 219, 0.15)', color: '#3498db', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(52, 152, 219, 0.3)', fontWeight: 600 }}>
                        {order.paymentGateway}
                      </span>
                    )}
                    {order.invoiceNumber && (
                      <span style={{ fontSize: '0.72rem', backgroundColor: 'rgba(197, 168, 128, 0.12)', color: 'var(--color-gold)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border-color)', fontWeight: 600 }}>
                        {order.invoiceNumber}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '6px', fontSize: '0.82rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
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
                    <div style={{ marginTop: '8px', padding: '8px 12px', borderRadius: '6px', backgroundColor: 'rgba(231, 76, 60, 0.1)', border: '1px solid rgba(231, 76, 60, 0.3)', color: '#e74c3c', fontSize: '0.82rem' }}>
                      <strong>Cancellation Note ({order.cancelledBy || 'User'}):</strong> {order.cancellationReason || 'No specific reason provided.'}
                    </div>
                  )}
                </div>
                
                <div style={{ textAlign: 'right', marginLeft: 'auto' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Total Bill</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-gold)' }}>₹{order.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Items List */}
              <div style={{ marginBottom: '16px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>Dish Items</span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 200px), 1fr))', gap: '10px' }}>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={{ padding: '8px 10px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '0.86rem' }}>
                      <strong>{item.quantity}×</strong> {item.menuItem?.name || 'Deleted Item'}
                      <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Category: {item.menuItem?.category || 'N/A'} • ₹{item.price?.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                {/* Kitchen Status triggers */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
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

                {/* Billing & Cashier actions */}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginLeft: 'auto', flexWrap: 'wrap' }}>
                  {/* Bill Generator / Invoice Dispatch */}
                  <button
                    onClick={() => {
                      if (order.invoiceNumber) {
                        setInvoiceOrder(order);
                      } else {
                        handleGenerateInvoice(order);
                      }
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ gap: '5px', display: 'flex', alignItems: 'center' }}
                  >
                    <FileText size={13} /> {order.invoiceNumber ? 'View Bill / Invoice' : 'Generate & Send Bill'}
                  </button>

                  {order.paymentStatus === 'Unpaid' ? (
                    <button
                      onClick={() => updatePayment(order._id, 'Paid')}
                      disabled={updatingId === order._id}
                      className="btn btn-secondary btn-sm"
                      style={{ color: '#2ecc71', borderColor: 'rgba(46,204,113,0.3)', gap: '6px', display: 'flex', alignItems: 'center' }}
                    >
                      <CreditCard size={13} /> Mark as Paid
                    </button>
                  ) : (
                    <button
                      onClick={() => updatePayment(order._id, 'Unpaid')}
                      disabled={updatingId === order._id}
                      className="btn btn-secondary btn-sm"
                      style={{ color: '#e74c3c', borderColor: 'rgba(231,76,60,0.3)', gap: '6px', display: 'flex', alignItems: 'center' }}
                    >
                      <CreditCard size={13} /> Mark as Unpaid
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
                <span style={{ fontWeight: 600, fontSize: '0.98rem', color: 'var(--text-primary)' }}>Customer Tax Invoice (1 Page Layout)</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  onClick={() => window.print()}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', fontSize: '0.82rem' }}
                >
                  <Printer size={14} /> Print Bill (1 Page)
                </button>
                <button onClick={() => setInvoiceOrder(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px', display: 'flex' }}>
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
                  <strong style={{ color: 'var(--color-gold)', letterSpacing: '0.3px' }}>{invoiceOrder.invoiceNumber || `INV-${new Date().getFullYear()}-${invoiceOrder._id.substring(18).toUpperCase()}`}</strong>

                  <span style={{ color: 'var(--text-muted)' }}>Order Ref:</span>
                  <strong>#{invoiceOrder._id.substring(18)}</strong>

                  <span style={{ color: 'var(--text-muted)' }}>Date & Time:</span>
                  <span>{new Date(invoiceOrder.createdAt).toLocaleDateString()} at {new Date(invoiceOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>

                  <span style={{ color: 'var(--text-muted)' }}>Dining Mode:</span>
                  <strong>{invoiceOrder.orderType} {invoiceOrder.tableNumber && `(Table ${invoiceOrder.tableNumber})`}</strong>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '5px 10px', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Billed To:</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{invoiceOrder.user?.name || invoiceOrder.guestName || 'Walk-in Guest'}</strong>

                  <span style={{ color: 'var(--text-muted)' }}>Customer:</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{invoiceOrder.user?.email || 'Registered Guest'}</span>

                  <span style={{ color: 'var(--text-muted)' }}>Payment Mode:</span>
                  <strong>{invoiceOrder.paymentMethod || 'Cash / Counter'}</strong>

                  <span style={{ color: 'var(--text-muted)' }}>Status:</span>
                  <div>
                    <span style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      backgroundColor: invoiceOrder.paymentStatus === 'Paid' ? 'rgba(46, 204, 113, 0.15)' : 'rgba(231, 76, 60, 0.15)',
                      color: invoiceOrder.paymentStatus === 'Paid' ? '#2ecc71' : '#e74c3c',
                      border: `1px solid ${invoiceOrder.paymentStatus === 'Paid' ? 'rgba(46, 204, 113, 0.3)' : 'rgba(231, 76, 60, 0.3)'}`
                    }}>
                      {invoiceOrder.paymentStatus === 'Paid' ? 'PAID' : 'UNPAID'}
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
                  {invoiceOrder.items.map((it, idx) => (
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
                    fontSize: '1.1rem',
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

      {/* Print & Responsive CSS to guarantee 1 single clean page print */}
      <style>{`
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
          .admin-invoice-modal-overlay,
          .printable-invoice-card,
          .invoice-print-container,
          .invoice-print-container * {
            visibility: visible;
          }
          .admin-invoice-modal-overlay {
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

export default AdminOrders;
