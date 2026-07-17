import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GeneralProvider, useGeneral } from './context/GeneralContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import StockChart from './pages/StockChart';
import History from './pages/History';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import AdminStockChart from './pages/AdminStockChart';
import AllOrders from './pages/AllOrders';
import AllTransactions from './pages/AllTransactions';
import Users from './pages/Users';

// Simple slide-down notification banner
const AlertBanner = () => {
  const { alert } = useGeneral();
  if (!alert) return null;
  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 9999,
      padding: '1rem 1.5rem',
      borderRadius: '12px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
      background: alert.type === 'danger' ? 'rgba(239, 68, 68, 0.95)' : 'rgba(16, 185, 129, 0.95)',
      color: '#fff',
      fontWeight: '600',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      animation: 'slideIn 0.3s forwards'
    }}>
      {alert.type === 'danger' ? '⚠️' : '✅'} {alert.message}
    </div>
  );
};

const ProtectedRoute = ({ children, adminRequired = false }) => {
  const { token, user } = useGeneral();
  
  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (adminRequired && user?.usertype !== 'admin') {
    return <Navigate to="/home" replace />;
  }

  return children;
};

const MainLayout = ({ children }) => {
  const { token } = useGeneral();
  return (
    <div className="app-shell" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {token && <Navbar />}
      <div style={{ flex: 1 }}>
        {children}
      </div>
    </div>
  );
};

function AppContent() {
  return (
    <Router>
      <AlertBanner />
      <MainLayout>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<Landing />} />
          
          {/* Protected Trader Routes */}
          <Route path="/home" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          
          <Route path="/portfolio" element={
            <ProtectedRoute>
              <Portfolio />
            </ProtectedRoute>
          } />
          
          <Route path="/stocks/:symbol" element={
            <ProtectedRoute>
              <StockChart />
            </ProtectedRoute>
          } />
          
          <Route path="/history" element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute adminRequired>
              <Admin />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/charts" element={
            <ProtectedRoute adminRequired>
              <AdminStockChart />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/orders" element={
            <ProtectedRoute adminRequired>
              <AllOrders />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/transactions" element={
            <ProtectedRoute adminRequired>
              <AllTransactions />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/users" element={
            <ProtectedRoute adminRequired>
              <Users />
            </ProtectedRoute>
          } />

          {/* Catch-all Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

function App() {
  return (
    <GeneralProvider>
      <AppContent />
    </GeneralProvider>
  );
}

export default App;
