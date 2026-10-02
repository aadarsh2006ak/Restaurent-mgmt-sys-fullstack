import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { API_BASE_URL } from '../config/api';
import { Calendar, Users, Clock, Phone, Mail, User, CheckCircle, Sparkles, Utensils } from 'lucide-react';
import { Link } from 'react-router-dom';

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
      const response = await fetch(`${API_BASE_URL}/api/reservations`, {
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
    <div className="fade-in page-wrapper" style={{ maxWidth: '680px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          color: 'var(--color-gold)',
          fontSize: '0.8rem',
          letterSpacing: '2.5px',
          fontWeight: 700,
          textTransform: 'uppercase',
          marginBottom: '6px'
        }}>
          <Sparkles size={14} /> SECURE YOUR TABLE
        </div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 4.5vw, 2.6rem)', margin: '4px 0 8px' }}>
          Make a Reservation
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '480px', margin: '0 auto', lineHeight: '1.5' }}>
          Reserve your table in advance for royal hospitality, fine Indian tandoor, and authentic Chinese dining.
        </p>
      </div>

      {success ? (
        <div className="glass-panel" style={{ padding: 'clamp(28px, 6vw, 44px) 20px', textAlign: 'center', borderRadius: '18px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'rgba(46, 204, 113, 0.15)',
            border: '2px solid rgba(46, 204, 113, 0.4)',
            color: '#2ecc71',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <CheckCircle size={36} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold)', fontSize: '1.5rem', marginBottom: '8px' }}>
            Reservation Request Confirmed
          </h2>
          <p style={{ color: 'var(--text-primary)', marginBottom: '10px', fontSize: '0.95rem' }}>
            Thank you! Your booking request has been registered in our restaurant management system.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '24px', maxWidth: '420px', margin: '0 auto 24px' }}>
            Our host team will assign a table and confirm your placement prior to arrival.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => setSuccess(false)} className="btn btn-secondary">
              Book Another Table
            </button>
            <Link to="/menu" className="btn btn-primary" style={{ gap: '6px' }}>
              <Utensils size={15} /> Explore Menu
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: 'clamp(20px, 5vw, 36px)', borderRadius: '18px' }}>
          {error && (
            <div style={{ color: '#e63946', backgroundColor: 'rgba(230, 57, 70, 0.1)', padding: '12px', borderRadius: '6px', fontSize: '0.86rem', marginBottom: '18px', border: '1px solid rgba(230, 57, 70, 0.2)' }}>
              {error}
            </div>
          )}

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={13} /> Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={13} /> Email Address
              </label>
              <input
                type="email"
                required
                placeholder="e.g. rahul@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={13} /> Phone Number
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. +91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Users size={13} /> Party Size
              </label>
              <select
                value={partySize}
                onChange={(e) => setPartySize(e.target.value)}
                className="form-input"
                style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 16].map((num) => (
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
                <Calendar size={13} /> Dining Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="form-input"
                style={{ colorScheme: 'dark' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={13} /> Dining Time
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
            style={{ width: '100%', marginTop: '10px', padding: '12px' }}
          >
            {submitting ? 'Submitting Request...' : 'Reserve Table'}
          </button>
        </form>
      )}
    </div>
  );
};

export default BookingPage;
