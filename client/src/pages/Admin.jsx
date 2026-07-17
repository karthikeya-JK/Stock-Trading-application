import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGeneral } from '../context/GeneralContext';
import { Shield, Users as UsersIcon, FileText, Landmark, BarChart2, PlusCircle, LayoutGrid, CheckCircle } from 'lucide-react';

const Admin = () => {
  const { adminFetchAll, adminOrders, adminTransactions, adminUsers, adminCreateStock } = useGeneral();
  const navigate = useNavigate();

  // Form states for adding new stock
  const [symbol, setSymbol] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [exchange, setExchange] = useState('NYSE');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    adminFetchAll();
  }, []);

  const handleAddStock = async (e) => {
    e.preventDefault();
    if (!symbol || !name || !price) return;
    setSubmitting(true);
    const result = await adminCreateStock({
      symbol: symbol.toUpperCase(),
      name,
      price: Number(price),
      stockExchange: exchange
    });
    setSubmitting(false);

    if (result.success) {
      setSymbol('');
      setName('');
      setPrice('');
    }
  };

  // Financial Stats Aggregates
  const totalVolume = adminTransactions
    .filter(t => t.type === 'BUY' || t.type === 'SELL')
    .reduce((sum, t) => sum + t.amount, 0);

  const menuCardStyle = {
    textDecoration: 'none',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '1.5rem',
    borderRadius: '16px',
    background: 'var(--card-bg)',
    border: '1px solid var(--card-border)',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
  };

  return (
    <div className="main-content" style={{ marginTop: 'var(--navbar-height)', marginLeft: 0 }}>
      {/* Page Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.25rem' }}>
          <Shield style={{ color: 'var(--danger-color)' }} /> Administrative Controls
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Monitor application performance metrics, manage registered users, and edit market exchange records.</p>
      </div>

      {/* Grid of administrative stats summaries */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        {/* Total Users */}
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
            <UsersIcon size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Active Users</span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '2px' }}>{adminUsers.length}</h3>
          </div>
        </div>

        {/* Total Orders */}
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)' }}>
            <FileText size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Trades Executed</span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '2px' }}>{adminOrders.length}</h3>
          </div>
        </div>

        {/* Transaction volume */}
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
            <Landmark size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Trading Volume</span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '2px' }}>
              ${totalVolume.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </h3>
          </div>
        </div>
      </div>

      {/* Main Grid: Management Shortcuts on Left, Seed Stock form on Right */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1.25fr',
        gap: '2rem',
        alignItems: 'start'
      }}>
        {/* Short-cuts panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Management Directories</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            {/* Users shortcuts */}
            <Link
              to="/admin/users"
              style={menuCardStyle}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary-color)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--card-border)'}
            >
              <div style={{ padding: '8px', width: 'fit-content', borderRadius: '8px', background: 'rgba(99,102,241,0.08)', color: 'var(--primary-color)' }}>
                <UsersIcon size={20} />
              </div>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>User Database</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '2px' }}>View all profiles, balance records, and administrative categories.</p>
              </div>
            </Link>

            {/* Orders shortcuts */}
            <Link
              to="/admin/orders"
              style={menuCardStyle}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary-color)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--card-border)'}
            >
              <div style={{ padding: '8px', width: 'fit-content', borderRadius: '8px', background: 'rgba(99,102,241,0.08)', color: 'var(--primary-color)' }}>
                <FileText size={20} />
              </div>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>Global Order Book</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '2px' }}>Check all buy/sell orders, quantity matches, and pending lists.</p>
              </div>
            </Link>

            {/* Transactions shortcuts */}
            <Link
              to="/admin/transactions"
              style={menuCardStyle}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary-color)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--card-border)'}
            >
              <div style={{ padding: '8px', width: 'fit-content', borderRadius: '8px', background: 'rgba(99,102,241,0.08)', color: 'var(--primary-color)' }}>
                <Landmark size={20} />
              </div>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>Financial Ledger</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '2px' }}>Audit all wallet logs, deposit checks, and withdrawal events.</p>
              </div>
            </Link>

            {/* Stock listings shortcuts */}
            <Link
              to="/admin/charts"
              style={menuCardStyle}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary-color)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--card-border)'}
            >
              <div style={{ padding: '8px', width: 'fit-content', borderRadius: '8px', background: 'rgba(99,102,241,0.08)', color: 'var(--primary-color)' }}>
                <BarChart2 size={20} />
              </div>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>Market Registries</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '2px' }}>Edit base seed pricing parameters and add company tickers.</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Add new stock form */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, borderBottom: '1px solid var(--card-border)', paddingBottom: '0.75rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <PlusCircle size={18} style={{ color: 'var(--primary-color)' }} /> Register New Asset
          </h3>

          <form onSubmit={handleAddStock} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {/* Symbol */}
            <div className="form-group">
              <label htmlFor="add-symbol">Stock Ticker Symbol</label>
              <input
                id="add-symbol"
                type="text"
                placeholder="e.g. AMZN"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                className="form-input"
                style={{ textTransform: 'uppercase', width: '100%' }}
                required
              />
            </div>

            {/* Name */}
            <div className="form-group">
              <label htmlFor="add-name">Company Name</label>
              <input
                id="add-name"
                type="text"
                placeholder="e.g. Amazon.com Inc."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                style={{ width: '100%' }}
                required
              />
            </div>

            {/* Price */}
            <div className="form-group">
              <label htmlFor="add-price">Starting Share Price (USD)</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: 'var(--text-muted)' }}>$</span>
                <input
                  id="add-price"
                  type="number"
                  placeholder="0.00"
                  step="any"
                  min="0.1"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '2rem', width: '100%' }}
                  required
                />
              </div>
            </div>

            {/* Exchange selection */}
            <div className="form-group">
              <label htmlFor="add-exchange">Stock Exchange</label>
              <select
                id="add-exchange"
                value={exchange}
                onChange={(e) => setExchange(e.target.value)}
                className="form-input"
                style={{ width: '100%', cursor: 'pointer' }}
              >
                <option value="NYSE">NYSE - New York Stock Exchange</option>
                <option value="NASDAQ">NASDAQ Exchange</option>
                <option value="LSE">LSE - London Stock Exchange</option>
                <option value="JPX">JPX - Tokyo Stock Exchange</option>
              </select>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginTop: '0.5rem' }}
              disabled={submitting}
            >
              {submitting ? 'Adding Asset...' : (
                <>
                  Register Ticker <LayoutGrid size={16} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Admin;
