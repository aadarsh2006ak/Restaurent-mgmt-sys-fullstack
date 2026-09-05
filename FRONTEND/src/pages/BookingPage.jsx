import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Calendar, Users, Clock, Phone, Mail, User, CheckCircle } from 'lucide-react';

const BookingPage = () => {
  const { user } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [partySize, setPartySize] = useState('2');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const response = await fetch('http://localhost:5000/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          date,
          time,
          partySize: parseInt(partySize, 10)
        })
      });
      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setPhone('');
        setDate('');
        setTime('');
        setPartySize('2');
      } else {
        setError(data.message || 'Could not place reservation');
      }
    } catch (err) {
      setError('Could not connect to restaurant reservation server. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fade-in page-wrapper" style={{ maxWidth: '650px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <span style={{ color: 'var(--color-gold)', fontSize: '0.82rem', letterSpacing: '3px', fontWeight: 600, textTransform: 'uppercase' }}>
          SECURE YOUR TABLE
        </span>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 4.5vw, 2.5rem)', marginTop: '6px' }}>
          Make a Reservation
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '6px', fontSize: '0.92rem' }}>
          Plan your luxury culinary journey. Reservations are highly recommended for dinner service.
        </p>
      </div>

      {success ? (
        <div className="glass-panel" style={{ padding: 'clamp(24px, 5vw, 40px)', textAlign: 'center' }}>
          <CheckCircle size={48} style={{ color: '#2ecc71', marginBottom: '16px' }} />
          <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold)', fontSize: '1.4rem', marginBottom: '10px' }}>
            Reservation Request Received
          </h2>
          <p style={{ color: 'var(--text-primary)', marginBottom: '12px', fontSize: '0.95rem' }}>
            Thank you, your request has been logged successfully!
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', marginBottom: '24px' }}>
            We will contact you shortly via email or phone to confirm your table placement.
          </p>
          <button onClick={() => setSuccess(false)} className="btn btn-primary">
            Book Another Table
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: 'clamp(20px, 4.5vw, 36px)' }}>
          {error && (
            <div style={{ color: '#e63946', backgroundColor: 'rgba(230, 57, 70, 0.1)', padding: '12px', borderRadius: '6px', fontSize: '0.88rem', marginBottom: '20px', border: '1px solid rgba(230, 57, 70, 0.2)' }}>
              {error}
            </div>
          )}

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={14} /> Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={14} /> Email Address
              </label>
              <input
                type="email"
                required
                placeholder="e.g. john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={14} /> Phone Number
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. +1 555-0199"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Users size={14} /> Party Size
              </label>
              <select
                value={partySize}
                onChange={(e) => setPartySize(e.target.value)}
                className="form-input"
                style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Guest' : 'Guests'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={14} /> Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="form-input"
                style={{ colorScheme: 'dark' }}
              >
              </input>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} /> Time
              </label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="form-input"
                style={{ colorScheme: 'dark' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '12px', padding: '12px' }}
          >
            {submitting ? 'Submitting Request...' : 'Submit Reservation'}
          </button>
        </form>
      )}
    </div>
  );
};

export default BookingPage;
