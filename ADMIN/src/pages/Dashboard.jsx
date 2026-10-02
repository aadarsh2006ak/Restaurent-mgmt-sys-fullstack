import React, { useState, useEffect, useContext } from 'react';
import { AdminAuthContext } from '../context/AdminAuthContext';
import { API_BASE_URL } from '../config/api';
import { DollarSign, ShoppingBag, Grid, CalendarDays, RefreshCw, Sparkles, TrendingUp } from 'lucide-react';

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '22px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', color: 'var(--color-gold)' }}>
            Operations Dashboard
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>
            Real-time restaurant performance telemetry and operational metrics.
          </p>
        </div>
        <button
          onClick={() => { setLoading(true); fetchDashboardData(); }}
          className="btn btn-secondary btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <RefreshCw size={13} className={loading ? 'spin' : ''} /> Sync Stats
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <div className="spin" style={{
            width: '32px',
            height: '32px',
            border: '2px solid rgba(197, 168, 128, 0.1)',
            borderTopColor: 'var(--color-gold)',
            borderRadius: '50%'
          }} />
        </div>
      ) : (
        <>
          {/* Metrics Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
            gap: '14px',
            marginBottom: '26px'
          }}>
            {/* Total Revenue */}
            <div className="glass-panel" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '14px', borderRadius: '14px' }}>
              <div style={{
                backgroundColor: 'rgba(197, 168, 128, 0.12)',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid var(--border-color)',
                display: 'flex',
                color: 'var(--color-gold)',
                flexShrink: 0
              }}>
                <DollarSign size={22} />
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Total Revenue</span>
                <h3 style={{ fontSize: '1.45rem', fontWeight: 'bold', marginTop: '2px', color: 'var(--color-gold)' }}>
                  ₹{metrics.totalSales.toFixed(2)}
                </h3>
              </div>
            </div>

            {/* Active Orders */}
            <div className="glass-panel" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '14px', borderRadius: '14px' }}>
              <div style={{
                backgroundColor: 'rgba(52, 152, 219, 0.12)',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid rgba(52, 152, 219, 0.25)',
                display: 'flex',
                color: '#3498db',
                flexShrink: 0
              }}>
                <ShoppingBag size={22} />
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Active Orders</span>
                <h3 style={{ fontSize: '1.45rem', fontWeight: 'bold', marginTop: '2px', color: '#3498db' }}>
                  {metrics.activeOrders}
                </h3>
              </div>
            </div>

            {/* Physical Tables utilization */}
            <div className="glass-panel" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '14px', borderRadius: '14px' }}>
              <div style={{
                backgroundColor: 'rgba(231, 76, 60, 0.12)',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid rgba(231, 76, 60, 0.25)',
                display: 'flex',
                color: '#e74c3c',
                flexShrink: 0
              }}>
                <Grid size={22} />
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Tables In Use</span>
                <h3 style={{ fontSize: '1.45rem', fontWeight: 'bold', marginTop: '2px', color: '#e74c3c' }}>
                  {metrics.occupiedTables} / {metrics.totalTables}
                </h3>
              </div>
            </div>

            {/* Table booking reservations */}
            <div className="glass-panel" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '14px', borderRadius: '14px' }}>
              <div style={{
                backgroundColor: 'rgba(243, 156, 18, 0.12)',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid rgba(243, 156, 18, 0.25)',
                display: 'flex',
                color: '#f39c12',
                flexShrink: 0
              }}>
                <CalendarDays size={22} />
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Pending Bookings</span>
                <h3 style={{ fontSize: '1.45rem', fontWeight: 'bold', marginTop: '2px', color: '#f39c12' }}>
                  {metrics.pendingReservations}
                </h3>
              </div>
            </div>
          </div>

          {/* Quick Operational advice */}
          <div className="glass-panel" style={{ padding: 'clamp(16px, 3vw, 24px)', borderRadius: '14px' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold)', fontSize: '1.2rem', marginBottom: '12px' }}>Operational Advisory</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '18px' }}>
              <div>
                <p style={{ color: 'var(--text-primary)', marginBottom: '6px', fontWeight: 600, fontSize: '0.92rem' }}>Kitchen Load Status</p>
                {metrics.activeOrders > 5 ? (
                  <p style={{ color: '#e74c3c', fontSize: '0.84rem', lineHeight: '1.5' }}>
                    High kitchen queue! {metrics.activeOrders} active tickets are in preparation.
                  </p>
                ) : (
                  <p style={{ color: '#2ecc71', fontSize: '0.84rem', lineHeight: '1.5' }}>
                    Moderate kitchen volume. Currently processing {metrics.activeOrders} active orders smoothly.
                  </p>
                )}
              </div>
              <div>
                <p style={{ color: 'var(--text-primary)', marginBottom: '6px', fontWeight: 600, fontSize: '0.92rem' }}>Dine-in Floor Capacity</p>
                {metrics.totalTables > 0 && (metrics.occupiedTables / metrics.totalTables) > 0.75 ? (
                  <p style={{ color: '#e74c3c', fontSize: '0.84rem', lineHeight: '1.5' }}>
                    Table occupancy critical ({metrics.occupiedTables}/{metrics.totalTables} occupied). Monitor upcoming reservations.
                  </p>
                ) : (
                  <p style={{ color: '#2ecc71', fontSize: '0.84rem', lineHeight: '1.5' }}>
                    Tables comfortably available. Floor occupancy rate: {((metrics.occupiedTables / (metrics.totalTables || 1)) * 100).toFixed(0)}%.
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
