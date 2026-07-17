import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGeneral } from '../context/GeneralContext';
import { ArrowLeft, Shield, Calendar, Wallet, ArrowUpRight, ArrowDownLeft, Mail, Clock } from 'lucide-react';

const AllTransactions = () => {
  const { adminTransactions = [], adminFetchAll } = useGeneral();
  const navigate = useNavigate();

  const transactionsList = Array.isArray(adminTransactions) ? adminTransactions : [];

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
          <Shield style={{ color: 'var(--danger-color)' }} /> System Financial Ledger & Wallet Audit
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Audit funding deposits, withdrawals, and equity wallet charges across all registered accounts ({transactionsList.length} total).</p>
      </div>

      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Wallet color="#3b82f6" size={18} /> Global Ledger Entries
        </h3>

        <div className="custom-table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>User Account</th>
                <th>Transaction Type</th>
                <th>Funding Method</th>
                <th>Amount (USD)</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {transactionsList.map((tx, idx) => {
                const txType = (tx?.type || 'DEPOSIT').toUpperCase();
                const isPositive = txType === 'DEPOSIT' || txType === 'SELL';
                const amountNum = Number(tx?.amount || 0);
                const badgeClass = `badge badge-${txType.toLowerCase()}`;
                return (
                  <tr key={tx?._id || idx}>
                    <td style={{ fontWeight: 600, color: '#d1d5db' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <Mail size={13} color="#6366f1" /> {tx?.user || 'Unknown'}
                      </span>
                    </td>
                    <td>
                      <span className={badgeClass} style={{ fontWeight: 800 }}>{txType}</span>
                    </td>
                    <td style={{ textTransform: 'uppercase', fontWeight: 600, fontSize: '0.85rem', color: '#d1d5db' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <Wallet size={14} color="#6366f1" />
                        {tx?.paymentMode || 'WALLET'}
                      </span>
                    </td>
                    <td style={{ fontWeight: 800, fontSize: '1.05rem', color: isPositive ? '#10b981' : '#ef4444' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                        ${amountNum.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} />
                        {formatTime(tx?.time || tx?.createdAt)}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {transactionsList.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '4rem 2rem', color: '#9ca3af' }}>
                    <Wallet size={40} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>No system transactions logged.</div>
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

export default AllTransactions;
