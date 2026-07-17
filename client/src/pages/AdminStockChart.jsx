import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGeneral } from '../context/GeneralContext';
import { ArrowLeft, Edit2, ShieldAlert, X, Check, TrendingUp, BarChart2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminStockChart = () => {
  const { marketStocks, adminUpdateStockPrice } = useGeneral();
  const navigate = useNavigate();

  const [editingSymbol, setEditingSymbol] = useState(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [high, setHigh] = useState('');
  const [low, setLow] = useState('');
  const [volume, setVolume] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [selectedStockSymbol, setSelectedStockSymbol] = useState('AAPL');

  const selectedStock = marketStocks.find(s => s.symbol === selectedStockSymbol) || marketStocks[0] || { symbol: 'AAPL', name: 'Apple Inc', price: 175.5, high: 178, low: 172 };

  // Generate mock history for selected stock preview inside Admin
  const generatePreviewData = (basePrice) => {
    const data = [];
    const now = new Date();
    let current = basePrice * 0.94;
    for (let i = 14; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      const delta = (Math.random() * 0.06 - 0.025) * current;
      current = Number((current + delta).toFixed(2));
      data.push({ time: dateStr, price: current, volume: Math.floor(Math.random() * 400000 + 100000) });
    }
    return data;
  };

  const previewData = generatePreviewData(selectedStock.price || 150);

  const startEdit = (stock) => {
    setEditingSymbol(stock.symbol);
    setName(stock.name);
    setPrice(stock.price.toString());
    setHigh(stock.high.toString());
    setLow(stock.low.toString());
    setVolume(stock.volume.toString());
  };

  const cancelEdit = () => {
    setEditingSymbol(null);
  };

  const handleUpdate = async (symbol) => {
    if (!name || !price) return;
    setSubmitting(true);
    const result = await adminUpdateStockPrice(symbol, {
      name,
      price: Number(price),
      high: Number(high),
      low: Number(low),
      volume: Number(volume)
    });
    setSubmitting(false);
    if (result.success) {
      setEditingSymbol(null);
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
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.25rem' }}>
          <ShieldAlert style={{ color: 'var(--danger-color)' }} /> Stock Registry & Market Graph Preview
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Configure global ticker data, monitor live volume trends, and verify exchange valuations.</p>
      </div>

      {/* Admin Live Special Graph Preview Card */}
      <div className="glass-card" style={{ marginBottom: '2.5rem', padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp color="#10b981" /> Live Admin Exchange Feed • {selectedStock.name} ({selectedStock.symbol})
            </h3>
            <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Select any ticker below to preview its live trajectory and volume</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {marketStocks.slice(0, 6).map(s => (
              <button
                key={s.symbol}
                onClick={() => setSelectedStockSymbol(s.symbol)}
                style={{
                  background: selectedStockSymbol === s.symbol ? 'var(--primary-color)' : 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--card-border)',
                  color: '#fff',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                {s.symbol}
              </button>
            ))}
          </div>
        </div>

        <div style={{ width: '100%', height: '260px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={previewData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="adminGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="time" stroke="#9ca3af" fontSize={11} axisLine={false} tickLine={false} />
              <YAxis stroke="#9ca3af" fontSize={11} axisLine={false} tickLine={false} domain={['auto', 'auto']} tickFormatter={v => `$${v}`} />
              <Tooltip content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div style={{ background: '#1f2937', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--card-border)', color: '#fff', fontSize: '0.8rem' }}>
                      <p style={{ fontWeight: 800 }}>{payload[0].payload.time}</p>
                      <p style={{ color: '#3b82f6', fontWeight: 700 }}>Price: ${payload[0].value.toFixed(2)}</p>
                    </div>
                  );
                }
                return null;
              }} />
              <Area type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#adminGlow)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tickers Listings Table */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Global Stock Tickers</h3>

        <div className="custom-table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Company Name</th>
                <th>Current Price</th>
                <th>24h High</th>
                <th>24h Low</th>
                <th>Volume</th>
                <th>Exchange</th>
                <th style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {marketStocks.map((stock) => {
                const isEditing = editingSymbol === stock.symbol;
                return (
                  <tr key={stock.symbol} style={{ cursor: 'pointer', background: selectedStockSymbol === stock.symbol ? 'rgba(99, 102, 241, 0.08)' : 'transparent' }} onClick={() => setSelectedStockSymbol(stock.symbol)}>
                    {isEditing ? (
                      <>
                        <td style={{ fontWeight: 800, color: '#fff' }}>{stock.symbol}</td>
                        <td>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="form-input"
                            style={{ padding: '0.4rem', width: '100%', fontSize: '0.85rem' }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            step="any"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="form-input"
                            style={{ padding: '0.4rem', width: '90px', fontSize: '0.85rem' }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            step="any"
                            value={high}
                            onChange={(e) => setHigh(e.target.value)}
                            className="form-input"
                            style={{ padding: '0.4rem', width: '90px', fontSize: '0.85rem' }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            step="any"
                            value={low}
                            onChange={(e) => setLow(e.target.value)}
                            className="form-input"
                            style={{ padding: '0.4rem', width: '90px', fontSize: '0.85rem' }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={volume}
                            onChange={(e) => setVolume(e.target.value)}
                            className="form-input"
                            style={{ padding: '0.4rem', width: '110px', fontSize: '0.85rem' }}
                          />
                        </td>
                        <td style={{ color: 'var(--text-muted)' }}>{stock.stockExchange}</td>
                        <td onClick={(e) => e.stopPropagation()}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            <button
                              onClick={() => handleUpdate(stock.symbol)}
                              className="btn-success"
                              style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                              disabled={submitting}
                            >
                              <Check size={14} /> Save
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="btn-secondary"
                              style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                              <X size={14} /> Cancel
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={{ fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ padding: '3px 6px', borderRadius: '4px', background: 'rgba(99,102,241,0.15)', color: '#818cf8', fontSize: '0.75rem' }}>{stock.symbol}</span>
                        </td>
                        <td style={{ fontWeight: 600 }}>{stock.name}</td>
                        <td style={{ fontWeight: 800, color: '#10b981' }}>${stock.price.toFixed(2)}</td>
                        <td style={{ color: 'var(--success-color)' }}>${stock.high.toFixed(2)}</td>
                        <td style={{ color: 'var(--danger-color)' }}>${stock.low.toFixed(2)}</td>
                        <td>{stock.volume?.toLocaleString()}</td>
                        <td style={{ color: 'var(--text-muted)' }}>{stock.stockExchange}</td>
                        <td onClick={(e) => e.stopPropagation()}>
                          <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <button
                              onClick={() => startEdit(stock)}
                              className="btn-secondary"
                              style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                              <Edit2 size={13} /> Edit
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminStockChart;
