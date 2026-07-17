import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGeneral } from '../context/GeneralContext';
import { ArrowLeft, Shield, Calendar, Mail, CheckCircle, Clock, BookOpen } from 'lucide-react';

const AllOrders = () => {
  const { adminOrders = [], adminFetchAll } = useGeneral();
  const navigate = useNavigate();

  const ordersList = Array.isArray(adminOrders) ? adminOrders : [];

  useEffect(() => {
    if (typeof adminFetchAll === 'function') adminFetchAll();
  }, []);

  const formatTime = (timeStr) => {
    if (!timeStr) return 'Recent';
    try {
      const date = new Date(timeStr);
      if (isNaN(date.getTime())) return timeStr;
      return date.toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'Recent';
    }
  };

  return (
    <div className="main-content" style={{ marginTop: 'var(--navbar-height)', marginLeft: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
        <span onClick={() => navigate('/admin')} style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem' }}>
          <ArrowLeft size={16} /> Back to Panel
        </span>
      </div>

      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fff', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.25rem' }}>
          <Shield style={{ color: 'var(--danger-color)' }} /> System Order Book & Audit Log
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Review all buy and sell trade transactions executed across the SB Stocks platform ({ordersList.length} total).</p>
      </div>

      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle color="#10b981" size={18} /> Active System Trades
        </h3>

        <div className="custom-table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>User Account</th>
                <th>Symbol / Asset</th>
                <th>Order Type</th>
                <th>Product Mode</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total Value</th>
                <th>Order Status</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {ordersList.map((order, idx) => {
                const isBuy = (order?.orderType || '').toLowerCase() === 'buy';
                const priceNum = Number(order?.price || 0);
                const totalNum = Number(order?.totalPrice || 0);
                return (
                  <tr key={order?._id || idx}>
                    <td style={{ fontWeight: 600, color: '#d1d5db' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <Mail size={13} color="#6366f1" /> {order?.user || 'Unknown'}
                      </span>
                    </td>
                    <td style={{ fontWeight: 800, color: '#fff' }}>
                      <span style={{ padding: '2px 6px', borderRadius: '4px', background: 'rgba(99,102,241,0.2)', color: '#818cf8', fontSize: '0.75rem' }}>{order?.symbol || 'N/A'}</span>
                      <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '2px' }}>{order?.name || 'Equity Trade'}</div>
                    </td>
                    <td>
                      <span className={isBuy ? 'badge badge-buy' : 'badge badge-sell'} style={{ fontWeight: 800 }}>
                        {isBuy ? '▲ BUY' : '▼ SELL'}
                      </span>
                    </td>
                    <td style={{ textTransform: 'capitalize', fontWeight: 600, color: '#d1d5db' }}>{order?.stockType || 'Intraday'}</td>
                    <td style={{ fontWeight: 700 }}>{order?.count || 0}</td>
                    <td style={{ fontWeight: 600 }}>${priceNum.toFixed(2)}</td>
                    <td style={{ fontWeight: 800, color: isBuy ? '#10b981' : '#ef4444' }}>${totalNum.toFixed(2)}</td>
                    <td style={{ color: '#10b981', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.8rem' }}>
                      ● {order?.orderStatus || 'Completed'}
                    </td>
                    <td style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} />
                        {formatTime(order?.time || order?.createdAt)}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {ordersList.length === 0 && (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '4rem 2rem', color: '#9ca3af' }}>
                    <BookOpen size={40} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>No system orders recorded.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllOrders;
