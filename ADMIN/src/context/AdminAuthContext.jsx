import React, { createContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';

export const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken') || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = `${API_BASE_URL}/api/auth`;

  useEffect(() => {
    const fetchAdmin = async () => {
      if (!adminToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/me`, {
          headers: {
            Authorization: `Bearer ${adminToken}`
          }
        });
        const data = await response.json();

        if (data.success && (data.user.role === 'admin' || data.user.role === 'staff')) {
          setAdminUser(data.user);
        } else {
          localStorage.removeItem('adminToken');
          setAdminToken('');
          setAdminUser(null);
        }
      } catch (err) {
        console.error('Error fetching admin profile', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, [adminToken]);

  const adminLogin = async (email, password) => {
    setError(null);
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();

      if (data.success) {
        if (data.user.role === 'admin' || data.user.role === 'staff') {
          localStorage.setItem('adminToken', data.token);
          setAdminToken(data.token);
          setAdminUser(data.user);
          return true;
        } else {
          setError('Access Denied: Only staff or admin roles are allowed to enter the management panel.');
          return false;
        }
      } else {
        setError(data.message || 'Login failed');
        return false;
      }
    } catch (err) {
      setError('Connection error. Could not connect to API server.');
      return false;
    }
  };

  const adminLogout = () => {
    localStorage.removeItem('adminToken');
    setAdminToken('');
    setAdminUser(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        adminToken,
        loading,
        error,
        adminLogin,
        adminLogout
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};
