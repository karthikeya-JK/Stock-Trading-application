import React, { createContext, useState, useEffect, useContext } from 'react';
import axiosInstance from '../components/axiosInstance';

const GeneralContext = createContext(null);

export const GeneralProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [holdings, setHoldings] = useState([]);
  const [marketStocks, setMarketStocks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [orders, setOrders] = useState([]);
  
  // Admin stats
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminOrders, setAdminOrders] = useState([]);
  const [adminTransactions, setAdminTransactions] = useState([]);

  // System alert states
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 4000);
  };

  const login = async (email, password) => {
    try {
      const res = await axiosInstance.post('/users/login', { email, password });
      setUser(res.data);
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      showAlert('Welcome back to SB Stocks!');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check credentials.';
      showAlert(msg, 'danger');
      return { success: false, message: msg };
    }
  };

  const register = async (username, email, password) => {
    try {
      const res = await axiosInstance.post('/users/register', { username, email, password });
      setUser(res.data);
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      showAlert('Registration successful! Welcome to the trading simulator.');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Try again.';
      showAlert(msg, 'danger');
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setHoldings([]);
    setTransactions([]);
    setOrders([]);
    showAlert('Logged out successfully.');
  };

  const fetchProfile = async () => {
    if (!token) return;
    try {
      const res = await axiosInstance.get('/users/profile');
      const updatedUser = { ...user, balance: res.data.balance, username: res.data.username, usertype: res.data.usertype };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (err) {
      console.error('Error fetching profile:', err.message);
    }
  };

  const fetchHoldings = async () => {
    if (!token) return;
    try {
      const res = await axiosInstance.get('/stocks/holdings');
      setHoldings(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching holdings:', err.message);
    }
  };

  const fetchMarketStocks = async () => {
    try {
      const res = await axiosInstance.get('/stocks/market');
      setMarketStocks(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching market stocks:', err.message);
    }
  };

  const fetchTransactions = async () => {
    if (!token) return;
    try {
      const res = await axiosInstance.get('/transactions');
      const list = Array.isArray(res.data) ? res.data : [];
      setTransactions(list.sort((a, b) => new Date(b.time || 0) - new Date(a.time || 0)));
    } catch (err) {
      console.error('Error fetching transactions:', err.message);
    }
  };

  const fetchOrders = async () => {
    if (!token) return;
    try {
      const res = await axiosInstance.get('/orders');
      const list = Array.isArray(res.data) ? res.data : [];
      setOrders(list.sort((a, b) => new Date(b.time || b.createdAt || 0) - new Date(a.time || a.createdAt || 0)));
    } catch (err) {
      console.error('Error fetching orders:', err.message);
    }
  };

  const placeTradeOrder = async (symbol, count, stockType, orderType) => {
    try {
      const res = await axiosInstance.post('/orders', { symbol, count, stockType, orderType });
      showAlert(res.data.message || 'Order executed successfully!');
      
      // Update balance & holdings
      fetchProfile();
      fetchHoldings();
      fetchTransactions();
      fetchOrders();
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Order failed to execute.';
      showAlert(msg, 'danger');
      return { success: false, message: msg };
    }
  };

  // Admin specific calls
  const adminFetchAll = async () => {
    if (!token) return;
    try {
      const [usersRes, ordersRes, txRes] = await Promise.all([
        axiosInstance.get('/users/all'),
        axiosInstance.get('/orders/all'),
        axiosInstance.get('/transactions/all')
      ]);
      const uList = Array.isArray(usersRes.data) ? usersRes.data : [];
      const oList = Array.isArray(ordersRes.data) ? ordersRes.data : [];
      const tList = Array.isArray(txRes.data) ? txRes.data : [];
      
      setAdminUsers(uList);
      setAdminOrders(oList.sort((a, b) => new Date(b.time || b.createdAt || 0) - new Date(a.time || a.createdAt || 0)));
      setAdminTransactions(tList.sort((a, b) => new Date(b.time || 0) - new Date(a.time || 0)));
    } catch (err) {
      console.error('Error fetching admin stats:', err.message);
    }
  };

  const adminUpdateStockPrice = async (symbol, data) => {
    try {
      const res = await axiosInstance.put(`/stocks/admin/${symbol}`, data);
      showAlert(res.data.message || 'Stock updated successfully!');
      fetchMarketStocks();
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update stock';
      showAlert(msg, 'danger');
      return { success: false };
    }
  };

  const adminDeleteUser = async (userId) => {
    try {
      await axiosInstance.delete(`/users/admin/${userId}`);
      showAlert('User deleted successfully!');
      adminFetchAll();
    } catch (err) {
      showAlert('Failed to delete user', 'danger');
    }
  };

  useEffect(() => {
    fetchMarketStocks();
    if (token) {
      fetchProfile();
      fetchHoldings();
      fetchTransactions();
      fetchOrders();
    }
  }, [token]);

  return (
    <GeneralContext.Provider
      value={{
        user,
        token,
        holdings,
        marketStocks,
        transactions,
        orders,
        adminUsers,
        adminOrders,
        adminTransactions,
        alert,
        login,
        register,
        logout,
        fetchProfile,
        fetchHoldings,
        fetchMarketStocks,
        fetchTransactions,
        fetchOrders,
        placeTradeOrder,
        adminFetchAll,
        adminUpdateStockPrice,
        adminDeleteUser
      }}
    >
      {children}
    </GeneralContext.Provider>
  );
};

export const useGeneral = () => useContext(GeneralContext);
export default GeneralContext;
