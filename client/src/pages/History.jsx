import React, { useState, useEffect } from 'react';
import { useGeneral } from '../context/GeneralContext';
import { ArrowUpRight, ArrowDownLeft, Wallet, TrendingUp, Calendar, RefreshCcw, BookOpen, Activity, CheckCircle, Clock } from 'lucide-react';

const History = () => {
  const { orders = [], transactions = [], fetchOrders, fetchTransactions } = useGeneral();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'transactions'
  const [refreshing, setRefreshing] = useState(false);

  // Safe array normalization
  const ordersList = Array.isArray(orders) ? orders : [];
  const transactionsList = Array.isArray(transactions) ? transactions : [];

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchOrders(), fetchTransactions()]);
    setRefreshing(false);
  };

  useEffect(() => {
    if (typeof fetchOrders === 'function') fetchOrders();
    if (typeof fetchTransactions === 'function') fetchTransactions();
  }, []);

  const formatTime = (timeStr) => {
    if (!timeStr) return 'Just now';
    try {
      const date = new Date(timeStr);
      if (isNaN(date.getTime())) return timeStr;
      return date.toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (e) {
      return timeStr || 'Recent';
    }
  };

  // Summary calculations
  const totalOrdersCount = ordersList.length;
  const totalBuyVolume = ordersList
    .filter(o => o?.orderType?.toLowerCase() === 'buy')
    .reduce((sum, o) => sum + Number(o?.totalPrice || 0), 0);
  const totalSellVolume = ordersList
    .filter(o => o?.orderType?.toLowerCase() === 'sell')
    .reduce((sum, o) => sum + Number(o?.totalPrice || 0), 0);
  const totalDeposits = transactionsList
    .filter(t => t?.type?.toUpperCase() === 'DEPOSIT')
    .reduce((sum, t) => sum + Number(t?.amount || 0), 0);

  return (
    <div className="main-content" style={{ marginTop: 'var(--navbar-height)', marginLeft: 0 }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#fff', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BookOpen color="#6366f1" /> Trading Book & Audit History
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Complete verifiable audit logs of your executed equity trades and wallet ledger activities.</p>
        </div>
        
        {/* Refresh button */}
        <button
          onClick={handleRefresh}
          className="btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.65rem 1.25rem', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}
          disabled={refreshing}
        >
          <RefreshCcw size={16} className={refreshing ? 'spin-anim' : ''} />
          {refreshing ? 'Syncing Ledger...' : 'Refresh Logs'}
        </button>
      </div>

      {/* Summary Statistics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
            <Activity size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 600 }}>Total Executed Orders</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', marginTop: '2px' }}>{totalOrdersCount} Trades</h3>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <TrendingUp size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 600 }}>Buy Capital Invested</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#10b981', marginTop: '2px' }}>
              ${totalBuyVolume.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h3>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
            <ArrowDownLeft size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 600 }}>Sell Capital Recovered</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ef4444', marginTop: '2px' }}>
              ${totalSellVolume.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h3>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
            <Wallet size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 600 }}>Total Wallet Deposits</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#3b82f6', marginTop: '2px' }}>
              ${totalDeposits.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h3>
          </div>
        </div>
      </div>

      {/* Tabs Switch */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--card-border)', marginBottom: '2rem' }}>
        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          style={{
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'orders' ? '3px solid var(--primary-color)' : '3px solid transparent',
            color: activeTab === 'orders' ? '#fff' : 'var(--text-secondary)',
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          Order Book ({ordersList.length})
        </button>
        
        <button
          type="button"
          onClick={() => setActiveTab('transactions')}
          style={{
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'transactions' ? '3px solid var(--primary-color)' : '3px solid transparent',
            color: activeTab === 'transactions' ? '#fff' : 'var(--text-secondary)',
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          Wallet Ledger ({transactionsList.length})
        </button>
      </div>

      {/* Tab Contents */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        {activeTab === 'orders' ? (
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle color="#10b981" size={18} /> Executed Equity Trading Orders
            </h3>
            <div className="custom-table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Symbol / Company</th>
                    <th>Order Type</th>
                    <th>Product Option</th>
                    <th>Shares Count</th>
                    <th>Price per Share</th>
                    <th>Total Price</th>
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
                        <td style={{ fontWeight: 800, color: '#fff' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ padding: '2px 6px', borderRadius: '4px', background: 'rgba(99,102,241,0.2)', color: '#818cf8', fontSize: '0.75rem' }}>{order?.symbol || 'N/A'}</span>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '2px' }}>{order?.name || 'Stock Trade'}</div>
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
                        <td>
                          <span style={{
                            color: '#10b981',
                            fontWeight: 800,
                            textTransform: 'capitalize',
                            fontSize: '0.85rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            ● {order?.orderStatus || 'Completed'}
                          </span>
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
                      <td colSpan="8" style={{ textAlign: 'center', padding: '4rem 2rem', color: '#9ca3af' }}>
                        <BookOpen size={40} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>No orders recorded yet</div>
                        <div>Start trading from the market dashboard to populate your order book.</div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Wallet color="#3b82f6" size={18} /> Wallet Ledger & Funding Log
            </h3>
            <div className="custom-table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Transaction Type</th>
                    <th>Funding Method</th>
                    <th>Amount</th>
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
                      <td colSpan="4" style={{ textAlign: 'center', padding: '4rem 2rem', color: '#9ca3af' }}>
                        <Wallet size={40} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>No wallet transactions logged</div>
                        <div>Your deposit and trade funding history will appear here automatically.</div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Tiny inline animation style */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spin-anim {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default History;
