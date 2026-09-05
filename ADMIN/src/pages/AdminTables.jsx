import React, { useState, useEffect, useContext } from 'react';
import { AdminAuthContext } from '../context/AdminAuthContext';
import { Plus, Trash2, RefreshCw, Grid } from 'lucide-react';

const AdminTables = () => {
  const { adminToken } = useContext(AdminAuthContext);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [number, setNumber] = useState('');
  const [capacity, setCapacity] = useState('4');
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchTables = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/tables');
      const data = await response.json();
      if (data.success) {
        setTables(data.data);
      }
    } catch (err) {
      console.error('Error fetching tables', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5000/api/tables', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          number,
          capacity: parseInt(capacity, 10)
        })
      });
      const data = await response.json();

      if (data.success) {
        setTables((prev) => [...prev, data.data].sort((a, b) => a.number - b.number));
        setSuccess(`Table ${number} created successfully!`);
        setNumber('');
        setCapacity('4');
        setShowAddForm(false);
      } else {
        setError(data.message || 'Failed to create table');
      }
    } catch (err) {
      setError('Connection error. Could not create table.');
    }
  };

  const handleUpdateStatus = async (tableId, currentStatus) => {
    setError('');
    // Rotate status Available -> Occupied -> Reserved -> Available
    const statuses = ['Available', 'Occupied', 'Reserved'];
    const nextIdx = (statuses.indexOf(currentStatus) + 1) % 3;
    const nextStatus = statuses[nextIdx];

    try {
      const response = await fetch(`http://localhost:5000/api/tables/${tableId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ status: nextStatus })
      });
      const data = await response.json();

      if (data.success) {
        setTables((prev) =>
          prev.map((table) => (table._id === tableId ? data.data : table))
        );
      }
    } catch (err) {
      console.error('Error updating table status', err);
    }
  };

  const handleDelete = async (tableId, tableNum) => {
    if (!window.confirm(`Are you sure you want to delete Table ${tableNum}?`)) return;
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`http://localhost:5000/api/tables/${tableId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${adminToken}`
        }
      });
      const data = await response.json();

      if (data.success) {
        setTables((prev) => prev.filter((table) => table._id !== tableId));
        setSuccess(`Table deleted.`);
      } else {
        setError(data.message || 'Failed to delete table');
      }
    } catch (err) {
      setError('Connection error. Could not delete.');
    }
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.6rem, 3.5vw, 2.3rem)', color: 'var(--color-gold)' }}>Physical Table Map</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Configure dining tables layout. Click on any table block to toggle its operational state.</p>
        </div>
        {!showAddForm && (
          <button onClick={() => setShowAddForm(true)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '0.85rem' }}>
            <Plus size={16} /> Add Table
          </button>
        )}
      </div>

      {error && (
        <div style={{ color: '#e63946', backgroundColor: 'rgba(230, 57, 70, 0.1)', padding: '12px', borderRadius: '6px', fontSize: '0.88rem', marginBottom: '18px', border: '1px solid rgba(230, 57, 70, 0.2)' }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{ color: '#2ecc71', backgroundColor: 'rgba(46, 204, 113, 0.1)', padding: '12px', borderRadius: '6px', fontSize: '0.88rem', marginBottom: '18px', border: '1px solid rgba(46, 204, 113, 0.2)' }}>
          {success}
        </div>
      )}

      {/* Add Table Form */}
      {showAddForm && (
        <div className="glass-panel" style={{ padding: '20px', marginBottom: '28px', maxWidth: '500px' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold)', fontSize: '1.2rem', marginBottom: '14px' }}>Configure Table</h3>
          <form onSubmit={handleCreate} style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div className="form-group" style={{ marginBottom: 0, flex: '1 1 140px' }}>
              <label className="form-label" htmlFor="table-num">Table Number</label>
              <input
                id="table-num"
                type="text"
                required
                placeholder="e.g. 10"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0, flex: '1 1 140px' }}>
              <label className="form-label" htmlFor="table-cap">Capacity (Guests)</label>
              <select
                id="table-cap"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="form-input"
                style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
              >
                {[2, 4, 6, 8, 10, 12].map((num) => (
                  <option key={num} value={num}>{num} seats</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', gap: '8px', width: '100%', marginTop: '8px' }}>
              <button type="button" onClick={() => setShowAddForm(false)} className="btn btn-secondary" style={{ flex: 1, padding: '9px' }}>Cancel</button>
              <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '9px' }}>Save</button>
            </div>
          </form>
        </div>
      )}

      {/* Tables Grid */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <RefreshCw className="spin" size={32} style={{ color: 'var(--color-gold)' }} />
        </div>
      ) : tables.length === 0 ? (
        <div className="glass-panel" style={{ padding: '48px 20px', textAlign: 'center' }}>
          <Grid size={36} style={{ color: 'var(--color-gold)', opacity: 0.5, marginBottom: '14px' }} />
          <p style={{ color: 'var(--text-muted)' }}>No tables registered. Add some to permit dine-in checkouts.</p>
        </div>
      ) : (
        <div>
          {/* Status Color Guide */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#2ecc71' }} />
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Available</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#e74c3c' }} />
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Occupied</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f39c12' }} />
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Reserved</span>
            </div>
          </div>

          <div className="table-grid">
            {tables.map((table) => (
              <div
                key={table._id}
                onClick={() => handleUpdateStatus(table._id, table.status)}
                className={`table-card ${table.status}`}
                style={{ position: 'relative', padding: '16px 8px' }}
              >
                <span style={{ fontSize: '0.75rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Table</span>
                <span style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 'bold', lineHeight: 1.1, margin: '2px 0' }}>{table.number}</span>
                <span style={{ fontSize: '0.72rem', opacity: 0.9 }}>{table.capacity} Seats</span>
                
                {/* Manual Table Delete Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(table._id, table.number);
                  }}
                  style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    background: 'none',
                    border: 'none',
                    color: 'inherit',
                    cursor: 'pointer',
                    opacity: 0.6,
                    padding: '4px',
                    transition: 'opacity 0.2s'
                  }}
                  className="table-delete-btn"
                  title="Remove Table"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .table-delete-btn:hover {
          opacity: 1 !important;
          color: #ff4d4d;
        }
      `}</style>
    </div>
  );
};

export default AdminTables;
