import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGeneral } from '../context/GeneralContext';
import { Search, TrendingUp, TrendingDown, ArrowUpRight, Award, DollarSign, Briefcase } from 'lucide-react';

const Home = () => {
  const { user, marketStocks, holdings } = useGeneral();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate holdings current market value
  const totalHoldingsValue = holdings.reduce((sum, item) => sum + item.currentValue, 0);
  const netWorth = (user?.balance || 0) + totalHoldingsValue;

  // Filter stocks based on search input
  const filteredStocks = marketStocks.filter(stock =>
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sorting out gainers and losers
  const sortedStocks = [...marketStocks].sort((a, b) => b.change - a.change);
  const topGainers = sortedStocks.slice(0, 3);
  const topLosers = sortedStocks.slice(-3).reverse();

  const handleStockClick = (symbol) => {
    navigate(`/stocks/${symbol}`);
  };

  return (
    <div className="main-content" style={{ marginTop: 'var(--navbar-height)', marginLeft: 0 }}>
      {/* Upper overview section */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>Dashboard Overview</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Track live simulated market movements and manage your virtual capital.</p>
      </div>

      {/* Grid of financial summary cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        {/* Net Worth */}
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color)' }}>
            <Award size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Net Worth</span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '2px' }}>
              ${netWorth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
          </div>
        </div>

        {/* Cash Balance */}
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Available Cash</span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '2px' }}>
              ${user?.balance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
          </div>
        </div>

        {/* Holdings Value */}
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
            <Briefcase size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Holdings Value</span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '2px' }}>
              ${totalHoldingsValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
          </div>
        </div>
      </div>

      {/* Main Grid: Stocks table on left, Gainers/Losers on right */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2.5fr 1fr',
        gap: '2rem',
        alignItems: 'start'
      }}>
        {/* Left Side: Market Watchlist */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="live-indicator"></div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Real-time Market Stocks</h3>
            </div>
            
            {/* Search Input bar */}
            <div style={{ position: 'relative', maxWidth: '300px', width: '100%' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search symbol or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem', width: '100%', paddingTop: '0.5rem', paddingBottom: '0.5rem' }}
              />
            </div>
          </div>

          <div className="custom-table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Company</th>
                  <th>Price</th>
                  <th>Change (%)</th>
                  <th>Exchange</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStocks.map((stock) => {
                  const isBullish = stock.change >= 0;
                  return (
                    <tr key={stock.symbol} style={{ cursor: 'pointer' }} onClick={() => handleStockClick(stock.symbol)}>
                      <td style={{ fontWeight: 800, color: '#fff' }}>{stock.symbol}</td>
                      <td style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{stock.name}</td>
                      <td style={{ fontWeight: 700 }}>${stock.price.toFixed(2)}</td>
                      <td className={isBullish ? 'bullish-glow' : 'bearish-glow'} style={{ fontWeight: 700 }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          {isBullish ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                          {isBullish ? '+' : ''}{stock.change.toFixed(2)}%
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{stock.stockExchange || 'NYSE'}</td>
                      <td>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStockClick(stock.symbol);
                          }}
                          className="btn-primary"
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', borderRadius: '6px' }}
                        >
                          Trade <ArrowUpRight size={12} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filteredStocks.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      No matching stocks found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Market Movers widgets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Top Gainers */}
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--success-color)' }}>
              <TrendingUp size={16} /> Top Gainers
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {topGainers.map(stock => (
                <div
                  key={stock.symbol}
                  onClick={() => handleStockClick(stock.symbol)}
                  style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', cursor: 'pointer', border: '1px solid transparent' }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.2)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
                >
                  <div>
                    <div style={{ fontWeight: 800, color: '#fff', fontSize: '0.9rem' }}>{stock.symbol}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{stock.name}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>${stock.price.toFixed(2)}</div>
                    <div style={{ color: 'var(--success-color)', fontSize: '0.75rem', fontWeight: 700 }}>+{stock.change}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Losers */}
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--danger-color)' }}>
              <TrendingDown size={16} /> Top Losers
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {topLosers.map(stock => (
                <div
                  key={stock.symbol}
                  onClick={() => handleStockClick(stock.symbol)}
                  style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', cursor: 'pointer', border: '1px solid transparent' }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.2)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
                >
                  <div>
                    <div style={{ fontWeight: 800, color: '#fff', fontSize: '0.9rem' }}>{stock.symbol}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{stock.name}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>${stock.price.toFixed(2)}</div>
                    <div style={{ color: 'var(--danger-color)', fontSize: '0.75rem', fontWeight: 700 }}>{stock.change}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
