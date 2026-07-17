import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useGeneral } from '../context/GeneralContext';
import { TrendingUp, Wallet, History, User as UserIcon, LayoutDashboard, ShieldAlert, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useGeneral();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navLinkStyle = (path) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: isActive(path) ? '#ffffff' : 'rgba(255, 255, 255, 0.8)',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: isActive(path) ? '800' : '600',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    background: isActive(path) ? 'rgba(255, 255, 255, 0.22)' : 'transparent',
    transition: 'all 0.2s ease',
    border: isActive(path) ? '1px solid rgba(255, 255, 255, 0.4)' : '1px solid transparent'
  });

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: 'var(--navbar-height)',
      background: 'linear-gradient(135deg, #1b5299, #1d4ed8)',
      color: '#ffffff',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      zIndex: 1000
    }}>
      {/* Brand logo */}
      <Link to="/home" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.2)',
          padding: '6px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <TrendingUp size={20} color="#fff" />
        </div>
        <span style={{
          fontWeight: 800,
          fontSize: '1.35rem',
          color: '#fff',
          letterSpacing: '0.5px'
        }}>SB Stocks</span>
      </Link>

      {/* Navigation links */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <Link to="/home" style={navLinkStyle('/home')}>
          <LayoutDashboard size={16} /> Dashboard
        </Link>
        <Link to="/portfolio" style={navLinkStyle('/portfolio')}>
          <Wallet size={16} /> Portfolio
        </Link>
        <Link to="/history" style={navLinkStyle('/history')}>
          <History size={16} /> History
        </Link>
        <Link to="/profile" style={navLinkStyle('/profile')}>
          <UserIcon size={16} /> Profile
        </Link>
        {user?.usertype === 'admin' && (
          <Link to="/admin" style={navLinkStyle('/admin')}>
            <ShieldAlert size={16} /> Admin Panel
          </Link>
        )}
      </div>

      {/* Profile & Wallet summary */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* Wallet balance capsule */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          padding: '0.4rem 0.9rem',
          borderRadius: '20px',
          color: 'var(--success-color)',
          fontWeight: '700',
          fontSize: '0.9rem',
          boxShadow: '0 0 15px rgba(16, 185, 129, 0.05)'
        }}>
          <Wallet size={14} />
          <span>${user?.balance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>

        {/* User profile dropdown pill */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>{user?.username}</span>
          <span style={{
            fontSize: '0.65rem',
            color: user?.usertype === 'admin' ? '#ef4444' : '#9ca3af',
            textTransform: 'uppercase',
            fontWeight: 800,
            letterSpacing: '0.5px'
          }}>{user?.usertype}</span>
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#9ca3af',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s'
          }}
          title="Sign Out"
          onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.background = 'transparent'; }}
        >
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
