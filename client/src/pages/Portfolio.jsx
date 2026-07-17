import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGeneral } from '../context/GeneralContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Briefcase, DollarSign, BarChart2, TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899', '#8b5cf6', '#14b8a6'];

const Portfolio = () => {
  const { user, holdings } = useGeneral();
  const navigate = useNavigate();

  // Financial aggregates
  const totalCost = holdings.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalValue = holdings.reduce((sum, item) => sum + item.currentValue, 0);
  const netProfitLoss = totalValue - totalCost;
  const netProfitLossPercent = totalCost > 0 ? (netProfitLoss / totalCost) * 100 : 0;
  const netWorth = (user?.balance || 0) + totalValue;

  const isBullish = netProfitLoss >= 0;

  // Formatting for Recharts allocation data
  const pieData = holdings.map(item => ({
    name: item.symbol,
    value: item.currentValue
  }));

  // Render tooltip inside Pie Chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: '#1f2937',
          border: '1px solid var(--card-border)',
          padding: '8px 12px',
          borderRadius: '8px',
          color: '#fff',
          fontSize: '0.85rem'
        }}>
          <p style={{ fontWeight: 700 }}>{payload[0].name}</p>
          <p style={{ color: 'var(--success-color)' }}>
            ${payload[0].value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            {((payload[0].value / (totalValue || 1)) * 100).toFixed(1)}% weight
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="main-content" style={{ marginTop: 'var(--navbar-height)', marginLeft: 0 }}>
      {/* Page Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>My Portfolio</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Analyze your current asset allocations, investments, and capital growth.</p>
      </div>

      {/* Portfolio overview blocks */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        {/* Total Value */}
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color)' }}>
            <Briefcase size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Holdings Valuation</span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '2px' }}>
              ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h3>
          </div>
        </div>

        {/* Invested Capital */}
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
            <DollarSign size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Invested Capital</span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '2px' }}>
              ${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h3>
          </div>
        </div>

        {/* Total Gain/Loss */}
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            padding: '10px',
            borderRadius: '10px',
            background: isBullish ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            color: isBullish ? 'var(--success-color)' : 'var(--danger-color)'
          }}>
            {isBullish ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Profits / Losses</span>
            <h3 className={isBullish ? 'bullish-glow' : 'bearish-glow'} style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '2px' }}>
              {isBullish ? '+' : ''}${netProfitLoss.toLocaleString(undefined, { minimumFractionDigits: 2 })} ({isBullish ? '+' : ''}{netProfitLossPercent.toFixed(2)}%)
            </h3>
          </div>
        </div>

        {/* Net Worth */}
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
            <BarChart2 size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Assets Worth</span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '2px' }}>
              ${netWorth.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h3>
          </div>
        </div>
      </div>

      {/* Grid: Holdings Table & Allocation Pie Chart */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: holdings.length > 0 ? '2.5fr 1.25fr' : '1fr',
        gap: '2rem',
        alignItems: 'start'
      }}>
        {/* Holdings List */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Asset Positions</h3>
          
          <div className="custom-table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Shares</th>
                  <th>Avg Purchase</th>
                  <th>Current Price</th>
                  <th>Total Cost</th>
                  <th>Market Value</th>
                  <th>Returns</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((item) => {
                  const holdingBullish = item.profitLoss >= 0;
                  return (
                    <tr key={item.symbol}>
                      <td style={{ fontWeight: 800, color: '#fff' }}>
                        <div>{item.symbol}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>{item.name}</div>
                      </td>
                      <td style={{ fontWeight: 600 }}>{item.count}</td>
                      <td>${item.purchasePrice.toFixed(2)}</td>
                      <td>${item.currentPrice.toFixed(2)}</td>
                      <td>${item.totalPrice.toFixed(2)}</td>
                      <td style={{ fontWeight: 600 }}>${item.currentValue.toFixed(2)}</td>
                      <td className={holdingBullish ? 'bullish-glow' : 'bearish-glow'} style={{ fontWeight: 700 }}>
                        <div>{holdingBullish ? '+' : ''}${item.profitLoss.toFixed(2)}</div>
                        <div style={{ fontSize: '0.75rem' }}>{holdingBullish ? '+' : ''}{item.profitLossPercentage.toFixed(2)}%</div>
                      </td>
                      <td>
                        <button
                          onClick={() => navigate(`/stocks/${item.symbol}`)}
                          className="btn-primary"
                          style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem', borderRadius: '6px' }}
                        >
                          Trade <ArrowUpRight size={12} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {holdings.length === 0 && (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                      No active holdings. Go to the <span style={{ color: 'var(--primary-color)', cursor: 'pointer', fontWeight: 700 }} onClick={() => navigate('/home')}>Dashboard</span> to buy your first stock!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Allocation Chart Widget */}
        {holdings.length > 0 && (
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', textAlign: 'center' }}>Portfolio Weighting</h3>
            <div style={{ width: '100%', height: '220px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Custom Legend */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginTop: '1rem' }}>
              {holdings.map((item, idx) => (
                <div key={item.symbol} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: COLORS[idx % COLORS.length] }}></div>
                  <span style={{ fontWeight: 700, color: '#fff' }}>{item.symbol}</span>
                  <span style={{ color: 'var(--text-muted)' }}>({((item.currentValue / totalValue) * 100).toFixed(0)}%)</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;
