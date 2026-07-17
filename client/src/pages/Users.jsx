import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGeneral } from '../context/GeneralContext';
import { ArrowLeft, Shield, User as UserIcon, Mail, ShieldAlert, Award } from 'lucide-react';

const Users = () => {
  const { adminUsers, adminFetchAll } = useGeneral();
  const navigate = useNavigate();

  useEffect(() => {
    adminFetchAll();
  }, []);

  return (
    <div className="main-content" style={{ marginTop: 'var(--navbar-height)', marginLeft: 0 }}>
      {/* Header & Back link */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
        <span onClick={() => navigate('/admin')} style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem' }}>
          <ArrowLeft size={16} /> Back to Panel
        </span>
      </div>

      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.25rem' }}>
          <Shield style={{ color: 'var(--danger-color)' }} /> User Directory Database
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>View details, authorization credentials, and simulated capital balances of all registered accounts.</p>
      </div>

      {/* Users Database table */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Registered User Profiles</h3>

        <div className="custom-table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Profile ID</th>
                <th>Username</th>
                <th>Email Address</th>
                <th>Authorization Type</th>
                <th>Simulated Cash Balance</th>
              </tr>
            </thead>
            <tbody>
              {adminUsers.map((usr, idx) => {
                const isAdmin = usr.usertype === 'admin';
                return (
                  <tr key={usr._id || idx}>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                      {usr._id}
                    </td>
                    <td style={{ fontWeight: 800, color: '#fff' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <UserIcon size={14} style={{ color: 'var(--primary-color)' }} />
                        {usr.username}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <Mail size={13} />
                        {usr.email}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontWeight: 800,
                        fontSize: '0.75rem',
                        color: isAdmin ? 'var(--danger-color)' : 'var(--primary-color)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        {isAdmin ? <ShieldAlert size={12} /> : null}
                        {usr.usertype}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--success-color)' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Award size={14} />
                        ${usr.balance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {adminUsers.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                    No users found in directory database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
