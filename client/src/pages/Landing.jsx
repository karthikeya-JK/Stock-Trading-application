import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGeneral } from '../context/GeneralContext';
import Login from '../components/Login';
import Register from '../components/Register';
import FeaturedStockGraphic from '../components/FeaturedStockGraphic';
import { TrendingUp, BarChart3, ShieldAlert, Award, ArrowRight } from 'lucide-react';

const Landing = () => {
  const { token } = useGeneral();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [themeMode, setThemeMode] = useState('light'); // default light to match exact reference screenshots

  // If already authenticated, bypass Landing
  useEffect(() => {
    if (token) {
      navigate('/home');
    }
  }, [token, navigate]);

  const isLight = themeMode === 'light';

  return (
    <div style={{
      minHeight: '100vh',
      background: isLight ? '#f8fafc' : '#080c14',
      color: isLight ? '#0f172a' : '#f9fafb',
      display: 'flex',
      flexDirection: 'column',
      transition: 'background 0.3s ease, color 0.3s ease'
    }}>
      {/* Top Navbar matching screenshot (Solid Royal Blue Bar) */}
      <header style={{
        background: 'linear-gradient(135deg, #1b5299, #1d4ed8)',
        color: '#ffffff',
        padding: '0 2.5rem',
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.2)',
            padding: '6px',
            borderRadius: '8px',
            display: 'flex'
          }}>
            <TrendingUp size={24} color="#fff" />
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '0.5px' }}>SB Stocks</span>
        </div>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem', fontWeight: 600, fontSize: '0.95rem' }}>
          <span style={{ cursor: 'pointer', opacity: 1 }} onClick={() => {}}>Home</span>
          <span style={{ cursor: 'pointer', opacity: 0.85 }} onClick={() => {}}>About</span>
          <span
            style={{
              cursor: 'pointer',
              background: 'rgba(255, 255, 255, 0.18)',
              padding: '6px 14px',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}
            onClick={() => setIsLogin(false)}
          >
            Join Now
          </span>
          <button
            onClick={() => setThemeMode(isLight ? 'dark' : 'light')}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              color: '#fff',
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
          >
            {isLight ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>
        </nav>
      </header>

      {/* Main Content Area */}
      <main style={{
        flexGrow: 1,
        maxWidth: '1280px',
        width: '100%',
        margin: '0 auto',
        padding: '3rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2.5rem',
        position: 'relative'
      }}>
        {/* Header Text Block (SB Stock Trading & Subtitle) */}
        <div className="animate-card-rise" style={{ maxWidth: '850px' }}>
          <h1 style={{
            fontSize: '3.2rem',
            fontWeight: 850,
            color: isLight ? '#1e3a8a' : '#fff',
            marginBottom: '1rem',
            letterSpacing: '-0.5px'
          }}>
            SB Stock Trading
          </h1>
          <p style={{
            fontSize: '1.15rem',
            lineHeight: 1.7,
            color: isLight ? '#475569' : '#9ca3af',
            fontWeight: 450
          }}>
            Experience seamless stock market trading with our new stock trading platform, offering real time market data, advanced analytics, and interactive tools to empower traders and investors alike.
          </p>
        </div>

        {/* 2-Column Section: Form Box on Left + Special Photo/Animation Graphic on Right */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.2fr',
          gap: '4rem',
          alignItems: 'center',
          marginTop: '0.5rem'
        }}>
          {/* Left: Login or Register Box */}
          <div className="animate-card-rise" style={{
            background: isLight ? '#ffffff' : 'rgba(17, 24, 39, 0.8)',
            border: isLight ? '1px solid #cbd5e1' : '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '2.5rem',
            boxShadow: isLight ? '0 12px 35px -5px rgba(0, 0, 0, 0.08)' : '0 12px 35px -5px rgba(0, 0, 0, 0.5)',
            width: '100%',
            maxWidth: '440px'
          }}>
            {isLogin ? (
              <Login onSwitchToRegister={() => setIsLogin(false)} isLight={isLight} />
            ) : (
              <Register onSwitchToLogin={() => setIsLogin(true)} isLight={isLight} />
            )}
          </div>

          {/* Right: Featured Stock Graphic with Animation */}
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <FeaturedStockGraphic isLight={isLight} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        padding: '1.5rem',
        textAlign: 'center',
        fontSize: '0.85rem',
        color: isLight ? '#64748b' : '#6b7280',
        borderTop: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.05)',
        marginTop: 'auto'
      }}>
        © 2026 SB Stocks Trading Platform. Powered by Fullstack MERN & MongoDB Compass.
      </footer>
    </div>
  );
};

export default Landing;
