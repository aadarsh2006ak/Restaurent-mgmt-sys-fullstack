import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { Trash2, ShoppingBag, Plus, Minus, ArrowRight, CreditCard, ShieldCheck, CheckCircle2, Lock, ArrowLeft, Utensils } from 'lucide-react';
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
    <div className="fade-in page-wrapper" style={{ maxWidth: '1020px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '8px' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.7rem, 4vw, 2.4rem)', color: 'var(--color-gold)' }}>
          Your Dining Cart
        </h1>
        <Link to="/menu" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <Utensils size={14} /> Add More Items
        </Link>
      </div>

      {cartItems.length === 0 ? (
        <div className="glass-panel" style={{ padding: 'clamp(36px, 8vw, 64px) 20px', textAlign: 'center' }}>
          <ShoppingBag size={48} style={{ color: 'var(--color-gold)', opacity: 0.4, marginBottom: '14px' }} />
          <h3 style={{ fontSize: '1.3rem', marginBottom: '8px', fontFamily: 'var(--font-serif)' }}>Your cart is empty</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '22px', fontSize: '0.92rem', maxWidth: '380px', margin: '0 auto 20px' }}>
            Explore our rich North & South Indian and authentic Chinese delicacies to begin your order.
          </p>
          <Link to="/menu" className="btn btn-primary" style={{ gap: '8px' }}>
            <Utensils size={16} /> Browse Master Menu
          </Link>
        </div>
      ) : (
        <div className="cart-responsive-grid">
          {/* Cart Items List Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 600 }}>
                Selected Items ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})
              </span>
              <button
                type="button"
                onClick={clearCart}
                style={{ background: 'none', border: 'none', color: '#e74c3c', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Trash2 size={13} /> Clear Cart
              </button>
            </div>

            {cartItems.map((item) => (
              <div
                key={item._id}
                className="glass-panel cart-item-card-row"
              >
                {/* Item Info */}
                <div style={{ flex: '1 1 180px', minWidth: '160px' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 600 }}>
                    {item.cuisine === 'Chinese' ? '🥢 Chinese' : '🇮🇳 Indian'} • {item.category}
                  </span>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 600, marginTop: '2px', color: 'var(--text-primary)' }}>
                    {item.name}
                  </h4>
                  <span style={{ color: 'var(--color-gold)', fontWeight: 700, fontSize: '0.88rem' }}>
                    ₹{item.price.toFixed(2)} each
                  </span>
                </div>
                
                {/* Quantity Stepper & Price Row */}
                <div className="cart-item-action-cluster">
                  {/* Quantity Stepper */}
                  <div className="cart-stepper-box">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="cart-stepper-btn"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={13} />
                    </button>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', minWidth: '20px', textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="cart-stepper-btn"
                      aria-label="Increase quantity"
                    >
                      <Plus size={13} />
                    </button>
                  </div>

                  {/* Subtotal and Delete */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)', minWidth: '65px', textAlign: 'right' }}>
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item._id)}
                      style={{
                        background: 'rgba(231,76,60,0.1)',
                        border: '1px solid rgba(231,76,60,0.2)',
                        borderRadius: '6px',
                        color: '#e74c3c',
                        cursor: 'pointer',
                        padding: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      aria-label="Remove item"
                      title="Remove"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Details Panel Column */}
          <div>
            <form onSubmit={handleInitialSubmit} className="glass-panel checkout-card-panel">
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--color-gold)', marginBottom: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                Order Preferences
              </h3>

              {error && (
                <div style={{ color: '#e63946', backgroundColor: 'rgba(230, 57, 70, 0.1)', padding: '10px', borderRadius: '6px', fontSize: '0.84rem', marginBottom: '14px', border: '1px solid rgba(230, 57, 70, 0.2)' }}>
                  {error}
                </div>
              )}

              {/* Order Type Toggle */}
              <div className="form-group">
                <span className="form-label">Dining Preference</span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '2px' }}>
                  <button
                    type="button"
                    onClick={() => setOrderType('Dine-in')}
                    className={`btn ${orderType === 'Dine-in' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '8px', fontSize: '0.84rem' }}
                  >
                    🍽️ Dine-in
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType('Takeaway')}
                    className={`btn ${orderType === 'Takeaway' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '8px', fontSize: '0.84rem' }}
                  >
                    🥡 Takeaway
                  </button>
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
                    style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', marginBottom: '6px' }}
                  >
                    <option value="">-- Choose available table --</option>
                    {tables.map((table) => (
                      <option key={table._id} value={table.number}>
                        Table {table.number} ({table.capacity} guests)
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="or enter table number manually (e.g. 5)"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="form-input"
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
                    placeholder="Enter guest name for order"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="form-input"
                  />
                </div>
              )}

              {/* Payment Mode Selection */}
              <div className="form-group" style={{ marginTop: '10px' }}>
                <span className="form-label">Payment Option</span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '2px' }}>
                  <button
                    type="button"
                    onClick={() => setPaymentChoice('Cash')}
                    className={`btn ${paymentChoice === 'Cash' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '8px 6px', fontSize: '0.78rem' }}
                  >
                    💵 Cash / Counter
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentChoice('Online')}
                    className={`btn ${paymentChoice === 'Online' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '8px 6px', fontSize: '0.78rem' }}
                  >
                    💳 Pay Online (UPI/Card)
                  </button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  <span>Food Items Subtotal:</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>₹{subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                  <span>Taxes & GST (5%):</span>
                  <span style={{ color: 'var(--text-primary)' }}>₹{tax.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 'bold', borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '8px' }}>
                  <span>Grand Total:</span>
                  <span style={{ color: 'var(--color-gold)' }}>₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '16px', gap: '8px', padding: '12px' }}
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
        .cart-responsive-grid {
          display: grid;
          grid-template-columns: 1.35fr 1fr;
          gap: 20px;
          align-items: start;
        }

        .cart-item-card-row {
          padding: 14px 18px;
          display: flex;
          gap: 14px;
          align-items: center;
          justify-content: space-between;
          border-radius: 14px;
          flex-wrap: wrap;
        }

        .cart-item-action-cluster {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-left: auto;
          flex-wrap: wrap;
        }

        .cart-stepper-box {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.04);
          padding: 4px 8px;
          border-radius: 24px;
          border: 1px solid var(--border-color);
        }

        .cart-stepper-btn {
          background: none;
          border: none;
          color: var(--color-gold);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          transition: background 0.2s;
        }

        .cart-stepper-btn:hover {
          background: rgba(197, 168, 128, 0.15);
        }

        .checkout-card-panel {
          padding: 20px;
          border-radius: 16px;
        }

        @media (min-width: 861px) {
          .checkout-card-panel {
            position: sticky;
            top: 90px;
          }
        }

        @media (max-width: 860px) {
          .cart-responsive-grid {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 480px) {
          .cart-item-card-row {
            padding: 12px 14px;
          }
          .cart-item-action-cluster {
            width: 100%;
            justify-content: space-between;
            margin-top: 6px;
            padding-top: 8px;
            border-top: 1px solid rgba(255,255,255,0.04);
          }
        }
      `}</style>
    </div>
  );
};

export default CartPage;
