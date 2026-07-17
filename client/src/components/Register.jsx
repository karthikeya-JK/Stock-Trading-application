import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGeneral } from '../context/GeneralContext';
import { User, Mail, Lock, Sparkles, ArrowLeft } from 'lucide-react';

const Register = ({ onSwitchToLogin, isLight = false }) => {
  const { register } = useGeneral();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) return;
    setLoading(true);
    const result = await register(username, email, password);
    setLoading(false);
    if (result.success) {
      navigate('/home');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff', textAlign: 'center', marginBottom: '0.5rem' }}>
        Register
      </h2>
      
      <div className="form-group">
        <label htmlFor="reg-username">Username</label>
        <div style={{ position: 'relative' }}>
          <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            id="reg-username"
            type="text"
            placeholder="JohnDoe"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '2.5rem', width: '100%' }}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="reg-email">Email Address</label>
        <div style={{ position: 'relative' }}>
          <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            id="reg-email"
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
        <label htmlFor="reg-password">Password</label>
        <div style={{ position: 'relative' }}>
          <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            id="reg-password"
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
        {loading ? 'Creating Account...' : (
          <>
            Start Simulating <Sparkles size={16} />
          </>
        )}
      </button>

      <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
        Already have an account?{' '}
        <span
          onClick={onSwitchToLogin}
          style={{ color: 'var(--primary-color)', cursor: 'pointer', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '2px' }}
        >
          <ArrowLeft size={12} /> Log in instead
        </span>
      </div>
    </form>
  );
};

export default Register;
