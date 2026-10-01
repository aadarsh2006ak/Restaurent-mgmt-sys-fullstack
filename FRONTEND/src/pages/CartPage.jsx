import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { Trash2, ShoppingBag, Plus, Minus, ArrowRight, CreditCard, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';
import PaymentModal from '../components/PaymentModal';
import { API_BASE_URL } from '../config/api';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useContext(CartContext);
  const { user, token } = useContext(AuthContext);
  
  const [orderType, setOrderType] = useState('Dine-in');
  const [tableNumber, setTableNumber] = useState('');
  const [guestName, setGuestName] = useState('');
  const [tables, setTables] = useState([]);
  const [paymentChoice, setPaymentChoice] = useState('Cash'); // 'Cash', 'Online'
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingOrder, setPendingOrder] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch tables to let customers pick their table
    const fetchTables = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/tables?status=Available`);
        const data = await response.json();
        if (data.success) {
          setTables(data.data);
        }
      } catch (err) {
        console.error('Error fetching tables', err);
      }
    };
    fetchTables();
  }, []);

  const subtotal = getCartTotal();
  const tax = parseFloat((subtotal * 0.05).toFixed(2));
  const grandTotal = parseFloat((subtotal + tax).toFixed(2));

  const validateOrder = () => {
    if (cartItems.length === 0) return false;

    if (orderType === 'Dine-in' && !tableNumber) {
      setError('Please select or input a table number');
      return false;
    }

    if (!user && !guestName) {
      setError('Please provide a name for guest checkout or sign in');
      return false;
    }

    setError('');
    return true;
  };

  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    if (!validateOrder()) return;

    if (paymentChoice === 'Online') {
      // Create the order in unpaid state first, then open payment modal
      setSubmitting(true);
      setError('');
      try {
        const orderPayload = {
          orderType,
          items: cartItems.map((item) => ({
            menuItem: item._id,
            quantity: item.quantity
          })),
          tableNumber: orderType === 'Dine-in' ? tableNumber : undefined,
          guestName: !user ? guestName : undefined,
          paymentMethod: 'Online - UPI',
          isPaidOnline: false
        };

        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(`${API_BASE_URL}/api/orders`, {
          method: 'POST',
          headers,
          body: JSON.stringify(orderPayload)
        });
        const data = await response.json();

        if (data.success) {
          setPendingOrder(data.data);
          setShowPaymentModal(true);
        } else {
          setError(data.message || 'Failed to initialize order');
        }
      } catch (err) {
        setError('Connection error. Could not connect to restaurant server.');
      } finally {
        setSubmitting(false);
      }
    } else {
      executeOrderPlacement(false, 'Cash / Counter');
    }
  };

  const executeOrderPlacement = async (isPaidOnline, paymentMethodName) => {
    setSubmitting(true);
    setError('');

    const orderPayload = {
      orderType,
      items: cartItems.map((item) => ({
        menuItem: item._id,
        quantity: item.quantity
      })),
      tableNumber: orderType === 'Dine-in' ? tableNumber : undefined,
      guestName: !user ? guestName : undefined,
      paymentMethod: paymentMethodName,
      isPaidOnline: isPaidOnline
    };

    try {
      const headers = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers,
        body: JSON.stringify(orderPayload)
      });
      const data = await response.json();

      if (data.success) {
        clearCart();
        setShowPaymentModal(false);
        navigate(`/orders/${data.data._id}`);
      } else {
        setError(data.message || 'Failed to place order');
      }
    } catch (err) {
      setError('Connection error. Could not connect to restaurant server.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePaymentSuccess = (paidOrder) => {
    clearCart();
    setShowPaymentModal(false);
    navigate(`/orders/${paidOrder._id}`);
  };

  return (
    <div className="fade-in page-wrapper" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', marginBottom: '24px', color: 'var(--color-gold)' }}>
        Your Dining Cart
      </h1>

      {cartItems.length === 0 ? (
        <div className="glass-panel" style={{ padding: '48px 20px', textAlign: 'center' }}>
          <ShoppingBag size={44} style={{ color: 'var(--color-gold)', opacity: 0.5, marginBottom: '14px' }} />
          <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>Your cart is empty</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '0.92rem' }}>Fill your cart with delicious items from our menu.</p>
          <button onClick={() => navigate('/menu')} className="btn btn-primary">Go to Menu</button>
        </div>
      ) : (
        <div className="cart-layout-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
          {/* Cart Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="glass-panel cart-item-card"
                style={{
                  padding: '16px 20px',
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap'
                }}
              >
                <div style={{ flex: '1 1 180px' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{item.category}</span>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 600, marginTop: '2px' }}>{item.name}</h4>
                  <span style={{ color: 'var(--color-gold)', fontWeight: 600, fontSize: '0.9rem' }}>${item.price.toFixed(2)} each</span>
                </div>
                
                {/* Quantity Editor */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.05)', padding: '5px 10px', borderRadius: '30px', border: '1px solid var(--border-color)' }}>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', padding: '4px' }}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={13} />
                  </button>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem', minWidth: '18px', textAlign: 'center' }}>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', padding: '4px' }}
                    aria-label="Increase quantity"
                  >
                    <Plus size={13} />
                  </button>
                </div>

                {/* Subtotal and Delete */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginLeft: 'auto' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '1.05rem' }}>${(item.price * item.quantity).toFixed(2)}</span>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    style={{ background: 'none', border: 'none', color: '#e63946', cursor: 'pointer', display: 'flex', padding: '6px' }}
                    aria-label="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Panel */}
          <div>
            <form onSubmit={handleInitialSubmit} className="glass-panel checkout-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--color-gold)', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                Order Details
              </h3>

              {error && (
                <div style={{ color: '#e63946', backgroundColor: 'rgba(230, 57, 70, 0.1)', padding: '10px', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '16px', border: '1px solid rgba(230, 57, 70, 0.2)' }}>
                  {error}
                </div>
              )}

              {/* Order Type Toggle */}
              <div className="form-group">
                <span className="form-label">Dining Preference</span>
                <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                  <button type="button" onClick={() => setOrderType('Dine-in')} className={`btn ${orderType === 'Dine-in' ? 'btn-primary' : 'btn-secondary'}`} style={{ flex: 1, padding: '9px', fontSize: '0.85rem' }}>Dine-in</button>
                  <button type="button" onClick={() => setOrderType('Takeaway')} className={`btn ${orderType === 'Takeaway' ? 'btn-primary' : 'btn-secondary'}`} style={{ flex: 1, padding: '9px', fontSize: '0.85rem' }}>Takeaway</button>
                </div>
              </div>

              {/* Table Number selection for Dine-in */}
              {orderType === 'Dine-in' && (
                <div className="form-group">
                  <label className="form-label" htmlFor="table-select">Select Table</label>
                  <select
                    id="table-select"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="form-input"
                    style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                  >
                    <option value="">-- Choose an available table --</option>
                    {tables.map((table) => (
                      <option key={table._id} value={table.number}>
                        Table {table.number} (Capacity: {table.capacity} guests)
                      </option>
                    ))}
                  </select>
                  <div style={{ marginTop: '8px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                    or enter table number manually below
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. 5"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="form-input"
                    style={{ marginTop: '6px' }}
                  />
                </div>
              )}

              {/* Guest details if not logged in */}
              {!user && (
                <div className="form-group">
                  <label className="form-label" htmlFor="guest-name">Your Full Name</label>
                  <input
                    id="guest-name"
                    type="text"
                    required
                    placeholder="Enter name for order"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="form-input"
                  />
                </div>
              )}

              {/* Payment Mode Selection */}
              <div className="form-group" style={{ marginTop: '14px' }}>
                <span className="form-label">Payment Mode</span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '4px' }}>
                  <button
                    type="button"
                    onClick={() => setPaymentChoice('Cash')}
                    className={`btn ${paymentChoice === 'Cash' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '8px 10px', fontSize: '0.8rem' }}
                  >
                    💵 Cash / Counter
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentChoice('Online')}
                    className={`btn ${paymentChoice === 'Online' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '8px 10px', fontSize: '0.8rem' }}
                  >
                    💳 Pay Online (UPI/Card)
                  </button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  <span>Food Items Subtotal:</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <span>Taxes & GST (5%):</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold', borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '8px' }}>
                  <span>Grand Total:</span>
                  <span style={{ color: 'var(--color-gold)' }}>₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '18px', gap: '8px', padding: '12px' }}
              >
                {submitting ? 'Processing...' : paymentChoice === 'Online' ? 'Proceed to Online Payment ➔' : 'Confirm Order'} <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Production-Grade Payment Gateway Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          if (pendingOrder) {
            clearCart();
            navigate(`/orders/${pendingOrder._id}`);
          }
        }}
        order={pendingOrder}
        onPaymentSuccess={handlePaymentSuccess}
        customerInfo={{
          name: user?.name || guestName,
          email: user?.email,
          phone: user?.phone
        }}
      />

      <style>{`
        @media (min-width: 861px) {
          .checkout-panel {
            position: sticky;
            top: 100px;
          }
        }
        @media (max-width: 860px) {
          .cart-layout-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CartPage;
