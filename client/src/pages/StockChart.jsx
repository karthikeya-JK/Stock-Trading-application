import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGeneral } from '../context/GeneralContext';
import {
  ComposedChart, AreaChart, BarChart, Area, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { TrendingUp, TrendingDown, ArrowLeft, ShieldAlert, Sparkles, BarChart2, Activity } from 'lucide-react';
import confetti from 'canvas-confetti';

// Generate realistic historical candles based on base price
const generateHistoricalCandles = (basePrice, days) => {
  const data = [];
  const now = new Date();
  let lastClose = basePrice * 0.95; // start slightly lower for realistic upward trend
  for (let i = days; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    
    const open = lastClose;
    const change = (Math.random() * 0.08 - 0.035) * open;
    const close = Number((open + change).toFixed(2));
    const high = Number((Math.max(open, close) + (Math.random() * 0.02 * open)).toFixed(2));
    const low = Number((Math.min(open, close) - (Math.random() * 0.02 * open)).toFixed(2));
    const volume = Math.floor(Math.random() * 500000 + 100000);
    
    lastClose = close;
    data.push({ time: dateStr, open, high, low, close, volume });
  }
  return data;
};

// Generate realistic 1D tick candles
const generate1DCandles = (currentPrice) => {
  const data = [];
  const now = new Date();
  let lastClose = currentPrice * 0.985;
  for (let i = 25; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 4000);
    const timeStr = time.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    const open = lastClose;
    const change = (Math.random() * 0.012 - 0.0055) * open;
    const close = Number((open + change).toFixed(2));
    const high = Number((Math.max(open, close) + (Math.random() * 0.004 * open)).toFixed(2));
    const low = Number((Math.min(open, close) - (Math.random() * 0.004 * open)).toFixed(2));
    const volume = Math.floor(Math.random() * 45000 + 5000);
    
    lastClose = close;
    data.push({ time: timeStr, open, high, low, close, volume });
  }
  return data;
};

// Bulletproof Custom Candlestick Component guaranteed to render visibly on any Recharts scale
const CustomCandlestickShape = (props) => {
  const { x, y, width, height, payload, chartMin, chartMax } = props;
  if (!payload || payload.open === undefined || payload.close === undefined) return null;

  const { open, close, high, low } = payload;
  const isBullish = close >= open;
  const color = isBullish ? '#10b981' : '#ef4444'; // Neon Green vs Neon Red
  const cx = x + (width || 12) / 2;

  // Try using Recharts D3 scale if available, otherwise exact proportional math based on chartMin/chartMax
  let yOpen, yClose, yHigh, yLow;
  if (props.yAxis && typeof props.yAxis.scale === 'function' && !isNaN(props.yAxis.scale(open))) {
    const scale = props.yAxis.scale;
    yOpen = scale(open);
    yClose = scale(close);
    yHigh = scale(high);
    yLow = scale(low);
  } else {
    const minP = chartMin !== undefined ? chartMin : (Math.min(open, close, high, low) * 0.995);
    const maxP = chartMax !== undefined ? chartMax : (Math.max(open, close, high, low) * 1.005);
    const range = Math.max(0.01, maxP - minP);
    const toY = (val) => y + height - ((val - minP) / range) * height;
    yOpen = toY(open);
    yClose = toY(close);
    yHigh = toY(high);
    yLow = toY(low);
  }

  if (isNaN(yOpen) || isNaN(yClose)) return null;

  const bodyTop = Math.min(yOpen, yClose);
  const bodyBottom = Math.max(yOpen, yClose);
  const bodyHeight = Math.max(5, bodyBottom - bodyTop); // Ensure minimum 5px height for guaranteed visibility!
  const barWidth = Math.max(6, Math.min(width || 14, 18));
  const barX = cx - barWidth / 2;

  return (
    <g>
      {/* Wick: High to Low */}
      <line x1={cx} y1={yHigh} x2={cx} y2={yLow} stroke={color} strokeWidth={2} />
      {/* Body: Open to Close */}
      <rect
        x={barX}
        y={bodyTop}
        width={barWidth}
        height={bodyHeight}
        fill={color}
        stroke={color}
        strokeWidth={1.5}
        rx={2}
      />
    </g>
  );
};

// Custom Tooltip component to display OHLC & Volume details
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isBullish = data.close >= data.open;
    const changeVal = data.close - data.open;
    const changePct = (changeVal / (data.open || 1)) * 100;

    return (
      <div style={{
        backgroundColor: '#111827',
        border: '1px solid rgba(99, 102, 241, 0.4)',
        padding: '12px 16px',
        borderRadius: '12px',
        color: '#fff',
        boxShadow: '0 12px 30px rgba(0,0,0,0.7)',
        fontSize: '0.85rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        minWidth: '180px',
        backdropFilter: 'blur(10px)',
        zIndex: 1000
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '6px', marginBottom: '4px' }}>
          <span style={{ fontWeight: 800 }}>{data.time}</span>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 800,
            padding: '2px 6px',
            borderRadius: '4px',
            background: isBullish ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
            color: isBullish ? '#10b981' : '#ef4444'
          }}>
            {isBullish ? '▲ BULLISH' : '▼ BEARISH'}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
          <span style={{ color: '#9ca3af' }}>Open:</span>
          <span style={{ fontWeight: 700 }}>${data.open?.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
          <span style={{ color: '#9ca3af' }}>High:</span>
          <span style={{ fontWeight: 700, color: '#10b981' }}>${data.high?.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
          <span style={{ color: '#9ca3af' }}>Low:</span>
          <span style={{ fontWeight: 700, color: '#ef4444' }}>${data.low?.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
          <span style={{ color: '#9ca3af' }}>Close:</span>
          <span style={{ fontWeight: 700, color: isBullish ? '#10b981' : '#ef4444' }}>
            ${data.close?.toFixed(2)} ({changePct >= 0 ? '+' : ''}{changePct.toFixed(2)}%)
          </span>
        </div>
        {data.volume && (
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '6px', marginTop: '4px' }}>
            <span style={{ color: '#9ca3af' }}>Volume:</span>
            <span style={{ fontWeight: 700 }}>{data.volume.toLocaleString()}</span>
          </div>
        )}
      </div>
    );
  }
  return null;
};

const StockChart = () => {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const { user, marketStocks, holdings, placeTradeOrder } = useGeneral();

  const [tradeType, setTradeType] = useState('buy'); // 'buy' or 'sell'
  const [stockType, setStockType] = useState('Intraday'); // 'Intraday' or 'Delivery'
  const [quantity, setQuantity] = useState(0);
  const [chartInterval, setChartInterval] = useState('1D'); // '1D', '1W', '1M', '1Y'
  const [chartMode, setChartMode] = useState('candlestick'); // 'candlestick', 'area', 'volume'
  const [chartData, setChartData] = useState([]);
  const [tradingLoading, setTradingLoading] = useState(false);

  const stock = marketStocks.find(s => s.symbol.toUpperCase() === symbol.toUpperCase());
  const holding = holdings.find(h => h.symbol.toUpperCase() === symbol.toUpperCase());

  const lastPriceRef = useRef(stock ? stock.price : 0);
  const [priceDirection, setPriceDirection] = useState('neutral');

  useEffect(() => {
    if (!stock) return;

    if (stock.price > lastPriceRef.current) {
      setPriceDirection('up');
    } else if (stock.price < lastPriceRef.current) {
      setPriceDirection('down');
    }
    lastPriceRef.current = stock.price;

    if (chartInterval === '1D') {
      setChartData(prev => {
        const nextTime = new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        
        if (prev.length === 0) {
          return generate1DCandles(stock.price);
        }
        
        const lastCandle = prev[prev.length - 1];
        const open = lastCandle.close;
        const close = stock.price;
        const high = Number((Math.max(open, close) + (Math.random() * 0.003 * open)).toFixed(2));
        const low = Number((Math.min(open, close) - (Math.random() * 0.003 * open)).toFixed(2));
        const volume = Math.floor(Math.random() * 45000 + 5000);
        
        const newTick = { time: nextTime, open, high, low, close, volume };
        return [...prev.slice(1), newTick];
      });
    }
  }, [stock, chartInterval]);

  useEffect(() => {
    if (!stock) return;
    
    if (chartInterval === '1D') {
      setChartData(generate1DCandles(stock.price));
    } else if (chartInterval === '1W') {
      setChartData(generateHistoricalCandles(stock.price, 7));
    } else if (chartInterval === '1M') {
      setChartData(generateHistoricalCandles(stock.price, 30));
    } else if (chartInterval === '1Y') {
      setChartData(generateHistoricalCandles(stock.price, 365));
    }
  }, [chartInterval, symbol]);

  if (!stock) return <div className="main-content" style={{ marginTop: 'var(--navbar-height)', marginLeft: 0, textAlign: 'center', padding: '5rem' }}><h2>Stock Symbol Not Found</h2></div>;

  const currentPrice = stock.price;
  const estimatedCost = currentPrice * quantity;
  const maxBuy = Math.floor((user?.balance || 0) / currentPrice);
  const maxSell = holding ? holding.count : 0;

  // Calculate explicit Y-axis domain min/max so chart bars and candles never render out of bounds or invisible
  const allPrices = chartData.flatMap(d => [d.open, d.high, d.low, d.close].filter(n => typeof n === 'number' && !isNaN(n)));
  const minPrice = allPrices.length > 0 ? Math.min(...allPrices) * 0.995 : currentPrice * 0.95;
  const maxPrice = allPrices.length > 0 ? Math.max(...allPrices) * 1.005 : currentPrice * 1.05;

  const handleTradeSubmit = async (e) => {
    e.preventDefault();
    if (quantity <= 0) return;
    
    setTradingLoading(true);
    const result = await placeTradeOrder(stock.symbol, quantity, stockType, tradeType);
    setTradingLoading(false);

    if (result.success) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: tradeType === 'buy' ? ['#10b981', '#6366f1', '#3b82f6'] : ['#ef4444', '#f59e0b', '#3b82f6']
      });
      setQuantity(0);
    }
  };

  return (
    <div className="main-content" style={{ marginTop: 'var(--navbar-height)', marginLeft: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
        <span onClick={() => navigate('/home')} style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem' }}>
          <ArrowLeft size={16} /> Back to Market
        </span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {stock.name} <span style={{ fontSize: '1.3rem', background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', padding: '4px 12px', borderRadius: '8px' }}>{stock.symbol}</span>
          </h1>
          <div style={{ fontSize: '0.9rem', color: '#9ca3af', marginTop: '4px' }}>
            Exchange: <strong style={{ color: '#fff' }}>{stock.stockExchange}</strong> • Real-time Ticker Engine Active
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '2.6rem', fontWeight: 900, color: priceDirection === 'up' ? 'var(--success-color)' : priceDirection === 'down' ? 'var(--danger-color)' : '#fff' }}>
            ${currentPrice.toFixed(2)}
          </div>
          <div style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
            <Activity size={14} className="live-indicator" style={{ margin: 0 }} /> Live Market Feed Connected
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2.4fr 1.1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Universal Multi-Mode Special Chart Card */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          {/* Top Controls Bar: Modes + Intervals */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            {/* Chart Mode Toggle */}
            <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--card-border)', borderRadius: '10px', padding: '4px' }}>
              <button
                type="button"
                onClick={() => setChartMode('candlestick')}
                style={{
                  background: chartMode === 'candlestick' ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  padding: '6px 14px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                🕯️ Candlesticks
              </button>
              <button
                type="button"
                onClick={() => setChartMode('area')}
                style={{
                  background: chartMode === 'area' ? 'linear-gradient(135deg, #10b981, #059669)' : 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  padding: '6px 14px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                📈 Glowing Trend
              </button>
              <button
                type="button"
                onClick={() => setChartMode('volume')}
                style={{
                  background: chartMode === 'volume' ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  padding: '6px 14px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                📊 Volume & Spread
              </button>
            </div>

            {/* Time Interval Toggle */}
            <div style={{ display: 'flex', gap: '6px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--card-border)', borderRadius: '8px', padding: '3px' }}>
              {['1D', '1W', '1M', '1Y'].map(interval => (
                <button
                  key={interval}
                  onClick={() => setChartInterval(interval)}
                  style={{
                    background: chartInterval === interval ? 'var(--primary-color)' : 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#fff',
                    padding: '6px 14px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {interval}
                </button>
              ))}
            </div>
          </div>

          {/* Graph Render Area */}
          <div style={{ width: '100%', height: '420px' }}>
            <ResponsiveContainer width="100%" height="100%">
              {chartMode === 'candlestick' ? (
                <ComposedChart data={chartData} margin={{ top: 15, right: 15, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="time" stroke="#9ca3af" fontSize={11} dy={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="#9ca3af" fontSize={11} dx={-10} axisLine={false} tickLine={false} domain={[minPrice, maxPrice]} tickFormatter={v => `$${v.toFixed(1)}`} />
                  <Tooltip content={<CustomTooltip />} />
                  {/* Subtle background trend area to guarantee visual fullness */}
                  <Area type="monotone" dataKey="close" stroke="#10b981" strokeWidth={1.5} fillOpacity={0.08} fill="#10b981" />
                  {/* Exact visible Candlestick Bars */}
                  <Bar dataKey="close" shape={<CustomCandlestickShape chartMin={minPrice} chartMax={maxPrice} />} isAnimationActive={false} />
                </ComposedChart>
              ) : chartMode === 'area' ? (
                <AreaChart data={chartData} margin={{ top: 15, right: 15, left: -10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorCloseGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.02}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="time" stroke="#9ca3af" fontSize={11} dy={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="#9ca3af" fontSize={11} dx={-10} axisLine={false} tickLine={false} domain={[minPrice, maxPrice]} tickFormatter={v => `$${v.toFixed(1)}`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="close" stroke="#10b981" strokeWidth={3.5} fillOpacity={1} fill="url(#colorCloseGlow)" />
                </AreaChart>
              ) : (
                <BarChart data={chartData} margin={{ top: 15, right: 15, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="time" stroke="#9ca3af" fontSize={11} dy={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="#9ca3af" fontSize={11} dx={-10} axisLine={false} tickLine={false} domain={['auto', 'auto']} tickFormatter={v => `$${v}`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="high" fill="#6366f1" name="High" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="low" fill="#ef4444" name="Low" radius={[4, 4, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trade Execution Box */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--card-border)', borderRadius: '10px', padding: '4px', marginBottom: '1.5rem' }}>
            <button type="button" onClick={() => setTradeType('buy')} style={{ background: tradeType === 'buy' ? 'linear-gradient(135deg, #1d4ed8, #2563eb)' : 'transparent', border: tradeType === 'buy' ? 'none' : '1px solid var(--card-border)', borderRadius: '8px', color: '#fff', padding: '10px 8px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
              Buy @ $ {currentPrice.toFixed(2)}
            </button>
            <button type="button" onClick={() => setTradeType('sell')} style={{ background: tradeType === 'sell' ? 'linear-gradient(135deg, #dc2626, #ef4444)' : 'transparent', border: tradeType === 'sell' ? 'none' : '1px solid var(--card-border)', borderRadius: '8px', color: '#fff', padding: '10px 8px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
              Sell @ $ {currentPrice.toFixed(2)}
            </button>
          </div>

          <form onSubmit={handleTradeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label htmlFor="product-type" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Product type</label>
              <select id="product-type" value={stockType} onChange={(e) => setStockType(e.target.value)} className="form-input" style={{ width: '100%', cursor: 'pointer', background: 'var(--input-bg)', border: '1px solid var(--input-border)' }}>
                <option value="Intraday">Intraday</option>
                <option value="Delivery">Delivery</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="order-qty" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Quantity</label>
              <input id="order-qty" type="number" min="0" max={tradeType === 'buy' ? Math.max(1, maxBuy) : Math.max(0, maxSell)} value={quantity} onChange={(e) => setQuantity(Math.max(0, Number(e.target.value)))} className="form-input" style={{ width: '100%' }} required />
            </div>

            <div className="form-group">
              <label htmlFor="total-price-view" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total price</label>
              <input id="total-price-view" type="text" value={estimatedCost.toFixed(2)} className="form-input" style={{ width: '100%', background: 'rgba(255,255,255,0.02)', color: 'var(--text-muted)' }} disabled />
            </div>

            <button type="submit" className={tradeType === 'buy' ? 'btn-success' : 'btn-danger'} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginTop: '0.5rem', background: tradeType === 'buy' ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #ef4444, #dc2626)', color: '#fff', padding: '0.85rem 1.5rem', borderRadius: '10px', fontWeight: 700, border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,0,0,0.3)' }} disabled={tradingLoading}>
              {tradingLoading ? 'Executing Trade...' : (tradeType === 'buy' ? `Execute Buy Order • $${estimatedCost.toFixed(2)}` : `Execute Sell Order • $${estimatedCost.toFixed(2)}`)}
            </button>
            
            <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#9ca3af', fontWeight: 600 }}>
              {tradeType === 'buy' ? `Max Buyable: ${maxBuy} shares ($${(user?.balance || 0).toLocaleString()} avail)` : `Owned Position: ${maxSell} shares`}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StockChart;
