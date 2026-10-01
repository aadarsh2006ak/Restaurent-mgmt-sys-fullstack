import React, { useState, useEffect, useContext } from 'react';
import { AdminAuthContext } from '../context/AdminAuthContext';
import { API_BASE_URL } from '../config/api';
import { DollarSign, ShoppingBag, Grid, CalendarDays, RefreshCw } from 'lucide-react';

const Dashboard = () => {
  const { adminToken } = useContext(AdminAuthContext);
  const [metrics, setMetrics] = useState({
    totalSales: 0,
    activeOrders: 0,
    occupiedTables: 0,
    totalTables: 0,
    pendingReservations: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const headers = { Authorization: `Bearer ${adminToken}` };

      // Fetch Orders
      const resOrders = await fetch(`${API_BASE_URL}/api/orders`, { headers });
      const ordersData = await resOrders.json();

      // Fetch Tables
      const resTables = await fetch(`${API_BASE_URL}/api/tables`, { headers });
      const tablesData = await resTables.json();

      // Fetch Reservations
      const resReservations = await fetch(`${API_BASE_URL}/api/reservations?status=Pending`, { headers });
      const reservationsData = await resReservations.json();

      if (ordersData.success && tablesData.success && reservationsData.success) {
        const ordersList = ordersData.data;
        const tablesList = tablesData.data;
        const reservationsList = reservationsData.data;

        // Calculate metrics
        const totalSales = ordersList
          .filter(order => order.status === 'Completed' && order.paymentStatus === 'Paid')
          .reduce((sum, order) => sum + order.totalAmount, 0);

        const activeOrders = ordersList.filter(
          order => order.status === 'Pending' || order.status === 'Preparing' || order.status === 'Ready'
        ).length;

        const occupiedTables = tablesList.filter(table => table.status === 'Occupied').length;

        setMetrics({
          totalSales,
          activeOrders,
          occupiedTables,
          totalTables: tablesList.length,
          pendingReservations: reservationsList.length
        });
      }
    } catch (err) {
      console.error('Error fetching dashboard stats', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, [adminToken]);

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.6rem, 3.5vw, 2.3rem)', color: 'var(--color-gold)' }}>Dashboard Overview</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Real-time restaurant operational analytics and key metrics.</p>
        </div>
        <button
          onClick={() => { setLoading(true); fetchDashboardData(); }}
          className="btn btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', fontSize: '0.82rem' }}
        >
          <RefreshCw size={13} className={loading ? 'spin' : ''} /> Refresh Stats
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <div style={{
            width: '32px',
            height: '32px',
            border: '2px solid rgba(197, 168, 128, 0.1)',
            borderTopColor: 'var(--color-gold)',
            borderRadius: '50%',
            animation: 'spin 1.5s linear infinite'
          }} />
        </div>
      ) : (
        <>
          {/* Metrics Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
            gap: '16px',
            marginBottom: '32px'
          }}>
            {/* Total Revenue */}
            <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                backgroundColor: 'rgba(197, 168, 128, 0.1)',
                padding: '14px',
                borderRadius: '10px',
                border: '1px solid var(--border-color)',
                display: 'flex',
                color: 'var(--color-gold)',
                flexShrink: 0
              }}>
                <DollarSign size={24} />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Sales</span>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 'bold', marginTop: '2px', color: 'var(--color-gold)' }}>
                  ₹{metrics.totalSales.toFixed(2)}
                </h3>
              </div>
            </div>

            {/* Active Orders */}
            <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                padding: '14px',
                borderRadius: '10px',
                border: '1px solid rgba(52, 152, 219, 0.2)',
                display: 'flex',
                color: '#3498db',
                flexShrink: 0
              }}>
                <ShoppingBag size={24} />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active Orders</span>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 'bold', marginTop: '2px' }}>
                  {metrics.activeOrders}
                </h3>
              </div>
            </div>

            {/* Physical Tables utilization */}
            <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                backgroundColor: 'rgba(231, 76, 60, 0.1)',
                padding: '14px',
                borderRadius: '10px',
                border: '1px solid rgba(231, 76, 60, 0.2)',
                display: 'flex',
                color: '#e74c3c',
                flexShrink: 0
              }}>
                <Grid size={24} />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tables Occupied</span>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 'bold', marginTop: '2px' }}>
                  {metrics.occupiedTables} / {metrics.totalTables}
                </h3>
              </div>
            </div>

            {/* Table booking reservations */}
            <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                backgroundColor: 'rgba(243, 156, 18, 0.1)',
                padding: '14px',
                borderRadius: '10px',
                border: '1px solid rgba(243, 156, 18, 0.2)',
                display: 'flex',
                color: '#f39c12',
                flexShrink: 0
              }}>
                <CalendarDays size={24} />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pending Bookings</span>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 'bold', marginTop: '2px' }}>
                  {metrics.pendingReservations}
                </h3>
              </div>
            </div>
          </div>

          {/* Quick Operational advice */}
          <div className="glass-panel" style={{ padding: 'clamp(18px, 3vw, 28px)' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold)', fontSize: '1.3rem', marginBottom: '14px' }}>Service Alert</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '24px' }}>
              <div>
                <p style={{ color: 'var(--text-primary)', marginBottom: '8px', fontWeight: 600, fontSize: '0.95rem' }}>Kitchen Operations Status</p>
                {metrics.activeOrders > 5 ? (
                  <p style={{ color: '#e74c3c', fontSize: '0.88rem', lineHeight: '1.5' }}>
                    High service volume! The kitchen is processing {metrics.activeOrders} active orders. Prepare to support staff.
                  </p>
                ) : (
                  <p style={{ color: '#2ecc71', fontSize: '0.88rem', lineHeight: '1.5' }}>
                    Moderate service volume. Currently processing {metrics.activeOrders} active orders. Operations running smoothly.
                  </p>
                )}
              </div>
              <div>
                <p style={{ color: 'var(--text-primary)', marginBottom: '8px', fontWeight: 600, fontSize: '0.95rem' }}>Dine-in Capacity Status</p>
                {metrics.totalTables > 0 && (metrics.occupiedTables / metrics.totalTables) > 0.75 ? (
                  <p style={{ color: '#e74c3c', fontSize: '0.88rem', lineHeight: '1.5' }}>
                    Table availability critical! Over 75% of your tables are currently occupied ({metrics.occupiedTables} occupied). Ensure reservations are carefully monitored.
                  </p>
                ) : (
                  <p style={{ color: '#2ecc71', fontSize: '0.88rem', lineHeight: '1.5' }}>
                    Dine-in tables are comfortably available. Current occupancy rate: {((metrics.occupiedTables / (metrics.totalTables || 1)) * 100).toFixed(0)}%.
                  </p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
