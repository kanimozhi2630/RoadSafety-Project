import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('lifelink_token'));
  const [loading, setLoading] = useState(true);

  // Set Authorization header for all requests if token is present
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }

  // Load current user on start
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get('/api/auth/user');
        setUser(res.data);
      } catch (err) {
        console.error('Failed to load user info:', err.message);
        localStorage.removeItem('lifelink_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  // Register User
  const register = async (name, email, password, mobile) => {
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/register', { name, email, password, mobile });
      localStorage.setItem('lifelink_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      toast.success('Registration successful! Welcome to IntelSOS.');
      return true;
    } catch (err) {
      const errorMsg = err.response?.data?.msg || 'Registration failed. Please try again.';
      toast.error(errorMsg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Login User
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('lifelink_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      toast.success(`Welcome back, ${res.data.user.name || 'User'}!`);
      return true;
    } catch (err) {
      const errorMsg = err.response?.data?.msg || 'Invalid Credentials. Please check fields.';
      toast.error(errorMsg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update Onboarding step
  const updateOnboarding = async (step, data) => {
    try {
      const res = await axios.put('/api/auth/onboarding', { step, data });
      setUser(res.data);
      
      if (step === 3) {
        toast.success('IntelSOS Setup Completed Successfully!');
      } else {
        toast.success(`Step ${step} details saved successfully!`);
      }
      return true;
    } catch (err) {
      const errorMsg = err.response?.data?.msg || 'Failed to update onboarding step details.';
      toast.error(errorMsg);
      return false;
    }
  };

  // Update Profile details
  const updateProfile = async (profileData) => {
    try {
      const res = await axios.put('/api/auth/profile', profileData);
      setUser(res.data);
      toast.success('Profile updated successfully!');
      return true;
    } catch (err) {
      const errorMsg = err.response?.data?.msg || 'Failed to update profile details.';
      toast.error(errorMsg);
      return false;
    }
  };

  // Logout User
  const logout = () => {
    localStorage.removeItem('lifelink_token');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully from IntelSOS.');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        register,
        login,
        updateOnboarding,
        updateProfile,
        logout,
        isAuthenticated: !!user && !!token,
        isOnboarded: !!user && user.isOnboarded
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
