import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { Trash2, ShoppingBag, Plus, Minus, ArrowRight } from 'lucide-react';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useContext(CartContext);
  const { user, token } = useContext(AuthContext);
  
  const [orderType, setOrderType] = useState('Dine-in');
  const [tableNumber, setTableNumber] = useState('');
  const [guestName, setGuestName] = useState('');
  const [tables, setTables] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch tables to let customers pick their table
    const fetchTables = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/tables?status=Available');
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

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    if (orderType === 'Dine-in' && !tableNumber) {
      setError('Please select or input a table number');
      return;
    }

    if (!user && !guestName) {
      setError('Please provide a name for guest checkout or sign in');
      return;
    }

    setError('');
    setSubmitting(true);

    const orderPayload = {
      orderType,
      items: cartItems.map((item) => ({
        menuItem: item._id,
        quantity: item.quantity
      })),
      tableNumber: orderType === 'Dine-in' ? tableNumber : undefined,
      guestName: !user ? guestName : undefined
    };

    try {
      const headers = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers,
        body: JSON.stringify(orderPayload)
      });
      const data = await response.json();

      if (data.success) {
        clearCart();
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

  return (
    <div className="fade-in" style={{ padding: '0 24px 60px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: '32px', color: 'var(--color-gold)' }}>Your Dining Cart</h1>

      {cartItems.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center' }}>
          <ShoppingBag size={48} style={{ color: 'var(--color-gold)', opacity: 0.5, marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>Your cart is empty</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Fill your cart with delicious items from our menu.</p>
          <button onClick={() => navigate('/menu')} className="btn btn-primary">Go to Menu</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '30px' }}>
          {/* Cart Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {cartItems.map((item) => (
              <div key={item._id} className="glass-panel" style={{ padding: '20px', display: 'flex', gap: '20px', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '1px' }}>{item.category}</span>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 600, marginTop: '4px' }}>{item.name}</h4>
                  <span style={{ color: 'var(--color-gold)', fontWeight: 600, fontSize: '0.95rem' }}>${item.price.toFixed(2)}</span>
                </div>
                
                {/* Quantity Editor */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '30px', border: '1px solid var(--border-color)' }}>
                  <button onClick={() => updateQuantity(item._id, item.quantity - 1)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex' }}><Minus size={14} /></button>
                  <span style={{ fontWeight: 600, fontSize: '0.95rem', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item._id, item.quantity + 1)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex' }}><Plus size={14} /></button>
                </div>

                <div style={{ textAlign: 'right', minWidth: '80px' }}>
                  <span style={{ fontWeight: 'bold', display: 'block' }}>${(item.price * item.quantity).toFixed(2)}</span>
                  <button onClick={() => removeFromCart(item._id)} style={{ background: 'none', border: 'none', color: '#e63946', cursor: 'pointer', marginTop: '8px' }}><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Panel */}
          <div>
            <form onSubmit={handleCheckout} className="glass-panel" style={{ padding: '30px', position: 'sticky', top: '120px' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--color-gold)', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>Order Details</h3>

              {error && (
                <div style={{ color: '#e63946', backgroundColor: 'rgba(230, 57, 70, 0.1)', padding: '12px', borderRadius: '6px', fontSize: '0.9rem', marginBottom: '20px', border: '1px solid rgba(230, 57, 70, 0.2)' }}>
                  {error}
                </div>
              )}

              {/* Order Type Toggle */}
              <div className="form-group">
                <span className="form-label">Dining Preference</span>
                <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                  <button type="button" onClick={() => setOrderType('Dine-in')} className={`btn ${orderType === 'Dine-in' ? 'btn-primary' : 'btn-secondary'}`} style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }}>Dine-in</button>
                  <button type="button" onClick={() => setOrderType('Takeaway')} className={`btn ${orderType === 'Takeaway' ? 'btn-primary' : 'btn-secondary'}`} style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }}>Takeaway</button>
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
                  <div style={{ marginTop: '10px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    or enter table number manually below
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. 5"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="form-input"
                    style={{ marginTop: '8px' }}
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

              <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '14px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', color: 'var(--text-muted)' }}>
                  <span>Subtotal:</span>
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 'bold' }}>
                  <span>Total:</span>
                  <span style={{ color: 'var(--color-gold)' }}>${getCartTotal().toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '24px', gap: '8px', padding: '14px' }}
              >
                {submitting ? 'Processing...' : 'Place Order'} <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
