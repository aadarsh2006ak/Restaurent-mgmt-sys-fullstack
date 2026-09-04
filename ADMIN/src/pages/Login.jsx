import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminAuthContext } from '../context/AdminAuthContext';
import { Lock, Mail, ArrowRight, ServerCrash, Key } from 'lucide-react';

const Login = () => {
  const { adminLogin, error, adminUser } = useContext(AdminAuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (adminUser) {
      navigate('/');
    }
  }, [adminUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const success = await adminLogin(email, password);
    setSubmitting(false);
    if (success) {
      navigate('/');
    }
  };

  const handleSeedAdmin = async () => {
    setSeeding(true);
    setSeedMessage('');
    try {
      const response = await fetch('http://localhost:5000/api/auth/seed-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.success) {
        setSeedMessage('Admin seeded! Try logging in with: admin@restaurant.com / AdminPassword123!');
        setEmail('admin@restaurant.com');
        setPassword('AdminPassword123!');
      } else {
        setSeedMessage(data.message || 'Seeding failed (account may already exist).');
      }
    } catch (err) {
      setSeedMessage('Could not connect to API server to seed.');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      backgroundColor: 'var(--bg-primary)'
    }} className="fade-in">
      <div className="glass-panel" style={{ padding: '40px', maxWidth: '450px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-gold)' }}>L'AURA Board</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '6px' }}>Staff & Administrator Authentication Portal</p>
        </div>

        {error && (
          <div style={{ color: '#e63946', backgroundColor: 'rgba(230, 57, 70, 0.1)', padding: '12px', borderRadius: '6px', fontSize: '0.9rem', marginBottom: '20px', border: '1px solid rgba(230, 57, 70, 0.2)' }}>
            {error}
          </div>
        )}

        {seedMessage && (
          <div style={{ color: 'var(--color-gold)', backgroundColor: 'rgba(197, 168, 128, 0.08)', padding: '12px', borderRadius: '6px', fontSize: '0.9rem', marginBottom: '20px', border: '1px solid var(--border-color)' }}>
            {seedMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Mail size={14} /> Staff Email Address
            </label>
            <input
              type="email"
              required
              placeholder="e.g. admin@restaurant.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group" style={{ marginBottom: '28px' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Lock size={14} /> Password
            </label>
            <input
              type="password"
              required
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', gap: '8px' }}
          >
            {submitting ? 'Verifying Credentials...' : 'Sign In To Panel'} <ArrowRight size={16} />
          </button>
        </form>

        {/* Bootstrapper Button */}
        <div style={{ marginTop: '30px', borderTop: '1px dashed var(--border-color)', paddingTop: '20px', textAlign: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '10px' }}>
            First time setting up the system?
          </span>
          <button
            type="button"
            onClick={handleSeedAdmin}
            disabled={seeding}
            className="btn btn-secondary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Key size={12} /> {seeding ? 'Seeding...' : 'Seed Default Admin Account'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
