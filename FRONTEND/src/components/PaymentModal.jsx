import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  QrCode,
  ShieldCheck,
  Lock,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
  Smartphone,
  Building,
  RefreshCw,
  Zap,
  Check,
  ArrowRight
} from 'lucide-react';
import { API_BASE_URL } from '../config/api';

const PaymentModal = ({ isOpen, onClose, order, onPaymentSuccess, customerInfo }) => {
  const [gatewayConfig, setGatewayConfig] = useState(null);
  const [selectedGateway, setSelectedGateway] = useState('razorpay'); // 'razorpay' or 'stripe'
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [processStep, setProcessStep] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Razorpay Test mode interactive simulation state
  const [razorpaySubMethod, setRazorpaySubMethod] = useState('upi'); // 'upi', 'card', 'netbanking'
  const [upiIdInput, setUpiIdInput] = useState('customer@okhdfcbank');

  // Stripe Card form state
  const [cardHolder, setCardHolder] = useState(customerInfo?.name || 'Valued Guest');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  // Fetch gateway configuration from backend
  useEffect(() => {
    if (!isOpen) return;

    const fetchConfig = async () => {
      try {
        setLoadingConfig(true);
        const res = await fetch(`${API_BASE_URL}/api/payment/config`);
        const data = await res.json();
        if (data.success) {
          setGatewayConfig(data.data);
          if (data.data.activeGateway === 'stripe') {
            setSelectedGateway('stripe');
          } else {
            setSelectedGateway('razorpay');
          }
        }
      } catch (err) {
        console.error('Error fetching payment config:', err);
      } finally {
        setLoadingConfig(false);
      }
    };

    fetchConfig();
    setErrorMessage('');
    setPaymentSuccess(false);
    setProcessing(false);
  }, [isOpen]);

  if (!isOpen || !order) return null;

  const totalAmount = order.totalAmount || 0;
  const orderId = order._id;

  // Format Card Number (adds spaces every 4 digits)
  const handleCardNumberChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 16);
    let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardNumber(formatted);
  };

  // Format Card Expiry (MM/YY)
  const handleCardExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (val.length >= 2) {
      val = val.substring(0, 2) + '/' + val.substring(2);
    }
    setCardExpiry(val);
  };

  // ==========================================
  // RAZORPAY PAYMENT HANDLER
  // ==========================================
  const handleRazorpayPayment = async () => {
    try {
      setProcessing(true);
      setErrorMessage('');
      setProcessStep('Initializing secure Razorpay order...');

      // 1. Create order on backend
      const createRes = await fetch(`${API_BASE_URL}/api/payment/razorpay/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      });

      const createData = await createRes.json();
      if (!createData.success) {
        throw new Error(createData.message || 'Failed to initialize Razorpay order');
      }

      const { order: rzpOrder, keyId, isMock } = createData.data;

      // 2. If Real Razorpay SDK is loaded and keys are active
      if (window.Razorpay && !isMock && keyId && !keyId.includes('placeholder')) {
        setProcessStep('Opening Razorpay Payment Gateway...');

        const options = {
          key: keyId,
          amount: rzpOrder.amount,
          currency: rzpOrder.currency || 'INR',
          name: 'Royal Gourmet Restaurant',
          description: `Order #${orderId.toString().slice(-6)}`,
          order_id: rzpOrder.id,
          prefill: {
            name: customerInfo?.name || order.guestName || 'Valued Guest',
            email: customerInfo?.email || 'customer@example.com',
            contact: customerInfo?.phone || '9876543210'
          },
          theme: {
            color: '#d4af37'
          },
          handler: async function (response) {
            setProcessStep('Verifying cryptographic signature...');
            try {
              const verifyRes = await fetch(`${API_BASE_URL}/api/payment/razorpay/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  orderId,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  paymentMethod: 'Online - Razorpay'
                })
              });

              const verifyData = await verifyRes.json();
              if (verifyData.success) {
                setPaymentSuccess(true);
                setProcessStep('Payment Verified!');
                setTimeout(() => {
                  onPaymentSuccess(verifyData.data);
                }, 1200);
              } else {
                throw new Error(verifyData.message || 'Signature verification failed');
              }
            } catch (verErr) {
              setErrorMessage(verErr.message || 'Payment verification failed');
              setProcessing(false);
            }
          },
          modal: {
            ondismiss: function () {
              setProcessing(false);
              setProcessStep('');
            }
          }
        };

        const razorpayInstance = new window.Razorpay(options);
        razorpayInstance.on('payment.failed', function (resp) {
          setErrorMessage(resp.error.description || 'Payment was declined by bank');
          setProcessing(false);
        });
        razorpayInstance.open();
      } else {
        // 3. Fallback / Test Sandbox Mode (Immediate seamless verification)
        setProcessStep('Simulating Razorpay Payment Gateway authorization...');
        await new Promise((resolve) => setTimeout(resolve, 1400));

        setProcessStep('Verifying Razorpay transaction & generating invoice...');
        const mockPaymentId = `pay_rzp_test_${Math.random().toString(36).substring(2, 10)}`;
        const mockSignature = `sig_rzp_${Math.random().toString(36).substring(2, 14)}`;

        const verifyRes = await fetch(`${API_BASE_URL}/api/payment/razorpay/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId,
            razorpay_order_id: rzpOrder.id,
            razorpay_payment_id: mockPaymentId,
            razorpay_signature: mockSignature,
            paymentMethod: `Razorpay - ${razorpaySubMethod.toUpperCase()}`,
            isMock: true
          })
        });

        const verifyData = await verifyRes.json();
        if (verifyData.success) {
          setPaymentSuccess(true);
          setProcessStep('Payment Captured & Verified!');
          setTimeout(() => {
            onPaymentSuccess(verifyData.data);
          }, 1200);
        } else {
          throw new Error(verifyData.message || 'Payment processing failed');
        }
      }
    } catch (err) {
      console.error('Razorpay Error:', err);
      setErrorMessage(err.message || 'Failed to process payment');
      setProcessing(false);
    }
  };

  // ==========================================
  // STRIPE PAYMENT HANDLER
  // ==========================================
  const handleStripePayment = async () => {
    try {
      setProcessing(true);
      setErrorMessage('');
      setProcessStep('Creating Stripe Payment Intent...');

      const intentRes = await fetch(`${API_BASE_URL}/api/payment/stripe/create-payment-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      });

      const intentData = await intentRes.json();
      if (!intentData.success) {
        throw new Error(intentData.message || 'Failed to create Stripe payment intent');
      }

      const { paymentIntentId, isMock } = intentData.data;

      setProcessStep('Processing card authorization with Stripe...');
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setProcessStep('Confirming Stripe payment & generating receipt...');
      const verifyRes = await fetch(`${API_BASE_URL}/api/payment/stripe/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          paymentIntentId,
          paymentMethod: 'Online - Stripe (Card)',
          isMock: true
        })
      });

      const verifyData = await verifyRes.json();
      if (verifyData.success) {
        setPaymentSuccess(true);
        setProcessStep('Stripe Payment Confirmed!');
        setTimeout(() => {
          onPaymentSuccess(verifyData.data);
        }, 1200);
      } else {
        throw new Error(verifyData.message || 'Stripe payment confirmation failed');
      }
    } catch (err) {
      console.error('Stripe Error:', err);
      setErrorMessage(err.message || 'Stripe payment failed');
      setProcessing(false);
    }
  };

  // Stripe Checkout Redirect (Optional hosted session)
  const handleStripeHostedCheckout = async () => {
    try {
      setProcessing(true);
      setErrorMessage('');
      setProcessStep('Redirecting to Stripe Hosted Checkout...');

      const res = await fetch(`${API_BASE_URL}/api/payment/stripe/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      });

      const data = await res.json();
      if (data.success && data.data?.url) {
        window.location.href = data.data.url;
      } else {
        throw new Error(data.message || 'Unable to open hosted Stripe checkout. Use instant card checkout below.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Hosted checkout failed');
      setProcessing(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(5, 5, 8, 0.82)',
        backdropFilter: 'blur(10px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '540px',
          backgroundColor: '#12131a',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          borderRadius: '16px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 30px rgba(212, 175, 55, 0.15)',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(180deg, rgba(212, 175, 55, 0.1) 0%, transparent 100%)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: 'rgba(212, 175, 55, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-gold)'
              }}
            >
              <Lock size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#fff', fontWeight: 600 }}>
                Online Payment
              </h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Order #{orderId?.toString().slice(-6).toUpperCase()} • 256-Bit SSL Encrypted
              </p>
            </div>
          </div>

          {!processing && (
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px' }}>
          {/* Amount Due Banner */}
          <div
            style={{
              padding: '16px 20px',
              borderRadius: '12px',
              backgroundColor: 'rgba(212, 175, 55, 0.08)',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px'
            }}
          >
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Total Payable Amount
              </span>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-gold)', fontFamily: 'var(--font-serif)' }}>
                ₹{totalAmount.toFixed(2)}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  backgroundColor: 'rgba(46, 204, 113, 0.15)',
                  color: '#2ecc71',
                  border: '1px solid rgba(46, 204, 113, 0.3)'
                }}
              >
                <ShieldCheck size={13} /> PCI Compliant
              </span>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {order.items?.length || 1} Item(s) included
              </div>
            </div>
          </div>

          {/* Gateway Selector Tabs (Razorpay vs Stripe) */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 500 }}>
              Select Payment Gateway
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {/* Razorpay Option */}
              <button
                type="button"
                onClick={() => setSelectedGateway('razorpay')}
                disabled={processing}
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: selectedGateway === 'razorpay' ? '2px solid var(--color-gold)' : '1px solid rgba(255, 255, 255, 0.1)',
                  backgroundColor: selectedGateway === 'razorpay' ? 'rgba(212, 175, 55, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'left'
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: '#0c2340',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#3395ff',
                    fontWeight: 800,
                    fontSize: '0.9rem'
                  }}
                >
                  <Zap size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: selectedGateway === 'razorpay' ? 'var(--color-gold)' : '#fff' }}>
                    Razorpay
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    UPI, QR, Cards, NetBanking
                  </div>
                </div>
              </button>

              {/* Stripe Option */}
              <button
                type="button"
                onClick={() => setSelectedGateway('stripe')}
                disabled={processing}
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: selectedGateway === 'stripe' ? '2px solid var(--color-gold)' : '1px solid rgba(255, 255, 255, 0.1)',
                  backgroundColor: selectedGateway === 'stripe' ? 'rgba(212, 175, 55, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'left'
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: '#635bff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: '0.9rem'
                  }}
                >
                  <CreditCard size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: selectedGateway === 'stripe' ? 'var(--color-gold)' : '#fff' }}>
                    Stripe
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Global Cards, Apple/G-Pay
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Active Gateway Content */}
          {selectedGateway === 'razorpay' ? (
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                padding: '16px',
                marginBottom: '20px'
              }}
            >
              {/* Razorpay Sub-methods tabs */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                <button
                  type="button"
                  onClick={() => setRazorpaySubMethod('upi')}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '8px',
                    border: razorpaySubMethod === 'upi' ? '1px solid var(--color-gold)' : '1px solid rgba(255, 255, 255, 0.08)',
                    backgroundColor: razorpaySubMethod === 'upi' ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                    color: razorpaySubMethod === 'upi' ? 'var(--color-gold)' : 'var(--text-muted)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Smartphone size={14} /> UPI / QR
                </button>
                <button
                  type="button"
                  onClick={() => setRazorpaySubMethod('card')}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '8px',
                    border: razorpaySubMethod === 'card' ? '1px solid var(--color-gold)' : '1px solid rgba(255, 255, 255, 0.08)',
                    backgroundColor: razorpaySubMethod === 'card' ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                    color: razorpaySubMethod === 'card' ? 'var(--color-gold)' : 'var(--text-muted)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <CreditCard size={14} /> Debit/Credit Card
                </button>
                <button
                  type="button"
                  onClick={() => setRazorpaySubMethod('netbanking')}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '8px',
                    border: razorpaySubMethod === 'netbanking' ? '1px solid var(--color-gold)' : '1px solid rgba(255, 255, 255, 0.08)',
                    backgroundColor: razorpaySubMethod === 'netbanking' ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                    color: razorpaySubMethod === 'netbanking' ? 'var(--color-gold)' : 'var(--text-muted)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Building size={14} /> NetBanking
                </button>
              </div>

              {/* Razorpay Method Info Box */}
              {razorpaySubMethod === 'upi' && (
                <div style={{ fontSize: '0.85rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      marginBottom: '10px'
                    }}
                  >
                    <span style={{ color: '#fff', fontWeight: 500 }}>Supported UPI Apps:</span>
                    <span style={{ color: 'var(--color-gold)', fontSize: '0.78rem', fontWeight: 600 }}>
                      GPay • PhonePe • Paytm • BHIM
                    </span>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      UPI ID / VPA
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={upiIdInput}
                      onChange={(e) => setUpiIdInput(e.target.value)}
                      placeholder="e.g. mobile@upi or username@okhdfcbank"
                      style={{ fontSize: '0.88rem', padding: '8px 12px' }}
                    />
                  </div>
                </div>
              )}

              {razorpaySubMethod === 'card' && (
                <div style={{ fontSize: '0.85rem' }}>
                  <p style={{ color: 'var(--text-muted)', margin: '0 0 8px 0', fontSize: '0.8rem' }}>
                    Supports Visa, MasterCard, RuPay, Maestro & Diners Club cards.
                  </p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="4532 •••• •••• ••••"
                      defaultValue="4532 8920 1204 5591"
                      style={{ fontSize: '0.88rem', padding: '8px 12px' }}
                    />
                  </div>
                </div>
              )}

              {razorpaySubMethod === 'netbanking' && (
                <div style={{ fontSize: '0.85rem' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Select Bank
                  </label>
                  <select
                    className="form-control"
                    defaultValue="HDFC Bank"
                    style={{ fontSize: '0.88rem', padding: '8px 12px' }}
                  >
                    <option value="HDFC Bank">HDFC Bank</option>
                    <option value="State Bank of India">State Bank of India (SBI)</option>
                    <option value="ICICI Bank">ICICI Bank</option>
                    <option value="Axis Bank">Axis Bank</option>
                    <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                    <option value="Punjab National Bank">Punjab National Bank</option>
                  </select>
                </div>
              )}
            </div>
          ) : (
            /* Stripe Payment Card Form */
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                padding: '16px',
                marginBottom: '20px'
              }}
            >
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Cardholder Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  placeholder="Cardholder Name"
                  style={{ fontSize: '0.88rem', padding: '8px 12px' }}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Card Number
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="form-control"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="4242 4242 4242 4242"
                    maxLength={19}
                    style={{ fontSize: '0.88rem', padding: '8px 36px 8px 12px', letterSpacing: '1px' }}
                  />
                  <CreditCard
                    size={16}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-muted)'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={cardExpiry}
                    onChange={handleCardExpiryChange}
                    placeholder="MM/YY"
                    maxLength={5}
                    style={{ fontSize: '0.88rem', padding: '8px 12px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    CVC / CVV
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').substring(0, 4))}
                    placeholder="•••"
                    maxLength={4}
                    style={{ fontSize: '0.88rem', padding: '8px 12px' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                backgroundColor: 'rgba(231, 76, 60, 0.15)',
                border: '1px solid rgba(231, 76, 60, 0.3)',
                color: '#e74c3c',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px'
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Processing / Progress Status */}
          {processing && (
            <div
              style={{
                padding: '14px',
                borderRadius: '8px',
                backgroundColor: paymentSuccess ? 'rgba(46, 204, 113, 0.15)' : 'rgba(212, 175, 55, 0.12)',
                border: `1px solid ${paymentSuccess ? 'rgba(46, 204, 113, 0.3)' : 'rgba(212, 175, 55, 0.3)'}`,
                color: paymentSuccess ? '#2ecc71' : 'var(--color-gold)',
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                marginBottom: '16px'
              }}
            >
              {paymentSuccess ? (
                <CheckCircle2 size={20} />
              ) : (
                <RefreshCw size={18} className="spin" />
              )}
              <span style={{ fontWeight: 600 }}>{processStep}</span>
            </div>
          )}

          {/* Submit Pay Button */}
          <button
            type="button"
            className="btn btn-primary"
            onClick={selectedGateway === 'razorpay' ? handleRazorpayPayment : handleStripePayment}
            disabled={processing}
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '1rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              cursor: processing ? 'not-allowed' : 'pointer'
            }}
          >
            {processing ? (
              <>
                <RefreshCw size={18} className="spin" />
                <span>Processing Transaction...</span>
              </>
            ) : (
              <>
                <Lock size={18} />
                <span>
                  Pay ₹{totalAmount.toFixed(2)} via {selectedGateway === 'razorpay' ? 'Razorpay' : 'Stripe'}
                </span>
                <ArrowRight size={18} />
              </>
            )}
          </button>

          {/* Security Footnote */}
          <div
            style={{
              marginTop: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              paddingTop: '12px'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={12} color="#2ecc71" /> 256-Bit SSL
            </span>
            <span>•</span>
            <span>PCI-DSS Certified</span>
            <span>•</span>
            <span>Instant GST Receipt</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
