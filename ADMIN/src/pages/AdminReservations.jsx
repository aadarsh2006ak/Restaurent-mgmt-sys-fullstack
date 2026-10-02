import React, { useState, useEffect, useContext } from 'react';
import { AdminAuthContext } from '../context/AdminAuthContext';
import { API_BASE_URL } from '../config/api';
import { Calendar, Check, X, RefreshCw } from 'lucide-react';

const AdminReservations = () => {
  const { adminToken } = useContext(AdminAuthContext);
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  
  // Selected table per reservation id
  const [assignedTables, setAssignedTables] = useState({});

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${adminToken}` };
      
      const resReservations = await fetch(`${API_BASE_URL}/api/reservations`, { headers });
      const reservationsData = await resReservations.json();

      const resTables = await fetch(`${API_BASE_URL}/api/tables`, { headers });
      const tablesData = await resTables.json();

      if (reservationsData.success && tablesData.success) {
        setReservations(reservationsData.data);
        setTables(tablesData.data);
      }
    } catch (err) {
      console.error('Error fetching reservations', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [adminToken]);

  const handleUpdate = async (resId, newStatus) => {
    setUpdatingId(resId);
    const tableNumber = assignedTables[resId] || '';

    try {
      const response = await fetch(`${API_BASE_URL}/api/reservations/${resId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          status: newStatus,
          tableNumber: newStatus === 'Confirmed' ? tableNumber : undefined
        })
      });
      const data = await response.json();

      if (data.success) {
        setReservations((prev) =>
          prev.map((res) => (res._id === resId ? data.data : res))
        );
      }
    } catch (err) {
      console.error('Error updating reservation', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleTableSelect = (resId, tableNum) => {
    setAssignedTables((prev) => ({ ...prev, [resId]: tableNum }));
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', color: 'var(--color-gold)' }}>
            Table Reservations
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>
            Review guest reservation requests and assign physical dining tables.
          </p>
        </div>
        <button
          onClick={() => { setLoading(true); fetchData(); }}
          className="btn btn-secondary btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <RefreshCw size={13} className={loading ? 'spin' : ''} /> Sync Bookings
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <RefreshCw className="spin" size={32} style={{ color: 'var(--color-gold)' }} />
        </div>
      ) : reservations.length === 0 ? (
        <div className="glass-panel" style={{ padding: '48px 20px', textAlign: 'center', borderRadius: '14px' }}>
          <Calendar size={36} style={{ color: 'var(--color-gold)', opacity: 0.5, marginBottom: '12px' }} />
          <p style={{ color: 'var(--text-muted)' }}>No reservation requests logged yet.</p>
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '4px', borderRadius: '14px' }}>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Guest Details</th>
                  <th>Party</th>
                  <th>Assigned Table</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((res) => (
                  <tr key={res._id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{res.date}</div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>at {res.time}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{res.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{res.email} • {res.phone}</div>
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      {res.partySize} {res.partySize === 1 ? 'Guest' : 'Guests'}
                    </td>
                    <td>
                      {res.status === 'Pending' ? (
                        <select
                          value={assignedTables[res._id] || ''}
                          onChange={(e) => handleTableSelect(res._id, e.target.value)}
                          className="form-input"
                          style={{
                            background: 'var(--bg-secondary)',
                            color: 'var(--text-primary)',
                            padding: '5px 8px',
                            fontSize: '0.8rem',
                            maxWidth: '150px'
                          }}
                        >
                          <option value="">-- Assign Table --</option>
                          {tables
                            .filter((t) => t.status === 'Available')
                            .map((t) => (
                              <option key={t._id} value={t.number}>
                                Table {t.number} ({t.capacity} seats)
                              </option>
                            ))}
                        </select>
                      ) : res.tableNumber ? (
                        <span style={{ color: 'var(--color-gold)', fontWeight: 600 }}>Table {res.tableNumber}</span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Unassigned</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge badge-${res.status.toLowerCase()}`}>{res.status}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {res.status === 'Pending' && (
                        <div style={{ display: 'flex', gap: '5px', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => handleUpdate(res._id, 'Confirmed')}
                            disabled={updatingId === res._id}
                            className="btn btn-primary btn-sm"
                            style={{
                              padding: '4px 8px',
                              gap: '3px',
                              backgroundColor: '#2ecc71',
                              borderColor: '#2ecc71',
                              color: 'white'
                            }}
                            title="Confirm Reservation"
                          >
                            <Check size={12} /> Confirm
                          </button>
                          <button
                            onClick={() => handleUpdate(res._id, 'Cancelled')}
                            disabled={updatingId === res._id}
                            className="btn btn-danger btn-sm"
                            style={{
                              padding: '4px 8px',
                              gap: '3px'
                            }}
                            title="Reject Reservation"
                          >
                            <X size={12} /> Cancel
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReservations;
