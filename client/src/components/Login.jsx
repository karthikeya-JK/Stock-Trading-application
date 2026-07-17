import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGeneral } from '../context/GeneralContext';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';

const Login = ({ onSwitchToRegister, isLight = false }) => {
  const { login } = useGeneral();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      navigate('/home');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff', textAlign: 'center', marginBottom: '0.5rem' }}>
        Login
      </h2>
      
      <div className="form-group">
        <label htmlFor="login-email">Email Address</label>
        <div style={{ position: 'relative' }}>
          <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            id="login-email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '2.5rem', width: '100%' }}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="login-password">Password</label>
        <div style={{ position: 'relative' }}>
          <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            id="login-password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '2.5rem', width: '100%' }}
            required
          />
        </div>
      </div>

      <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
        {loading ? 'Logging in...' : (
          <>
            Continue Trading <LogIn size={16} />
          </>
        )}
      </button>

      <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
        Don't have an account?{' '}
        <span
          onClick={onSwitchToRegister}
          style={{ color: 'var(--primary-color)', cursor: 'pointer', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '2px' }}
        >
          Register here <ArrowRight size={12} />
        </span>
      </div>
    </form>
  );
};

export default Login;
