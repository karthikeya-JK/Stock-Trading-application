import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, BarChart2, Zap, ArrowUpRight, ShieldCheck, Activity } from 'lucide-react';

const FeaturedStockGraphic = ({ isLight = false }) => {
  const [livePrice, setLivePrice] = useState(175.50);
  const [liveChange, setLiveChange] = useState(1.42);
  const [activeTab, setActiveTab] = useState('bullish');

  // Simulate subtle real-time fluctuations inside the graphic badge
  useEffect(() => {
    const interval = setInterval(() => {
      const delta = (Math.random() * 0.8 - 0.35);
      setLivePrice(prev => Number((prev + delta).toFixed(2)));
      setLiveChange(prev => Number((prev + (delta * 0.1)).toFixed(2)));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="animate-float-chart" style={{
      position: 'relative',
      width: '100%',
      maxWidth: '520px',
      margin: '0 auto',
      padding: '2rem 1.5rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      userSelect: 'none'
    }}>
      {/* Background radial glowing effect */}
      <div style={{
        position: 'absolute',
        width: '320px',
        height: '320px',
        borderRadius: '50%',
        background: isLight 
          ? 'radial-gradient(circle, rgba(37, 99, 235, 0.12) 0%, rgba(16, 185, 129, 0.05) 70%, transparent 100%)'
          : 'radial-gradient(circle, rgba(99, 102, 241, 0.22) 0%, rgba(16, 185, 129, 0.1) 70%, transparent 100%)',
        filter: 'blur(30px)',
        zIndex: 0
      }} />

      {/* Main Isometric 3D Bar Chart Container */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* Floating Live Market Badge */}
        <div className="animate-coin-bounce" style={{
          position: 'absolute',
          top: '-15px',
          right: '10px',
          background: isLight ? '#ffffff' : 'rgba(17, 24, 39, 0.9)',
          border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(99, 102, 241, 0.4)',
          boxShadow: isLight ? '0 10px 25px -5px rgba(0, 0, 0, 0.1)' : '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
          borderRadius: '14px',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          zIndex: 3
        }}>
          <div style={{
            background: liveChange >= 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            padding: '8px',
            borderRadius: '10px',
            color: liveChange >= 0 ? '#10b981' : '#ef4444',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Activity size={20} className="live-indicator" style={{ margin: 0 }} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: isLight ? '#64748b' : '#9ca3af', fontWeight: 600 }}>
              Live US Ticker • AAPL
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff' }}>
                ${livePrice.toFixed(2)}
              </span>
              <span style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: liveChange >= 0 ? '#10b981' : '#ef4444'
              }}>
                {liveChange >= 0 ? '+' : ''}{liveChange.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        {/* Floating Coin & Diamond Elements */}
        <div className="animate-coin-bounce" style={{
          position: 'absolute',
          bottom: '25px',
          left: '5px',
          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 20px rgba(245, 158, 11, 0.4)',
          border: '3px solid rgba(255, 255, 255, 0.3)',
          animationDelay: '1.5s',
          zIndex: 3
        }}>
          <DollarSign size={32} color="#fff" strokeWidth={3} />
        </div>

        {/* Animated Custom Vector Isometric Illustration (Inspired by Screenshot 3D Building Blocks) */}
        <svg viewBox="0 0 460 360" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
          <defs>
            {/* Gradients for 3D Pillars */}
            <linearGradient id="gradYellow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="100%" stopColor="#eab308" />
            </linearGradient>
            <linearGradient id="gradGreen" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="gradBlue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
            <linearGradient id="gradNavy" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1e40af" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Isometric Base Grid Platform */}
          <path d="M 230 290 L 390 215 L 230 140 L 70 215 Z" fill={isLight ? '#f1f5f9' : 'rgba(30, 41, 59, 0.5)'} stroke={isLight ? '#cbd5e1' : '#334155'} strokeWidth="2" />
          <path d="M 230 310 L 390 235 L 390 215 L 230 290 Z" fill={isLight ? '#e2e8f0' : 'rgba(15, 23, 42, 0.7)'} />
          <path d="M 70 235 L 230 310 L 230 290 L 70 215 Z" fill={isLight ? '#cbd5e1' : 'rgba(30, 41, 59, 0.8)'} />

          {/* Step 1: Yellow 3D Pillar (Lowest) */}
          <g style={{ transition: 'transform 0.3s ease' }}>
            <path d="M 140 240 L 190 215 L 140 190 L 90 215 Z" fill="url(#gradYellow)" />
            <path d="M 90 215 L 140 240 L 140 280 L 90 255 Z" fill="#ca8a04" />
            <path d="M 140 240 L 190 215 L 190 255 L 140 280 Z" fill="#eab308" />
            <text x="133" y="210" fill="#fff" fontSize="13" fontWeight="bold">$</text>
          </g>

          {/* Step 2: Teal / Green 3D Pillar (Mid-Low) */}
          <g style={{ transition: 'transform 0.3s ease' }}>
            <path d="M 200 200 L 250 175 L 200 150 L 150 175 Z" fill="url(#gradGreen)" />
            <path d="M 150 175 L 200 200 L 200 260 L 150 235 Z" fill="#047857" />
            <path d="M 200 200 L 250 175 L 250 235 L 200 260 Z" fill="#059669" />
          </g>

          {/* Step 3: Blue 3D Pillar (Mid-High) */}
          <g style={{ transition: 'transform 0.3s ease' }}>
            <path d="M 260 160 L 310 135 L 260 110 L 210 135 Z" fill="url(#gradBlue)" />
            <path d="M 210 135 L 260 160 L 260 235 L 210 210 Z" fill="#1d4ed8" />
            <path d="M 260 160 L 310 135 L 310 210 L 260 235 Z" fill="#2563eb" />
          </g>

          {/* Step 4: Navy / Purple 3D Pillar (Top Summit) */}
          <g style={{ transition: 'transform 0.3s ease' }}>
            <path d="M 320 115 L 370 90 L 320 65 L 270 90 Z" fill="url(#gradNavy)" />
            <path d="M 270 90 L 320 115 L 320 205 L 270 180 Z" fill="#1e3a8a" />
            <path d="M 320 115 L 370 90 L 370 180 L 320 205 Z" fill="#1e40af" />
          </g>

          {/* Soaring Bullish Trading Arrow (Climbing Up Through the Pillars) */}
          <g className="animate-arrow-soar" style={{ transformOrigin: '230px 140px' }}>
            <path
              d="M 120 200 Q 200 160, 270 120 T 360 40"
              fill="none"
              stroke="#10b981"
              strokeWidth="7"
              strokeLinecap="round"
              filter="url(#glow)"
            />
            {/* Arrowhead */}
            <polygon points="345,35 375,35 365,65" fill="#10b981" filter="url(#glow)" />
          </g>

          {/* Animated Trader Characters (Building & Climbing) */}
          {/* Character 1: Sitting on the Green Pillar with Laptop */}
          <g transform="translate(180, 140)">
            <circle cx="15" cy="10" r="8" fill="#f87171" />
            <path d="M 8 20 Q 15 16, 22 20 L 24 35 L 6 35 Z" fill="#38bdf8" />
            <rect x="10" y="25" width="14" height="10" rx="2" fill="#0f172a" />
          </g>

          {/* Character 2: Climbing to Top Navy Pillar with Flag */}
          <g transform="translate(315, 38)" className="animate-coin-bounce" style={{ animationDelay: '0.8s' }}>
            <circle cx="12" cy="10" r="8" fill="#fbbf24" />
            <path d="M 6 20 Q 12 16, 18 20 L 20 38 L 4 38 Z" fill="#a855f7" />
            <line x1="22" y1="18" x2="30" y2="5" stroke="#fff" strokeWidth="2" />
            <polygon points="30,5 44,8 30,12" fill="#10b981" />
          </g>
        </svg>

        {/* Feature Highlights Badge Strip Below Graphic */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px',
          width: '100%',
          marginTop: '1.5rem',
          textAlign: 'center'
        }}>
          <div style={{
            background: isLight ? '#f8fafc' : 'rgba(255, 255, 255, 0.03)',
            border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.08)',
            padding: '10px 8px',
            borderRadius: '12px'
          }}>
            <TrendingUp size={18} color="#10b981" style={{ margin: '0 auto 4px' }} />
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: isLight ? '#0f172a' : '#fff' }}>Real-time Data</div>
            <div style={{ fontSize: '0.7rem', color: isLight ? '#64748b' : '#9ca3af' }}>4s Ticker Engine</div>
          </div>

          <div style={{
            background: isLight ? '#f8fafc' : 'rgba(255, 255, 255, 0.03)',
            border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.08)',
            padding: '10px 8px',
            borderRadius: '12px'
          }}>
            <ShieldCheck size={18} color="#3b82f6" style={{ margin: '0 auto 4px' }} />
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: isLight ? '#0f172a' : '#fff' }}>MongoDB Compass</div>
            <div style={{ fontSize: '0.7rem', color: isLight ? '#64748b' : '#9ca3af' }}>Synced Schema</div>
          </div>

          <div style={{
            background: isLight ? '#f8fafc' : 'rgba(255, 255, 255, 0.03)',
            border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.08)',
            padding: '10px 8px',
            borderRadius: '12px'
          }}>
            <Zap size={18} color="#f59e0b" style={{ margin: '0 auto 4px' }} />
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: isLight ? '#0f172a' : '#fff' }}>$100k Virtual</div>
            <div style={{ fontSize: '0.7rem', color: isLight ? '#64748b' : '#9ca3af' }}>Risk-Free Trading</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedStockGraphic;
