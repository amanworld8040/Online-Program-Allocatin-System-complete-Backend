import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from './api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check for existing auth data on mount
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Error parsing stored user data:', err);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await authApi.login(credentials);
      
      if (response.data.success && response.data.user) {
        const userData = response.data.user;
        const token = response.data.token;
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);
        
        return { success: true, user: userData };
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await authApi.signup(userData);
      
      if (response.data.success && response.data.user) {
        const user = response.data.user;
        const token = response.data.token;
        
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
        
        return { success: true, user };
      } else {
        throw new Error(response.data.message || 'Signup failed');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Signup failed';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error('Logout API call failed:', err);
      // Continue with client-side logout even if API call fails
    } finally {
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setError(null);
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'ADMIN';
  const isUser = user?.role === 'USER';

  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    isUser,
    login,
    signup,
    logout,
    setError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};