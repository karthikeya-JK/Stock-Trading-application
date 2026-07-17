import React, { useState } from 'react';
import { useGeneral } from '../context/GeneralContext';
import { User, Mail, Shield, Wallet, ArrowDownLeft, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

const Profile = () => {
  const { user, depositWithdrawFunds } = useGeneral();
  const [action, setAction] = useState('deposit'); // 'deposit' or 'withdraw'
  const [amount, setAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('bank');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numAmt = Number(amount);
    if (!amount || numAmt <= 0) return;

    if (action === 'withdraw' && (user?.balance || 0) < numAmt) {
      return; // Validation handled in context alert
    }

    setLoading(true);
    const result = await depositWithdrawFunds(action, numAmt, paymentMode);
    setLoading(false);

    if (result.success) {
      setAmount('');
      // Confetti on funding success!
      confetti({
        particleCount: 80,
        spread: 50,
        origin: { y: 0.8 },
        colors: action === 'deposit' ? ['#3b82f6', '#10b981'] : ['#f59e0b', '#3b82f6']
      });
    }
  };

  return (
    <div className="main-content" style={{ marginTop: 'var(--navbar-height)', marginLeft: 0 }}>
      {/* Page Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>My Profile</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your personal credentials and simulate funding transactions.</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.25fr',
        gap: '2rem',
        alignItems: 'start'
      }}>
        {/* Left Side: Profile Information */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, borderBottom: '1px solid var(--card-border)', paddingBottom: '0.75rem' }}>
            Account Profile
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Username */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.02)', color: 'var(--text-secondary)' }}>
                <User size={18} />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>Username</span>
                <span style={{ fontWeight: 700, color: '#fff', fontSize: '1rem' }}>{user?.username}</span>
              </div>
            </div>

            {/* Email */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.02)', color: 'var(--text-secondary)' }}>
                <Mail size={18} />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>Email Address</span>
                <span style={{ fontWeight: 700, color: '#fff', fontSize: '1rem' }}>{user?.email}</span>
              </div>
            </div>

            {/* Account Type */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.02)', color: 'var(--text-secondary)' }}>
                <Shield size={18} />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>Authorization Role</span>
                <span style={{
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  color: user?.usertype === 'admin' ? 'var(--danger-color)' : 'var(--primary-color)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>{user?.usertype}</span>
              </div>
            </div>

            {/* Balance Summary box */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '0.5rem', background: 'rgba(99, 102, 241, 0.04)', border: '1px solid rgba(99, 102, 241, 0.1)', padding: '1rem', borderRadius: '12px' }}>
              <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color)' }}>
                <Wallet size={20} />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block' }}>Net Wallet Balance</span>
                <span style={{ fontWeight: 900, color: '#fff', fontSize: '1.25rem' }}>
                  ${user?.balance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Cash Wallet Simulator */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, borderBottom: '1px solid var(--card-border)', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
            Wallet Funding Simulator
          </h3>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Deposit / Withdraw Action tabs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--card-border)', borderRadius: '10px', padding: '4px' }}>
              <button
                type="button"
                onClick={() => setAction('deposit')}
                style={{
                  background: action === 'deposit' ? 'linear-gradient(135deg, var(--primary-color), var(--primary-hover))' : 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  padding: '10px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <ArrowUpRight size={16} /> Deposit
              </button>
              <button
                type="button"
                onClick={() => setAction('withdraw')}
                style={{
                  background: action === 'withdraw' ? 'linear-gradient(135deg, var(--primary-color), var(--primary-hover))' : 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  padding: '10px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <ArrowDownLeft size={16} /> Withdraw
              </button>
            </div>

            {/* Input Amount */}
            <div className="form-group">
              <label htmlFor="fund-amount">Amount (USD)</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontWeight: 800, color: 'var(--text-muted)' }}>$</span>
                <input
                  id="fund-amount"
                  type="number"
                  placeholder="0.00"
                  min="1"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '2rem', width: '100%' }}
                  required
                />
              </div>
            </div>

            {/* Payment Method selector */}
            <div className="form-group">
              <label htmlFor="payment-mode">Funding Source</label>
              <select
                id="payment-mode"
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="form-input"
                style={{ width: '100%', background: 'var(--input-bg)', border: '1px solid var(--input-border)', cursor: 'pointer' }}
              >
                <option value="bank">Bank Transfer (ACH / Wire)</option>
                <option value="card">Credit / Debit Card</option>
                <option value="upi">UPI / Instant Transfer</option>
                <option value="paypal">PayPal Wallet</option>
              </select>
            </div>

            {/* Confirmation button */}
            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}
              disabled={loading || (action === 'withdraw' && (user?.balance || 0) < Number(amount))}
            >
              {loading ? 'Processing Transaction...' : (
                <>
                  Confirm {action.toUpperCase()} <CheckCircle2 size={16} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
