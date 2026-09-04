import React, { useState, useEffect, useContext } from 'react';
import { AdminAuthContext } from '../context/AdminAuthContext';
import { DollarSign, ShoppingBag, Grid, CalendarDays, Users, RefreshCw } from 'lucide-react';

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
      const resOrders = await fetch('http://localhost:5000/api/orders', { headers });
      const ordersData = await resOrders.json();

      // Fetch Tables
      const resTables = await fetch('http://localhost:5000/api/tables', { headers });
      const tablesData = await resTables.json();

      // Fetch Reservations
      const resReservations = await fetch('http://localhost:5000/api/reservations?status=Pending', { headers });
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: 'var(--color-gold)' }}>Dashboard Overview</h1>
          <p style={{ color: 'var(--text-muted)' }}>Real-time restaurant operational analytics and key metrics.</p>
        </div>
        <button
          onClick={() => { setLoading(true); fetchDashboardData(); }}
          className="btn btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '0.85rem' }}
        >
          <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh Stats
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '24px',
            marginBottom: '40px'
          }}>
            {/* Total Revenue */}
            <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{
                backgroundColor: 'rgba(197, 168, 128, 0.1)',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                display: 'flex',
                color: 'var(--color-gold)'
              }}>
                <DollarSign size={28} />
              </div>
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Sales</span>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginTop: '4px', color: 'var(--color-gold)' }}>
                  ${metrics.totalSales.toFixed(2)}
                </h3>
              </div>
            </div>

            {/* Active Orders */}
            <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid rgba(52, 152, 219, 0.2)',
                display: 'flex',
                color: '#3498db'
              }}>
                <ShoppingBag size={28} />
              </div>
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active Orders</span>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginTop: '4px' }}>
                  {metrics.activeOrders}
                </h3>
              </div>
            </div>

            {/* Physical Tables utilization */}
            <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{
                backgroundColor: 'rgba(231, 76, 60, 0.1)',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid rgba(231, 76, 60, 0.2)',
                display: 'flex',
                color: '#e74c3c'
              }}>
                <Grid size={28} />
              </div>
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tables Occupied</span>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginTop: '4px' }}>
                  {metrics.occupiedTables} / {metrics.totalTables}
                </h3>
              </div>
            </div>

            {/* Table booking reservations */}
            <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{
                backgroundColor: 'rgba(243, 156, 18, 0.1)',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid rgba(243, 156, 18, 0.2)',
                display: 'flex',
                color: '#f39c12'
              }}>
                <CalendarDays size={28} />
              </div>
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pending Bookings</span>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginTop: '4px' }}>
                  {metrics.pendingReservations}
                </h3>
              </div>
            </div>
          </div>

          {/* Quick Operational advice */}
          <div className="glass-panel" style={{ padding: '30px' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold)', fontSize: '1.4rem', marginBottom: '16px' }}>Service Alert</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
              <div>
                <p style={{ color: 'var(--text-primary)', marginBottom: '12px', fontWeight: 600 }}>Kitchen Operations Status</p>
                {metrics.activeOrders > 5 ? (
                  <p style={{ color: '#e74c3c', fontSize: '0.95rem' }}>
                    High service volume! The kitchen is processing {metrics.activeOrders} active orders. Prepare to support staff.
                  </p>
                ) : (
                  <p style={{ color: '#2ecc71', fontSize: '0.95rem' }}>
                    Moderate service volume. Currently processing {metrics.activeOrders} active orders. Operations running smoothly.
                  </p>
                )}
              </div>
              <div>
                <p style={{ color: 'var(--text-primary)', marginBottom: '12px', fontWeight: 600 }}>Dine-in Capacity Status</p>
                {metrics.totalTables > 0 && (metrics.occupiedTables / metrics.totalTables) > 0.75 ? (
                  <p style={{ color: '#e74c3c', fontSize: '0.95rem' }}>
                    Table availability critical! Over 75% of your tables are currently occupied ({metrics.occupiedTables} occupied). Ensure reservations are carefully monitored.
                  </p>
                ) : (
                  <p style={{ color: '#2ecc71', fontSize: '0.95rem' }}>
                    Dine-in tables are comfortably available. Current occupancy rate: {((metrics.occupiedTables / (metrics.totalTables || 1)) * 100).toFixed(0)}%.
                  </p>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`
        .spin { animation: spin 1.5s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Dashboard;
